export interface BaseRequest {
    op: string;
}
export interface AuthRequest extends BaseRequest {
    id?: string;
    t: number;
    key: string;
    sig: string;
}
export interface PingRequest extends BaseRequest {
}
export interface PongRequest extends BaseRequest {
}
export interface SubscribeChannelRequest extends BaseRequest {
    id?: string;
    ch: string;
}
