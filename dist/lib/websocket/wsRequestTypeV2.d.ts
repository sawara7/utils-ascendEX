import { BaseRequest } from "./wsRequestTypeCommon";
export type OrderTypeV2 = "cancel-order" | "place-order" | "cancel-all";
export type AccountCategoryV2 = "futures";
export interface OrderRequestV2<T> extends BaseRequest {
    action: OrderTypeV2;
    ac: AccountCategoryV2;
    id: string;
    args: T;
}
export interface PlaceOrderRequestV2 {
    time: number;
    symbol: string;
    orderPrice?: string;
    orderQty: string;
    orderType: "market" | "limit" | "stop_market" | "stop_limit";
    side: "buy" | "sell";
    postOnly?: boolean;
    respInst?: "ACK" | "ACCEPT" | "DONE";
}
export interface CancelOrderRequestV2 {
    time: number;
    orderId: string;
    symbol: string;
}
