import enquirer from 'enquirer'
import { JSONFileSyncPreset } from 'lowdb/node'
import {
    authKeyAuth,
    exchangeTelegramForHamster,
    setupNewAccount,
} from './onboarding.js'
import { Config, defaultConfig } from './util/config-schema.js'
import { startHeartbeat } from './modules/heartbeat.js'
import * as fs from 'node:fs'
import { v4 as uuidv4 } from 'uuid'
import { API_HASH, API_ID } from './env.js'
import { TelegramClient } from '@mtcute/node'

export const storage = JSONFileSyncPreset<Config>('config.json', defaultConfig)

if (!storage.data.accounts) {
    await setupNewAccount(true)
}

const menuResponse = await enquirer.prompt<{
    action: 'add' | 'run' | 'addrefaccs' | 'addreferals'
}>({
    type: 'select',
    name: 'action',
    message: '📝 Запустить бота?',
    initial: 0,
    choices: [
        {
            name: 'run',
            message: 'Запустить бота',
        },
        {
            name: 'add',
            message: 'Добавить новый аккаунт',
        },
        {
            name: 'addrefaccs',
            message:
                'Добавить аккаунты для накрутки рефералов (загрузите в availableaccounts.txt)',
        },
        {
            name: 'addreferals',
            message: 'Добавить рефералов',
        },
    ],
})

async function setupReferralAccounts() {
    fs.readFile('availableaccounts.txt', 'utf8', function (err, data) {
        if (err) {
            console.log(err)
            return
        }
        const lines = data.split('\n')

        lines.forEach(async (line) => {
            const clientName = uuidv4()
            await authKeyAuth(clientName, line)

            storage.update((data) => {
                data.referralAccounts.push(clientName)
                return data
            })
        })

        console.log(
            `Successfully added ${lines.length} accounts to referralAccounts`
        )
    })

    fs.rmSync('availableaccounts.txt')
}

async function addReferals() {
    const { count } = await enquirer.prompt<{ count: number }>({
        type: 'input',
        name: 'count',
        message: '👥 Сколько рефералов добавить?',
    })

    const { targetId } = await enquirer.prompt<{ targetId: string }>({
        type: 'input',
        name: 'targetId',
        message: '👥 Кому добавить рефералов?',
    })

    //get n last referral accounts
    const referralAccounts = storage.data.referralAccounts.slice(-count)

    console.log(referralAccounts)

    for (const clientName of referralAccounts) {
        console.log(`Adding referal using ${clientName} to ${targetId}`)
        const tg = new TelegramClient({
            apiId: API_ID,
            apiHash: API_HASH,
            storage: `bot-data/${clientName}`,
        })

        await tg.start()

        await exchangeTelegramForHamster(tg, clientName, +targetId)
        await tg.close()

        console.log(
            `Successfully added referal using ${clientName} to ${targetId}`
        )

        await new Promise((resolve) => setTimeout(resolve, 5000))
    }

    console.log(`Successfully added ${count} referals`)

    storage.update((data) => {
        data.referralAccounts = data.referralAccounts.slice(0, -count)
        return data
    })
}

switch (menuResponse.action) {
    case 'run':
        await startHeartbeat()
        break
    case 'add':
        await setupNewAccount()
        break
    case 'addrefaccs':
        await setupReferralAccounts()
        break
    case 'addreferals':
        await addReferals()
        break
    default:
        throw new Error('Unknown action')
}
