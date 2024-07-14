import fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';
import {
    authKeyAuth,
    createTelegramClient,
    exchangeTelegramForHamster,
} from 'onboarding.js';
import enquirer from 'enquirer';
import { Color, Logger } from '@starkow/logger';
import { storage } from 'index.js';

const log = Logger.create('[Referrals]');

export async function setupReferralAccounts() {
    const { dc } = await enquirer.prompt<{
        dc: string;
    }>({
        type: 'input',
        name: 'dc',
        message: 'Введите дата-центр аккаунтов',
    });

    fs.readFile('availableaccounts.txt', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        const lines = data.split('\n');

        lines.forEach(async (line) => {
            const clientName = uuidv4();
            await authKeyAuth(clientName, line, dc, false, null);

            storage.update((data) => {
                data.referralAccounts.push(clientName);
                return data;
            });
        });

        console.log(
            `Successfully added ${lines.length} accounts to referralAccounts`
        );

        fs.writeFileSync('availableaccounts.txt', '');
    });
}

export async function addReferalsPrompt() {
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

    const successCount = await addReferals(+targetId, count, (clientName) => {
        log.info(
            Logger.color('Добавлен реферал:', Color.Green),
            Logger.color(clientName, Color.Yellow),
            Logger.color('к', Color.Gray),
            Logger.color(targetId, Color.Yellow)
        );
    });

    log.info(
        Logger.color(successCount.toString(), Color.Green),
        Logger.color('из', Color.Gray),
        Logger.color(count.toString(), Color.Green),
        Logger.color('рефералов', Color.Green),
        Logger.color('для ', Color.Green),
        Logger.color(targetId, Color.Yellow)
    );
}

export async function addReferals(
    targetId: number,
    count: number,
    onReferalAddition: (clientName: string) => void
) {
    const referralAccounts = storage.data.referralAccounts.slice(-count);
    let successCount = 0;

    for (const clientName of referralAccounts) {
        try {
            log.info(
                Logger.color(clientName, Color.Yellow),
                Logger.color(' | ', Color.Gray),
                Logger.color('Регистрирую по рефералке UserID', Color.Green),
                Logger.color(targetId.toString(), Color.Yellow)
            );

            const tg = createTelegramClient(clientName);
            console.log(
                await tg.call({
                    _: 'help.getNearestDc',
                })
            );

            await tg.start();
            await exchangeTelegramForHamster(tg, clientName, +targetId);
            await tg.close();

            onReferalAddition(clientName);

            successCount++;
            await new Promise((resolve) => setTimeout(resolve, 750));
        } catch (e) {
            log.error(
                Logger.color(clientName, Color.Yellow),
                Logger.color(' | ', Color.Gray),
                Logger.color('Ошибка:', Color.Red),
                e
            );
        }
    }

    storage.update((data) => {
        data.referralAccounts = data.referralAccounts.slice(0, -count);
        return data;
    });

    return successCount;
}

export function extractReferralId(url: string): string | null {
    const pattern = /(\d+)/;
    const match = url.match(pattern);

    return match ? match[1] : null;
}
