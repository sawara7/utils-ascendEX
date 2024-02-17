export interface ASDAsset {
    assetCode: string;
    assetname: string;
    precisionScale: number;
    nativeScale: number;
    blockChain: ASDBlockchainSpecificDetails[];
}
export interface ASDBlockchainSpecificDetails {
    chainName: string;
    withdrawFee: string;
    allowDepoist: boolean;
    allowWithdraw: boolean;
    minDepositAmt: string;
    minWithdrawalAmt: string;
    numConfirmations: number;
}
export interface ASDTicker {
    symbol: string;
    open: string;
    close: string;
    high: string;
    low: string;
    volume: string;
    ask: [string, string];
    bid: [string, string];
}
export interface FuturePricingData {
    contracts: FutureContract[];
    collaterals: FutureCollaterals[];
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
