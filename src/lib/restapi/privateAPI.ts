import * as crypto from 'crypto'
import { ApiConfig, BaseApiClass } from './baseAPI'
import { ASCENDEX_ENDPOINT, CancelOrderRequest, GetMarginAccountBalanceRequest, PlaceFutureOrderRequest, PlaceOrderRequest } from './requestType'
import { ASDResponse, CancelBatchOrderResponse, CancelOrderResponse, FuturesAccountBalanceSnapshot, MarginAccountBalance, MarginRiskProfile, OrderInfo, PlaceFutureOrderInfo, PositionResponse } from './responseType'
import * as querystring from 'querystring'
import { sleep } from 'my-utils'

export interface ASDPrivateApiConfig extends ApiConfig {
    apiKey: string;
    apiSecret: string;
    accountGroup: string;
    subAccount?: string;
    sendingInterval?: number;
}

export class ASDPrivateApiClass extends BaseApiClass {
    private static toSha256(key: string, value: string): string {
        return crypto
            .createHmac('sha256', key)
            .update(Buffer.from(value))
            .digest('hex')
            .toString();
    }

    private readonly _apiKey: string;
    private readonly _apiSecret: string;
    private readonly _accountGroup: string;
    private readonly _subAccount?: string;

    private static _lastOrderTime?: {[marketName: string]: number}
    private _minOrderInterval: number

    constructor(config: ASDPrivateApiConfig) {
        config.endPoint = config.endPoint || ASCENDEX_ENDPOINT
        super(config)
        this._apiKey = config.apiKey
        this._apiSecret = config.apiSecret
        this._accountGroup = config.accountGroup
        this._subAccount = config.subAccount
        this._minOrderInterval = config.sendingInterval || 200
        if (!ASDPrivateApiClass._lastOrderTime){
            ASDPrivateApiClass._lastOrderTime = {}
        }
    }

    public async getFuturesAccountBalanceSnapshot(date: string): Promise<FuturesAccountBalanceSnapshot> {
        const path = this._accountGroup + '/api/pro/data/v1/futures/balance/snapshot'
        await this.sleepWhileOrderInterval(this._apiKey)
        return await this.get(path, 'data/v1/futures/balance/snapshot', {date: date})
    }

    public async getFuturePosition(): Promise<ASDResponse<PositionResponse>> {
        const path = this._accountGroup + '/api/pro/v2/futures/position'
        await this.sleepWhileOrderInterval(this._apiKey)
        return await this.get(path, 'v2/futures/position', {})
    }

    public async placeFutureOrder(req: PlaceFutureOrderRequest): Promise<ASDResponse<PlaceFutureOrderInfo>> {
        const path = this._accountGroup + '/api/pro/v2/futures/order'
        await this.sleepWhileOrderInterval(this._apiKey)
        return await this.post(path, 'v2/futures/order', req, req.time)
    }

    public async cancelFutureOrder(req: CancelOrderRequest): Promise<ASDResponse<CancelOrderResponse>> {
        const path = this._accountGroup + '/api/pro/v2/futures/order'
        await this.sleepWhileOrderInterval(this._apiKey)
        return await this.delete(path, 'v2/futures/order', req, req.time)
    }

    public async cancelFutureOrderBatch(req: CancelOrderRequest[]): Promise<ASDResponse<CancelBatchOrderResponse>> {
        if (req.length === 0) throw new Error('no Requests.')
        const path = this._accountGroup + '/api/pro/v2/futures/order/batch'
        await this.sleepWhileOrderInterval(this._apiKey)
        return await this.delete(path, 'v2/futures/order/batch', {orders: req}, req[0].time)
    }

    public async cancelFutureOrderAll(symbol: string): Promise<ASDResponse<CancelBatchOrderResponse>> {
        const path = this._accountGroup + '/api/pro/v2/futures/order/all'
        await this.sleepWhileOrderInterval(this._apiKey)
        return await this.delete(path, 'v2/futures/order/all', {symbol: symbol}, Date.now())
    }

    public async placeMarginOrder(req: PlaceOrderRequest): Promise<ASDResponse<PlaceFutureOrderInfo>> {
        const path = this._accountGroup + '/api/pro/v1/margin/order'
        await this.sleepWhileOrderInterval(this._apiKey)
        return await this.post(path, 'order', req)
    }

    public async getOrderInfo(orderId: string): Promise<ASDResponse<OrderInfo>> {
        const path = this._accountGroup + '/api/pro/v2/futures/order/status'
        await this.sleepWhileOrderInterval(this._apiKey)
        return await this.get(path, 'v2/futures/order/status', {orderId: orderId})
    }

    public async getMarginAccountBalance(params: GetMarginAccountBalanceRequest): Promise<ASDResponse<MarginAccountBalance>> {
        const path = this._accountGroup + '/api/pro/v1/margin/balance'
        await this.sleepWhileOrderInterval(this._apiKey)
        return await this.get(path, 'balance', params)
    }

    public async getMarginRiskProfile(): Promise<ASDResponse<MarginRiskProfile>> {
        const path = this._accountGroup + '/api/pro/v1/margin/risk'
        await this.sleepWhileOrderInterval(this._apiKey)
        return await this.get(path, 'margin/risk', {})
    }

    get<T>(path: string, apiPath: string, query?: {}) {
        let queryPath = path
        if (query && Object.keys(query).length > 0) {
            queryPath += '?' + querystring.encode(query)
        }
        return super.get(queryPath, query, this.makeHeader(apiPath))
    }

    post<T>(path: string, apiPath: string, body: {}, ts?: number) {
        return super.post(path, body, this.makeHeader(apiPath, ts))
    }

    delete<T>(path: string, apiPath: string, query?: {}, ts?: number) {
        let queryPath = path
        if (query && Object.keys(query).length > 0) {
            queryPath += '?' + querystring.encode(query)
        }
        return super.delete(queryPath, query, this.makeHeader(apiPath, ts))
    }

    private makeHeader(path: string, timestamp?: number): any {
        const ts = timestamp? timestamp: Date.now()
        console.log(ts)
        const s = ts + path
        const sign = ASDPrivateApiClass.toSha256(this._apiSecret, s)
        const header = {
            'x-auth-key': this._apiKey,
            'x-auth-timestamp': ts.toString(),
            'x-auth-signature': sign
        }
        return header
    }

    private async sleepWhileOrderInterval(market: string): Promise<void> {
        if (!ASDPrivateApiClass._lastOrderTime) {
            throw new Error('no last order')
        }
        if (ASDPrivateApiClass._lastOrderTime[market]) {
            const interval = Date.now() - ASDPrivateApiClass._lastOrderTime[market]
            if (interval > 0) {
                if (interval < this._minOrderInterval) {
                    ASDPrivateApiClass._lastOrderTime[market] += this._minOrderInterval 
                    await sleep(this._minOrderInterval - interval)
                } else if (interval > this._minOrderInterval) {
                    ASDPrivateApiClass._lastOrderTime[market] = Date.now()
                }
            } else if (interval < 0) {
                ASDPrivateApiClass._lastOrderTime[market] += this._minOrderInterval
                await sleep(ASDPrivateApiClass._lastOrderTime[market] - Date.now())
            }
        } else {
            ASDPrivateApiClass._lastOrderTime[market] = Date.now()
        }
    }
}

