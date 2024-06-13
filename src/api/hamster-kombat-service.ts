import {
    BasePath,
    BaseService,
    Body,
    Header,
    POST,
    Response,
    ServiceBuilder,
} from 'ts-retrofit'

import { Fingerprint } from '../util/fingerprint.js'
import { HamsterProfile, MeTelegramResponse, TokenResponse } from './model.js'

@BasePath('')
class HamsterKombatService extends BaseService {
    @POST('auth/auth-by-telegram-webapp')
    async authByTelegramWebApp(
        @Body _body: { initDataRaw: string; fingerprint: Fingerprint }
    ): Promise<Response<TokenResponse>> {
        return {} as Response<TokenResponse>
    }

    @POST('auth/me-telegram')
    async getMeTelegram(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        @Header('Authorization') _token: string
    ): Promise<Response<MeTelegramResponse>> {
        return {} as Response<MeTelegramResponse>
    }

    @POST('clicker/sync')
    async getProfileData(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        @Header('Authorization') _token: string
    ): Promise<Response<HamsterProfile>> {
        return {} as Response<HamsterProfile>
    }

    @POST('clicker/tap')
    async tap(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        @Header('Authorization') _token: string,
        @Body
        _: {
            availableTaps: number
            count: number
            timestamp: number
        }
    ): Promise<Response<HamsterProfile>> {
        return {} as Response<HamsterProfile>
    }

    @POST('clicker/add-referral')
    async addReferral(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        @Header('Authorization') _token: string,
        @Body
        _: {
            friendUserId: number
        }
    ): Promise<Response<string>> {
        return {} as Response<string>
    }

    @POST('clicker/select-exchange')
    async selectExchange(
        @Header('Authorization') _token: string,
        @Body
        _: {
            exchangeId: string
        }
    ): Promise<Response<string>> {
        return {} as Response<string>
    }
}

export const hamsterKombatService = new ServiceBuilder()
    .setEndpoint('https://api.hamsterkombat.io/')
    .setRequestInterceptors((request) => {
        request.headers.Authorization = `Bearer ${request.headers.Authorization}`
        return request
    })
    .build(HamsterKombatService)
