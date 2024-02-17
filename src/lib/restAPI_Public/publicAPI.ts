import * as querystring from 'querystring'
import { ASCENDEX_ENDPOINT } from '../utils'
import { ASDResponse } from '../restAPI_Base'
import {
    BaseApiClass,
    ApiConfig
} from '../restAPI_Base/baseAPI';

import {
    ASDAsset,
    FuturePricingData,
    ASDTicker
} from './responseType';

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

    public getAllAssets(): Promise<ASDResponse<ASDAsset[]>> {
        const path = 'api/pro/v2/assets'
        return this.get(path)
    }

    public getCashMarginTicker(symbol: string): Promise<ASDResponse<ASDTicker>> {
        const path = 'api/pro/v1/spot/ticker'
        return this.get(path, {symbol: symbol})
    }

    public getFutureTicker(symbol: string): Promise<ASDResponse<ASDTicker>> {
        const path = 'api/pro/v2/futures/ticker'
        return this.get(path, {symbol: symbol})
    }

    public getFuturePricingData(): Promise<ASDResponse<FuturePricingData>> {
        const path = 'api/pro/v2/futures/pricing-data'
        return this.get(path, {})
    }
}
