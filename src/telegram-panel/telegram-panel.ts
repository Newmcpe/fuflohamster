import { TELEGRAM_BOT_PANEL_TOKEN } from 'env.js';
import { Bot } from 'grammy';
import { Menu } from '@grammyjs/menu';

// const tg = new TelegramClient({
//     apiId: API_ID,
//     apiHash: API_HASH,
// });
//
// const dp = Dispatcher.for(tg);
// const PostButton = new CallbackDataBuilder('main', 'action');
//
// dp.onNewMessage(filters.command('start'), async (msg) => {
//     await msg.answerText(
//         `🧾 Доступное количество рефералов: ${storage.data.referralAccounts.length}`,
//         {
//             replyMarkup: BotKeyboard.inline([
//                 [
//                     BotKeyboard.callback(
//                         'Закупить аккаунты',
//                         PostButton.build({ action: 'buy_hams' })
//                     ),
//                     BotKeyboard.callback(
//                         'Накрутить рефералов',
//                         PostButton.build({ action: 'give_referrals' })
//                     ),
//                 ],
//             ]),
//         }
//     );
// });
//
// dp.onCallbackQuery(
//     PostButton.filter({ action: 'give_referrals' }),
//     async (upd) => {
//         const conv = new Conversation(tg, upd.chat.peer.id);
//         await conv.with(async () => {
//             await conv.sendText(
//                 `👥 Сколько рефералов добавить? (доступно ${storage.data.referralAccounts.length})`
//             );
//
//             const { text: count } = await conv.waitForNewMessage(filters.any);
//
//             await conv.sendText(`👥 Кому добавить рефералов?`);
//
//             const { text: url } = await conv.waitForNewMessage(filters.any);
//             const inviterId = extractReferralId(url);
//
//             await tg.sendText(
//                 upd.user,
//                 `Колво - ${count}, инвайтер - ${inviterId}`
//             );
//         });
//     }
// );

const bot = new Bot(TELEGRAM_BOT_PANEL_TOKEN ?? '');
const menu = new Menu('movements')
    .text('Накрутка рефералов', (ctx) => {})
    .text('Купить аккаунты', (ctx) => ctx.reply('Forward!'))
    .row();

bot.use(menu);

bot.command('start', async (ctx) => {
    await ctx.reply('Выберите действие', {
        reply_markup: menu,
    });
});

export function startTelegramPanel() {
    if (!TELEGRAM_BOT_PANEL_TOKEN) return;

    bot.start();
}
