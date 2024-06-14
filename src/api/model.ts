export type TokenResponse = {
    authToken: string;
};
export type MeTelegramResponse = {
    telegramUser: {
        id: number;
        isBot: boolean;
        firstName: string;
        lastName: string;
        username: string;
        languageCode: string;
    };
    status: string;
};

export type HamsterProfile = {
    clickerUser: {
        id: string;
        totalCoins: number;
        balanceCoins: number;
        level: number;
        availableTaps: number;
        lastSyncUpdate: number;
        exchangeId: string;
        boosts: Record<
            string,
            {
                id: string;
                level: number;
                lastUpgradeAt: number;
            }
        >;
        upgrades: Record<
            string,
            {
                id: string;
                level: number;
                lastUpgradeAt: number;
                snapshotReferralsCount?: number;
            }
        >;
        tasks: Record<
            string,
            {
                id: string;
                completedAt: string;
                days?: number;
            }
        >;
        airdropTasks: Record<string, unknown>;
        referralsCount: number;
        maxTaps: number;
        earnPerTap: number;
        earnPassivePerSec: number;
        earnPassivePerHour: number;
        lastPassiveEarn: number;
        tapsRecoverPerSec: number;
        referral: {
            friend: {
                id: number;
                isBot: boolean;
                firstName: string;
                lastName: string;
                username: string;
                languageCode: string;
                isPremium: boolean;
                welcomeBonusCoins: number;
            };
        };
        claimedCipherAt: string;
        claimedUpgradeComboAt: string;
    };
};

export type AvailableUpgradesResponse = {
    upgradesForBuy: {
        id: string;
        name: string;
        price: number;
        profitPerHour: number;
        condition?: {
            _type: string;
            link: string;
            channelId: number;
        };
        cooldownSeconds?: number;
        section: string;
        level: number;
        maxLevel?: number;
        currentProfitPerHour: number;
        profitPerHourDelta: number;
        isAvailable: boolean;
        isExpired: boolean;
        totalCooldownSeconds: number;
    }[];
};
