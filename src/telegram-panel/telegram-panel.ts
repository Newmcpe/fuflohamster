import { TelegramClient } from '@mtcute/node';
import { API_HASH, API_ID, TELEGRAM_BOT_PANEL_TOKEN } from 'env.js';
import { Dispatcher, filters, MemoryStateStorage } from '@mtcute/dispatcher';
import { storage } from 'index.js';
import { GiveReferralsWizard } from 'telegram-panel/give-referrals-scene.js';
import { BuyAccountsWizard } from 'telegram-panel/buy-accounts-scene.js';
import { referralMenuDispatcher } from 'telegram-panel/menu/referral-menu.js';
import { MainMenu, mainMenuDispatcher } from 'telegram-panel/menu/main-menu.js';
import { backMenuDispatcher } from 'telegram-panel/menu/back-menu.js';

const tg = new TelegramClient({
    apiId: API_ID,
    apiHash: API_HASH,
});

const dp = Dispatcher.for<{}>(tg, {
    storage: new MemoryStateStorage(),
});

dp.addChild(mainMenuDispatcher);
dp.addChild(referralMenuDispatcher);
dp.addChild(backMenuDispatcher);

dp.addScene(GiveReferralsWizard);
dp.addScene(BuyAccountsWizard);

dp.onNewMessage(filters.command('start'), async (msg) => {
    await msg.answerText(
        `🧾 Доступное количество рефералов: ${storage.data.referralAccounts.length}`,
        {
            replyMarkup: MainMenu(),
        }
    );
});

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
