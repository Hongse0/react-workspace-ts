import BaseAPIService from "../api/BaseAPIService";
import type { ServerResponse } from "../api/Types";

export interface AccountSelectItem {
    accountId: number;
    memberId: number;
    brokerName: string;
    accountNumber: string;
    accountName?: string;
    baseCurrency: string;
    cashBalance: string; // 백엔드가 string으로 내려주는 구조 그대로
    createdAt: string;
}

export interface AccountCreateRequest {
    brokerName: string;
    accountNumber: string;
    accountName?: string;
    baseCurrency: string;
    initialBalance: number;
}

export type AccountResponse = AccountSelectItem;

export interface AccountV1 {
    registerAccount(body: AccountCreateRequest): Promise<ServerResponse<AccountResponse>>;
    selectAll(): Promise<ServerResponse<AccountSelectItem[]>>;
}

export class AccountService extends BaseAPIService implements AccountV1 {
    constructor(baseUrl: string) {
        super(baseUrl, "v1", "account");
    }

    /** 계좌 등록 */
    registerAccount(body: AccountCreateRequest) {
        return this.post<AccountResponse, AccountCreateRequest>("/register", body);
    }

    /** 계좌 목록 조회 (POST /v1/account/select/all) */
    selectAll() {
        return this.post<AccountSelectItem[], Record<string, never>>("/select/all", {});
    }

    deleteAccount(accountId: number) {
        return this.delete<null>(`/${accountId}`);
    }
}
