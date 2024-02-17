import { BaseApiClass, ApiConfig } from './baseAPI';
import { ASDResponse, Asset, FuturePricingData, Ticker } from './responseType';
export declare class ASDPublicApiClass extends BaseApiClass {
    constructor(config: ApiConfig);
    get<T>(path: string, query?: {}): Promise<any>;
    getAllAssets(): Promise<ASDResponse<Asset[]>>;
    getCashMarginTicker(symbol: string): Promise<ASDResponse<Ticker>>;
    getFutureTicker(symbol: string): Promise<ASDResponse<Ticker>>;
    getFuturePricingData(): Promise<ASDResponse<FuturePricingData>>;
}
