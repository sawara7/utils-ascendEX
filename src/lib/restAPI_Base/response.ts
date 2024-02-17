export interface ASDResponse<T> {
    code: number
    // Normal case
    data: T;
    // Error case
    accountId? : string
    ac?: string
    action?: string
    status?: string
    message: string
    info: {
      id: string
      symbol: string
    }
}