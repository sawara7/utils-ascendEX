export interface ASDAsset {
  assetCode: string; // asset code. e.g. "BTC"
  assetname: string; // full name of the asset, e.g. "Bitcoin"
  precisionScale: number; // scale used in internal position keeping
  nativeScale: number; // scale used in deposit/withdraw transaction from/to chain
  blockChain: ASDBlockchainSpecificDetails[]; // block chain specific details
}

export interface ASDBlockchainSpecificDetails {
  chainName: string; // name of the blockchain
  withdrawFee: string; // fee charged for each withdrawal request. e.g. "0.01"
  allowDepoist: boolean; // allow deposit
  allowWithdraw: boolean; // allow withdrawal
  minDepositAmt: string; // minimum amount required for the deposit request e.g. "0.0"
  minWithdrawalAmt: string; // minimum amount required for the withdrawal request e.g. "50"
  numConfirmations: number; // number of confirmations needed for the exchange to recoganize a deposit
}
  
export interface ASDTicker {
  symbol: string; // symbol
  open: string; // the traded price 24 hour ago
  close: string; // the last traded price
  high: string; // the highest price over the past 24 hours
  low: string; // the lowest price over the past 24 hours
  volume: string; // the total traded volume in quote asset over the paste 24 hours
  ask: [string, string]; // the price and size at the current best ask level
  bid: [string, string]; // the price and size at the current best bid level
}

export interface FuturePricingData {
  contracts: FutureContract[]
  collaterals: FutureCollaterals[]
}

export interface FutureCollaterals {
  asset: string
  referencePrice: string
}

export interface FutureContract {
  symbol: string; // contract symbol
  time: number; // server time (UTC timestamp in milliseconds)
  fundingRate: string; // funding rate 
  indexPrice: string; // index price of the underlying
  markPrice: string; // mark price of the contract
  openInterest: string; // funding rate
  nextFundingTime: number; // next funding time (UTC timestamp in milliseconds)
}