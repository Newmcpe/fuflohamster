import enquirer from 'enquirer'
import { TelegramClient } from '@mtcute/node'
import { API_HASH, API_ID } from './env.js'
import { v4 as uuidv4 } from 'uuid'
import { getRandomFingerprint } from './util/fingerprint.js'
import { storage } from './index.js'
import { hamsterKombatService } from './api/hamster-kombat-service.js'

export async function setupNewAccount(firstTime = false) {
    const authMethodResponse = await enquirer.prompt<{
        authMethod: 'authkey' | 'phone'
        clientName: string
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
    ])

    console.log(authMethodResponse)

    switch (authMethodResponse.authMethod) {
        case 'authkey':
            await authKeyAuth(authMethodResponse.clientName)
            break
        case 'phone':
            await phoneAuth(authMethodResponse.clientName)
            break
        default:
            throw new Error('Unknown auth method')
    }
}

async function phoneAuth(clientName: string) {
    const tg = new TelegramClient({
        apiId: API_ID,
        apiHash: API_HASH,
        storage: `bot-data/${clientName}`,
    })

    await tg.start({
        phone: async () => {
            const phoneResponse = await enquirer.prompt<{
                phone: string
            }>({
                type: 'input',
                name: 'phone',
                message: '📞 Введите номер телефона',
            })

            return phoneResponse.phone
        },
        code: async () => {
            const codeResponse = await enquirer.prompt<{
                code: string
            }>({
                type: 'input',
                name: 'code',
                message: '💬 Введите код из СМС',
            })

            return codeResponse.code
        },
        password: async () => {
            const passwordResponse = await enquirer.prompt<{
                password: string
            }>({
                type: 'input',
                name: 'password',
                message: '🔑 Введите пароль',
            })

            return passwordResponse.password
        },
    })

    await exchangeTelegramForHamster(tg, clientName)

    await tg.close()
}

export async function authKeyAuth(clientName: string) {
    const authKeyResponse = await enquirer.prompt({
        type: 'input',
        name: 'authKey',
        message: 'Введите Auth Key (HEX)',
    })
}

async function exchangeTelegramForHamster(
    tg: TelegramClient,
    clientName: string
) {
    const hamsterPeer = await tg.resolvePeer('hamster_kombat_bot')
    const hamsterUser = await tg.resolveUser(hamsterPeer)

    const result = await tg.call({
        _: 'messages.requestWebView',
        peer: hamsterPeer,
        bot: hamsterUser,
        platform: 'android',
        fromBotMenu: false,
        url: 'https://hamsterkombat.io/',
    })

    const initDataRaw = decodeURIComponent(
        result.url.split('tgWebAppData=')[1].split('&tgWebAppVersion')[0]
    )
    const fingerprint = getRandomFingerprint()

    const {
        data: { authToken },
    } = await hamsterKombatService.authByTelegramWebApp({
        initDataRaw,
        fingerprint,
    })

    storage.update(async (data) => {
        data.accounts = {
            ...data.accounts,
            [clientName]: {
                clientName,
                fingerprint,
                token: authToken,
            },
        }
    })
}
