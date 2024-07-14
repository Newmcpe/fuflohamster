import enquirer from 'enquirer';
import { JSONFileSyncPreset } from 'lowdb/node';
import { setupNewAccount } from './onboarding.js';
import { Config, defaultConfig } from './util/config-schema.js';
import { startHeartbeat } from './clicker-modules/heartbeat.js';
import { addReferalsPrompt, setupReferralAccounts } from 'referrals.js';
import axios from 'axios';

export const storage = JSONFileSyncPreset<Config>('config.json', defaultConfig);
if (!storage.data.accounts) {
    await setupNewAccount(true);
}
axios.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.resolve();
    }
);

const menuResponse = await enquirer.prompt<{
    action: 'add' | 'run' | 'addrefaccs' | 'addreferals';
}>({
    type: 'select',
    name: 'action',
    message: '📝 Запустить бота?',
    initial: 0,
    choices: [
        {
            name: 'run',
            message: 'Запустить бота',
        },
        {
            name: 'add',
            message: 'Добавить новый аккаунт',
        },
        {
            name: 'addrefaccs',
            message:
                'Добавить аккаунты для накрутки рефералов (загрузите в availableaccounts.txt)',
        },
        {
            name: 'addreferals',
            message: 'Добавить рефералов',
        },
    ],
});

switch (menuResponse.action) {
    case 'run':
        await startHeartbeat();
        break;
    case 'add':
        await setupNewAccount();
        break;
    case 'addrefaccs':
        await setupReferralAccounts();
        break;
    case 'addreferals':
        await addReferalsPrompt();
        break;
    default:
        throw new Error('Unknown action');
}
