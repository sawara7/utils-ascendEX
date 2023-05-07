import { ApiConfig, BaseApiClass } from './baseAPI';
import { CancelOrderRequest, GetMarginAccountBalanceRequest, PlaceFutureOrderRequest, PlaceOrderRequest } from './requestType';
import { ASDResponse, CancelBatchOrderResponse, CancelOrderResponse, FuturesAccountBalanceSnapshot, MarginAccountBalance, MarginRiskProfile, OrderInfo, OrderInfoMarginV1, PlaceFutureOrderInfo, PositionResponse } from './responseType';
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
    getFuturesAccountBalanceSnapshot(date: string): Promise<FuturesAccountBalanceSnapshot>;
    getFutureOrderInfo(orderId: string): Promise<ASDResponse<OrderInfo>>;
    getFuturePosition(): Promise<ASDResponse<PositionResponse>>;
    placeFutureOrder(req: PlaceFutureOrderRequest): Promise<ASDResponse<PlaceFutureOrderInfo>>;
    cancelFutureOrder(req: CancelOrderRequest): Promise<ASDResponse<CancelOrderResponse>>;
    cancelFutureOrderBatch(req: CancelOrderRequest[]): Promise<ASDResponse<CancelBatchOrderResponse>>;
    cancelFutureOrderAll(symbol: string): Promise<ASDResponse<CancelBatchOrderResponse>>;
    placeMarginOrder(req: PlaceOrderRequest): Promise<ASDResponse<PlaceFutureOrderInfo>>;
    getMarginAccountBalance(params: GetMarginAccountBalanceRequest): Promise<ASDResponse<MarginAccountBalance[]>>;
    getMarginRiskProfile(): Promise<ASDResponse<MarginRiskProfile>>;
    getMarginOrderInfo(orderID: String): Promise<ASDResponse<OrderInfoMarginV1[]>>;
    getCashOrderInfo(orderID: String): Promise<ASDResponse<OrderInfoMarginV1[]>>;
    get<T>(path: string, apiPath: string, query?: {}): Promise<any>;
    post<T>(path: string, apiPath: string, body: {}, ts?: number): Promise<any>;
    delete<T>(path: string, apiPath: string, query?: {}, ts?: number): Promise<any>;
    private makeHeader;
    private sleepWhileOrderInterval;
}
