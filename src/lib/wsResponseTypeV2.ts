import { BaseResponse } from "./wsResponseTypeCommon";

export interface OrderInfoV2 extends BaseResponse {
    // m      : string,
    sn     : number // sequence number
    e      : string // event
    a      : string // account Id
    ac     : string // account category 
    t      : number // last execution time
    ct     : number // order creation time
    orderId: string // order Id
    sd     : string // side 
    ot     : string // order type 
    q      : number // order quantity (base asset)
    p      : number // order price
    sp     : number // stop price
    spb    : string // stop trigger
    s      : string // symbol 
    st     : string // order status
    lp     : number // last filled price
    lq     : number // last filled quantity (base asset)
    ap     : number // average filled price
    cfq    : number // cummulative filled quantity (base asset)
    f      : number // commission fee of the current execution
    cf     : number // cumulative commission fee
    fa     : string // fee asset
    ei     : string // execution instruction
    err    : string // error message
}

export interface OrderResponseV2 extends BaseResponse {
    m     : string
    code  : number
    id    : string   // echo back the original request Id
    action: string
    ac    : string
    info  : OrderResponseInfo | OrderResponseError
}

export interface OrderResponseInfo {
    orderId: string
    symbol: string
}

export interface OrderResponseError {
    symbol  : string
    reason  : string
    errorMsg: string
}
