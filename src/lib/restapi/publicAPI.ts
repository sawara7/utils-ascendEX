import { BaseApiClass, ApiConfig } from './baseAPI';
import { ASCENDEX_ENDPOINT } from './requestType';
import { ASDResponse, Asset, FuturePricingData, Ticker } from './responseType';
import * as querystring from 'querystring'

export class ASDPublicApiClass extends BaseApiClass {
    constructor(config: ApiConfig) {
        config.endPoint = config.endPoint || ASCENDEX_ENDPOINT
        super(config)
    }

    get<T>(path: string, query?: {}) {
        let queryPath = path
        if (query && Object.keys(query).length > 0) {
            queryPath += '?' + querystring.encode(query)
        }
        return super.get(queryPath, query)
    }

    public getAllAssets(): Promise<ASDResponse<Asset[]>> {
        const path = 'api/pro/v2/assets'
        return this.get(path)
    }

    public getTicker(symbol: string): Promise<ASDResponse<Ticker>> {
        const path = 'api/pro/v1/spot/ticker'
        return this.get(path, {symbol: symbol})
    }

    public getFutureTicker(symbol: string): Promise<ASDResponse<Ticker>> {
        const path = 'api/pro/v2/futures/ticker'
        return this.get(path, {symbol: symbol})
    }

    public getFuturePricingData(): Promise<ASDResponse<FuturePricingData>> {
        const path = 'api/pro/v2/futures/pricing-data'
        return this.get(path, {})
    }
}
