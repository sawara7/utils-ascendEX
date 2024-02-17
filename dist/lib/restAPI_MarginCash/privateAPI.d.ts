import { ApiConfig, ASDResponse, ASDPrivateApiClass } from '../restAPI_Base';
import { PlaceCashMarginOrderRequest, CancelCashMarginOrderRequest, GetCashMarginAccountBalanceRequest } from './requestType';
import { ASDCashMarginOrderResponse, CashMarginAccountBalance, CashMarginCancelInfo, CashMarginOrderInfo, CashMarginRiskProfile, OrderInfoMarginV1 } from './responseType';
import { AccountCategory } from '../utils';
export interface ASDPrivateApiConfig extends ApiConfig {
    apiKey: string;
    apiSecret: string;
    accountGroup: string;
    subAccount?: string;
    sendingInterval?: number;
}
export declare class ASDPrivateCashMarginApiClass extends ASDPrivateApiClass {
    constructor(config: ASDPrivateApiConfig);
    placeCashMarginOrder(type: AccountCategory, req: PlaceCashMarginOrderRequest): Promise<ASDResponse<ASDCashMarginOrderResponse<CashMarginOrderInfo>>>;
    cancelCashMarginOrder(type: AccountCategory, req: CancelCashMarginOrderRequest): Promise<ASDResponse<ASDCashMarginOrderResponse<CashMarginCancelInfo>>>;
    getCashMarginOrderInfo(type: AccountCategory, orderIDs: String[]): Promise<ASDResponse<OrderInfoMarginV1[]>>;
    getCashMarginOpenOrderInfo(type: AccountCategory): Promise<ASDResponse<OrderInfoMarginV1[]>>;
    getCashMarginAccountBalance(params: GetCashMarginAccountBalanceRequest): Promise<ASDResponse<CashMarginAccountBalance[]>>;
    getCashMarginRiskProfile(type: AccountCategory): Promise<ASDResponse<CashMarginRiskProfile>>;
}
