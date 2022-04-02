import { WebSocket, MessageEvent } from 'ws'
import * as crypto from 'crypto'
import {
    AuthRequest,
    AuthResponse,
    BaseResponse,
    BBOResponse,
    CancelOrderRequestV1,
    ConnectedResponse,
    OrderRequestV1,
    OrderInfoV1,
    OrderInfoV2,
    PlaceOrderRequestV1,
    SubscribeChannelRequest,
    PlaceOrderRequestV2,
    OrderRequestV2,
    CancelOrderRequestV2,
    OrderResponseV2,
    OrderResponseInfo
} from '..';

export interface wsTrade {
    id: number;
    time: string;
    side: string;
    size: number;
    price: number;
    liquidation: boolean;
}

export interface wsTicker {
    time: number
    bid: number
    ask: number
    symbol: string
}

export interface wsOrder {
    id: string //24852229,
    clientID?: string
    market: string //XRP-PERP,
    type: string //limit,
    side: string //buy,
    size: number //42353.0,
    price: number //0.2977,
    status: string //closed,
    filledSize: number //0.0,
    remainingSize: number //0.0,
    avgFillPrice: number //0.2978
}

export interface wsParameters {
    feature: boolean
    accountGroup: number
    apiKey: string
    apiSecret: string
    pingIntervalSec?: number
    reconnectOnClose?: boolean
    onAuth?: () => void
    onTrades?: (trades: wsTrade[]) => void
    onTicker?: (ticer: wsTicker) => void
    onOrder?:(orders: wsOrder) => void
    onPong?: () => void
    onWebSocketOpen?: () => void
    onWebSocketClose?: () => void
    onWebSocketError?: () => void
}

export class WebsocketAPI {
    private static toSha256(key: string, value: string): string {
        return crypto
            .createHmac('sha256', key)
            .update(Buffer.from(value))
            .digest('hex')
            .toString();
    }
    private socket: WebSocket
    private _accountGroup: number
    private _apiKey: string
    private _apiSecret: string
    private _pingInterval: number
    private _reconnect: boolean
    private _path: string
    private _v2: boolean

    // internal
    private pingIntervalID?: NodeJS.Timeout

    constructor(private params: wsParameters) {
        this._accountGroup = params.accountGroup
        this._apiKey = params.apiKey
        this._apiSecret = params.apiSecret
        this._pingInterval = (params.pingIntervalSec || 5) * 1000
        this._reconnect = params.reconnectOnClose || false
        this._v2 = params.feature
        this._path = this._v2?
            'wss://ascendex.com:443/' + this._accountGroup + '/api/pro/v2/stream':
            'wss://ascendex.com/' + this._accountGroup + '/api/pro/v1/stream'
        this.socket = new WebSocket(this._path)
        this.initializeWebSocket()
    }

    private initializeWebSocket() {
        if (this.pingIntervalID) {
            clearInterval(this.pingIntervalID)
        }
        this.socket.addEventListener('error', this.onError)
        this.socket.addEventListener('open', this.onOpen)
        this.socket.addEventListener('message', this.onMessage)
        this.socket.addEventListener('close', this.onClose)
    }

    private onOpen = () => {
        this.pingIntervalID = setInterval(() => {
            this.socket.send(JSON.stringify({'op': 'ping'}))
        },  this._pingInterval)
        if (this.params.onWebSocketOpen){
            this.params.onWebSocketOpen()
        }
    }

    private onClose = () => {
        if (this._reconnect) {
            this.socket = new WebSocket(this._path)
            this.initializeWebSocket()
        }
        if (this.params.onWebSocketClose){
            this.params.onWebSocketClose()
        }
    }

    private onError = () => {
        if (this.params.onWebSocketError){
            this.params.onWebSocketError()
        }
    }

    private onMessage = (event: MessageEvent) => {
        const d = JSON.parse(event.data.toString()) as BaseResponse
        if (d.m === 'connected') {
            const res = d as ConnectedResponse
            if (res.type === 'unauth') {
                this.login()
            }
        }else if (d.m === 'pong') {
            if (this.params.onPong) {
                this.params.onPong()
            }
        }else if (d.m === 'auth') {
            const res = d as AuthResponse
            if (res.code === 0 && this.params.onAuth) {
                this.params.onAuth()
            }
        }else if (d.m === 'bbo') {
            const res = d as BBOResponse
            if (this.params.onTicker) {
                const ticker: wsTicker =  {
                    symbol: res.symbol,
                    time: res.data.ts,
                    ask: parseFloat(res.data.ask[0]),
                    bid: parseFloat(res.data.bid[0])
                }
                this.params.onTicker(ticker)
            }
        }else if (d.m === 'order') {
            console.log(d)
            if (this._v2) {
                const res = d as OrderResponseV2
                if (this.params.onOrder && res.ac === "FUTURES" && res.action === "place-order") {
                    const info = res.info as OrderResponseInfo
                    const order: wsOrder = {
                        id: info.orderId,
                        clientID: res.id,
                        market: info.symbol,
                        type: "",
                        side: "",
                        size: 0,
                        price: 0,
                        status: "New",
                        filledSize: 0,
                        remainingSize: 0,
                        avgFillPrice: 0      
                    }
                    this.params.onOrder(order)
                }
            } else {
                const res = d as OrderInfoV1
                if (this.params.onOrder && res.data) {
                    const order: wsOrder = {
                        id: res.data.orderId,
                        market: res.data.s,
                        type: res.data.ot,
                        side: res.data.sd,
                        size: parseFloat(res.data.q),
                        price: parseFloat(res.data.p),
                        status: res.data.st,
                        filledSize: parseFloat(res.data.cfq),
                        remainingSize: parseFloat(res.data.q) - parseFloat(res.data.cfq), //0.0,
                        avgFillPrice: parseFloat(res.data.ap)      
                    }
                    this.params.onOrder(order)
                }
            }
        }else if (d.m === 'futures-order') {
            console.log(d)
            const res = d as OrderInfoV2
            if (this.params.onOrder && res) {
                const order: wsOrder = {
                    id: res.orderId,
                    market: res.s,
                    type: res.ot,
                    side: res.sd,
                    size: parseFloat(res.q),
                    price: parseFloat(res.p),
                    status: res.st,
                    filledSize: parseFloat(res.cfq),
                    remainingSize: parseFloat(res.q) - parseFloat(res.cfq), //0.0,
                    avgFillPrice: parseFloat(res.ap)    
                }
                this.params.onOrder(order)
            }
        }else{
            console.log(d)
        }
    }

    public login() {
        const t = Date.now()
        const m: AuthRequest = {
            op: 'auth',
            t: t,
            key: this._apiKey,
            sig: WebsocketAPI.toSha256(this._apiSecret, t.toString() + (this._v2? '+v2/':'+') + 'stream')
        }
        this.socket.send(JSON.stringify(m))
    }

    public subscribePublic(ch: "trades" | "ticker", market: string) {
        let channel = ''
        if (ch === "ticker") {
            channel = 'bbo:' + market
        }else if (ch === "trades") {
            channel = 'trades:' + market
        }
        const req: SubscribeChannelRequest = {
            op: 'sub',
            ch: channel
        }
        this.socket.send(JSON.stringify(req))
    }

    public subscribePrivate(ch: "orders-cash" | "orders-features") {
        if (ch==="orders-cash") {
            this.socket.send(JSON.stringify({
                op: 'sub',
                ch: 'order:cash'
            }))
        }else if(ch === "orders-features"){
            this.socket.send(JSON.stringify({
                op: 'sub',
                ch: 'futures-order'
            }))
        }
        
    }

    public placeOrderCash(req: PlaceOrderRequestV1) {
        const m: OrderRequestV1<PlaceOrderRequestV1> = {
            op: 'req',
            action: 'place-Order',
            account: 'cash',
            args: req
        }
        this.socket.send(JSON.stringify(m))
    }

    public placeOrderFeature(req: PlaceOrderRequestV2, id: string = '') {
        const m: OrderRequestV2<PlaceOrderRequestV2> = {
            op: 'req',
            action: 'place-order',
            ac: 'futures',
            id: id,
            args: req
        }
        this.socket.send(JSON.stringify(m))
    }

    public cancelOrderCash(req: CancelOrderRequestV1) {
        const m: OrderRequestV1<CancelOrderRequestV1> = {
            op: 'req',
            action: 'cancel-Order',
            account: 'cash',
            args: req
        }
        this.socket.send(JSON.stringify(m))
    }

    public cancelOrderFeature(req: CancelOrderRequestV2, id: string = '') {
        const m: OrderRequestV2<CancelOrderRequestV2> = {
            op: 'req',
            action: 'cancel-order',
            ac: 'futures',
            id: id,
            args: req
        }
        this.socket.send(JSON.stringify(m))
    }

    public cancelAllOrderCash(symbol: string) {
        const m: OrderRequestV1<any> = {
            op: 'req',
            action: 'cancel-All',
            account: 'cash',
            args: {
                symbol: symbol
            }
        }
        this.socket.send(JSON.stringify(m))
    }

    public cancelAllOrderFeature(symbol: string) {
        const m: OrderRequestV2<any> = {
            op: 'req',
            action: 'cancel-all',
            ac: 'futures',
            id: '',
            args: { 
                symbol: symbol
           }
        }
        this.socket.send(JSON.stringify(m))
    }
}