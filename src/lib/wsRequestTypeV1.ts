import { BaseRequest } from "./wsRequestTypeCommon";

export interface OrderRequestV1<T> extends BaseRequest {
    // op: 'req'
    action: string
    account: string
    args: T
}

export interface PlaceOrderRequestV1 {
    symbol: string		
    time: number //milliseconds since UNIX epoch in UTC	We do not process request placed more than 30 seconds ago.
    orderQty: string //Yes		Order size. Please set scale properly for each symbol.
    orderType: "market" | "limit" | "stop_market" | "stop_limit" //Yes	["market", "limit", "stop_market", "stop_limit"]	Order type
    side: "buy" | "sell"	
    id?: string	//>=9 chars(letter and digit number only)	Optional but recommended. We echo it back to help you match response with request.
    orderPrice?: string //The limit price for limit order. Please set price scale properly.
    stopPrice?: string //Trigger price of stop limit order
    postOnly?: boolean	
    timeInForce?: "GTC" | "IOC" | "FOK"	//GTC: good-till-canceled; IOC: immediate-or-cancel; FOK: fill-or-kill. GTC by default.
    respInst?: "ACK" | "ACCEPT" | "DONE" //Response instruction. Refer to "Response" below. "ACK" by default
}

export interface CancelOrderRequestV1 {
    time: number
    id?: string
    orderId: string
    symbol: string
}
