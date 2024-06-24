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
