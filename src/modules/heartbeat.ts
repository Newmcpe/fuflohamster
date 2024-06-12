import { storage } from '../index.js'
import { HamsterAccount } from '../util/config-schema.js'
import { tap } from './tapper.js'
import { dateNowInSeconds } from '../util/date.js'
import { hamsterKombatService } from '../api/hamster-kombat-service.js'
import { Color, Logger } from '@starkow/logger'

const log = Logger.create('heartbeat')

export async function startHeartbeat() {
    for (const account of Object.values(storage.data.accounts)) {
        const {
            data: { clickerUser },
        } = await hamsterKombatService.getProfileData(account.token)

        log.info(
            Logger.color(account.clientName, Color.Cyan),
            Logger.color(' | ', Color.Gray),
            'Last passive earn:',
            Logger.color(clickerUser.lastPassiveEarn.toString(), Color.Green),
            Logger.color(' | ', Color.Gray),
            'Earn every hour:',
            Logger.color(
                clickerUser.earnPassivePerHour.toString(),
                Color.Green
            ),
            Logger.color(' | ', Color.Gray),
            'Current level:',
            Logger.color(clickerUser.level.toString(), Color.Green)
        )

        setInterval(async () => {
            accountHeartbeat(account).then(() => {})
        }, 1000)
    }
}

async function accountHeartbeat(account: HamsterAccount) {
    await tap(account)
}

export function isCooldownOver(
    cooldown: keyof HamsterAccount['currentCooldowns'],
    account: HamsterAccount
): boolean {
    return account.currentCooldowns[cooldown] <= dateNowInSeconds()
}
