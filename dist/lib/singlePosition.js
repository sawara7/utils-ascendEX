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
exports.SinglePosition = void 0;
const my_utils_1 = require("my-utils");
class SinglePosition {
    constructor(params) {
        this._initialSize = 0;
        this._currentSize = 0;
        this._openID = '';
        this._closeID = '';
        this._openTime = 0;
        this._closeTime = 0;
        this._isLosscut = false;
        this._openSide = 'buy';
        this._currentOpenPrice = 0;
        this._currentClosePrice = 0;
        // Information
        this._closeCount = 0;
        this._losscutCount = 0;
        this._cumulativeFee = 0;
        this._cumulativeProfit = 0;
        if (!SinglePosition._lastOrderTime) {
            SinglePosition._lastOrderTime = {};
        }
        this._marketName = params.marketName;
        if (!SinglePosition._lastOrderTime[this._marketName]) {
            SinglePosition._lastOrderTime[this._marketName] = Date.now();
        }
        this._funds = params.funds;
        this._minOrderInterval = params.minOrderInterval || 200;
        this._openOrderSettings = params.openOrderSettings;
        this._closeOrderSettings = params.closeOrderSettings;
        this._sizeResolution = params.sizeResolution;
        this._priceResolution = params.priceResolution;
        this._api = params.api;
        this._name = params.name;
    }
    roundSize(size) {
        return Math.round(size * (1 / this._sizeResolution)) / (1 / this._sizeResolution);
    }
    roundPrice(price) {
        return Math.round(price * (1 / this._priceResolution)) / (1 / this._priceResolution);
    }
    placeOrder(side, type, size, price, postOnly) {
        return __awaiter(this, void 0, void 0, function* () {
            const p = {
                time: Date.now(),
                symbol: this._marketName,
                side: side,
                orderType: type,
                orderQty: this.roundSize(size).toString()
            };
            if (price) {
                p.orderPrice = this.roundPrice(price).toString();
            }
            if (postOnly) {
                p.postOnly = true;
            }
            if (SinglePosition._lastOrderTime && SinglePosition._lastOrderTime[this._marketName]) {
                const interval = Date.now() - SinglePosition._lastOrderTime[this._marketName];
                if (interval > 0) {
                    if (interval < this._minOrderInterval) {
                        SinglePosition._lastOrderTime[this._marketName] += this._minOrderInterval;
                        yield (0, my_utils_1.sleep)(this._minOrderInterval - interval);
                    }
                    else if (interval > this._minOrderInterval) {
                        SinglePosition._lastOrderTime[this._marketName] = Date.now();
                    }
                }
                else if (interval < 0) {
                    SinglePosition._lastOrderTime[this._marketName] += this._minOrderInterval;
                    yield (0, my_utils_1.sleep)(SinglePosition._lastOrderTime[this._marketName] - Date.now());
                }
            }
            this._api.placeOrder(p, this._name);
        });
    }
    resetOpen() {
        this._openID = '';
    }
    resetClose() {
        this._closeID = '';
    }
    open() {
        if (!this._openOrderSettings) {
            return false;
        }
        if (this._openOrderSettings.type === 'limit') {
            this._openSide = this._openOrderSettings.side;
            return this.openLimit(this._openOrderSettings.side, this._openOrderSettings.price, this._openOrderSettings.postOnly, this._openOrderSettings.cancelSec || 0);
        }
        else if (this._openOrderSettings.type === 'market') {
            this._openSide = this._openOrderSettings.side;
            return this.openMarket(this._openOrderSettings.side, this._openOrderSettings.price);
        }
        return false;
    }
    close() {
        if (!this._closeOrderSettings) {
            return false;
        }
        if (this._closeOrderSettings.type === 'limit') {
            return this.closeLimit(this._closeOrderSettings.price, this._closeOrderSettings.postOnly, this._closeOrderSettings.cancelSec || 0);
        }
        else if (this._closeOrderSettings.type === 'market') {
            return this.closeMarket();
        }
        return false;
    }
    openMarket(side, price) {
        if (this._openID !== '') {
            return false;
        }
        this._openID = this._name;
        try {
            this.placeOrder(side, 'market', this._funds / price);
        }
        catch (e) {
            this._openID = '';
            return false;
        }
        return true;
    }
    openLimit(side, price, postOnly = true, cancelSec = 0) {
        if (this._openID !== '') {
            return false;
        }
        this._openID = this._name;
        try {
            this.placeOrder(side, 'limit', this._funds / price, price, postOnly);
            if (cancelSec > 0) {
                setTimeout(() => {
                    this.cancelOpenOrder();
                }, cancelSec * 1000);
            }
        }
        catch (e) {
            this._openID = '';
            return false;
        }
        return true;
    }
    closeMarket() {
        if (this._closeID !== '') {
            return false;
        }
        this._closeID = this._name;
        try {
            this.placeOrder(this._openSide === 'buy' ? 'sell' : 'buy', 'market', this._currentSize);
        }
        catch (e) {
            this._closeID = '';
            return false;
        }
        return true;
    }
    closeLimit(price, postOnly = true, cancelSec = 0) {
        if (this._closeID !== '') {
            return false;
        }
        this._closeID = this._name;
        try {
            this.placeOrder(this._openSide === 'buy' ? 'sell' : 'buy', 'limit', this._currentSize, price, postOnly);
            if (cancelSec > 0) {
                setTimeout(() => {
                    this.cancelCloseOrder;
                }, cancelSec * 1000);
            }
        }
        catch (e) {
            this._closeID = '';
            return false;
        }
        return true;
    }
    updateTicker(ticker) {
        // ToDO: 含み損更新
    }
    updateOrder(order) {
        // New
        // PartiallyFilled
        // Filled
        // Canceled
        // Rejected
        // PendingNew
        if (order.clientID && order.clientID === this._name && order.status === 'New') {
            if (this.enabledOpen) {
                console.log('open');
                this._openID = order.id;
                this._openTime = Date.now();
            }
            if (this.enabledClose) {
                console.log('close');
                this._closeID = order.id;
                this._closeTime = Date.now();
            }
            console.log(order.clientID, this._openID, this._closeID);
        }
        if (order.id === this._openID && ['Filled', 'Canceled'].includes(order.status)) {
            this.resetOpen();
            const size = this.roundSize(order.size);
            const filled = this.roundSize(order.filledSize);
            if (order.filledSize > 0) {
                this._currentSize += filled;
                this._initialSize += filled;
                this._currentOpenPrice = order.avgFillPrice ? order.avgFillPrice : order.price;
            }
            if (filled !== size) {
                if (this.onOpenOrderCanceled) {
                    this.onOpenOrderCanceled(this);
                }
            }
            if (filled === size) {
                if (this.onOpened) {
                    this.onOpened(this);
                }
            }
        }
        if (order.id === this._closeID && ['Filled', 'Canceled'].includes(order.status)) {
            this.resetClose();
            const size = this.roundSize(order.size);
            const filled = this.roundSize(order.filledSize);
            if (filled > 0) {
                this._currentSize -= filled;
                this._currentClosePrice = order.avgFillPrice ? order.avgFillPrice : order.price;
            }
            if (filled !== size) {
                if (this.onCloseOrderCanceled) {
                    this.onCloseOrderCanceled(this);
                }
            }
            if (this._isLosscut && this._currentSize > 0) {
                this.closeMarket();
            }
            if (filled === size) {
                if (this._isLosscut) {
                    this._losscutCount++;
                    this._isLosscut = false;
                }
                this._cumulativeProfit += this._initialSize *
                    (this._openSide === 'buy' ?
                        (this._currentClosePrice - this._currentOpenPrice) :
                        (this._currentOpenPrice - this._currentClosePrice));
                this._initialSize = 0;
                this._currentSize = 0;
                this._closeCount++;
                if (this.onClosed) {
                    this.onClosed(this);
                }
            }
        }
    }
    losscut() {
        this._isLosscut = true;
        this.cancelCloseOrder();
    }
    cancelOpenOrder() {
        if (this._openID === this._name) {
            this._openID = '';
        }
        else if (this._openID !== '') {
            this._api.cancelOrder(this._marketName, this._openID);
        }
    }
    cancelCloseOrder() {
        if (this._closeID === this._name) {
            this._closeID = '';
        }
        else if (this._closeID !== '') {
            this._api.cancelOrder(this._marketName, this._closeID);
        }
    }
    get profit() {
        return this._cumulativeProfit - this._cumulativeFee;
    }
    get enabledOpen() {
        return this._openID === '' &&
            this._closeID === '' &&
            this._currentSize === 0;
    }
    get enabledClose() {
        return this._openID === '' &&
            this._closeID === '' &&
            this._currentSize > 0;
    }
    get openOrderSettings() {
        return this._openOrderSettings;
    }
    get closeOrderSettings() {
        return this._closeOrderSettings;
    }
    get currentSize() {
        return this._currentSize;
    }
    get isLosscut() {
        return this._isLosscut;
    }
    get openSide() {
        return this._openSide;
    }
    get currentOpenPrice() {
        return this._currentOpenPrice;
    }
    get currentClosePrice() {
        return this._currentClosePrice;
    }
    get closeCount() {
        return this._closeCount;
    }
    get losscutCount() {
        return this._losscutCount;
    }
}
exports.SinglePosition = SinglePosition;
