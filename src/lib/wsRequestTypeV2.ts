import { BaseRequest } from "./wsRequestTypeCommon";

export type OrderTypeV2 = "cancel-order" | "place-order" | "cancel-all"
export type AccountCategoryV2 = "futures"

export interface OrderRequestV2<T> extends BaseRequest {
    // "op"    : "req",
    action: OrderTypeV2 // "place-order",
    ac    : AccountCategoryV2 // "futures",         // the Account Category
    id    : string // "sampleRequestID", // the server will echo back this id in the ack message. 
    args  : T
 }

export interface PlaceOrderRequestV2 {
    time: number //milliseconds since UNIX epoch in UTC	We do not process request placed more than 30 seconds ago.
    symbol: string
    orderPrice?: string
    orderQty: string //Yes		Order size. Please set scale properly for each symbol.
    orderType: "market" | "limit" | "stop_market" | "stop_limit" //Yes	["market", "limit", "stop_market", "stop_limit"]	Order type
    side: "buy" | "sell"	
    postOnly?: boolean	
    respInst?: "ACK" | "ACCEPT" | "DONE" //Response instruction. Refer to "Response" below. "ACK" by default
}

export interface CancelOrderRequestV2 {
    time: number
    orderId: string
    symbol: string
}
