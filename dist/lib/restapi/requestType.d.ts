import { V1OrderSide, V2FutureOrderSide } from "../utils";
export declare const ASCENDEX_ENDPOINT = "https://ascendex.com/";
export interface GetMarginAccountBalanceRequest {
    asset?: string;
    showAll?: boolean;
}
export interface PlaceOrderRequest {
    symbol: string;
    time: number;
    orderQty: string;
    orderType: "limit" | "market" | "stop_limit" | "stop_market";
    side: V1OrderSide;
    id?: string;
    orderPrice?: string;
    stopPrice?: string;
    postOnly?: boolean;
    timeInForce?: "GTC" | "IOC" | "FOK";
    respInst?: "ACK" | "ACCEPT" | "DONE";
}
export interface PlaceFutureOrderRequest {
    id?: string;
    time: number;
    symbol: string;
    orderPrice?: string;
    orderQty: string;
    orderType: "Limit" | "Market" | "StopLimit" | "StopMarket";
    side: V2FutureOrderSide;
    respInst?: "ACK" | "DONE";
    postOnly?: boolean;
    stopPrice?: string;
    timeInForce?: "GTC" | "IOC" | "FOK";
    execInst?: string;
    posStopLossPrice?: string;
    posTakeProfitPrice?: string;
}
export interface CancelOrderRequest {
    id?: string;
    orderId: string;
    symbol: string;
    time: number;
    respInst?: string;
}
