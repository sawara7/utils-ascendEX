import { BaseResponse } from "./wsResponseTypeCommon";
export interface OrderInfoV1 extends BaseResponse {
    accountId: string;
    ac: string;
    data: {
        s: string;
        sn: number;
        ap: string;
        bab: string;
        btb: string;
        cf: string;
        cfq: string;
        err: string;
        fa: string;
        orderId: string;
        ot: string;
        p: string;
        q: string;
        qab: string;
        qtb: string;
        sd: string;
        sp: string;
        st: string;
        t: number;
        ei: string;
    };
}
