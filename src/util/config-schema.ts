import { Fingerprint } from './fingerprint.js'

export type Config = {
    accounts: Record<string, HamsterAccount>
}

export type HamsterAccount = {
    token: string
    clientName: string
    fingerprint: Fingerprint
    currentCooldowns: Cooldowns
}

export type Cooldowns = {
    noTapsUntil: number
}

export const defaultConfig: Config = {
    accounts: {},
}

export const defaultHamsterAccount = {
    token: '',
    clientName: '',
    currentCooldowns: {
        noTapsUntil: 0,
    },
}