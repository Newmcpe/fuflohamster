import { WizardScene, WizardSceneAction } from '@mtcute/dispatcher';
import { addReferals, extractReferralId } from 'referrals.js';
import { storage } from 'index.js';
import { BotKeyboard } from '@mtcute/node';
import { MainMenu } from 'telegram-panel/telegram-panel.js';

interface ReferralAddForm {
    targetLink: number;
}

const GiveReferralsWizard = new WizardScene<ReferralAddForm>(
    'referrals_add_form'
);

GiveReferralsWizard.addStep(async (msg, state) => {
    if (msg.text.length < 3) {
        await msg.replyText('Invalid name!');
        return WizardSceneAction.Stay;
    }

    const link = +extractReferralId(msg.text.trim())!;
    await state.set({ targetLink: link });

    await msg.answerText(
        `📝 Введите количество рефералов (доступно ${storage.data.referralAccounts.length})`
    );

    return WizardSceneAction.Next;
});

GiveReferralsWizard.addStep(async (msg, state) => {
    const targetId = (await state.get())!.targetLink;
    const count = +msg.text.trim();

    if (isNaN(count) || count < 1) {
        await msg.replyText('Invalid count!');
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
