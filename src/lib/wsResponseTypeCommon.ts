
export interface BaseResponse {
    m: string
}

export interface PingResponse extends BaseResponse{
    // m: 'ping'
    hp: number //health point: when this value decreases to 0, the session will be disconnected.   
}

export interface PongResponse extends BaseResponse{
    // m: 'pong'
    code: number //error code, for the pong mesage, the error code is always 0 (success)
    ts: number //server time in UTC miliseconds
    hp: number //health point: when this value decreases to 0, the session will be disconnected.
}

export interface ConnectedResponse extends BaseResponse{
    // m: 'connected'
    type: string
}

export interface AuthResponse extends BaseResponse{
    // m: 'auth'
    id: string //echo back the id if you provide one in the request
    code: number //Any code other than 0 indicate an error in authentication
    err?: string //Optional[String]	Provide detailed error message if code is not 0
}

export interface BBOResponse extends BaseResponse {
    // m: "bbo"
    symbol: string
    data: {
        ts: number
        bid: string[]
        ask: string[]
    }
}
