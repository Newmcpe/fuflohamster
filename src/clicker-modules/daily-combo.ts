import { HamsterAccount } from 'util/config-schema.js';
import { Color, Logger } from '@starkow/logger';
import { hamsterKombatService } from 'api/hamster-kombat-service.js';
import { DailyCombo } from 'api/model.js';
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

    upgradesForBuy = upgradesForBuy.filter((upgrade) => {
        return revealedDailyCombo.includes(upgrade.id);
    });

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
        setCooldown('noUpgradesUntil', account, 60);
        return;
    }

    for (const upgrade of upgradesForBuy) {
        await hamsterKombatService.buyUpgrade(account.token, {
            timestamp: Date.now(),
            upgradeId: upgrade.id,
        });
        clickerUser.balanceCoins -= upgrade.price;
    }

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
    const response = await fetch('https://api21.datavibe.top/api/GetCombo', {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return await response.json();
}
