import * as crypto from 'crypto'
import { ApiConfig, BaseApiClass } from './baseAPI'
import * as querystring from 'querystring'
import { sleep } from 'utils-general'
import { ASCENDEX_ENDPOINT } from '../utils';

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

    get accountGroup(): string {
        return this._accountGroup
    }

    private makeHeader(path: string, timestamp?: number): any {
        const ts = timestamp? timestamp: Date.now()
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

