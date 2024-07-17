import {
    CallbackDataBuilder,
    Dispatcher,
    PropagationAction,
} from '@mtcute/dispatcher';
import { MainMenu } from 'telegram-panel/menu/main-menu.js';

const BackData = new CallbackDataBuilder('back', 'to');

const backMenuDispatcher = Dispatcher.child<{}>();
backMenuDispatcher.onCallbackQuery(
    BackData.filter({ to: 'main' }),
    async (msg) => {
        await msg.editMessage({
            text: 'Выберите действие',
            replyMarkup: MainMenu(),
        });

        return PropagationAction.Stop;
    }
);

export { backMenuDispatcher, BackData };
