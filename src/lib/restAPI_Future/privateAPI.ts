import {
    ASDPrivateApiClass,
    ASDPrivateApiConfig,
    ASDResponse
} from '../restAPI_Base'

import { 
    PlaceFutureOrderRequest,
    CancelOrderRequest
} from './requestType'

import {
    CancelBatchOrderResponse,
    CancelOrderResponse,
    FuturesAccountBalanceSnapshot,
    OrderInfo,
    PlaceFutureOrderInfo,
    PositionResponse
} from './responseType'

export class ASDPrivateFutureApiClass extends ASDPrivateApiClass {
    constructor(config: ASDPrivateApiConfig) {
        super(config)
    }

    public async getFuturesAccountBalanceSnapshot(date: string): Promise<FuturesAccountBalanceSnapshot> {
        const path = this.accountGroup + '/api/pro/data/v1/futures/balance/snapshot'
        return await this.get(path, 'data/v1/futures/balance/snapshot', {date: date})
    }

    public async getFutureOrderInfo(orderId: string): Promise<ASDResponse<OrderInfo>> {
        const path = this.accountGroup + '/api/pro/v2/futures/order/status'
        return await this.get(path, 'v2/futures/order/status', {orderId: orderId})
    }

    public async getFuturePosition(): Promise<ASDResponse<PositionResponse>> {
        const path = this.accountGroup + '/api/pro/v2/futures/position'
        return await this.get(path, 'v2/futures/position', {})
    }

    public async placeFutureOrder(req: PlaceFutureOrderRequest): Promise<ASDResponse<PlaceFutureOrderInfo>> {
        const path = this.accountGroup + '/api/pro/v2/futures/order'
        return await this.post(path, 'v2/futures/order', req, req.time)
    }

    public async cancelFutureOrder(req: CancelOrderRequest): Promise<ASDResponse<CancelOrderResponse>> {
        const path = this.accountGroup + '/api/pro/v2/futures/order'
        return await this.delete(path, 'v2/futures/order', req, req.time)
    }

    public async cancelFutureOrderBatch(req: CancelOrderRequest[]): Promise<ASDResponse<CancelBatchOrderResponse>> {
        if (req.length === 0) throw new Error('no Requests.')
        const path = this.accountGroup + '/api/pro/v2/futures/order/batch'
        return await this.delete(path, 'v2/futures/order/batch', {orders: req}, req[0].time)
    }

    public async cancelFutureOrderAll(symbol: string): Promise<ASDResponse<CancelBatchOrderResponse>> {
        const path = this.accountGroup + '/api/pro/v2/futures/order/all'
        return await this.delete(path, 'v2/futures/order/all', {symbol: symbol}, Date.now())
    }
}

