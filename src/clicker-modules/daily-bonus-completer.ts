import { Color, Logger } from '@starkow/logger';
import { HamsterAccount } from 'util/config-schema.js';
import { hamsterKombatService } from 'api/hamster/hamster-kombat-service.js';
import { setCooldown } from 'clicker-modules/heartbeat.js';

const log = Logger.create('[Streak Completor] ');

export async function dailyBonusCompleter(account: HamsterAccount) {
    const {
        data: { tasks },
    } = await hamsterKombatService.listTasks(account.token);

    const streakDaysTask = tasks.find((task) => task.id === 'streak_days')!;

    if (streakDaysTask.isCompleted) {
        setCooldown('noDailyBonusUntil', account, 3600);
        return;
    }

    await hamsterKombatService.checkTask(account.token, {
        taskId: streakDaysTask.id,
    });

    log.info(
        Logger.color(account.clientName, Color.Cyan),
        Logger.color(' | ', Color.Gray),
        `Активирован бонус за ${streakDaysTask.days} дней.`
    );
}
