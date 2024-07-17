import { filters, WizardScene, WizardSceneAction } from '@mtcute/dispatcher';
import { addReferals, extractReferralId } from 'referrals.js';
import { storage } from 'index.js';
import { BotKeyboard } from '@mtcute/node';
import { referralMenu } from 'telegram-panel/menu/referral-menu.js';

interface ReferralAddForm {
    targetLink: number;
}

const GiveReferralsWizard = new WizardScene<ReferralAddForm>(
    'referrals_add_form'
);

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
            replyMarkup: referralMenu(),
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
            replyMarkup: referralMenu(),
        }
    );

    return WizardSceneAction.Exit;
});

export { GiveReferralsWizard };
