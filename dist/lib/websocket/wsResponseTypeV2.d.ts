import { BaseResponse } from "./wsResponseTypeCommon";
export interface OrderInfoV2 extends BaseResponse {
    sn: number;
    e: string;
    a: string;
    ac: string;
    t: number;
    ct: number;
    orderId: string;
    sd: string;
    ot: string;
    q: string;
    p: string;
    sp: string;
    spb: string;
    s: string;
    st: string;
    lp: string;
    lq: string;
    ap: string;
    cfq: string;
    f: string;
    cf: string;
    fa: string;
    ei: string;
    err: string;
}
export interface OrderResponseV2 extends BaseResponse {
    m: string;
    code: number;
    id: string;
    action: string;
    ac: string;
    info: OrderResponseInfo | OrderResponseError;
}
export interface OrderResponseInfo {
    orderId: string;
    symbol: string;
}
export interface OrderResponseError {
    symbol: string;
    reason: string;
    errorMsg: string;
}
