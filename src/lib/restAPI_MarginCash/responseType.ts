import { V1OrderSide } from "../utils";

export interface ASDCashMarginOrderResponse<T> {
  ac: "CASH" | "MARGIN",
  accountId: string,
  action: string,
  status: string,
  info: T
}

export interface CashMarginOrderInfo {
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

export interface CashMarginCancelInfo {
  id?: string; // Optional but recommended. We echo it back to help you identify the response if provided.
  orderId: string; // 32 chars order id responded by server when place order
  symbol: string; // Symbol of the order to cancel
  time: number; // milliseconds since UNIX epoch in UTC. We do not process requests placed more than 30 seconds ago.
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

export interface CashMarginAccountBalance {
  asset: string; // asset code e.g. "USDT"
  totalBalance: string; // total balance e.g. "1234.56"
  availableBalance: string; // available balance e.g. "234.56"
  borrowed: string; // borrowed amount e.g. "0"
  interest: string; // interest owed e.g. "0"
}

export interface CashMarginRiskProfile {
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