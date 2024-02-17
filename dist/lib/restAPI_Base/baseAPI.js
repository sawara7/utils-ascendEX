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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseApiClass = exports.AscendEXApiError = void 0;
const axios_1 = __importDefault(require("axios"));
class AscendEXApiError extends Error {
    constructor(code, message, data) {
        super('API_ERROR');
        this.code = 0;
        this.message = '';
        this.code = code;
        this.message = message;
        this.data = data;
    }
}
exports.AscendEXApiError = AscendEXApiError;
class BaseApiClass {
    constructor(config) {
        this.endPoint = config.endPoint || "";
        this.keepAlive = config.keepAlive || false;
        this.timeout = config.timeout || 3000;
        this.optionsCallback = config.optionsCallback;
        this.responseCallback = config.responseCallback;
    }
    get(path, params, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', path, params, undefined, headers);
        });
    }
    post(path, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', path, undefined, data, headers);
        });
    }
    put(path, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', path, undefined, data, headers);
        });
    }
    delete(path, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', path, undefined, data, headers);
        });
    }
    request(method, path, params, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            let queryPath = path;
            const options = {
                method: method,
                baseURL: this.endPoint,
                url: queryPath,
                timeout: this.timeout
                // httpAgent: new http.Agent({ keepAlive: this.keepAlive }),
                // httpsAgent: new https.Agent({ keepAlive: this.keepAlive })
            };
            if (data && Object.keys(data).length >= 0) {
                Object.assign(options, { data });
            }
            if (headers && Object.keys(headers).length > 0) {
                Object.assign(options, { headers });
            }
            if (this.optionsCallback) {
                yield this.optionsCallback(options);
            }
            try {
                const res = yield axios_1.default.request(options);
                if (this.responseCallback) {
                    this.responseCallback(res.data);
                }
                return res.data;
            }
            catch (e) {
                const err = e;
                let code = 0;
                let message = err.message;
                let data;
                if (err.response) {
                    code = err.response.status;
                    data = err.response.data;
                }
                throw new AscendEXApiError(code, message, data);
            }
        });
    }
}
exports.BaseApiClass = BaseApiClass;
