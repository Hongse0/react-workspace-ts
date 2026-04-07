import BaseAPIService from "../api/BaseAPIService";
import type { ServerResponse } from "../api/Types";

export interface AccountSelectItem {
    accountId: number;
    memberId: number;
    brokerName: string;
    accountNumber: string;
    accountName?: string;
    baseCurrency: string;
    cashBalance: string;
    createdAt: string;
}

export interface AccountCreateRequest {
    brokerName: string;
    accountNumber: string;
    accountName?: string;
    baseCurrency: string;
    initialBalance: number;
}

export interface AccountHoldingItem {
    accountId: number;
    stockId: number;
    symbolCode: string;
    symbolName: string;
    quantity: number;
    avgPrice: number;
    availableQuantity?: number;
    currentPrice?: number;
    evaluationAmount?: number;
    profitLoss?: number;
    profitRate?: number;
}

export type AccountResponse = AccountSelectItem;

export interface AccountV1 {
    registerAccount(body: AccountCreateRequest): Promise<ServerResponse<AccountResponse>>;
    selectAll(): Promise<ServerResponse<AccountSelectItem[]>>;
    selectHoldings(accountId: number): Promise<ServerResponse<AccountHoldingItem[]>>;
}

export class AccountService extends BaseAPIService implements AccountV1 {
    constructor(baseUrl: string) {
        super(baseUrl, "v1", "account");
    }

    /** 계좌 등록 */
    registerAccount(body: AccountCreateRequest) {
        return this.post<AccountResponse, AccountCreateRequest>("/register", body);
    }

    /** 계좌 목록 조회 */
    selectAll() {
        return this.post<AccountSelectItem[], Record<string, never>>("/select/all", {});
    }

    /** 계좌별 보유 주식 조회 */
    selectHoldings(accountId: number) {
        return this.get<AccountHoldingItem[]>(`/${accountId}/holdings`);
    }

    deleteAccount(accountId: number) {
        return this.delete<null>(`/${accountId}`);
    }
}