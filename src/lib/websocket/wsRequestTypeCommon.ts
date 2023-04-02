
export interface BaseRequest {
    op: string
}

export interface AuthRequest extends BaseRequest{
    // op: 'auth'
    id?: string
    t: number
    key: string
    sig: string
}

export interface PingRequest extends BaseRequest{
    // op: 'ping'
}

export interface PongRequest extends BaseRequest{
    // op: 'pong'
}

export interface SubscribeChannelRequest extends BaseRequest {
    // op: 'sub' | 'unsub'
    id?: string
    ch: string
}