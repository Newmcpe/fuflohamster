import {
    BaseService,
    GET,
    Path,
    POST,
    Query,
    Response,
    ServiceBuilder,
} from 'retrofit-axios-ts';
import { BuyItemResponse, SearchResponse } from 'api/lzt/model.js';
import { LZT_TOKEN } from 'env.js';

class LolzMarketService extends BaseService {
    @GET('telegram?origin[]=autoreg&order_by=price_to_up&nsb=true&spam=no')
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
}

export const lolzMarketService = new ServiceBuilder()
    .setEndpoint('https://api.lzt.market/')
    .setRequestInterceptors({
        fulfilled: (config) => {
            config.headers.set('Authorization', `${LZT_TOKEN}`);
            return config;
        },
    })
    .build(LolzMarketService);
