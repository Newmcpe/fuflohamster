import { Fingerprint } from './fingerprint.js';

export type Config = {
    accounts: Record<string, HamsterAccount>;
    referralAccounts: string[];
};

export type HamsterAccount = {
    token: string;
    clientName: string;
    fingerprint: Fingerprint;
    currentCooldowns: Cooldowns;
};

export type Cooldowns = {
    noTapsUntil: number;
    noUpgradesUntil: number;
};

export const defaultConfig: Config = {
    accounts: {},
    referralAccounts: [],
};

export const defaultHamsterAccount = {
    token: '',
    clientName: '',
    currentCooldowns: {
        noTapsUntil: 0,
        noUpgradesUntil: 0,
    },
};
