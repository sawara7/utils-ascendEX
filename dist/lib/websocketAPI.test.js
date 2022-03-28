"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const __1 = require("..");
const firebase_utils_server_1 = require("firebase-utils-server");
const mongodb_utils_1 = require("mongodb-utils");
const mongodb_1 = require("mongodb");
let ask = 0;
let bid = 0;
let orderId = '';
let openPrice = 0;
const symbol = 'ATOM-PERP';
(() => __awaiter(void 0, void 0, void 0, function* () {
    const mongo = new mongodb_utils_1.MongodbManagerClass('firebase_realtimedatabase');
    let settings;
    try {
        if (yield mongo.connect()) {
            const res = yield mongo.find('settings');
            settings = res[0];
        }
        else {
            throw new mongodb_1.MongoError('failed');
        }
    }
    catch (e) {
        console.log(e);
        (0, process_1.exit)();
    }
    (0, firebase_utils_server_1.initializeApp)(settings);
    const rdb = new firebase_utils_server_1.RealtimeDatabaseClass();
    const apiKey = yield rdb.get(yield rdb.getReference('settings/ascendEX/apiKey'));
    const secret = yield rdb.get(yield rdb.getReference('settings/ascendEX/apiSecret'));
    const api = new __1.WebsocketAPI({
        feature: true,
        apiKey: apiKey,
        apiSecret: secret,
        accountGroup: 4,
        onAuth: () => {
            console.log("on auth");
            api.subscribePublic("ticker", symbol);
            api.subscribePrivate("orders-features");
        },
        onTicker: (ticker) => {
            ask = ticker.ask;
            bid = ticker.bid;
            if (orderId === '') {
                console.log(ask, bid);
                api.placeOrderFeature({
                    time: Date.now(),
                    symbol: symbol,
                    orderPrice: (bid).toString(),
                    orderQty: "0.1",
                    orderType: 'limit',
                    side: "buy",
                    postOnly: true
                });
            }
            else {
                // if (bid > openPrice) {
                //     console.log(bid, openPrice)
                //     api.cancelOrder({
                //         time: Date.now(),
                //         orderId: orderId,
                //         symbol: symbol
                //     })
                // }
            }
        },
        onOrder: (orders) => {
            if (orders.status === 'New') {
                orderId = orders.id;
                openPrice = orders.price;
                // api.cancelOrder({
                // time: Date.now(),
                // orderId: orderId,
                // symbol: 'ASD/USDT'
                // })
            }
            else if (orders.status === 'Canceled') {
                orderId = '';
            }
            else if (orders.status === 'Filled') {
            }
            console.log(orders);
        }
    });
}))();
