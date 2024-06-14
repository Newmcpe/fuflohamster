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
    dailyCombo: {
        upgradeIds: string[];
        bonusCoins: number;
        isClaimed: boolean;
        remainSeconds: number;
    };
};

export type ClickerGameConfig = {
    clickerConfig: {
        guidLink: {
            ru: string;
            en: string;
            latam: string;
            uz: string;
            vn: string;
            br: string;
        };
        maxPassiveDtSeconds: number;
        userLevels_balanceCoins: Array<{
            level: number;
            coinsToLeveUp: number | null;
        }>;
        boosts: Array<{
            id: string;
            price: number;
            earnPerTap: number;
            maxTaps: number;
            maxLevel?: number;
            cooldownSeconds?: number;
        }>;
        tasks: Array<{
            id: string;
            rewardCoins: number;
            periodicity: 'Once' | 'Repeatedly';
            link?: string;
            channelId?: number;
            rewardsByDays?: Array<{
                days: number;
                rewardCoins: number;
            }>;
        }>;
        airdropTasks: Array<{
            id: string;
            rewardTickets: number;
            periodicity: 'Once';
        }>;
        upgrades: Array<{
            id: string;
            name: string;
            price: number;
            profitPerHour: number;
            condition?: {
                _type:
                    | 'ByUpgrade'
                    | 'ReferralCount'
                    | 'MoreReferralsCount'
                    | 'LinkWithoutCheck'
                    | 'LinksToUpgradeLevel'
                    | 'SubscribeTelegramChannel';
                upgradeId?: string;
                level?: number;
                referralCount?: number;
                moreReferralsCount?: number;
                subscribeLink?: string;
                links?: string[];
                link?: string;
                channelId?: number;
            };
            section: string;
            cooldownSeconds?: Array<{
                level: number;
                cooldownSeconds: number;
            }>;
            maxLevel?: number;
            expiresAt?: string;
            welcomeCoins?: number;
        }>;
        levelUp: {
            maxTaps: number;
            earnPerTap: number;
        };
        referral: {
            base: {
                welcome: number;
                levelUp: { [level: string]: number };
            };
            premium: {
                welcome: number;
                levelUp: { [level: string]: number };
            };
        };
        exchanges: Array<{
            id: string;
            name: string;
            players: number;
            bonus: number;
        }>;
        airdrops: Array<any>;
        depositsUpdateCooldownSeconds: number;
    };
    dailyCipher: {
        cipher: string;
        bonusCoins: number;
        isClaimed: boolean;
        remainSeconds: number;
    };
    feature: Array<string>;
};

export type DailyCombo = {
    combo: string[];
    date: string;
};
