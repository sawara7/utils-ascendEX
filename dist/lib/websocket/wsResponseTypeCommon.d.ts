export interface BaseResponse {
    m: string;
}
export interface PingResponse extends BaseResponse {
    hp: number;
}
export interface PongResponse extends BaseResponse {
    code: number;
    ts: number;
    hp: number;
}
export interface ConnectedResponse extends BaseResponse {
    type: string;
}
export interface AuthResponse extends BaseResponse {
    id: string;
    code: number;
    err?: string;
}
export interface BBOResponse extends BaseResponse {
    symbol: string;
    data: {
        ts: number;
        bid: string[];
        ask: string[];
    };
}
