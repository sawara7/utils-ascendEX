import {
    ApiConfig,
    ASDResponse,
    ASDPrivateApiClass
} from '../restAPI_Base'

import {
    PlaceCashMarginOrderRequest,
    CancelCashMarginOrderRequest,
    GetCashMarginAccountBalanceRequest,
} from './requestType'

import {
    ASDCashMarginOrderResponse,
    CashMarginAccountBalance,
    CashMarginCancelInfo,
    CashMarginOrderInfo,
    CashMarginRiskProfile,
    OrderInfoMarginV1
} from './responseType'

import {
    AccountCategory
} from '../utils';

export interface ASDPrivateApiConfig extends ApiConfig {
    apiKey: string;
    apiSecret: string;
    accountGroup: string;
    subAccount?: string;
    sendingInterval?: number;
}

export class ASDPrivateCashMarginApiClass  extends ASDPrivateApiClass {
    constructor(config: ASDPrivateApiConfig) {
        super(config)
    }

    public async placeCashMarginOrder(type: AccountCategory, req: PlaceCashMarginOrderRequest): Promise<ASDResponse<ASDCashMarginOrderResponse<CashMarginOrderInfo>>> {
        const path = this.accountGroup + '/api/pro/v1/' + type + '/order'
        return await this.post(path, 'order', req)
    }

    public async cancelCashMarginOrder(type: AccountCategory, req: CancelCashMarginOrderRequest): Promise<ASDResponse<ASDCashMarginOrderResponse<CashMarginCancelInfo>>> {
        const path = this.accountGroup + '/api/pro/v1/' + type + '/order'
        return await this.delete(path, 'order', req)
    }

    public async getCashMarginOrderInfo(type: AccountCategory, orderIDs: String[]): Promise<ASDResponse<OrderInfoMarginV1[] | OrderInfoMarginV1>> {
        const ods = orderIDs.toString()
        const path = this.accountGroup + '/api/pro/v1/' + type + '/order/status?orderId=' + ods
        return await this.get(path, 'order/status', {})
    }

    public async getCashMarginOpenOrderInfo(type: AccountCategory): Promise<ASDResponse<OrderInfoMarginV1[]>> {
        const path = this.accountGroup + '/api/pro/v1/' + type + '/order/open'
        return await this.get(path, 'order/open')
    }

    public async getCashMarginAccountBalance(params: GetCashMarginAccountBalanceRequest): Promise<ASDResponse<CashMarginAccountBalance[]>> {
        const path = this.accountGroup + '/api/pro/v1/cash/balance'
        return await this.get(path, 'balance', params)
    }

    public async getCashMarginRiskProfile(type: AccountCategory): Promise<ASDResponse<CashMarginRiskProfile>> {
        const path = this.accountGroup + '/api/pro/v1/' + type + '/risk'
        return await this.get(path, 'margin/risk', {})
    }
}

