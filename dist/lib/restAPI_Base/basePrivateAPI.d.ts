import { ApiConfig, BaseApiClass } from './baseAPI';
export interface ASDPrivateApiConfig extends ApiConfig {
    apiKey: string;
    apiSecret: string;
    accountGroup: string;
    subAccount?: string;
    sendingInterval?: number;
}
export declare class ASDPrivateApiClass extends BaseApiClass {
    private static toSha256;
    private readonly _apiKey;
    private readonly _apiSecret;
    private readonly _accountGroup;
    private readonly _subAccount?;
    private static _lastOrderTime?;
    private _minOrderInterval;
    constructor(config: ASDPrivateApiConfig);
    get<T>(path: string, apiPath: string, query?: {}): Promise<any>;
    post<T>(path: string, apiPath: string, body: {}, ts?: number): Promise<any>;
    delete<T>(path: string, apiPath: string, query?: {}, ts?: number): Promise<any>;
    get accountGroup(): string;
    private makeHeader;
    private sleepWhileOrderInterval;
}
