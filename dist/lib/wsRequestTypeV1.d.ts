import { BaseRequest } from "./wsRequestTypeCommon";
export interface OrderRequestV1<T> extends BaseRequest {
    action: string;
    account: string;
    args: T;
}
export interface PlaceOrderRequestV1 {
    symbol: string;
    time: number;
    orderQty: string;
    orderType: "market" | "limit" | "stop_market" | "stop_limit";
    side: "buy" | "sell";
    id?: string;
    orderPrice?: string;
    stopPrice?: string;
    postOnly?: boolean;
    timeInForce?: "GTC" | "IOC" | "FOK";
    respInst?: "ACK" | "ACCEPT" | "DONE";
}
export interface CancelOrderRequestV1 {
    time: number;
    id?: string;
    orderId: string;
    symbol: string;
}
