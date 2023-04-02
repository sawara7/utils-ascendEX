// import {
//     OrderSide,
//     OrderType,
//     sleep
// } from "my-utils"

// import {
//     PlaceOrderRequestV1,
//     PlaceOrderRequestV2,
//     OrderInfoV1,
//     OrderInfoV2,
//     wsOrder,
//     wsTicker
// } from ".."

// import {
//     WebsocketAPIClient
// } from "./websocketClient"

// export interface SinglePositionParameters {
//     name: string
//     marketName: string
//     funds: number
//     sizeResolution: number
//     priceResolution: number
//     minOrderInterval?: number
//     openOrderSettings?: OrderSettings
//     closeOrderSettings?: OrderSettings
//     api: WebsocketAPIClient
// }

// export interface SinglePositionResponse {
//     success: boolean
//     message?: any 
// }

// export interface OrderSettings {
//     side: OrderSide
//     type: OrderType
//     price: number
//     size?: number
//     postOnly?: boolean
//     cancelSec?: number
// }

// export class SinglePosition {
//     // Global State
//     private static _lastOrderTime?: {[marketName: string]: number}

//     // api
//     private _api: WebsocketAPIClient

//     // Parameters
//     private _marketName: string
//     private _funds: number 
//     private _minOrderInterval: number
//     private _openOrderSettings?: OrderSettings
//     private _closeOrderSettings?: OrderSettings

//     // Position State
//     private _name: string
//     private _initialSize: number = 0
//     private _currentSize: number = 0
//     private _openID: string = ''
//     private _closeID: string = ''
//     private _openTime: number = 0
//     private _closeTime: number = 0
//     private _isLosscut: boolean = false;
//     private _openSide: OrderSide = 'buy'
//     private _currentOpenPrice: number = 0
//     private _currentClosePrice: number = 0
//     private _sizeResolution: number
//     private _priceResolution: number

//     // Information
//     private _closeCount: number = 0
//     private _losscutCount: number = 0
//     private _cumulativeFee: number = 0
//     private _cumulativeProfit: number = 0

//     // Events
//     public onOpened?: (pos: SinglePosition) => void
//     public onClosed?: (pos: SinglePosition) => void
//     public onOpenOrderCanceled?: (pos: SinglePosition) => void
//     public onCloseOrderCanceled?: (pos: SinglePosition) => void

//     constructor(params: SinglePositionParameters){
//         if (!SinglePosition._lastOrderTime){
//             SinglePosition._lastOrderTime = {}
//         }
//         this._marketName = params.marketName
//         if (!SinglePosition._lastOrderTime[this._marketName]){
//             SinglePosition._lastOrderTime[this._marketName] = Date.now()
//         }
//         this._funds = params.funds
//         this._minOrderInterval = params.minOrderInterval || 200
//         this._openOrderSettings = params.openOrderSettings
//         this._closeOrderSettings = params.closeOrderSettings
//         this._sizeResolution = params.sizeResolution
//         this._priceResolution = params.priceResolution
//         this._api = params.api
//         this._name = params.name
//     }

//     private roundSize(size: number): number {
//         return Math.round(size * (1/this._sizeResolution))/(1/this._sizeResolution)
//     }

//     private roundPrice(price: number): number {
//         return Math.round(price * (1/this._priceResolution))/(1/this._priceResolution)
//     }

//     private async placeOrder(side: OrderSide, type: OrderType, size: number, price?: number, postOnly?: boolean): Promise<void> {
//         const p: PlaceOrderRequestV2 = {
//             time: Date.now(),
//             symbol: this._marketName,
//             side: side,
//             orderType: type,
//             orderQty: this.roundSize(size).toString()
//         }
//         if (price) {
//             p.orderPrice = this.roundPrice(price).toString()
//         }
//         if (postOnly) {
//             p.postOnly = true
//         }
//         if (SinglePosition._lastOrderTime && SinglePosition._lastOrderTime[this._marketName]) {
//             const interval = Date.now() - SinglePosition._lastOrderTime[this._marketName]
//             if (interval > 0) {
//                 if (interval < this._minOrderInterval) {
//                     SinglePosition._lastOrderTime[this._marketName] += this._minOrderInterval 
//                     await sleep(this._minOrderInterval - interval)
//                 } else if (interval > this._minOrderInterval) {
//                     SinglePosition._lastOrderTime[this._marketName] = Date.now()
//                 }
//             } else if (interval < 0) {
//                 SinglePosition._lastOrderTime[this._marketName] += this._minOrderInterval
//                 await sleep(SinglePosition._lastOrderTime[this._marketName] - Date.now())
//             }
//         }
//         this._api.placeOrder(p, this._name)
//     }

//     private resetOpen() {
//         this._openID = ''
//     }

//     private resetClose() {
//         this._closeID = ''
//     }

//     public open(): Boolean {
//         if (!this._openOrderSettings) {
//             return false
//         }
//         if (this._openOrderSettings.type === 'limit') {
//             this._openSide = this._openOrderSettings.side
//             return this.openLimit(
//                 this._openOrderSettings.side,
//                 this._openOrderSettings.price,
//                 this._openOrderSettings.postOnly,
//                 this._openOrderSettings.cancelSec || 0
//                 )
//         } else if (this._openOrderSettings.type === 'market')  {
//             this._openSide = this._openOrderSettings.side
//             return this.openMarket(
//                 this._openOrderSettings.side,
//                 this._openOrderSettings.price
//                 )
//         }
//         return false
//     }

//     public close(): Boolean {
//         if (!this._closeOrderSettings) {
//             return false
//         }
//         if (this._closeOrderSettings.type === 'limit') {
//             return this.closeLimit(
//                 this._closeOrderSettings.price,
//                 this._closeOrderSettings.postOnly,
//                 this._closeOrderSettings.cancelSec || 0
//                 )
//         } else if (this._closeOrderSettings.type === 'market')  {
//             return this.closeMarket()
//         }
//         return false
//     }

//     public openMarket(side: OrderSide, price: number): boolean {
//         if (this._openID !== '') {
//             return false
//         }
//         this._openID = this._name
//         try {
//             this.placeOrder(side, 'market', this._funds/price)
//         } catch(e) {
//             this._openID = ''
//             return false
//         }
//         return true
//     }

//     public openLimit(side: 'buy' | 'sell', price: number, postOnly: boolean = true, cancelSec: number = 0): boolean {
//         if (this._openID !== '') {
//             return false
//         }
//         this._openID = this._name
//         try {
//             this.placeOrder(side, 'limit', this._funds/price, price, postOnly)
//             if (cancelSec > 0) {
//                 setTimeout(()=>{
//                     this.cancelOpenOrder()
//                 }, cancelSec * 1000)
//             }
//         } catch(e) {
//             this._openID = ''
//             return false
//         }
//         return true
//     }

//     public closeMarket(): boolean {
//         if (this._closeID !== '') {
//             return false
//         }
//         this._closeID = this._name
//         try {
//             this.placeOrder(
//                 this._openSide === 'buy'? 'sell': 'buy',
//                 'market',
//                 this._currentSize
//             )
//         } catch(e) {
//             this._closeID = ''
//             return false
//         }
//         return true
//     }

//     public closeLimit(price: number, postOnly: boolean = true, cancelSec: number = 0): boolean {
//         if (this._closeID !== '') {
//             return false
//         }
//         this._closeID = this._name
//         try {
//             this.placeOrder(
//                 this._openSide === 'buy'? 'sell': 'buy',
//                 'limit',
//                 this._currentSize,
//                 price,
//                 postOnly)
//             if (cancelSec > 0) {
//                 setTimeout(()=>{
//                     this.cancelCloseOrder
//                 }, cancelSec * 1000)
//             }
//         } catch(e) {
//             this._closeID = ''
//             return false
//         }
//         return true
//     }

//     public updateTicker(ticker: wsTicker) {
//         // ToDO: 含み損更新
//     }

//     public updateOrder(order: wsOrder) {
//         // New
//         // PartiallyFilled
//         // Filled
//         // Canceled
//         // Rejected
//         // PendingNew
//         if (order.clientID && order.clientID === this._name && order.status === 'New') {
//             if (this._openID === order.clientID) {
//                 console.log('open')
//                 this._openID = order.id
//                 this._openTime = Date.now()
//             }
//             if (this._closeID === order.clientID) {
//                 console.log('close')
//                 this._closeID = order.id
//                 this._closeTime = Date.now()
//             }
//             console.log(order.clientID, this._openID, this._closeID)
//         }
//         if (order.id === this._openID && ['Filled', 'Canceled'].includes(order.status)) {
//             this.resetOpen()
//             const size = this.roundSize(order.size)
//             const filled = this.roundSize(order.filledSize)
//             if (order.filledSize > 0) {
//                 this._currentSize += filled
//                 this._initialSize += filled
//                 this._currentOpenPrice = order.avgFillPrice? order.avgFillPrice: order.price   
//             }
//             if (filled !== size) {
//                 if (this.onOpenOrderCanceled) {
//                     this.onOpenOrderCanceled(this)
//                 }
//             }
//             if (filled === size) {
//                 if (this.onOpened){
//                     this.onOpened(this)
//                 }
//             }
//         }
//         if (order.id === this._closeID && ['Filled', 'Canceled'].includes(order.status)) {
//             this.resetClose()
//             const size = this.roundSize(order.size)
//             const filled = this.roundSize(order.filledSize)
//             if (filled > 0) {
//                 this._currentSize -= filled
//                 this._currentClosePrice = order.avgFillPrice? order.avgFillPrice: order.price
//             }
//             if (filled !== size) {
//                 if (this.onCloseOrderCanceled){
//                     this.onCloseOrderCanceled(this)
//                 }
//             }

//             if (this._isLosscut && this._currentSize > 0) {
//                 this.closeMarket()
//             }

//             if (filled === size) {
//                 if (this._isLosscut) {
//                     this._losscutCount++
//                     this._isLosscut = false
//                 }
//                 this._cumulativeProfit += this._initialSize * 
//                     (this._openSide === 'buy' ?
//                         (this._currentClosePrice - this._currentOpenPrice):
//                         (this._currentOpenPrice - this._currentClosePrice)
//                     )
//                 this._initialSize = 0
//                 this._currentSize = 0
//                 this._closeCount++
//                 if (this.onClosed){
//                     this.onClosed(this)
//                 }
//             }
//         }
//     }

//     public losscut() {
//         this._isLosscut = true
//         this.cancelCloseOrder()
//     }

//     public cancelOpenOrder() {
//         if (this._openID === this._name){
//             this._openID = ''
//         }else if (this._openID !== ''){
//             this._api.cancelOrder(this._marketName, this._openID)
//         }
//     }

//     public cancelCloseOrder() {
//         if (this._closeID === this._name){
//             this._closeID = ''
//         }else if (this._closeID !== ''){
//             this._api.cancelOrder(this._marketName, this._closeID)
//         }
//     }

//     get profit(): number {
//         return this._cumulativeProfit - this._cumulativeFee
//     }

//     get enabledOpen(): Boolean {
//         return  this._openID === '' &&
//                 this._closeID === '' &&
//                 this._currentSize === 0
//     }

//     get enabledClose(): Boolean {
//         return  this._openID === '' &&
//                 this._closeID === '' &&
//                 this._currentSize > 0
//     }

//     get openOrderSettings(): OrderSettings | undefined {
//         return this._openOrderSettings
//     }

//     get closeOrderSettings(): OrderSettings | undefined {
//         return this._closeOrderSettings
//     }
    
//     get currentSize(): number {
//         return this._currentSize
//     }

//     get isLosscut(): boolean {
//         return this._isLosscut
//     }

//     get openSide(): OrderSide {
//         return this._openSide
//     }

//     get currentOpenPrice(): number {
//         return this._currentOpenPrice
//     }

//     get currentClosePrice(): number {
//         return this._currentClosePrice
//     }

//     get closeCount(): number {
//         return this._closeCount
//     }

//     get losscutCount(): number {
//         return this._losscutCount
//     }
// }