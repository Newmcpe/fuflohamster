import { Color, Logger } from '@starkow/logger';
import { HamsterAccount } from 'util/config-schema.js';
import { checkTask, listTasks } from 'api/hamster/hamster-kombat-service.js';

const log = Logger.create('[Task Completor]');

export async function autoTasksCompleter(account: HamsterAccount) {
    const {
        data: { tasks },
    } = await listTasks(account);

    for (const task of tasks.filter((task) => !task.isCompleted)) {
        await checkTask(account, task.id);

        log.info(
            Logger.color(account.clientName, Color.Cyan),
            Logger.color(' | ', Color.Gray),
            `Активирована задача ${task.id}`,
            Logger.color(`+(${task.rewardCoins} 🪙)`)
        );
    }
}
