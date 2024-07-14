import { HamsterAccount } from '../util/config-schema.js';
import { Color, Logger } from '@starkow/logger';
import { isCooldownOver, setCooldown } from 'clicker-modules/heartbeat.js';
import { formatNumber } from 'util/number.js';
import { Upgrade } from 'api/hamster/model.js';
import {
    buyUpgrade,
    getProfileData,
    getUpgradesForBuy,
} from 'api/hamster/hamster-kombat-service.js';

const log = Logger.create('[Upgrader] ');

export async function upgrader(account: HamsterAccount) {
    if (!isCooldownOver('noUpgradesUntil', account)) return;

    let { data: profile } = await getProfileData(account);

    let {
        data: { upgradesForBuy },
    } = await getUpgradesForBuy(account);

    const bestUpgrade: Upgrade | null = upgradesForBuy
        .filter(
            (upgrade) =>
                upgrade.isAvailable &&
                !upgrade.isExpired &&
                (upgrade.cooldownSeconds === 0 || !upgrade.cooldownSeconds) &&
                upgrade.profitPerHourDelta * 168 >= upgrade.price &&
                (upgrade.condition?.referralCount ?? 0) <=
                    profile.clickerUser.referralsCount &&
                upgrade.price < profile.clickerUser.balanceCoins
        )
        .reduce(
            (best, upgrade) =>
                best === null ||
                upgrade.profitPerHourDelta > best.profitPerHourDelta
                    ? upgrade
                    : best,
            null as Upgrade | null
        );

    if (!bestUpgrade) {
        log.info(
            Logger.color(account.clientName, Color.Cyan),
            Logger.color(' | ', Color.Gray),
            `Нет доступных улучшений`
        );
        setCooldown('noUpgradesUntil', account, 60);
        return;
    }

    await buyUpgrade(account, bestUpgrade!.id, Date.now());

    profile.clickerUser.balanceCoins -= bestUpgrade!.price;

    log.info(
        Logger.color(account.clientName, Color.Cyan),
        Logger.color(' | ', Color.Gray),
        `Успешно улучшено`,
        Logger.color(bestUpgrade!.id, Color.Yellow),
        `с ценой`,
        Logger.color(bestUpgrade!.price.toString(), Color.Magenta),
        `до`,
        Logger.color((bestUpgrade!.level++).toString(), Color.Magenta),
        `уровня |\n`,
        `Заработок каждый час:`,
        Logger.color(
            formatNumber(
                bestUpgrade!.profitPerHourDelta +
                    profile.clickerUser.earnPassivePerHour
            ),
            Color.Magenta
        ),
        Logger.color(`(+${bestUpgrade!.profitPerHourDelta})\n`, Color.Green),
        Logger.color(`Осталось денег:`, Color.Green),
        Logger.color(
            formatNumber(profile.clickerUser.balanceCoins),
            Color.Magenta
        )
    );

    setCooldown('noUpgradesUntil', account, 10);
}
