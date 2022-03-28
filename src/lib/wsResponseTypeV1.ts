import { BaseResponse } from "./wsResponseTypeCommon";

export interface OrderInfoV1 extends BaseResponse {
    // m: "order"
    accountId: string,
    ac: string,
    data: {
        s: string //symbol
        sn: number //sequence number
        ap: string //average fill price
        bab: string //base asset available balance
        btb: string //base asset total balance
        cf: string //cumulated commission
        cfq: string //cumulated filled qty
        err: string //error code; could be empty
        fa: string //fee asset
        orderId: string //order id
        ot: string //order type
        p: string //order price
        q: string //order quantity
        qab: string //quote asset available balance
        qtb: string //quote asset total balance
        sd: string //order side
        sp: string //stop price; could be empty
        st: string //order status
        t: number //latest execution timestamp
        ei: string //execution instruction
    }
}

