import { Fingerprint } from './fingerprint.js';

export type Config = {
    accounts: Record<string, HamsterAccount>;
    referralAccounts: string[];
};

export type Proxy = {
    host: string;
    port: number;
    username: string;
    password: string;
};

export type HamsterAccount = {
    token: string;
    clientName: string;
    fingerprint: Fingerprint;
    currentCooldowns: Cooldowns;
    proxy: Proxy | null;
};

export type Cooldowns = {
    noTapsUntil: number;
    noUpgradesUntil: number;
    noDailyComboUntil: number;
    noDailyBonusUntil: number;
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
        noDailyComboUntil: 0,
        noDailyBonusUntil: 0,
    },
    proxy: null,
};
