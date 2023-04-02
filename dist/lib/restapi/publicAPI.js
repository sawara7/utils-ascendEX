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
exports.ASDPublicApiClass = void 0;
const baseAPI_1 = require("./baseAPI");
const requestType_1 = require("./requestType");
const querystring = __importStar(require("querystring"));
class ASDPublicApiClass extends baseAPI_1.BaseApiClass {
    constructor(config) {
        config.endPoint = config.endPoint || requestType_1.ASCENDEX_ENDPOINT;
        super(config);
    }
    get(path, query) {
        let queryPath = path;
        if (query && Object.keys(query).length > 0) {
            queryPath += '?' + querystring.encode(query);
        }
        return super.get(queryPath, query);
    }
    getAllAssets() {
        const path = 'api/pro/v2/assets';
        return this.get(path);
    }
    getTicker(symbol) {
        const path = 'api/pro/v1/spot/ticker';
        return this.get(path, { symbol: symbol });
    }
    getFutureTicker(symbol) {
        const path = 'api/pro/v2/futures/ticker';
        return this.get(path, { symbol: symbol });
    }
    getFuturePricingData() {
        const path = 'api/pro/v2/futures/pricing-data';
        return this.get(path, {});
    }
}
exports.ASDPublicApiClass = ASDPublicApiClass;
