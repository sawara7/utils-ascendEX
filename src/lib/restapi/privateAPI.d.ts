import { ApiConfig, BaseApiClass } from './baseAPI';
import { GetMarginAccountBalanceRequest, PlaceFutureOrderRequest, PlaceOrderRequest } from './requestType';
import { ASDResponse, MarginAccountBalance, MarginRiskProfile, OrderInfo, PlaceFutureOrderInfo, PositionResponse } from './responseType';
export interface ASDPrivateApiConfig extends ApiConfig {
    apiKey: string;
    apiSecret: string;
    accountGroup: string;
    subAccount?: string;
    sendingInterval?: number;
}
export declare class ASDPrivateApiClass extends BaseApiClass {
    private static toSha256;
    private readonly _apiKey;
    private readonly _apiSecret;
    private readonly _accountGroup;
    private readonly _subAccount?;
    private static _lastOrderTime?;
    private _minOrderInterval;
    constructor(config: ASDPrivateApiConfig);
    getFuturePosition(): Promise<ASDResponse<PositionResponse>>;
    placeMarginOrder(req: PlaceOrderRequest): Promise<ASDResponse<PlaceFutureOrderInfo>>;
    placeFutureOrder(req: PlaceFutureOrderRequest): Promise<ASDResponse<PlaceFutureOrderInfo>>;
    getOrderInfo(orderId: string): Promise<ASDResponse<OrderInfo>>;
    getMarginAccountBalance(params: GetMarginAccountBalanceRequest): Promise<ASDResponse<MarginAccountBalance>>;
    getMarginRiskProfile(): Promise<ASDResponse<MarginRiskProfile>>;
    get<T>(path: string, apiPath: string, query?: {}): Promise<any>;
    post<T>(path: string, apiPath: string, body: {}, ts?: number): Promise<any>;
    delete<T>(path: string, apiPath: string, query?: {}): Promise<any>;
    private makeHeader;
    private sleepWhileOrderInterval;
}
