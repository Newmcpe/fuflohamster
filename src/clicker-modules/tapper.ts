import { HamsterAccount } from '../util/config-schema.js';
import { hamsterKombatService } from '../api/hamster-kombat-service.js';
import { isCooldownOver, setCooldown } from './heartbeat.js';
import { Color, Logger } from '@starkow/logger';
import random from 'random';
import { formatNumber } from 'util/number.js';

const log = Logger.create('[TAPPER]');

export async function tap(account: HamsterAccount) {
    if (!isCooldownOver('noTapsUntil', account)) return;

    let {
        data: { clickerUser },
    } = await hamsterKombatService.getProfileData(account.token);

    const availableTaps = clickerUser.availableTaps / clickerUser.earnPerTap;

    if (availableTaps < 50) {
        const sleepTime = random.int(50, 350);
        log.info(
            Logger.color(account.clientName, Color.Cyan),
            Logger.color('|', Color.Gray),
            'Недостаточно энергии, жду восстановления',
            Logger.color(sleepTime.toString(), Color.Yellow),
            'секунд'
        );

        const {
            data: { boostsForBuy },
        } = await hamsterKombatService.getBoosts(account.token);

        const boost = boostsForBuy.find(
            (boost) => boost.id === 'BoostFullAvailableTaps'
        );

        if (
            boost &&
            boost.cooldownSeconds == 0 &&
            boost.level <= (boost.maxLevel ?? 0)
        ) {
            await hamsterKombatService.applyBoost(account.token, {
                timestamp: Date.now(),
                boostId: boost.id,
            });

            log.info(
                Logger.color(account.clientName, Color.Cyan),
                Logger.color(' |', Color.Gray),
                'Активирован бустер энергии'
            );
        } else {
            setCooldown('noTapsUntil', account, sleepTime);
            return;
        }
    }

    const taps = Math.floor(availableTaps / 3);

    const {
        data: { clickerUser: newClickerUser },
    } = await hamsterKombatService.tap(account.token, {
        availableTaps,
        count: taps,
        timestamp: Date.now(),
    });

    const sleepTime = random.int(5, 25);

    log.info(
        Logger.color(account.clientName, Color.Cyan),
        Logger.color(' |', Color.Gray),
        'Сделано',
        Logger.color(taps.toString(), Color.Magenta),
        'тапов, осталось',
        Logger.color(newClickerUser.availableTaps.toString(), Color.Magenta),
        'энергии.',
        'Баланс:',
        Logger.color(formatNumber(newClickerUser.balanceCoins), Color.Magenta),
        '🪙',
        Logger.color(
            `(+${formatNumber(newClickerUser.balanceCoins - clickerUser.balanceCoins)})`,
            Color.Green
        )
    );

    setCooldown('noTapsUntil', account, sleepTime);
}
