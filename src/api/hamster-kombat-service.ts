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
import { TokenResponse } from './model.js'

@BasePath('')
class HamsterKombatService extends BaseService {
    @POST('auth/auth-by-telegram-webapp')
    async authByTelegramWebApp(
        @Body body: { initDataRaw: string; fingerprint: Fingerprint }
    ): Promise<Response<TokenResponse>> {
        return <Response<TokenResponse>>{}
    }

    @POST('auth/me-telegram')
    async getMeTelegram(
        @Header('Authorization') token: string
    ): Promise<Response<JSON>> {
        return <Response<JSON>>{}
    }
}

export const hamsterKombatService = new ServiceBuilder()
    .setEndpoint('https://api.hamsterkombat.io/')
    .build(HamsterKombatService)
