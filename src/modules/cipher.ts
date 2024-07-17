import { HamsterAccount } from 'util/config-schema.js';
import { Color, Logger } from '@starkow/logger';
import {
    claimDailyCipher,
    getConfig,
} from 'api/hamster/hamster-kombat-service.js';

const log = Logger.create('[CIPHER]');

function decodeCipher(cipher: string) {
    return Buffer.from(cipher.slice(0, 3) + cipher.slice(4), 'base64').toString(
        'utf-8'
    );
}

export async function cipherClaimer(account: HamsterAccount) {
    const {
        data: { dailyCipher },
    } = await getConfig(account);

    const decryptedCipher = decodeCipher(dailyCipher.cipher);
    if (dailyCipher.isClaimed) return;

    await claimDailyCipher(account, decryptedCipher);

    log.info(
        Logger.color(account.clientName, Color.Cyan),
        Logger.color(' | ', Color.Gray),
        'Расшифрован шифр',
        Logger.color(decryptedCipher, Color.Yellow),
        Logger.color('(+1 000 000 🪙)', Color.Green)
    );
}
