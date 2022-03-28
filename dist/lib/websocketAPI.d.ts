import { CancelOrderRequestV1, PlaceOrderRequestV1, PlaceOrderRequestV2, CancelOrderRequestV2 } from '..';
export interface wsTrade {
    id: number;
    time: string;
    side: string;
    size: number;
    price: number;
    liquidation: boolean;
}
export interface wsTicker {
    time: number;
    bid: number;
    ask: number;
    symbol: string;
}
export interface wsOrder {
    id: string;
    clientID?: string;
    market: string;
    type: string;
    side: string;
    size: number;
    price: number;
    status: string;
    filledSize: number;
    remainingSize: number;
    avgFillPrice: number;
}
export interface wsParameters {
    feature: boolean;
    accountGroup: number;
    apiKey: string;
    apiSecret: string;
    pingIntervalSec?: number;
    reconnectOnClose?: boolean;
    onAuth?: () => void;
    onTrades?: (trades: wsTrade[]) => void;
    onTicker?: (ticer: wsTicker) => void;
    onOrder?: (orders: wsOrder) => void;
    onPong?: () => void;
    onWebSocketOpen?: () => void;
    onWebSocketClose?: () => void;
    onWebSocketError?: () => void;
}
export declare class WebsocketAPI {
    private params;
    private static toSha256;
    private socket;
    private _accountGroup;
    private _apiKey;
    private _apiSecret;
    private _pingInterval;
    private _reconnect;
    private _path;
    private _v2;
    private pingIntervalID?;
    constructor(params: wsParameters);
    private initializeWebSocket;
    private onOpen;
    private onClose;
    private onError;
    private onMessage;
    login(): void;
    subscribePublic(ch: "trades" | "ticker", market: string): void;
    subscribePrivate(ch: "orders-cash" | "orders-features"): void;
    placeOrderCash(req: PlaceOrderRequestV1): void;
    placeOrderFeature(req: PlaceOrderRequestV2, id?: string): void;
    cancelOrderCash(req: CancelOrderRequestV1): void;
    cancelOrderFeature(req: CancelOrderRequestV2, id?: string): void;
    cancelAllOrderCash(symbol: string): void;
    cancelAllOrderFeature(symbol: string): void;
}
