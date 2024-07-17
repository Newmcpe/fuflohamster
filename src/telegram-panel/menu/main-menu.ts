import {
    CallbackDataBuilder,
    Dispatcher,
    PropagationAction,
} from '@mtcute/dispatcher';
import { BotKeyboard } from '@mtcute/node';
import { referralMenu } from 'telegram-panel/menu/referral-menu.js';
import { storage } from 'index.js';
import { getProfileData } from 'api/hamster/hamster-kombat-service.js';
import { formatNumber } from 'util/number.js';

const MainMenuData = new CallbackDataBuilder('main', 'action');
const MainMenu = () =>
    BotKeyboard.inline([
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

const mainMenuDispatcher = Dispatcher.child();

mainMenuDispatcher.onCallbackQuery(
    MainMenuData.filter({ action: 'referral' }),
    async (msg) => {
        await msg.editMessage({
            text: 'Выберите действие',
            replyMarkup: referralMenu(),
        });

        return PropagationAction.Stop;
    }
);

mainMenuDispatcher.onCallbackQuery(
    MainMenuData.filter({ action: 'accounts' }),
    async (msg) => {
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
    }
);

export { mainMenuDispatcher, MainMenu };
