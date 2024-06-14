import { HamsterAccount } from '../util/config-schema.js';
import { hamsterKombatService } from 'api/hamster-kombat-service.js';
import { Color, Logger } from '@starkow/logger';
import { isCooldownOver, setCooldown } from 'clicker-modules/heartbeat.js';
import { formatNumber } from 'util/number.js';

const log = Logger.create('[Upgrader] ');

export async function upgrader(account: HamsterAccount) {
    if (!isCooldownOver('noUpgradesUntil', account)) return;

    const { data: profile } = await hamsterKombatService.getProfileData(
        account.token
    );

    let {
        data: { upgradesForBuy },
    } = await hamsterKombatService.getUpgradesForBuy(account.token);

    const bestUpgrade = upgradesForBuy
        .filter(
            (upgrade) =>
                upgrade.isAvailable &&
                !upgrade.isExpired &&
                upgrade.cooldownSeconds == 0 &&
                (upgrade.maxLevel ?? upgrade.level) >= upgrade.level &&
                (!upgrade.condition ||
                    upgrade.condition._type != 'SubscribeTelegramChannel')
        )
        .sort((a, b) => {
            return (
                b.profitPerHourDelta / b.price - a.profitPerHourDelta / a.price
            );
        })
        .shift();

    if (profile.clickerUser.balanceCoins < bestUpgrade!.price) return;

    await hamsterKombatService.buyUpgrade(account.token, {
        timestamp: Date.now(),
        upgradeId: bestUpgrade!.id,
    });

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
