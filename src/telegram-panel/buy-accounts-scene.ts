import {
    MessageContext,
    WizardScene,
    WizardSceneAction,
} from '@mtcute/dispatcher';
import { lolzMarketService } from 'api/lzt/lzt-market-service.js';
import { ItemData } from 'api/lzt/model.js';
import { authKeyAuth } from 'onboarding.js';

interface BuyAccountsForm {
    count: number;
    maxPrice: number;
}

export const BuyAccountsWizard = new WizardScene<BuyAccountsForm>(
    'buy_accounts_form'
);

BuyAccountsWizard.addStep(async (msg, state) => {
    const count = +msg.text.trim();

    if (isNaN(count) || count < 1) {
        await msg.replyText('Invalid count!');
        return WizardSceneAction.Stay;
    }
    await state.set({ count, maxPrice: 0 });

    await msg.answerText(
        '💎 Выбрано ' +
            count +
            ' аккаунтов. Введите потолок цены на каждый аккаунт.'
    );

    return WizardSceneAction.Next;
});

BuyAccountsWizard.addStep(async (msg, state) => {
    const count = (await state.get())!.count;
    const price = +msg.text.trim();

    if (isNaN(price) || price < 0) {
        await msg.replyText('Invalid price!');
        return WizardSceneAction.Stay;
    }

    await state.set({ count, maxPrice: price });

    await msg.answerText(
        `🔍 Ищу ${count} аккаунтов по цене не выше ${price} рублей. Подождите...`
    );

    let {
        data: { items },
    } = await lolzMarketService.getTelegramAccounts(price);

    if (items.length === 0) {
        await msg.replyText('❌ Не найдено аккаунтов по заданным параметрам');
        return WizardSceneAction.Exit;
    }

    let itemsToBuy = items.slice(0, count);

    const summaryMsg = await msg.replyText(
        `✅ Найдено ${items.length} аккаунтов. Средняя цена - ${
            items.reduce((acc, item) => acc + item.price, 0) / items.length
        } рублей.`
    );

    await msg.client.editMessage({
        message: summaryMsg,
        text:
            summaryMsg.text +
            `\nАккаунты:\n${itemsToBuy.map((item, idx) => `[${idx}] - [${item.item_id}] = ${item.price} RUB`).join('\n')}`,
    });

    await buyAccounts(itemsToBuy, msg);

    return WizardSceneAction.Exit;
});

async function buyAccounts(itemsToBuy: ItemData[], msg: MessageContext) {
    await msg.answerText(
        '🛒 Начата покупка аккаунтов. Это займет какое-то время...'
    );

    for (let itemIdx = 0; itemIdx < itemsToBuy.length; itemIdx++) {
        const itemToBuy = itemsToBuy[itemIdx];
        const response = await lolzMarketService.fastBuy(itemToBuy.item_id);
        if (response.status === 200) {
            const {
                data: { item },
            } = response;

            await authKeyAuth(
                item.item_id.toString(),
                item.loginData.raw,
                item.loginData.password
            );

            await msg.answerText(
                `✅ [${itemIdx}/${itemsToBuy.length}] Аккаунт ${item.item_id} - ${item.title} успешно куплен`
            );
        } else {
            await msg.answerText(
                `❌ [${itemIdx}/${itemsToBuy.length}] Ошибка покупки аккаунта ${itemToBuy.item_id}`
            );
        }
    }
}
