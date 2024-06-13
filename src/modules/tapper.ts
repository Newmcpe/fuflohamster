import { HamsterAccount } from '../util/config-schema.js'
import { hamsterKombatService } from '../api/hamster-kombat-service.js'
import { isCooldownOver } from './heartbeat.js'
import { storage } from '../index.js'
import { dateNowInSeconds } from '../util/date.js'
import { Color, Logger } from '@starkow/logger'

const log = Logger.create('[Heartbeat]')

export async function tap(account: HamsterAccount) {
    if (!isCooldownOver('noTapsUntil', account)) return

    const { data } = await hamsterKombatService.getProfileData(account.token)
    const availableTaps = data.clickerUser.availableTaps

    if (availableTaps < 50) {
        const sleepTime = getRandomInt(250, 500)
        log.info(
            Logger.color(account.clientName, Color.Cyan),
            Logger.color(' | ', Color.Gray),
            'No more taps available, sleeping for',
            Logger.color(sleepTime.toString(), Color.Yellow),
            'secs'
        )
        storage.update((data) => {
            data.accounts[account.clientName].currentCooldowns.noTapsUntil =
                dateNowInSeconds() + sleepTime
        })
        return
    }

    const taps = getRandomInt(10, availableTaps)

    const response = await hamsterKombatService.tap(account.token, {
        availableTaps,
        count: taps,
        timestamp: Date.now(),
    })

    const sleepTime = getRandomInt(1, 10)
    storage.update((data) => {
        data.accounts[account.clientName].currentCooldowns.noTapsUntil =
            dateNowInSeconds() + sleepTime
    })

    log.info(
        Logger.color(account.clientName, Color.Cyan),
        Logger.color(' | ', Color.Gray),
        'Tapped',
        Logger.color(taps.toString(), Color.Green),
        'times',
        Logger.color('|', Color.Gray),
        'Available energy:',
        Logger.color(
            response.data.clickerUser.availableTaps.toString(),
            Color.Green
        ),
        Logger.color('|', Color.Gray),
        `Balance:`,
        Logger.color(
            response.data.clickerUser.balanceCoins.toFixed(0),
            Color.Green
        )
    )
}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
