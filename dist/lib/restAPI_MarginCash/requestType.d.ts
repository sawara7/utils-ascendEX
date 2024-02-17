import { V1OrderSide } from "../utils";
export interface GetCashMarginAccountBalanceRequest {
    asset?: string;
    showAll?: boolean;
}
export interface PlaceCashMarginOrderRequest {
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
export interface CancelCashMarginOrderRequest {
    id?: string;
    orderId: string;
    symbol: string;
    time: number;
}
