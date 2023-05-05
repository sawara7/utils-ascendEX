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
    side: "buy" | "sell";
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
    side: "Buy" | "Sell";
    respInst?: "ACK" | "DONE";
    postOnly?: boolean;
    stopPrice?: string;
    timeInForce?: "GTC" | "IOC" | "FOK";
    execInst?: string;
    posStopLossPrice?: string;
    posTakeProfitPrice?: string;
}
