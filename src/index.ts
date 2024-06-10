import { JSONFileSyncPreset } from 'lowdb/node'
import { Config, defaultConfig } from './util/config-schema.js'
import { setupNewAccount } from './onboarding.js'
import enquirer from 'enquirer'
import { hamsterKombatService } from './api/hamster-kombat-service.js'

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
        console.log(
            await hamsterKombatService.getMeTelegram(
                'Bearer ' +
                    storage.data.accounts[Object.keys(storage.data.accounts)[0]]
                        .token
            )
        )
        break
    case 'add':
        await setupNewAccount()
        break
    default:
        throw new Error('Unknown action')
}
