export interface ASDResponse<T> {
    code: number;
    data: T;
    accountId?: string;
    ac?: string;
    action?: string;
    status?: string;
    message: string;
    info: {
        id: string;
        symbol: string;
    };
}
