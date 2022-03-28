import { OrderSide, OrderType } from "my-utils";
import { wsOrder, wsTicker } from "..";
import { WebsocketAPIClient } from "./websocketClient";
export interface SinglePositionParameters {
    name: string;
    marketName: string;
    funds: number;
    sizeResolution: number;
    priceResolution: number;
    minOrderInterval?: number;
    openOrderSettings?: OrderSettings;
    closeOrderSettings?: OrderSettings;
    api: WebsocketAPIClient;
}
export interface SinglePositionResponse {
    success: boolean;
    message?: any;
}
export interface OrderSettings {
    side: OrderSide;
    type: OrderType;
    price: number;
    size?: number;
    postOnly?: boolean;
    cancelSec?: number;
}
export declare class SinglePosition {
    private static _lastOrderTime?;
    private _api;
    private _marketName;
    private _funds;
    private _minOrderInterval;
    private _openOrderSettings?;
    private _closeOrderSettings?;
    private _name;
    private _initialSize;
    private _currentSize;
    private _openID;
    private _closeID;
    private _openTime;
    private _closeTime;
    private _isLosscut;
    private _openSide;
    private _currentOpenPrice;
    private _currentClosePrice;
    private _sizeResolution;
    private _priceResolution;
    private _closeCount;
    private _losscutCount;
    private _cumulativeFee;
    private _cumulativeProfit;
    onOpened?: (pos: SinglePosition) => void;
    onClosed?: (pos: SinglePosition) => void;
    onOpenOrderCanceled?: (pos: SinglePosition) => void;
    onCloseOrderCanceled?: (pos: SinglePosition) => void;
    constructor(params: SinglePositionParameters);
    private roundSize;
    private roundPrice;
    private placeOrder;
    private resetOpen;
    private resetClose;
    open(): Boolean;
    close(): Boolean;
    openMarket(side: OrderSide, price: number): boolean;
    openLimit(side: 'buy' | 'sell', price: number, postOnly?: boolean, cancelSec?: number): boolean;
    closeMarket(): boolean;
    closeLimit(price: number, postOnly?: boolean, cancelSec?: number): boolean;
    updateTicker(ticker: wsTicker): void;
    updateOrder(order: wsOrder): void;
    losscut(): void;
    cancelOpenOrder(): void;
    cancelCloseOrder(): void;
    get profit(): number;
    get enabledOpen(): Boolean;
    get enabledClose(): Boolean;
    get openOrderSettings(): OrderSettings | undefined;
    get closeOrderSettings(): OrderSettings | undefined;
    get currentSize(): number;
    get isLosscut(): boolean;
    get openSide(): OrderSide;
    get currentOpenPrice(): number;
    get currentClosePrice(): number;
    get closeCount(): number;
    get losscutCount(): number;
}
