import enquirer from 'enquirer';
import { TelegramClient } from '@mtcute/node';
import { API_HASH, API_ID } from './env.js';
import { v4 as uuidv4 } from 'uuid';
import { getRandomFingerprint } from './util/fingerprint.js';
import { storage } from './index.js';
import { hamsterKombatService } from './api/hamster-kombat-service.js';
import { DC_MAPPING_PROD } from '@mtcute/convert';
import { defaultHamsterAccount } from './util/config-schema.js';
import { HttpProxyTcpTransport } from '@mtcute/http-proxy';
import * as process from 'node:process';

export async function setupNewAccount(firstTime = false) {
    const { authMethod, clientName } = await enquirer.prompt<{
        authMethod: 'authkey' | 'phone';
        clientName: string;
    }>([
        {
            type: 'input',
            name: 'clientName',
            initial: uuidv4(),
            message: firstTime
                ? '👋 Привет! Для начала работы нужно добавить аккаунт Telegram. Как вы хотите назвать этот профиль?'
                : '📝 Как вы хотите назвать этот профиль?',
        },
        {
            type: 'select',
            name: 'authMethod',
            message: '🧾 Выберите способ авторизации',
            choices: [
                {
                    name: 'phone',
                    message: 'Войти по номеру телефона',
                },
                {
                    name: 'authkey',
                    message: 'Auth Key (HEX)',
                },
            ],
        },
    ]);

    switch (authMethod) {
        case 'authkey':
            await authKeyAuthPrompt(clientName);
            break;
        case 'phone':
            await phoneAuth(clientName);
            break;
        default:
            throw new Error('Unknown auth method');
    }
}

async function phoneAuth(clientName: string) {
    const tg = new TelegramClient({
        apiId: API_ID,
        apiHash: API_HASH,
        storage: `bot-data/${clientName}`,
    });

    await tg.start({
        phone: async () => {
            const phoneResponse = await enquirer.prompt<{
                phone: string;
            }>({
                type: 'input',
                name: 'phone',
                message: '📞 Введите номер телефона',
            });

            return phoneResponse.phone;
        },
        code: async () => {
            const codeResponse = await enquirer.prompt<{
                code: string;
            }>({
                type: 'input',
                name: 'code',
                message: '💬 Введите код из СМС',
            });

            return codeResponse.code;
        },
        password: async () => {
            const passwordResponse = await enquirer.prompt<{
                password: string;
            }>({
                type: 'input',
                name: 'password',
                message: '🔑 Введите пароль',
            });

            return passwordResponse.password;
        },
    });

    await exchangeTelegramForHamster(tg, clientName, undefined, true);
    await tg.close();
}

export async function authKeyAuthPrompt(clientName: string) {
    const authKeyResponse = await enquirer.prompt<{
        authKey: string;
    }>({
        type: 'input',
        name: 'authKey',
        message: 'Введите Auth Key (HEX)',
    });

    await authKeyAuth(clientName, authKeyResponse.authKey);
}

export async function authKeyAuth(
    clientName: string,
    authKey: string,
    dc: string = '1'
) {
    const tg = createTelegramClient(clientName);

    await tg.importSession({
        authKey: new Uint8Array(Buffer.from(authKey, 'hex')),
        testMode: false,
        version: 3,
        primaryDcs: DC_MAPPING_PROD[+dc],
    });

    await tg.close();

    console.log(`${clientName} | ${authKey} Auth key imported successfully`);
}

export async function exchangeTelegramForHamster(
    tg: TelegramClient,
    clientName: string,
    referrer?: number,
    saveToStorage = false
) {
    const hamsterPeer = await tg.resolvePeer('hamster_kombat_bot');
    const hamsterUser = await tg.resolveUser(hamsterPeer);

    const result = await tg.call({
        _: 'messages.requestAppWebView',
        peer: hamsterPeer,
        app: {
            _: 'inputBotAppShortName',
            botId: hamsterUser,
            shortName: 'start',
        },
        platform: 'android',
        startParam: `kentId${referrer}`,
    });

    let initDataRaw = result.url
        .split('tgWebAppData=')[1]
        .split('&tgWebAppVersion')[0];

    initDataRaw = decodeURIComponent(initDataRaw);

    const fingerprint = getRandomFingerprint();

    const {
        data: { authToken },
    } = await hamsterKombatService.authByTelegramWebApp({
        initDataRaw,
        fingerprint,
    });

    if (referrer) {
        await hamsterKombatService.addReferral(authToken, {
            friendUserId: +referrer,
        });

        await hamsterKombatService.selectExchange(authToken, {
            exchangeId: 'bybit',
        });
    }

    if (saveToStorage) {
        storage.update(async (data) => {
            data.accounts = {
                ...data.accounts,
                [clientName]: {
                    ...defaultHamsterAccount,
                    clientName,
                    fingerprint,
                    token: authToken,
                },
            };
        });
    }
}

export function createTelegramClient(clientName: string) {
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
            transport: new HttpProxyTcpTransport({
                host: process.env.PROXY_IP,
                port: parseInt(process.env.PROXY_PORT!),
                user: process.env.PROXY_USER,
                password: process.env.PROXY_PASS,
            }),
        };
    }

    return new TelegramClient(opts);
}
