export interface ASDResponse<T> {
    code: number;
    accountId?: string;
    ac?: string;
    data: T;
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
export interface PlaceOrderResponce {
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
export interface MarginAccountBalance {
    asset: string;
    totalBalance: string;
    availableBalance: string;
    borrowed: string;
    interest: string;
}
export interface MarginRiskProfile {
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
export interface Collateral {
    asset: string;
    balance: string;
    discountFactor: string;
    referencePrice: string;
}
export interface Position {
    symbol: string;
    side: string;
    position: string;
    referenceCost: string;
    unrealizedPnl: string;
    realizedPnl: string;
    avgOpenPrice: string;
    marginType: string;
    isolatedMargin: string;
    leverage: string;
    takeProfitPrice: string;
    takeProfitTrigger: string;
    stopLossPrice: string;
    stopLossTrigger: string;
    buyOpenOrderNotional: string;
    sellOpenOrderNotional: string;
    indexPrice: string;
    markPrice: string;
}
export interface PositionResponse {
    ac: string;
    accountId: string;
    collaterals: Collateral[];
    contracts: Position[];
}
export interface PlaceFutureOrderInfo {
    ac: string;
    accountId: string;
    seqNum: number;
    time: number;
    orderId: string;
    orderType: "Limit" | "Market" | "StopLimit" | "StopMarket";
    side: "Buy" | "Sell";
    symbol: string;
    price: string;
    orderQty: string;
    stopPrice: string;
    stopBy: "market" | "limit";
    status: "New" | "PartiallyFilled" | "Filled" | "Cancelled" | "Rejected";
    lastExecTime: number;
    lastPx: string;
    lastQty: string;
    avgFilledPx: string;
    cumFilledQty: string;
    fee: string;
    cumFee: string;
    feeAsset: string;
    errorCode: string;
}
export interface MetaInfo {
    action: string;
    id: string;
    respInst: string;
}
export interface PlaceOrderResponse {
    meta: MetaInfo;
    order: PlaceFutureOrderInfo;
}
export interface OrderInfo {
    ac: string;
    accountId: string;
    avgFilledPx: string;
    cumFee: string;
    cumFilledQty: string;
    errorCode: string;
    execInst: "NULL_VAL";
    fee: string;
    feeAsset: string;
    lastExecTime: number;
    lastPx: string;
    lastQty: string;
    orderId: string;
    orderQty: string;
    orderType: "Limit" | "Market" | "StopLimit" | "StopMarket";
    posStopLossPrice: string;
    posStopLossTrigger: "None";
    posTakeProfitPrice: string;
    posTakeProfitTrigger: "None";
    price: string;
    seqNum: number;
    side: "Buy" | "Sell";
    status: "New" | "PartiallyFilled" | "Filled" | "Cancelled" | "Rejected";
    stopBy: "" | "market" | "limit";
    stopPrice: string;
    symbol: string;
    time: number;
}
export interface BlockchainSpecificDetails {
    chainName: string;
    withdrawFee: string;
    allowDepoist: boolean;
    allowWithdraw: boolean;
    minDepositAmt: string;
    minWithdrawalAmt: string;
    numConfirmations: number;
}
export interface Asset {
    assetCode: string;
    assetname: string;
    precisionScale: number;
    nativeScale: number;
    blockChain: BlockchainSpecificDetails[];
}
export interface Ticker {
    symbol: string;
    open: string;
    close: string;
    high: string;
    low: string;
    volume: string;
    ask: [string, string];
    bid: [string, string];
}
export interface FutureCollaterals {
    asset: string;
    referencePrice: string;
}
export interface FutureContract {
    symbol: string;
    time: number;
    fundingRate: string;
    indexPrice: string;
    markPrice: string;
    openInterest: string;
    nextFundingTime: number;
}
export interface FuturePricingData {
    contracts: FutureContract[];
    collaterals: FutureCollaterals[];
}
export interface CancelOrderResponse {
    meta: MetaInfo;
    order: CancelOrderInfo;
}
export interface CancelBatchOrderResponse {
    meta: MetaInfo;
    orders: CancelOrderInfo[];
}
export interface CancelOrderInfo {
    ac: string;
    accountId: string;
    seqNum: number;
    time: number;
    orderId: string;
    orderType: string;
    side: string;
    symbol: string;
    price: string;
    orderQty: string;
    stopPrice: string;
    stopBy: string;
    status: string;
    lastExecTime: number;
    lastPx: string;
    lastQty: string;
    avgFilledPx: string;
    cumFilledQty: string;
    fee: string;
    cumFee: string;
    feeAsset: string;
    errorCode: string;
}
export interface FuturesAccountBalanceSnapshot {
    meta: BalanceMetaInfo;
    collateralBalance: CollateralBalance[];
    contractBalance: ContractBalance[];
}
export interface BalanceMetaInfo {
    ac: string;
    accountId: string;
    sn: number;
    balanceTime: number;
}
export interface ContractBalance {
    contract: string;
    futuresAssetBalance: string;
    isolatedMargin: string;
    refCostBalance: string;
}
export interface CollateralBalance {
    asset: string;
    totalBalance: string;
}
