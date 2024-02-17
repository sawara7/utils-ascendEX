import { V1OrderSide } from "../utils";
export interface ASDCashMarginOrderResponse<T> {
    ac: "CASH" | "MARGIN";
    accountId: string;
    action: string;
    status: string;
    info: T;
}
export interface CashMarginOrderInfo {
    avgPx: string;
    cumFee: string;
    cumFilledQty: string;
    errorCode: string;
    feeAsset: string;
    id: string;
    lastExecTime: string;
    orderId: string;
    orderQty: string;
    orderType: string;
    price: string;
    seqNum: number;
    side: string;
    status: string;
    stopPrice: string;
    symbol: string;
    execInst: string;
}
export interface CashMarginCancelInfo {
    id?: string;
    orderId: string;
    symbol: string;
    time: number;
}
export interface OrderInfoMarginV1 {
    symbol: string;
    price: string;
    orderQty: string;
    orderType: string;
    avgPx: string;
    cumFee: string;
    cumFilledQty: string;
    errorCode: string;
    feeAsset: string;
    lastExecTime: number;
    orderId: string;
    seqNum: number;
    side: V1OrderSide;
    status: string;
    stopPrice: string;
    execInst: string;
}
export interface AccountInfo {
    accountGroup: number;
    email: string;
    expireTime: number;
    allowedIps: string[];
    cashAccount: string[];
    marginAccount: string[];
    tradePermission: boolean;
    transferPermission: boolean;
    viewPermission: boolean;
    userUID: string;
}
export interface CashMarginAccountBalance {
    asset: string;
    totalBalance: string;
    availableBalance: string;
    borrowed: string;
    interest: string;
}
export interface CashMarginRiskProfile {
    accountMaxLeverage: string;
    availableBalanceInUSDT: string;
    totalBalanceInUSDT: string;
    totalBorrowedInUSDT: string;
    totalInterestInUSDT: string;
    netBalanceInUSDT: string;
    pointsBalance: string;
    currentLeverage: string;
    cushion: string;
}
