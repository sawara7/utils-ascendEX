
export interface ASDResponse<T> {
    code: number;
    accountId? : string;
    ac?: string;
    data: T;
}

export interface AccountInfo {
    accountGroup: number; // non-negative integer
    email: string;
    expireTime: number; // the time when the API key will be expired (UTC timestamp in milliseconds). If -1, the api key will not expire
    allowedIps: string[]; // list of IPs allowed for the api key
    cashAccount: string[];
    marginAccount: string[];
    tradePermission: boolean;
    transferPermission: boolean;
    viewPermission: boolean;
    userUID: string; // an unique id associated with user
}

export interface PlaceOrderResponce {
    avgPx: string; // average fill price
    cumFee: string; // cumulated filled comission
    cumFilledQty: string; // cumulated filled qty
    errorCode: string; // could be empty (see detail below)
    feeAsset: string; // fee asset, e.g, USDT
    id: string; // id from request
    lastExecTime: string; // latest execution timestamp
    orderId: string; // order id, this is what you should provide for future order query or cancel
    orderQty: string; // order quantity
    orderType: string; // order type
    price: string; // order price
    seqNum: number; // sequence number
    side: string; // order side
    status: string; // order status
    stopPrice: string; // stop price(could be empty)
    symbol: string; // symbol
    execInst: string; // execution instruction, POST for Post-Only orders, Liquidation for forced-liquidation orders, and NULL_VAL otherwise
  }

  export interface MarginAccountBalance {
    asset: string; // asset code e.g. "USDT"
    totalBalance: string; // total balance e.g. "1234.56"
    availableBalance: string; // available balance e.g. "234.56"
    borrowed: string; // borrowed amount e.g. "0"
    interest: string; // interest owed e.g. "0"
  }

  export interface MarginRiskProfile {
    accountMaxLeverage: string; // "10"
    availableBalanceInUSDT: string; // "17715.8175"
    totalBalanceInUSDT: string; // "17715.8175"
    totalBorrowedInUSDT: string; // "0"
    totalInterestInUSDT: string; // "0"
    netBalanceInUSDT: string; // "17715.8175"
    pointsBalance: string; // "0"
    currentLeverage: string; // "1"
    cushion: string; // "-1"
  }

  export interface Collateral {
    asset: string; // asset name e.g. "USDT"
    balance: string; // balance e.g. "10000"
    discountFactor: string; // discount factor e.g. "1"
    referencePrice: string; // reference price e.g. "1"
  }

  export interface Position {
    symbol: string; // contract symbol e.g. "BTC-PERP"
    side: string; // side e.g. "LONG"
    position: string; // positive for long position and negative for short position e.g. "0.5"
    referenceCost: string; // reference cost e.g. "-16800"
    unrealizedPnl: string; // unrealized pnl e.g. "0"
    realizedPnl: string; // realized pnl e.g. "0"
    avgOpenPrice: string; // Average Opening Price e.g. "0"
    marginType: string; // margin type: isolated / cross e.g. "cross"
    isolatedMargin: string; // isolated margin e.g. "0"
    leverage: string; // leverage e.g. "10"
    takeProfitPrice: string; // take profit price (by position exit order) e.g. "0"
    takeProfitTrigger: string; // take profit trigger (by position exit order) e.g. "market"
    stopLossPrice: string; // stop loss price (by position exit order) e.g. "0"
    stopLossTrigger: string; // stop loss trigger (by position exit order) e.g. "market"
    buyOpenOrderNotional: string; // buy open order notional e.g. "1362.419625"
    sellOpenOrderNotional: string; // sell open order notional e.g. "0"
    indexPrice: string; // price of the contract's underlying product price e.g. "17600.095"
    markPrice: string; // contract's mark price e.g. "-1"
  }

  export interface PositionResponse {
    ac: string // account category
    accountId: string, // account id
    collaterals: Collateral[]
    contracts: Position[]
  }

export interface PlaceFutureOrderInfo {
    ac: string; // account type e.g. "FUTURES"
    accountId: string; // account id e.g. "sample-futures-account-id"
    seqNum: number; // sequence number, also -1 in ACK mode
    time: number; // milliseconds since UNIX epoch in UTC
    orderId: string; // order id e.g. "sample-order-id"
    orderType: "Limit" | "Market" | "StopLimit" | "StopMarket"; // order type
    side: "Buy" | "Sell"; // order side
    symbol: string; // symbol e.g. "BTC-PERP"
    price: string; // order price
    orderQty: string; // order quantity
    stopPrice: string; // stop price
    stopBy: "market" | "limit"; // stop by
    status: "New" | "PartiallyFilled" | "Filled" | "Cancelled" | "Rejected"; // order status
    lastExecTime: number; // last execution time in milliseconds since UNIX epoch in UTC
    lastPx: string; // last execution price
    lastQty: string; // last execution quantity
    avgFilledPx: string; // average filled price
    cumFilledQty: string; // cumulative filled quantity
    fee: string; // fee for this execution
    cumFee: string; // cumulative fee for this order
    feeAsset: string; // fee asset e.g. "USDT"
    errorCode: string; // error code if any
}

export interface MetaInfo {
    action: string //  : "place-order",
    id: string // : "abcd1234abcd1234",
    respInst: string //: "ACCEPT"   // ACK, ACCEPT, or DONE
}

export interface PlaceOrderResponse {
    meta: MetaInfo,
    order: PlaceFutureOrderInfo,
}

export interface OrderInfo {
    ac: string; // account type e.g. "FUTURES"
    accountId: string; // account id e.g. "sampleFuturesAccountId"
    avgFilledPx: string; // average filled price
    cumFee: string; // cumulative fee for this order
    cumFilledQty: string; // cumulative filled quantity
    errorCode: string; // error code if any
    execInst: "NULL_VAL"; // execution instruction
    fee: string; // fee for this execution
    feeAsset: string; // fee asset e.g. "USDT"
    lastExecTime: number; // last execution time in milliseconds since UNIX epoch in UTC
    lastPx: string; // last execution price
    lastQty: string; // last execution quantity
    orderId: string; // order id e.g. "a177c29e4064U0123456789dVeUxlVyA"
    orderQty: string; // order quantity
    orderType: "Limit" | "Market" | "StopLimit" | "StopMarket"; // order type
    posStopLossPrice: string; // position stop loss price
    posStopLossTrigger: "None"; // position stop loss trigger
    posTakeProfitPrice: string; // position take profit price
    posTakeProfitTrigger: "None"; // position take profit trigger
    price: string; // order price
    seqNum: number; // sequence number, also -1 in ACK mode
    side: "Buy" | "Sell"; // order side
    status: "New" | "PartiallyFilled" | "Filled" | "Cancelled" | "Rejected"; // order status
    stopBy: "" | "market" | "limit"; // stop by
    stopPrice: string; // stop price
    symbol: string; // symbol e.g. "BTC-PERP"
    time: number; // milliseconds since UNIX epoch in UTC
  }


  // Public
export interface BlockchainSpecificDetails {
    chainName: string; // name of the blockchain
    withdrawFee: string; // fee charged for each withdrawal request. e.g. "0.01"
    allowDepoist: boolean; // allow deposit
    allowWithdraw: boolean; // allow withdrawal
    minDepositAmt: string; // minimum amount required for the deposit request e.g. "0.0"
    minWithdrawalAmt: string; // minimum amount required for the withdrawal request e.g. "50"
    numConfirmations: number; // number of confirmations needed for the exchange to recoganize a deposit
  }
  
  export interface Asset {
    assetCode: string; // asset code. e.g. "BTC"
    assetname: string; // full name of the asset, e.g. "Bitcoin"
    precisionScale: number; // scale used in internal position keeping
    nativeScale: number; // scale used in deposit/withdraw transaction from/to chain
    blockChain: BlockchainSpecificDetails[]; // block chain specific details
  }
  
  export interface Ticker {
    symbol: string; // symbol
    open: string; // the traded price 24 hour ago
    close: string; // the last traded price
    high: string; // the highest price over the past 24 hours
    low: string; // the lowest price over the past 24 hours
    volume: string; // the total traded volume in quote asset over the paste 24 hours
    ask: [string, string]; // the price and size at the current best ask level
    bid: [string, string]; // the price and size at the current best bid level
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

  export interface FuturePricingData {
    contracts: FutureContract[]
    collaterals: FutureCollaterals[]
  }


  export interface CancelOrderResponse {
    meta: MetaInfo
    order: CancelOrderInfo
  }

  export interface CancelBatchOrderResponse {
    meta: MetaInfo
    orders: CancelOrderInfo[]
  }

  export interface CancelOrderInfo {
    ac: string;           // account category
    accountId: string;    // account ID
    seqNum: number;       // sequence number
    time: number;         // order creation time
    orderId: string;      // order ID
    orderType: string;    // order type
    side: string;         // order side
    symbol: string;       // contract symbol
    price: string;        // order price
    orderQty: string;     // order quantity
    stopPrice: string;    // stop price
    stopBy: string;       // stop price trigger
    status: string;       // order status
    lastExecTime: number; // last execution time
    lastPx: string;       // last filled price
    lastQty: string;      // last filled quantity
    avgFilledPx: string;  // average filled price of all fills
    cumFilledQty: string; // cumulative filled quantity
    fee: string;          // fee of the last fill
    cumFee: string;       // cumulative fee
    feeAsset: string;     // fee asset
    errorCode: string;    // error code
  }

  export interface FuturesAccountBalanceSnapshot {
    meta: BalanceMetaInfo;              // meta info
    collateralBalance: CollateralBalance[]; // collateral balance info
    contractBalance: ContractBalance[];     // contract balance info
  }

  export interface BalanceMetaInfo {
    ac: string;          // account category
    accountId: string;   // account ID
    sn: number;          // sequence number
    balanceTime: number; // balance snapshot time in milliseconds
  }

  export interface ContractBalance {
    contract: string;         // contract name
    futuresAssetBalance: string;  // current contract position
    isolatedMargin: string;   // Isolated margin
    refCostBalance: string;   // Reference cost
  }

  export interface CollateralBalance {
    asset: string;       // asset code
    totalBalance: string; // current asset total balance
  }