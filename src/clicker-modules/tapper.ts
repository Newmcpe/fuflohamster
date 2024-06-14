import { HamsterAccount } from '../util/config-schema.js';
import { hamsterKombatService } from '../api/hamster-kombat-service.js';
import { isCooldownOver, setCooldown } from './heartbeat.js';
import { Color, Logger } from '@starkow/logger';
import { getRandomInt } from '../util/math.js';

const log = Logger.create('[TAPPER]');

export async function tap(account: HamsterAccount) {
    if (!isCooldownOver('noTapsUntil', account)) return;

    let {
        data: { clickerUser },
    } = await hamsterKombatService.getProfileData(account.token);
    const availableTaps = clickerUser.availableTaps;

    if (availableTaps < 50) {
        const sleepTime = getRandomInt(250, 500);
        log.info(
            Logger.color(account.clientName, Color.Cyan),
            Logger.color('|', Color.Gray),
            'Недостаточно энергии, жду восстановления',
            Logger.color(sleepTime.toString(), Color.Yellow),
            'секунд'
        );
        setCooldown('noTapsUntil', account, sleepTime);
        return;
    }

    const taps = getRandomInt(1, availableTaps / 2);

    const {
        data: { clickerUser: newClickerUser },
    } = await hamsterKombatService.tap(account.token, {
        availableTaps,
        count: taps,
        timestamp: Date.now(),
    });

    const sleepTime = getRandomInt(5, 25);

    log.info(
        Logger.color(account.clientName, Color.Cyan),
        Logger.color(' |', Color.Gray),
        'Сделано',
        Logger.color(taps.toString(), Color.Magenta),
        'тапов, осталось',
        Logger.color(newClickerUser.availableTaps.toString(), Color.Magenta),
        'энергии.',
        'Баланс:',
        Logger.color(newClickerUser.balanceCoins.toFixed(0), Color.Magenta),
        '🪙',
        Logger.color(
            `(+${(newClickerUser.balanceCoins - clickerUser.balanceCoins).toFixed(0)})`,
            Color.Green
        )
    );

    setCooldown('noTapsUntil', account, sleepTime);
}
