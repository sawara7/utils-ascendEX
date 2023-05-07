import { V1OrderSide, V2FutureOrderSide } from "../utils";

export const ASCENDEX_ENDPOINT = 'https://ascendex.com/'

export interface GetMarginAccountBalanceRequest {
  asset?: string; // valid asset code e.g. "BTC"
  showAll?: boolean; // true / false
}

export interface PlaceOrderRequest {
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

export interface PlaceFutureOrderRequest {
  id?: string; // >=9 chars (letter and digit number only). Optional but recommended. We echo it back to help you match response with request. By setting this field, you can obtain the orderId before sending the request. It is also useful when you place order in batch mode.
  time: number; // Milliseconds since UNIX epoch in UTC. We do not process request placed more than 30 seconds ago.
  symbol: string; // e.g. BTC-PERP
  orderPrice?: string; // Required for Limit and StopLimit orders
  orderQty: string; // Order size. Please set scale properly for each symbol.
  orderType: "Limit" | "Market" | "StopLimit" | "StopMarket"; // 
  side: V2FutureOrderSide; // 
  respInst?: "ACK" | "DONE"; // ACK for limit order and Done for market order by default
  postOnly?: boolean; // false by default
  stopPrice?: string; // required for StopLimit and StopMarket orders
  timeInForce?: "GTC" | "IOC" | "FOK"; // GTC by default
  execInst?: string; // 
  posStopLossPrice?: string; // position stop loss price
  posTakeProfitPrice?: string; // position take profit price
}

export interface CancelOrderRequest {
  id?: string;       // >=9 chars (letter and digit number only). Optional but recommended.
  orderId: string;   // 32 chars order id.
  symbol: string;    // Symbol of the order to cancel.
  time: number;      // milliseconds since UNIX epoch in UTC.
  respInst?: string; // ACK by default.
}