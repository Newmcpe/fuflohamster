import fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';
import { authKeyAuth, exchangeTelegramForHamster } from 'onboarding.js';
import enquirer from 'enquirer';
import { Color, Logger } from '@starkow/logger';
import { TelegramClient } from '@mtcute/node';
import { API_HASH, API_ID } from 'env.js';
import { storage } from 'index.js';

const log = Logger.create('[Referrals]');

export async function setupReferralAccounts() {
    fs.readFile('availableaccounts.txt', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        const lines = data.split('\n');

        lines.forEach(async (line) => {
            const clientName = uuidv4();
            await authKeyAuth(clientName, line);

            storage.update((data) => {
                data.referralAccounts.push(clientName);
                return data;
            });
        });

        console.log(
            `Successfully added ${lines.length} accounts to referralAccounts`
        );
    });

    fs.rmSync('availableaccounts.txt');
}

export async function addReferals() {
    const { count } = await enquirer.prompt<{ count: number }>({
        type: 'input',
        name: 'count',
        message: `👥 Сколько рефералов добавить? (доступно ${storage.data.referralAccounts.length})`,
    });

    const { targetId } = await enquirer.prompt<{ targetId: string }>({
        type: 'input',
        name: 'targetId',
        message: '👥 Кому добавить рефералов?',
    });

    const referralAccounts = storage.data.referralAccounts.slice(-count);

    for (const clientName of referralAccounts) {
        log.info(
            Logger.color(clientName, Color.Yellow),
            Logger.color(' | ', Color.Gray),
            Logger.color('Регистрирую по рефералке UserID', Color.Green),
            Logger.color(targetId, Color.Yellow)
        );

        const tg = new TelegramClient({
            apiId: API_ID,
            apiHash: API_HASH,
            storage: `bot-data/${clientName}`,
        });

        await tg.start();

        await exchangeTelegramForHamster(tg, clientName, +targetId);
        await tg.close();

        log.info(
            Logger.color(clientName, Color.Yellow),
            Logger.color(' | ', Color.Gray),
            Logger.color('Успешно зарегался по рефералке UserID', Color.Green),
            Logger.color(targetId, Color.Yellow)
        );

        await new Promise((resolve) => setTimeout(resolve, 750));
    }

    log.info(
        Logger.color('Добавлено', Color.Green),
        Logger.color(count.toString(), Color.Yellow),
        Logger.color('рефералов', Color.Green),
        Logger.color('для ', Color.Green),
        Logger.color(targetId, Color.Yellow)
    );

    storage.update((data) => {
        data.referralAccounts = data.referralAccounts.slice(0, -count);
        return data;
    });
}
