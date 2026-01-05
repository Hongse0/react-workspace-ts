import BaseAPIService from "../../module/api/BaseAPIService";
import type { ServerResponse } from "../api/Types.ts";

export interface StockSearchItem {
    srtnCd: string;   // A005930
    itmsNm: string;   // 삼성전자
    mrktCtg: string;  // KOSPI
    activeYn?: string;
}

export interface StockSearchResult {
    items: StockSearchItem[];
}

export interface StockSearchV1 {
    searchStocks(params: { q: string; size?: number }): Promise<ServerResponse<StockSearchResult>>;
    suggestStocks(params: { q: string; size?: number }): Promise<ServerResponse<StockSearchResult>>;
}

export class StockSearchService extends BaseAPIService implements StockSearchV1 {
    constructor(baseUrl: string, token?: string) {
        super(baseUrl, "v1", "search", token);
    }

    /** 주식 검색 (동의어/오타 허용) */
    searchStocks(params: { q: string; size?: number }): Promise<ServerResponse<StockSearchResult>> {
        return this.get<StockSearchResult>("/stocks", params);
    }

    /** 자동완성 */
    suggestStocks(params: { q: string; size?: number }): Promise<ServerResponse<StockSearchResult>> {
        return this.get<StockSearchResult>("/stocks/suggest", params);
    }
}
