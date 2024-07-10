export type SearchResponse = {
    items: ItemData[];
};

export interface BuyItemResponse {
    item: ItemData;
}

export type ItemData = {
    item_id: number;
    item_state: string;
    category_id: number;
    published_date: number;
    title: string;
    description: string;
    price: number;
    update_stat_date: number;
    refreshed_date: number;
    view_count: number;
    is_sticky: number;
    item_origin: string;
    extended_guarantee: number;
    nsb: number;
    allow_ask_discount: number;
    title_en: string;
    description_en: string;
    email_type: string;
    item_domain: string;
    active_auction: number;
    resale_item_origin: string;
    telegram_item_id: number;
    telegram_country: string;
    telegram_last_seen: number;
    telegram_premium: number;
    telegram_stars_count: number;
    telegram_birthday: number;
    telegram_password: number;
    telegram_premium_expires: number;
    telegram_spam_block: number;
    telegram_channels_count: number;
    telegram_chats_count: number;
    telegram_admin_count: number;
    telegram_admin_subs_count: number;
    telegram_conversations_count: number;
    telegram_id_count: number;
    telegram_contacts_count: number;
    feedback_data: string;
    isIgnored: boolean;
    priceWithSellerFee: number;
    guarantee: null;
    canViewLoginData: boolean;
    canUpdateItemStats: boolean;
    canReportItem: boolean;
    canViewEmailLoginData: boolean;
    showGetEmailCodeButton: boolean;
    canOpenItem: boolean;
    canCloseItem: boolean;
    loginData: {
        raw: string;
        encodedRaw: string;
        login: string;
        password: string;
        encodedPassword: string;
        oldPassword: string;
        encodedOldPassword: string;
    };
    canEditItem: boolean;
    canDeleteItem: boolean;
    canStickItem: boolean;
    canUnstickItem: boolean;
    bumpSettings: {
        canBumpItem: boolean;
        canBumpItemGlobally: boolean;
        shortErrorPhrase: string | null;
        errorPhrase: string | null;
    };
    canBumpItem: boolean;
    canBuyItem: boolean;
    rub_price: number;
    price_currency: string;
    canValidateAccount: boolean;
    canResellItemAfterPurchase: boolean;
    telegram_group_counters: {
        chats: number;
        channels: number;
        conversations: number;
        admin: number;
    };
    telegram_admin_groups: any[];
    canViewAccountLink: boolean;
    accountLinks: any[];
    itemOriginPhrase: string;
    sold_items_category_count: number;
    restore_items_category_count: number;
    tags: any[];
    note_text: string | null;
    auction: any[];
    hasPendingAutoBuy: boolean;
    descriptionHtml: string;
    descriptionEnHtml: string;
    descriptionPlain: string;
    descriptionEnPlain: string;
    seller: {
        user_id: number;
        sold_items_count: number;
        active_items_count: number;
        restore_data: string;
        username: string;
        avatar_date: number;
        is_banned: number;
        display_style_group_id: number;
        restore_percents: number;
    };
};

type User = {
    user_id: number;
    username: string;
    username_html: string;
    user_message_count: number;
    user_register_date: number;
    user_like_count: number;
    user_like2_count: number;
    contest_count: number;
    trophy_count: number;
    custom_title: string;
    is_banned: number;
    user_email: string;
    user_unread_notification_count: number;
    user_dob_day: number;
    user_dob_month: number;
    user_dob_year: number;
    user_unread_conversation_count: number;
    user_title: string;
    user_is_valid: boolean;
    user_is_verified: boolean;
    user_is_followed: boolean;
    user_last_seen_date: number;
    user_following_count: number;
    user_followers_count: number;
    links: {
        permalink: string;
        detail: string;
        avatar: string;
        avatar_big: string;
        avatar_small: string;
        followers: string;
        followings: string;
        ignore: string;
        timeline: string;
    };
    permissions: {
        market: {
            canBumpOwnItem: boolean;
            createAuction: boolean;
            canAddItem: boolean;
            manageAnyFeedback: boolean;
            manageAnyPayments: boolean;
            bumpItemPeriod: number;
            canCancelBuy: boolean;
            canViewEmailLetters: boolean;
            canUseMarketScope: boolean;
            canWithdrawalBalance: boolean;
            cancelFinishedPayout: boolean;
            canDeleteItem: boolean;
            canDeleteFeedback: boolean;
            bumpItemCountInPeriod: number;
            viewReports: boolean;
            allowManageProxy: boolean;
            stickItem: boolean;
            bidAuction: boolean;
            viewUserWallet: boolean;
            viewAnyPayments: boolean;
            hasExtendedRights: boolean;
            hasAccessToMarket: boolean;
            viewAllItems: boolean;
            canAddFeedback: boolean;
            approvePayoutRequest: boolean;
        };
    };
    user_is_ignored: boolean;
    user_is_visitor: boolean;
    user_group_id: number;
    user_timezone_offset: number;
    user_has_password: boolean;
    fields: {
        id: string;
        title: string;
        description: string;
        position: string;
        is_required: boolean;
        value: string;
        is_multi_choice?: boolean;
        choices?: {
            key: string;
            value: string;
        }[];
    }[];
    self_permissions: {
        create_conversation: boolean;
        upload_attachment_conversation: boolean;
    };
    edit_permissions: {
        password: boolean;
        user_email: boolean;
        username: boolean;
        user_title: boolean;
        primary_group_id: boolean;
        secondary_group_ids: boolean;
        user_dob_day: boolean;
        user_dob_month: boolean;
        user_dob_year: boolean;
        fields: boolean;
    };
    balance: number;
    hold: number;
    joined_date: number;
    sold_items_count: number;
    active_items_count: number;
    payout_count: number;
    restore_count: number;
    user_allow_ask_discount: number;
    currency: string;
    max_discount_percent: number;
    restore_data: string;
    market_custom_title: string;
    feedback_data: any;
    notice_first_sale: string;
    notice_first_payout: string;
    has_ignored_items: number;
    domain: string;
    check_ban: number;
    disable_steam_guard: number;
    hide_favourites: number;
    tags: {
        [key: number]: {
            tag_id: number;
            title: string;
            isDefault: boolean;
            forOwnedAccountsOnly: boolean;
            bc: string;
        };
    };
    search_ban_end_date: number;
    vk_ua: string;
    telegram_client: any[];
    payment_stats: string;
    imap_data: any[];
    custom_account_download_format: string;
    hide_bids: number;
    deauthorize_steam: number;
    show_account_links: number;
    show_too_low_price_change_warning: number;
    currencyPhrase: string;
    sourceBalance: number;
    sourceHold: number;
    customTags: any[];
    hasCustomTags: boolean;
    searchHistory: {
        category_id: number;
        order_by: string;
        tag_id: any[];
        not_tag_id: any[];
        origin: string[];
        not_origin: any[];
        user_id: number;
        nsb: boolean;
        sb: boolean;
        nsb_by_me: boolean;
        sb_by_me: boolean;
        hide_viewed: boolean;
        email_login_data: boolean;
        email_type: any[];
        update_stat_after: number;
        update_stat_before: number;
        delete_after: number;
        delete_before: number;
        search_id: number;
        spam: string;
        password: string;
        country: any[];
        not_country: any[];
        userItems: boolean;
        userOrders: boolean;
        searchUrl: string;
    }[];
    savedSearch: {
        [key: number]: {
            search_id: number;
            user_id: number;
            link: string;
            title: string;
        };
    };
};

export type MeResponse = {
    user: User;
};

type Task = {
    id: string;
    rewardCoins: number;
    periodicity: 'Once' | 'Repeatedly';
    link?: string;
    isCompleted: boolean;
    linksWithLocales?: LinkWithLocale[];
    channelId?: number;
    completedAt?: string;
    rewardsByDays?: RewardByDay[];
    days?: number;
    remainSeconds?: number;
};

type LinkWithLocale = {
    locale: string;
    link: string;
};

type RewardByDay = {
    days: number;
    rewardCoins: number;
};

export type TasksResponse = {
    tasks: Task[];
};
