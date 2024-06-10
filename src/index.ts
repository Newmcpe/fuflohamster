import { JSONFileSyncPreset } from 'lowdb/node'
import { Config, defaultConfig } from './util/config-schema.js'
import enquirer from 'enquirer'
import { setupNewAccount } from './onboarding.js'

export const storage = JSONFileSyncPreset<Config>('config.json', defaultConfig)

if (storage.data.accounts.length === 0) {
    await setupNewAccount(true)
}
