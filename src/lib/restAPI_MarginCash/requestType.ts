import { V1OrderSide } from "../utils";

export interface GetCashMarginAccountBalanceRequest {
  asset?: string; // valid asset code e.g. "BTC"
  showAll?: boolean; // true / false
}

export interface PlaceCashMarginOrderRequest {
  symbol: string; // required
  time: number; // required, milliseconds since UNIX epoch in UTC
  orderQty: string; // required, order size
  orderType: "limit" | "market" | "stop_limit" | "stop_market"; // required, order type
  side: V1OrderSide; // required
  id?: string; // optional but recommended, >=9 chars(letter and digit number only)
  orderPrice?: string; // optional, the limit price for limit order
  stopPrice?: string; // optional, trigger price of stop limit order
  postOnly?: boolean; // optional, true or false
  timeInForce?: "GTC" | "IOC" | "FOK"; // optional, GTC by default
  respInst?: "ACK" | "ACCEPT" | "DONE"; // optional, ACK by default
}

export interface CancelCashMarginOrderRequest {
  id?: string; // Optional but recommended. We echo it back to help you identify the response if provided.
  orderId: string; // 32 chars order id responded by server when place order
  symbol: string; // Symbol of the order to cancel
  time: number; // milliseconds since UNIX epoch in UTC. We do not process requests placed more than 30 seconds ago.
}