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
exports.ASDPrivateFutureApiClass = void 0;
const restAPI_Base_1 = require("../restAPI_Base");
class ASDPrivateFutureApiClass extends restAPI_Base_1.ASDPrivateApiClass {
    constructor(config) {
        super(config);
    }
    getFuturesAccountBalanceSnapshot(date) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.accountGroup + '/api/pro/data/v1/futures/balance/snapshot';
            return yield this.get(path, 'data/v1/futures/balance/snapshot', { date: date });
        });
    }
    getFutureOrderInfo(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.accountGroup + '/api/pro/v2/futures/order/status';
            return yield this.get(path, 'v2/futures/order/status', { orderId: orderId });
        });
    }
    getFuturePosition() {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.accountGroup + '/api/pro/v2/futures/position';
            return yield this.get(path, 'v2/futures/position', {});
        });
    }
    placeFutureOrder(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.accountGroup + '/api/pro/v2/futures/order';
            return yield this.post(path, 'v2/futures/order', req, req.time);
        });
    }
    cancelFutureOrder(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.accountGroup + '/api/pro/v2/futures/order';
            return yield this.delete(path, 'v2/futures/order', req, req.time);
        });
    }
    cancelFutureOrderBatch(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.length === 0)
                throw new Error('no Requests.');
            const path = this.accountGroup + '/api/pro/v2/futures/order/batch';
            return yield this.delete(path, 'v2/futures/order/batch', { orders: req }, req[0].time);
        });
    }
    cancelFutureOrderAll(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.accountGroup + '/api/pro/v2/futures/order/all';
            return yield this.delete(path, 'v2/futures/order/all', { symbol: symbol }, Date.now());
        });
    }
}
exports.ASDPrivateFutureApiClass = ASDPrivateFutureApiClass;
