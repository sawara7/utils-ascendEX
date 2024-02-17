import { ASDResponse } from '../restAPI_Base';
import { BaseApiClass, ApiConfig } from '../restAPI_Base/baseAPI';
import { ASDAsset, FuturePricingData, ASDTicker } from './responseType';
export declare class ASDPublicApiClass extends BaseApiClass {
    constructor(config: ApiConfig);
    get<T>(path: string, query?: {}): Promise<any>;
    getAllAssets(): Promise<ASDResponse<ASDAsset[]>>;
    getCashMarginTicker(symbol: string): Promise<ASDResponse<ASDTicker>>;
    getFutureTicker(symbol: string): Promise<ASDResponse<ASDTicker>>;
    getFuturePricingData(): Promise<ASDResponse<FuturePricingData>>;
}
