import { argv, exit } from "process"
import { WebsocketAPI } from ".."
import { FirebaseSettings, initializeApp, RealtimeDatabaseClass } from "firebase-utils-server"
import { MongodbManagerClass } from "mongodb-utils"
import { MongoError } from "mongodb"

let ask = 0;
let bid = 0;
let orderId = '';
let openPrice = 0;
const symbol = 'ATOM-PERP';
(async () => {
    const mongo = new MongodbManagerClass('firebase_realtimedatabase')
    let settings: FirebaseSettings
    try {
        if (await mongo.connect()){
            const res = await mongo.find('settings')
            settings = res[0] as FirebaseSettings
        }else{
            throw new MongoError('failed')
        }
    }catch(e){
        console.log(e)
        exit()
    }
    initializeApp(settings)
    const rdb = new RealtimeDatabaseClass()
    const apiKey = await rdb.get(await rdb.getReference('settings/ascendEX/apiKey')) as string
    const secret = await rdb.get(await rdb.getReference('settings/ascendEX/apiSecret')) as string

    const api = new WebsocketAPI({
        feature: true,
        apiKey: apiKey,
        apiSecret: secret,
        accountGroup: 4,
        onAuth: ()=>{
            console.log("on auth")
            api.subscribePublic("ticker", symbol)
            api.subscribePrivate("orders-features")
        },
        onTicker: (ticker) => {
            ask = ticker.ask
            bid = ticker.bid
            if (orderId === '') {
                console.log(ask, bid)
                api.placeOrderFeature({
                    time: Date.now(),
                    symbol: symbol,
                    orderPrice: (bid).toString(),
                    orderQty: "0.1",
                    orderType: 'limit',
                    side: "buy",	
                    postOnly: true
                })
            } else {
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
                orderId = orders.id
                openPrice = orders.price
                // api.cancelOrder({
                    // time: Date.now(),
                    // orderId: orderId,
                    // symbol: 'ASD/USDT'
                // })
            }else if (orders.status === 'Canceled') {
                orderId = ''
            }else if (orders.status === 'Filled') {
    
            }
            console.log(orders)
        }
    })
})()