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
exports.ASDPrivateCashMarginApiClass = void 0;
const restAPI_Base_1 = require("../restAPI_Base");
class ASDPrivateCashMarginApiClass extends restAPI_Base_1.ASDPrivateApiClass {
    constructor(config) {
        super(config);
    }
    placeCashMarginOrder(type, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.accountGroup + '/api/pro/v1/' + type + '/order';
            return yield this.post(path, 'order', req);
        });
    }
    cancelCashMarginOrder(type, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.accountGroup + '/api/pro/v1/' + type + '/order';
            return yield this.delete(path, 'order', req);
        });
    }
    getCashMarginOrderInfo(type, orderIDs) {
        return __awaiter(this, void 0, void 0, function* () {
            const ods = orderIDs.toString();
            const path = this.accountGroup + '/api/pro/v1/' + type + '/order/status?orderId=' + ods;
            return yield this.get(path, 'order/status', {});
        });
    }
    getCashMarginOpenOrderInfo(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.accountGroup + '/api/pro/v1/' + type + '/order/open';
            return yield this.get(path, 'order/open');
        });
    }
    getCashMarginAccountBalance(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.accountGroup + '/api/pro/v1/cash/balance';
            return yield this.get(path, 'balance', params);
        });
    }
    getCashMarginRiskProfile(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.accountGroup + '/api/pro/v1/' + type + '/risk';
            return yield this.get(path, 'margin/risk', {});
        });
    }
}
exports.ASDPrivateCashMarginApiClass = ASDPrivateCashMarginApiClass;
