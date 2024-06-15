import { storage } from '../index.js';
import { HamsterAccount } from '../util/config-schema.js';
import { tap } from './tapper.js';
import { dateNowInSeconds } from '../util/date.js';
import { hamsterKombatService } from '../api/hamster-kombat-service.js';
import { Color, Logger } from '@starkow/logger';
import { upgrader } from 'clicker-modules/upgrader.js';
import { cipherClaimer } from 'clicker-modules/cipher.js';
import { dailyComboClaimer } from 'clicker-modules/daily-combo.js';
import { formatNumber } from 'util/number.js';

const log = Logger.create('[HEARTBEAT]');

export async function startHeartbeat() {
    for (const account of Object.values(storage.data.accounts)) {
        try {
            const {
                data: { clickerUser },
            } = await hamsterKombatService.getProfileData(account.token);

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
                Logger.color(
                    formatNumber(clickerUser.balanceCoins),
                    Color.Magenta
                ),
                '🪙',
                Logger.color('|', Color.Gray),
                'Текущий уровень:',
                Logger.color(clickerUser.level.toString(), Color.Magenta)
            );

            setInterval(async () => {
                accountHeartbeat(account).then(() => {});
            }, 1000);
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
