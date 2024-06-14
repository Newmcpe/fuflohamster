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
        const {
            data: { clickerUser },
        } = await hamsterKombatService.getProfileData(account.token);

        log.info(
            Logger.color(account.clientName, Color.Cyan),
            Logger.color(' | ', Color.Gray),
            'Последний пассивный заработок:',
            Logger.color(
                `${formatNumber(clickerUser.lastPassiveEarn)} 🪙`,
                Color.Green
            ),
            Logger.color(' | ', Color.Gray),
            'Доход:',
            Logger.color(
                `${formatNumber(clickerUser.earnPassivePerHour)} 🪙/ч.`,
                Color.Green
            ),
            Logger.color(' | ', Color.Gray),
            'Текущий уровень:',
            Logger.color(clickerUser.level.toString(), Color.Green)
        );

        setInterval(async () => {
            accountHeartbeat(account).then(() => {});
        }, 1000);
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
