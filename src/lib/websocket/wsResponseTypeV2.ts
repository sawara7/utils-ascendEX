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
    q      : string // order quantity (base asset)
    p      : string // order price
    sp     : string // stop price
    spb    : string // stop trigger
    s      : string // symbol 
    st     : string // order status
    lp     : string // last filled price
    lq     : string // last filled quantity (base asset)
    ap     : string // average filled price
    cfq    : string // cummulative filled quantity (base asset)
    f      : string // commission fee of the current execution
    cf     : string // cumulative commission fee
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
