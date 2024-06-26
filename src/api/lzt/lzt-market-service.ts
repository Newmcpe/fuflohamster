import {
    BaseService,
    GET,
    Path,
    POST,
    Queries,
    Query,
    Response,
    ServiceBuilder,
} from 'retrofit-axios-ts';
import { BuyItemResponse, MeResponse, SearchResponse } from 'api/lzt/model.js';
import { LZT_TOKEN } from 'env.js';

class LolzMarketService extends BaseService {
    @GET('telegram')
    @Queries({
        //origin[]=autoreg&order_by=price_to_up&nsb=true&spam=no
        order_by: 'price_to_up',
        'origin[]': 'autoreg',
        //not_country[]=ZA
        //country[]=ID
        nsb: 1,
    })
    async getTelegramAccounts(
        @Query('pmax') pmax: number
    ): Promise<Response<SearchResponse>> {
        return <Response<SearchResponse>>{};
    }

    @POST('{itemId}/fast-buy')
    async fastBuy(
        @Path('itemId') itemId: number
    ): Promise<Response<BuyItemResponse>> {
        return <Response<BuyItemResponse>>{};
    }

    @GET('me')
    async getProfileData(): Promise<Response<MeResponse>> {
        return <Response<MeResponse>>{};
    }
}

export const lolzMarketService = new ServiceBuilder()
    .setEndpoint('https://api.lzt.market/')
    .setRequestInterceptors({
        fulfilled: (config) => {
            config.headers.set('Authorization', 'Bearer ' + LZT_TOKEN);
            return config;
        },
    })
    .setStandalone(true)
    .build(LolzMarketService);
