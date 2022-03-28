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
    q: number;
    p: number;
    sp: number;
    spb: string;
    s: string;
    st: string;
    lp: number;
    lq: number;
    ap: number;
    cfq: number;
    f: number;
    cf: number;
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
