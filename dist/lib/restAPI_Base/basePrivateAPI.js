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
exports.ASDPrivateApiClass = void 0;
const crypto = __importStar(require("crypto"));
const baseAPI_1 = require("./baseAPI");
const utils_general_1 = require("utils-general");
const utils_1 = require("../utils");
class ASDPrivateApiClass extends baseAPI_1.BaseApiClass {
    static toSha256(key, value) {
        return crypto
            .createHmac('sha256', key)
            .update(Buffer.from(value))
            .digest('hex')
            .toString();
    }
    constructor(config) {
        config.endPoint = config.endPoint || utils_1.ASCENDEX_ENDPOINT;
        super(config);
        this._apiKey = config.apiKey;
        this._apiSecret = config.apiSecret;
        this._accountGroup = config.accountGroup;
        this._subAccount = config.subAccount;
        this._minOrderInterval = config.sendingInterval || 200;
        if (!ASDPrivateApiClass._lastOrderTime) {
            ASDPrivateApiClass._lastOrderTime = {};
        }
    }
    get(path, apiPath, query) {
        let queryPath = path;
        if (query && Object.keys(query).length > 0) {
            queryPath += '?' + (new URLSearchParams(query)).toString();
        }
        return super.get(queryPath, query, this.makeHeader(apiPath));
    }
    post(path, apiPath, body, ts) {
        return super.post(path, body, this.makeHeader(apiPath, ts));
    }
    delete(path, apiPath, query, ts) {
        let queryPath = path;
        if (query && Object.keys(query).length > 0) {
            queryPath += '?' + (new URLSearchParams(query)).toString();
        }
        return super.delete(queryPath, query, this.makeHeader(apiPath, ts));
    }
    get accountGroup() {
        return this._accountGroup;
    }
    makeHeader(path, timestamp) {
        const ts = timestamp ? timestamp : Date.now();
        const s = ts + path;
        const sign = ASDPrivateApiClass.toSha256(this._apiSecret, s);
        const header = {
            'x-auth-key': this._apiKey,
            'x-auth-timestamp': ts.toString(),
            'x-auth-signature': sign
        };
        return header;
    }
    sleepWhileOrderInterval(market) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ASDPrivateApiClass._lastOrderTime) {
                throw new Error('no last order');
            }
            if (ASDPrivateApiClass._lastOrderTime[market]) {
                const interval = Date.now() - ASDPrivateApiClass._lastOrderTime[market];
                if (interval > 0) {
                    if (interval < this._minOrderInterval) {
                        ASDPrivateApiClass._lastOrderTime[market] += this._minOrderInterval;
                        yield (0, utils_general_1.sleep)(this._minOrderInterval - interval);
                    }
                    else if (interval > this._minOrderInterval) {
                        ASDPrivateApiClass._lastOrderTime[market] = Date.now();
                    }
                }
                else if (interval < 0) {
                    ASDPrivateApiClass._lastOrderTime[market] += this._minOrderInterval;
                    yield (0, utils_general_1.sleep)(ASDPrivateApiClass._lastOrderTime[market] - Date.now());
                }
            }
            else {
                ASDPrivateApiClass._lastOrderTime[market] = Date.now();
            }
        });
    }
}
exports.ASDPrivateApiClass = ASDPrivateApiClass;
