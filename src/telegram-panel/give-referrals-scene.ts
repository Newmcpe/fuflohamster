import { filters, WizardScene, WizardSceneAction } from '@mtcute/dispatcher';
import { addReferals, extractReferralId } from 'referrals.js';
import { storage } from 'index.js';
import { BotKeyboard } from '@mtcute/node';
import { defaultMenu, MainMenu } from 'telegram-panel/telegram-panel.js';

interface ReferralAddForm {
    targetLink: number;
}

const GiveReferralsWizard = new WizardScene<ReferralAddForm>(
    'referrals_add_form'
);

//regex for https://t.me/hamster_Kombat_bot/start?startapp=kentId1449892902; hamster_Kombat_bot letter case is not important
const referralLinkRegex =
    /https:\/\/t.me\/hamster_kombat_bot\/start\?startapp=\d+/gi;

GiveReferralsWizard.addStep(async (msg, state) => {
    if (msg.text.length < 3) {
        await msg.replyText('Неверная ссылка', {
            replyMarkup: BotKeyboard.inline([
                [BotKeyboard.callback('Отмена', 'cancel')],
            ]),
        });
        return WizardSceneAction.Stay;
    }

    const link = +extractReferralId(msg.text.trim())!;
    await state.set({ targetLink: link });

    await msg.answerText(
        `📝 Введите количество рефералов (доступно ${storage.data.referralAccounts.length})`
    );

    return WizardSceneAction.Next;
});

GiveReferralsWizard.onCallbackQuery(
    filters.equals('cancel'),
    async (upd, state) => {
        await upd.editMessage({
            text: 'Выберите действие',
            replyMarkup: defaultMenu,
        });
        await upd.client.sendText(upd.user, '❌ Действие отменено');
        await state.exit();
    }
);

GiveReferralsWizard.addStep(async (msg, state) => {
    const targetId = (await state.get())!.targetLink;
    const count = +msg.text.trim();

    if (isNaN(count) || count < 1) {
        await msg.replyText('Неверное количество', {
            replyMarkup: BotKeyboard.inline([
                [BotKeyboard.callback('Отмена', 'cancel')],
            ]),
        });
        return WizardSceneAction.Stay;
    }

    const successfulCount = await addReferals(targetId, count, (clientName) => {
        msg.replyText(
            `🐖 Успешно добавлен реферал для ${targetId}, используя ${clientName}`
        );
    });

    await msg.replyText(
        `✅ Успешно добавлено ${successfulCount} из ${count} рефералов для ${targetId}`,
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

    return WizardSceneAction.Exit;
});

export { GiveReferralsWizard };
