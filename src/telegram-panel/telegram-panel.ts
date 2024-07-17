import { BotKeyboard, TelegramClient } from '@mtcute/node';
import { API_HASH, API_ID, TELEGRAM_BOT_PANEL_TOKEN } from 'env.js';
import {
    CallbackDataBuilder,
    Dispatcher,
    filters,
    MemoryStateStorage,
    PropagationAction,
} from '@mtcute/dispatcher';
import { storage } from 'index.js';
import { GiveReferralsWizard } from 'telegram-panel/give-referrals-scene.js';
import { BuyAccountsWizard } from 'telegram-panel/buy-accounts-scene.js';
import { getProfileData } from 'api/hamster/hamster-kombat-service.js';
import { formatNumber } from 'util/number.js';

const tg = new TelegramClient({
    apiId: API_ID,
    apiHash: API_HASH,
});

export const dp = Dispatcher.for<{}>(tg, {
    storage: new MemoryStateStorage(),
});

dp.addScene(GiveReferralsWizard);
dp.addScene(BuyAccountsWizard);

dp.onNewMessage(filters.command('start'), async (msg) => {
    await msg.answerText(
        `🧾 Доступное количество рефералов: ${storage.data.referralAccounts.length}`,
        {
            replyMarkup: mainMenu,
        }
    );
});

const MainMenuData = new CallbackDataBuilder('main', 'action');
export const mainMenu = BotKeyboard.inline([
    [
        BotKeyboard.callback(
            'Рефералы',
            MainMenuData.build({ action: 'referral' })
        ),
        BotKeyboard.callback(
            'Аккаунты',
            MainMenuData.build({ action: 'accounts' })
        ),
    ],
]);

dp.onCallbackQuery(MainMenuData.filter({ action: 'referral' }), async (msg) => {
    await msg.editMessage({
        text: 'Выберите действие',
        replyMarkup: referralMenu,
    });

    return PropagationAction.Stop;
});

dp.onCallbackQuery(MainMenuData.filter({ action: 'accounts' }), async (msg) => {
    await msg.answer({
        text: '',
    });
    const accounts = Object.values(storage.data.accounts);

    let accountsStatsText = '';

    for (const account of accounts) {
        const {
            data: { clickerUser },
        } = await getProfileData(account);

        accountsStatsText += `${account.clientName}:\n`;
        //with emoji
        accountsStatsText += `💰 Последний пассивный заработок: ${formatNumber(
            clickerUser.lastPassiveEarn
        )} 🪙\n`;
        accountsStatsText += `💵 Доход: ${formatNumber(
            clickerUser.earnPassivePerHour
        )} 🪙/ч.\n`;
        accountsStatsText += `🏦 Баланс: ${formatNumber(clickerUser.balanceCoins)} 🪙\n`;
        accountsStatsText += `🧑 Текущий уровень: ${clickerUser.level.toString()}\n`;
        accountsStatsText += `🐘 Количество рефералов: ${clickerUser.referralsCount.toString()}\n`;
        accountsStatsText += `💳 Стоимость аккаунта: ${formatNumber(
            clickerUser.totalCoins
        )}\n\n`;
    }

    await msg.client.sendText(msg.user, accountsStatsText);

    return PropagationAction.Stop;
});

export const BackData = new CallbackDataBuilder('back', 'to');

dp.onCallbackQuery(BackData.filter({ to: 'main' }), async (msg) => {
    await msg.editMessage({
        text: 'Выберите действие',
        replyMarkup: mainMenu,
    });

    return PropagationAction.Stop;
});

const ReferralMenuData = new CallbackDataBuilder('referral', 'action');

export const referralMenu = BotKeyboard.inline([
    [
        BotKeyboard.callback(
            'Закупить аккаунты',
            ReferralMenuData.build({ action: 'buy_hams' })
        ),
        BotKeyboard.callback(
            'Накрутить рефералов',
            ReferralMenuData.build({ action: 'give_referrals' })
        ),
    ],
    [BotKeyboard.callback('Назад', BackData.build({ to: 'main' }))],
]);

dp.onCallbackQuery(
    ReferralMenuData.filter({ action: 'give_referrals' }),
    async (msg, state) => {
        await state.enter(GiveReferralsWizard);
        await msg.answer({});
        await msg.client.sendText(msg.user, '✍️ Введите реферальную ссылку');

        return PropagationAction.ToScene;
    }
);

dp.onCallbackQuery(
    ReferralMenuData.filter({ action: 'buy_hams' }),
    async (msg, state) => {
        await state.enter(BuyAccountsWizard);
        await msg.answer({});
        await msg.client.sendText(
            msg.user,
            '✍️ Количество аккаунтов для закупки'
        );

        return PropagationAction.ToScene;
    }
);

export function startTelegramPanel() {
    if (!TELEGRAM_BOT_PANEL_TOKEN) return;
    tg.run(
        {
            botToken: TELEGRAM_BOT_PANEL_TOKEN,
        },
        async (self) => {
            console.log(`Logged in as ${self.displayName}`);
        }
    );
}
