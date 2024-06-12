import enquirer from 'enquirer'
import { JSONFileSyncPreset } from 'lowdb/node'
import { setupNewAccount } from './onboarding.js'
import { Config, defaultConfig } from './util/config-schema.js'
import { startHeartbeat } from './modules/heartbeat.js'

export const storage = JSONFileSyncPreset<Config>('config.json', defaultConfig)

if (!storage.data.accounts) {
    await setupNewAccount(true)
}

const menuResponse = await enquirer.prompt<{
    action: 'add' | 'run'
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
    ],
})

switch (menuResponse.action) {
    case 'run':
        await startHeartbeat()
        break
    case 'add':
        await setupNewAccount()
        break
    default:
        throw new Error('Unknown action')
}
