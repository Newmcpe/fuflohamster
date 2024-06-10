import { Fingerprint } from './fingerprint.js'

export type Config = {
    accounts: Record<string, HamsterAccount>
}

type HamsterAccount = {
    token: string
    clientName: string
    fingerprint: Fingerprint
}

export const defaultConfig: Config = {
    accounts: {},
}
