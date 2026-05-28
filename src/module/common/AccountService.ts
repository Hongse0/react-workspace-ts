import BaseAPIService from "../api/BaseAPIService";
import type { ServerResponse } from "../api/Types";

export interface AccountSelectItem {
    accountId: number;
    memberId?: number;
    brokerName: string;
    accountNumber: string;
    accountName?: string;
    baseCurrency: string;
    cashBalance: number;
    stockAssetValue: number;
    totalAssetValue: number;
    holdingCount: number;
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

export interface AccountCashRequest {
    amount: number;
}

export interface AccountCashResponse {
    accountId: number;
    cashBalance: number;
    stockAssetValue: number;
    totalAssetValue: number;
    holdingCount: number;
}

export type AccountResponse = AccountSelectItem;

export interface AccountV1 {
    registerAccount(body: AccountCreateRequest): Promise<ServerResponse<AccountResponse>>;
    selectAll(): Promise<ServerResponse<AccountSelectItem[]>>;
    selectAccount(accountId: number): Promise<ServerResponse<AccountSelectItem>>;
    selectHoldings(accountId: number): Promise<ServerResponse<AccountHoldingItem[]>>;
    deleteAccount(accountId: number): Promise<ServerResponse<null>>;
    depositCash(accountId: number, body: AccountCashRequest): Promise<ServerResponse<AccountCashResponse>>;
    withdrawCash(accountId: number, body: AccountCashRequest): Promise<ServerResponse<AccountCashResponse>>;
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

    /** 계좌 삭제 */
    deleteAccount(accountId: number) {
        return this.delete<null>(`/${accountId}`);
    }

    /** 계좌 현금 입금 */
    depositCash(accountId: number, body: AccountCashRequest) {
        return this.post<AccountCashResponse, AccountCashRequest>(
            `/${accountId}/cash/deposit`,
            body
        );
    }

    /** 계좌 현금 출금 */
    withdrawCash(accountId: number, body: AccountCashRequest) {
        return this.post<AccountCashResponse, AccountCashRequest>(
            `/${accountId}/cash/withdraw`,
            body
        );
    }

    /** 계좌 단건 조회 */
    selectAccount(accountId: number) {
        return this.get<AccountSelectItem>(`/${accountId}`);
    }
}