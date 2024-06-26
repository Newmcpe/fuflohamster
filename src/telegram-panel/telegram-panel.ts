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

const tg = new TelegramClient({
    apiId: API_ID,
    apiHash: API_HASH,
});

const dp = Dispatcher.for<{}>(tg, {
    storage: new MemoryStateStorage(),
});

export const MainMenu = new CallbackDataBuilder('main', 'action');
export const defaultMenu = BotKeyboard.inline([
    [
        BotKeyboard.callback(
            'Закупить аккаунты',
            MainMenu.build({ action: 'buy_hams' })
        ),
        BotKeyboard.callback(
            'Накрутить рефералов',
            MainMenu.build({ action: 'give_referrals' })
        ),
    ],
]);

dp.addScene(GiveReferralsWizard);
dp.addScene(BuyAccountsWizard);

dp.onNewMessage(filters.command('start'), async (msg) => {
    await msg.answerText(
        `🧾 Доступное количество рефералов: ${storage.data.referralAccounts.length}`,
        {
            replyMarkup: BotKeyboard.inline([
                [
                    BotKeyboard.callback(
                        'Закупить аккаунты',
                        MainMenu.build({ action: 'buy_hams' })
                    ),
                    BotKeyboard.callback(
                        'Накрутить рефералов',
                        MainMenu.build({ action: 'give_referrals' })
                    ),
                ],
            ]),
        }
    );
});

dp.onCallbackQuery(
    MainMenu.filter({ action: 'give_referrals' }),
    async (msg, state) => {
        await state.enter(GiveReferralsWizard);
        await msg.answer({});
        await msg.client.sendText(msg.user, '✍️ Введите реферальную ссылку');

        return PropagationAction.ToScene;
    }
);

dp.onCallbackQuery(
    MainMenu.filter({ action: 'buy_hams' }),
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
