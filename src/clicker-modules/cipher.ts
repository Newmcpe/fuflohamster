import { HamsterAccount } from 'util/config-schema.js';
import { hamsterKombatService } from 'api/hamster-kombat-service.js';
import { Color, Logger } from '@starkow/logger';

const log = Logger.create('[CIPHER]');

function decodeCipher(cipher: string) {
    return Buffer.from(cipher.slice(0, 3) + cipher.slice(4), 'base64').toString(
        'utf-8'
    );
}

export async function cipherClaimer(account: HamsterAccount) {
    const {
        data: { dailyCipher },
    } = await hamsterKombatService.getConfig(account.token);

    const decryptedCipher = decodeCipher(dailyCipher.cipher);
    if (dailyCipher.isClaimed) return;

    log.info(
        Logger.color(account.clientName, Color.Cyan),
        Logger.color(' | ', Color.Gray),
        'Расшифрован шифр',
        Logger.color(decryptedCipher, Color.Yellow),
        Logger.color('(+1 000 000 🪙)', Color.Green)
    );
}
