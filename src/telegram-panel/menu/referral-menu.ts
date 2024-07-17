import {
    CallbackDataBuilder,
    Dispatcher,
    PropagationAction,
} from '@mtcute/dispatcher';
import { BotKeyboard } from '@mtcute/node';
import { GiveReferralsWizard } from 'telegram-panel/give-referrals-scene.js';
import { BuyAccountsWizard } from 'telegram-panel/buy-accounts-scene.js';
import { BackData } from 'telegram-panel/menu/back-menu.js';

const ReferralMenuData = new CallbackDataBuilder('referral', 'action');

const referralMenu = () =>
    BotKeyboard.inline([
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

const referralMenuDispatcher = Dispatcher.child<{}>();

referralMenuDispatcher.onCallbackQuery(
    ReferralMenuData.filter({ action: 'give_referrals' }),
    async (msg, state) => {
        await state.enter(GiveReferralsWizard);
        await msg.answer({});
        await msg.client.sendText(msg.user, '✍️ Введите реферальную ссылку');

        return PropagationAction.ToScene;
    }
);

referralMenuDispatcher.onCallbackQuery(
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

export { referralMenu, referralMenuDispatcher };
