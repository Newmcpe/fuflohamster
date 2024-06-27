import { HamsterAccount } from 'util/config-schema.js';
import { Color, Logger } from '@starkow/logger';
import { hamsterKombatService } from 'api/hamster/hamster-kombat-service.js';
import { DailyCombo } from 'api/hamster/model.js';
import { isCooldownOver, setCooldown } from 'clicker-modules/heartbeat.js';
import { formatNumber } from 'util/number.js';

const log = Logger.create('[DAILY-COMBO]');

export async function dailyComboClaimer(account: HamsterAccount) {
    if (!isCooldownOver('noUpgradesUntil', account)) return;

    let {
        data: { upgradesForBuy, dailyCombo },
    } = await hamsterKombatService.getUpgradesForBuy(account.token);

    if (dailyCombo.isClaimed) return;

    const {
        data: { clickerUser },
    } = await hamsterKombatService.getProfileData(account.token);
    const { combo: revealedDailyCombo } = await fetchDailyCombo();

    upgradesForBuy = upgradesForBuy
        .filter((upgrade) => {
            return (
                revealedDailyCombo.includes(upgrade.id) &&
                !dailyCombo.upgradeIds.includes(upgrade.id)
            );
        })
        .filter(
            (upgrade) =>
                upgrade.isAvailable &&
                !upgrade.isExpired &&
                upgrade.cooldownSeconds == 0 &&
                clickerUser.referralsCount >=
                    (upgrade.condition?.referralCount ?? 0) &&
                upgrade.profitPerHourDelta * 180 + 1666666 < upgrade.price && // не покупать улучшения, которые окупаются дольше 5 дней / 120 часов
                (upgrade.maxLevel || upgrade.level) >= upgrade.level &&
                upgrade.price < clickerUser.balanceCoins
        );

    if (upgradesForBuy.length === 0) {
        log.info(
            Logger.color(account.clientName, Color.Cyan),
            Logger.color(' | ', Color.Gray),
            `Комбо не выгодно к покупке`
        );
        return;
    }

    const totalCost = upgradesForBuy.reduce((acc, upgrade) => {
        return acc + upgrade.price;
    }, 0);

    if (clickerUser.balanceCoins < totalCost) {
        log.info(
            Logger.color(account.clientName, Color.Cyan),
            Logger.color(' | ', Color.Gray),
            `Недостаточно монет для покупки комбо.`,
            `Суммарная стоимость -`,
            Logger.color(`${formatNumber(totalCost)} 🪙,`, Color.Magenta),
            `а у вас -`,
            Logger.color(
                `${formatNumber(clickerUser.balanceCoins)} 🪙.`,
                Color.Magenta
            ),
            'Не хватает:',
            Logger.color(
                `${formatNumber(totalCost - clickerUser.balanceCoins)} 🪙.`,
                Color.Magenta
            )
        );
        setCooldown('noUpgradesUntil', account, 30);
        return;
    }

    for (const upgrade of upgradesForBuy) {
        await hamsterKombatService.buyUpgrade(account.token, {
            timestamp: Date.now(),
            upgradeId: upgrade.id,
        });
        clickerUser.balanceCoins -= upgrade.price;
    }

    await hamsterKombatService.claimDailyCombo(account.token);

    log.info(
        Logger.color(account.clientName, Color.Cyan),
        Logger.color(' | ', Color.Gray),
        `Комбо успешно куплено за`,
        Logger.color(`${totalCost} 🪙`, Color.Magenta),
        `| Осталось денег:`,
        Logger.color(
            `${clickerUser.balanceCoins.toFixed(0)} 🪙`,
            Color.Magenta
        ),
        `|`,
        Logger.color('(+5 000 000 🪙)', Color.Green)
    );
}

export async function fetchDailyCombo(): Promise<DailyCombo> {
    const response = await fetch(
        'https://github.com/AnisovAleksey/HamsterKombatBot/raw/e1594a9febb4d0a13dedef10495b1ccb58a81bce/daily_combo.json',
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
    return await response.json();
}
