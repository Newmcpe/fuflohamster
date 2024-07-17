import { storage } from '../index.js';
import { HamsterAccount } from '../util/config-schema.js';
import { tap } from './tapper.js';
import { dateNowInSeconds } from '../util/date.js';
import { Color, Logger } from '@starkow/logger';
import { upgrader } from 'clicker-modules/upgrader.js';
import { cipherClaimer } from 'clicker-modules/cipher.js';
import { dailyComboClaimer } from 'clicker-modules/daily-combo.js';
import { formatNumber } from 'util/number.js';
import { dailyBonusCompleter } from 'clicker-modules/daily-bonus-completer.js';
import { getProfileData } from 'api/hamster/hamster-kombat-service.js';

const log = Logger.create('[HEARTBEAT]');

export async function startHeartbeat() {
    for (const account of Object.values(storage.data.accounts)) {
        const {
            data: { clickerUser },
        } = await getProfileData(account);

        log.info(
            Logger.color(account.clientName, Color.Cyan),
            Logger.color('|', Color.Gray),
            'Последний пассивный заработок:',
            Logger.color(
                `${formatNumber(clickerUser.lastPassiveEarn)} 🪙`,
                Color.Magenta
            ),
            Logger.color('|', Color.Gray),
            'Доход:',
            Logger.color(
                `${formatNumber(clickerUser.earnPassivePerHour)} 🪙/ч.\n`,
                Color.Magenta
            ),
            Logger.color('|', Color.Gray),
            'Баланс:',
            Logger.color(formatNumber(clickerUser.balanceCoins), Color.Magenta),
            '🪙',
            Logger.color('|', Color.Gray),
            'Текущий уровень:',
            Logger.color(clickerUser.level.toString(), Color.Magenta),
            Logger.color('|', Color.Gray),
            'Количество рефералов:',
            Logger.color(clickerUser.referralsCount.toString(), Color.Magenta),
            Logger.color('|', Color.Gray),
            'Стоимость аккаунта:',
            Logger.color(formatNumber(clickerUser.totalCoins), Color.Magenta)
        );

        try {
            await accountHeartbeat(account);
        } catch (e) {
            log.error(
                Logger.color(account.clientName, Color.Cyan),
                Logger.color('|', Color.Gray),
                'Ошибка при обновлении аккаунта:',
                e
            );
        }
    }
}

async function accountHeartbeat(account: HamsterAccount) {
    await tap(account);
    await dailyComboClaimer(account);
    await upgrader(account);
    await cipherClaimer(account);
    await dailyBonusCompleter(account);

    setTimeout(accountHeartbeat, 1000, account);
}

export function isCooldownOver(
    cooldown: keyof HamsterAccount['currentCooldowns'],
    account: HamsterAccount
): boolean {
    return account.currentCooldowns[cooldown] <= dateNowInSeconds();
}

export function setCooldown(
    cooldown: keyof HamsterAccount['currentCooldowns'],
    account: HamsterAccount,
    time: number
) {
    storage.update((data) => {
        data.accounts[account.clientName].currentCooldowns[cooldown] =
            dateNowInSeconds() + time;
    });
}
