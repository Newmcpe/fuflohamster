import enquirer from 'enquirer';
import { BaseTelegramClientOptions, TelegramClient } from '@mtcute/node';
import { API_HASH, API_ID } from './env.js';
import { v4 as uuidv4 } from 'uuid';
import { getRandomFingerprint } from './util/fingerprint.js';
import { storage } from './index.js';
import { DC_MAPPING_PROD } from '@mtcute/convert';
import { defaultHamsterAccount, Proxy } from './util/config-schema.js';
import { HttpProxyTcpTransport } from '@mtcute/http-proxy';
import * as process from 'node:process';
import { toInputUser } from '@mtcute/node/utils.js';
import {
    addReferral,
    authByTelegramWebApp,
    selectExchange,
} from 'api/hamster/hamster-kombat-service.js';

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
    const proxy = await proxyPrompt();

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

    await exchangeTelegramForHamster(tg, clientName, undefined, true, proxy);
    await tg.close();
}

async function proxyPrompt(): Promise<Proxy | null> {
    const { needProxy } = await enquirer.prompt<{ needProxy: boolean }>({
        type: 'confirm',
        name: 'needProxy',
        message: '🔗 Нужен ли прокси для подключения?',
    });

    if (!needProxy) return null;

    return enquirer.prompt<Proxy>([
        {
            type: 'input',
            name: 'host',
            message: '🔗 Введите хост прокси',
        },
        {
            type: 'input',
            name: 'port',
            message: '🔗 Введите порт прокси',
        },
        {
            type: 'input',
            name: 'username',
            message: '🔗 Введите имя пользователя прокси',
        },
        {
            type: 'input',
            name: 'password',
            message: '🔗 Введите пароль прокси',
        },
    ]);
}

export async function authKeyAuthPrompt(clientName: string) {
    const authKeyResponse = await enquirer.prompt<{
        authKey: string;
    }>({
        type: 'input',
        name: 'authKey',
        message: 'Введите Auth Key (HEX)',
    });

    const proxy = await proxyPrompt();

    await authKeyAuth(clientName, authKeyResponse.authKey, '2', true, proxy);
}

export async function authKeyAuth(
    clientName: string,
    authKey: string,
    dc: string = '1',
    exchangeToHamsterToken: boolean,
    proxy?: Proxy | null
) {
    const tg = createTelegramClient(clientName, proxy);

    await tg.importSession({
        authKey: new Uint8Array(Buffer.from(authKey, 'hex')),
        testMode: false,
        version: 3,
        primaryDcs: DC_MAPPING_PROD[+dc],
    });

    if (exchangeToHamsterToken) {
        await exchangeTelegramForHamster(
            tg,
            clientName,
            undefined,
            true,
            proxy
        );
    } else {
        await tg.close();
    }
}

export async function exchangeTelegramForHamster(
    tg: TelegramClient,
    clientName: string,
    referrer?: number,
    saveToStorage = false,
    proxy: Proxy | null = null
) {
    const hamsterPeer = await tg.resolvePeer('hamster_kombat_bot');
    const hamsterUser = toInputUser(hamsterPeer);

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

    const { authToken } = await authByTelegramWebApp(
        {
            initDataRaw,
            fingerprint,
        },
        proxy
    );

    if (referrer) {
        await addReferral(authToken, proxy, +referrer);
    }

    await selectExchange(authToken, proxy, 'bybit');

    if (saveToStorage) {
        storage.update(async (data) => {
            data.accounts = {
                ...data.accounts,
                [clientName]: {
                    ...defaultHamsterAccount,
                    clientName,
                    fingerprint,
                    token: authToken,
                    proxy,
                },
            };
        });
    }
}

export function createTelegramClient(clientName: string, proxy?: Proxy | null) {
    let opts: BaseTelegramClientOptions = {
        apiId: API_ID,
        apiHash: API_HASH,
        storage: `bot-data/${clientName}`,
        initConnectionOptions: {
            langCode: 'en',
            langPack: 'en',
            systemLangCode: 'en',
            appVersion: '5.1.7 x64',
            deviceModel: 'Desktop',
            systemVersion: '10',
        },
    };

    if (proxy) {
        opts.transport = () =>
            new HttpProxyTcpTransport({
                host: proxy.host,
                port: proxy.port,
                user: proxy.username,
                password: proxy.password,
            });
    } else if (process.env.PROXY_IP) {
        opts.transport = () =>
            new HttpProxyTcpTransport({
                host: process.env.PROXY_IP!,
                port: parseInt(process.env.PROXY_PORT!),
                user: process.env.PROXY_USER,
                password: process.env.PROXY_PASS,
            });
    }

    return new TelegramClient(opts);
}
