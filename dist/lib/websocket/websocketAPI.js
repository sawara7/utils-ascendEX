"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketAPI = void 0;
const ws_1 = require("ws");
const crypto = __importStar(require("crypto"));
class WebsocketAPI {
    static toSha256(key, value) {
        return crypto
            .createHmac('sha256', key)
            .update(Buffer.from(value))
            .digest('hex')
            .toString();
    }
    constructor(params) {
        this.params = params;
        this.onOpen = () => {
            this.pingIntervalID = setInterval(() => {
                this.socket.send(JSON.stringify({ 'op': 'ping' }));
            }, this._pingInterval);
            if (this.params.onWebSocketOpen) {
                this.params.onWebSocketOpen();
            }
        };
        this.onClose = () => {
            if (this._reconnect) {
                this.socket = new ws_1.WebSocket(this._path);
                this.initializeWebSocket();
            }
            if (this.params.onWebSocketClose) {
                this.params.onWebSocketClose();
            }
        };
        this.onError = () => {
            if (this.params.onWebSocketError) {
                this.params.onWebSocketError();
            }
        };
        this.onMessage = (event) => {
            const d = JSON.parse(event.data.toString());
            if (d.m === 'connected') {
                const res = d;
                if (res.type === 'unauth') {
                    this.login();
                }
            }
            else if (d.m === 'pong') {
                if (this.params.onPong) {
                    this.params.onPong();
                }
            }
            else if (d.m === 'auth') {
                const res = d;
                if (res.code === 0 && this.params.onAuth) {
                    this.params.onAuth();
                }
            }
            else if (d.m === 'bbo') {
                const res = d;
                if (this.params.onTicker) {
                    const ticker = {
                        symbol: res.symbol,
                        time: res.data.ts,
                        ask: parseFloat(res.data.ask[0]),
                        bid: parseFloat(res.data.bid[0])
                    };
                    this.params.onTicker(ticker);
                }
            }
            else if (d.m === 'order') {
                if (this._v2) {
                    const res = d;
                    if (this.params.onOrder && res.ac === "FUTURES" && res.action === "place-order") {
                        const info = res.info;
                        const order = {
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
                        };
                        this.params.onOrder(order);
                    }
                }
                else {
                    const res = d;
                    if (this.params.onOrder && res.data) {
                        const order = {
                            id: res.data.orderId,
                            market: res.data.s,
                            type: res.data.ot,
                            side: res.data.sd,
                            size: parseFloat(res.data.q),
                            price: parseFloat(res.data.p),
                            status: res.data.st,
                            filledSize: parseFloat(res.data.cfq),
                            remainingSize: parseFloat(res.data.q) - parseFloat(res.data.cfq),
                            avgFillPrice: parseFloat(res.data.ap)
                        };
                        this.params.onOrder(order);
                    }
                }
            }
            else if (d.m === 'futures-order') {
                const res = d;
                if (this.params.onOrder && res) {
                    const order = {
                        id: res.orderId,
                        market: res.s,
                        type: res.ot,
                        side: res.sd === 'Buy' ? 'buy' : 'sell',
                        size: parseFloat(res.q),
                        price: parseFloat(res.p),
                        status: res.st,
                        filledSize: parseFloat(res.cfq),
                        remainingSize: parseFloat(res.q) - parseFloat(res.cfq),
                        avgFillPrice: parseFloat(res.ap)
                    };
                    this.params.onOrder(order);
                }
            }
            else {
                console.log(d);
            }
        };
        this._accountGroup = params.accountGroup;
        this._apiKey = params.apiKey;
        this._apiSecret = params.apiSecret;
        this._pingInterval = (params.pingIntervalSec || 5) * 1000;
        this._reconnect = params.reconnectOnClose || false;
        this._v2 = params.feature;
        this._path = this._v2 ?
            'wss://ascendex.com:443/' + this._accountGroup + '/api/pro/v2/stream' :
            'wss://ascendex.com/' + this._accountGroup + '/api/pro/v1/stream';
        this.socket = new ws_1.WebSocket(this._path);
        this.initializeWebSocket();
    }
    initializeWebSocket() {
        if (this.pingIntervalID) {
            clearInterval(this.pingIntervalID);
        }
        this.socket.addEventListener('error', this.onError);
        this.socket.addEventListener('open', this.onOpen);
        this.socket.addEventListener('message', this.onMessage);
        this.socket.addEventListener('close', this.onClose);
    }
    login() {
        const t = Date.now();
        const m = {
            op: 'auth',
            t: t,
            key: this._apiKey,
            sig: WebsocketAPI.toSha256(this._apiSecret, t.toString() + (this._v2 ? '+v2/' : '+') + 'stream')
        };
        this.socket.send(JSON.stringify(m));
    }
    subscribePublic(ch, market) {
        let channel = '';
        if (ch === "ticker") {
            channel = 'bbo:' + market;
        }
        else if (ch === "trades") {
            channel = 'trades:' + market;
        }
        const req = {
            op: 'sub',
            ch: channel
        };
        this.socket.send(JSON.stringify(req));
    }
    subscribePrivate(ch) {
        if (ch === "orders-cash") {
            this.socket.send(JSON.stringify({
                op: 'sub',
                ch: 'order:cash'
            }));
        }
        else if (ch === "orders-features") {
            this.socket.send(JSON.stringify({
                op: 'sub',
                ch: 'futures-order'
            }));
        }
    }
    placeOrderCash(req) {
        const m = {
            op: 'req',
            action: 'place-Order',
            account: 'cash',
            args: req
        };
        this.socket.send(JSON.stringify(m));
    }
    placeOrderFeature(req, id = '') {
        const m = {
            op: 'req',
            action: 'place-order',
            ac: 'futures',
            id: id,
            args: req
        };
        this.socket.send(JSON.stringify(m));
    }
    cancelOrderCash(req) {
        const m = {
            op: 'req',
            action: 'cancel-Order',
            account: 'cash',
            args: req
        };
        this.socket.send(JSON.stringify(m));
    }
    cancelOrderFeature(req, id = '') {
        const m = {
            op: 'req',
            action: 'cancel-order',
            ac: 'futures',
            id: id,
            args: req
        };
        this.socket.send(JSON.stringify(m));
    }
    cancelAllOrderCash(symbol) {
        const m = {
            op: 'req',
            action: 'cancel-All',
            account: 'cash',
            args: {
                symbol: symbol
            }
        };
        this.socket.send(JSON.stringify(m));
    }
    cancelAllOrderFeature(symbol) {
        const m = {
            op: 'req',
            action: 'cancel-all',
            ac: 'futures',
            id: '',
            args: {
                symbol: symbol
            }
        };
        this.socket.send(JSON.stringify(m));
    }
}
exports.WebsocketAPI = WebsocketAPI;
