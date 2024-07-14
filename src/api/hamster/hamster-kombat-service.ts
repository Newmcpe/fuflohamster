import { Fingerprint } from 'util/fingerprint.js';
import {
    AvailableBoostsResponse,
    AvailableUpgradesResponse,
    ClickerGameConfig,
    HamsterProfile,
    MeTelegramResponse,
    TasksResponse,
    TokenResponse,
} from 'api/hamster/model.js';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { HamsterAccount, Proxy } from 'util/config-schema.js';

const BASE_DOMAIN = 'https://api.hamsterkombatgame.io';

export const authByTelegramWebApp = async (
    body: {
        initDataRaw: string;
        fingerprint: Fingerprint;
    },
    proxy: Proxy | null
): Promise<TokenResponse> =>
    axios.post(
        `${BASE_DOMAIN}/auth/auth-by-telegram-webapp`,
        body,
        proxy
            ? {
                  proxy: {
                      host: proxy.host,
                      port: proxy.port,
                      auth: {
                          username: proxy.username,
                          password: proxy.password,
                      },
                  },
              }
            : {}
    );

export const getMeTelegram = async (
    account: HamsterAccount
): Promise<MeTelegramResponse> =>
    axios.post(
        `${BASE_DOMAIN}/auth/me-telegram`,
        {},
        buildConfigFromAccount(account)
    );

export const getProfileData = async (
    account: HamsterAccount
): Promise<AxiosResponse<HamsterProfile>> =>
    axios.post(
        `${BASE_DOMAIN}/clicker/sync`,
        {},
        buildConfigFromAccount(account)
    );

export const sendTaps = async (
    account: HamsterAccount,
    availableTaps: number,
    count: number,
    timestamp: number
): Promise<AxiosResponse<HamsterProfile>> =>
    axios.post(
        `${BASE_DOMAIN}/clicker/tap`,
        { availableTaps: availableTaps, count, timestamp },
        buildConfigFromAccount(account)
    );

export const addReferral = async (
    token: string,
    proxy: Proxy | null,
    friendUserId: number
): Promise<AxiosResponse<string>> =>
    axios.post(
        `${BASE_DOMAIN}/clicker/add-referral`,
        { friendUserId },
        buildConfig(proxy, token)
    );

export const selectExchange = async (
    token: string,
    proxy: Proxy | null,
    exchangeId: string
): Promise<AxiosResponse<string>> =>
    axios.post(
        `${BASE_DOMAIN}/clicker/select-exchange`,
        { exchangeId },
        buildConfig(proxy, token)
    );

export const getUpgradesForBuy = async (
    account: HamsterAccount
): Promise<AxiosResponse<AvailableUpgradesResponse>> =>
    axios.post(
        `${BASE_DOMAIN}/clicker/upgrades-for-buy`,
        {},
        buildConfigFromAccount(account)
    );

export const buyUpgrade = async (
    account: HamsterAccount,
    upgradeId: string,
    timestamp: number
): Promise<AxiosResponse<AvailableUpgradesResponse>> =>
    axios.post(
        `${BASE_DOMAIN}/clicker/buy-upgrade`,
        { upgradeId, timestamp },
        buildConfigFromAccount(account)
    );

export const getConfig = async (
    account: HamsterAccount
): Promise<AxiosResponse<ClickerGameConfig>> =>
    axios.post(
        `${BASE_DOMAIN}/clicker/config`,
        {},
        buildConfigFromAccount(account)
    );

export const claimDailyCipher = async (
    account: HamsterAccount,
    cipher: string
): Promise<AxiosResponse<ClickerGameConfig>> =>
    axios.post(
        `${BASE_DOMAIN}/clicker/claim-daily-cipher`,
        { cipher },
        buildConfigFromAccount(account)
    );

export const claimDailyCombo = async (account: HamsterAccount): Promise<void> =>
    axios.post(
        `${BASE_DOMAIN}/clicker/claim-daily-combo`,
        {},
        buildConfigFromAccount(account)
    );

export const getBoosts = async (
    account: HamsterAccount
): Promise<AxiosResponse<AvailableBoostsResponse>> =>
    axios.post(
        `${BASE_DOMAIN}/clicker/boosts-for-buy`,
        {},
        buildConfigFromAccount(account)
    );

export const listTasks = async (
    account: HamsterAccount
): Promise<AxiosResponse<TasksResponse>> =>
    axios.post(
        `${BASE_DOMAIN}/clicker/list-tasks`,
        {},
        buildConfigFromAccount(account)
    );

export const applyBoost = async (
    account: HamsterAccount,
    boostId: string,
    timestamp: number
): Promise<void> =>
    axios.post(
        `${BASE_DOMAIN}/clicker/buy-boost`,
        { boostId, timestamp },
        buildConfigFromAccount(account)
    );

export const checkTask = async (
    account: HamsterAccount,
    taskId: string
): Promise<void> =>
    axios.post(
        `${BASE_DOMAIN}/clicker/check-task`,
        { taskId },
        buildConfigFromAccount(account)
    );

const buildConfigFromAccount = (account: HamsterAccount): AxiosRequestConfig =>
    buildConfig(account.proxy, account.token);

const buildConfig = (
    proxy: Proxy | null,
    token: string
): AxiosRequestConfig => {
    let config: AxiosRequestConfig = {};
    if (proxy) {
        config = {
            proxy: {
                host: proxy.host,
                port: proxy.port,
                auth: {
                    username: proxy.username,
                    password: proxy.password,
                },
            },
        };
    }

    if (token) {
        config.headers = {
            Authorization: `Bearer ${token}`,
        };
    }

    return config;
};
