import { ASDPrivateApiClass, ASDPrivateApiConfig, ASDResponse } from '../restAPI_Base';
import { PlaceFutureOrderRequest, CancelOrderRequest } from './requestType';
import { CancelBatchOrderResponse, CancelOrderResponse, FuturesAccountBalanceSnapshot, OrderInfo, PlaceFutureOrderInfo, PositionResponse } from './responseType';
export declare class ASDPrivateFutureApiClass extends ASDPrivateApiClass {
    constructor(config: ASDPrivateApiConfig);
    getFuturesAccountBalanceSnapshot(date: string): Promise<FuturesAccountBalanceSnapshot>;
    getFutureOrderInfo(orderId: string): Promise<ASDResponse<OrderInfo>>;
    getFuturePosition(): Promise<ASDResponse<PositionResponse>>;
    placeFutureOrder(req: PlaceFutureOrderRequest): Promise<ASDResponse<PlaceFutureOrderInfo>>;
    cancelFutureOrder(req: CancelOrderRequest): Promise<ASDResponse<CancelOrderResponse>>;
    cancelFutureOrderBatch(req: CancelOrderRequest[]): Promise<ASDResponse<CancelBatchOrderResponse>>;
    cancelFutureOrderAll(symbol: string): Promise<ASDResponse<CancelBatchOrderResponse>>;
}
