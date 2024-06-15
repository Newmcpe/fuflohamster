import fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';
import { authKeyAuth, exchangeTelegramForHamster } from 'onboarding.js';
import enquirer from 'enquirer';
import { Color, Logger } from '@starkow/logger';
import { TelegramClient } from '@mtcute/node';
import { API_HASH, API_ID } from 'env.js';
import { storage } from 'index.js';
import process from 'node:process';
import { HttpProxyTcpTransport } from '@mtcute/http-proxy';

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
    let success = 0;

    for (const clientName of referralAccounts) {
        try {
            log.info(
                Logger.color(clientName, Color.Yellow),
                Logger.color(' | ', Color.Gray),
                Logger.color('Регистрирую по рефералке UserID', Color.Green),
                Logger.color(targetId, Color.Yellow)
            );

            let opts: {
                apiId: number;
                apiHash: string;
                storage: string;
                transport?: any;
            } = {
                apiId: API_ID,
                apiHash: API_HASH,
                storage: `bot-data/${clientName}`,
            };

            if (process.env.PROXY_IP) {
                opts = {
                    ...opts,
                    transport: () =>
                        new HttpProxyTcpTransport({
                            host: process.env.PROXY_IP!,
                            port: parseInt(process.env.PROXY_PORT!),
                            user: process.env.PROXY_USER,
                            password: process.env.PROXY_PASS,
                        }),
                };
            }

            const tg = new TelegramClient(opts);

            await tg.start();

            await exchangeTelegramForHamster(tg, clientName, +targetId);
            await tg.close();

            log.info(
                Logger.color(clientName, Color.Yellow),
                Logger.color(' | ', Color.Gray),
                Logger.color(
                    'Успешно зарегался по рефералке UserID',
                    Color.Green
                ),
                Logger.color(targetId, Color.Yellow)
            );

            success++;
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
    log.info(
        Logger.color(success.toString(), Color.Green),
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
