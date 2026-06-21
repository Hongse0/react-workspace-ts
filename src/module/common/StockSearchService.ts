import BaseAPIService from "../api/BaseAPIService";
import type { ServerResponse } from "../api/Types";

export interface StockSearchRequest {
    q?: string;
    mrktCtg?: string;
    activeYn?: string;
    basDt?: string;
    size?: number;
    fuzzy?: boolean;
}

export interface StockSearchItem {
    srtnCd: string;
    isinCd: string | null;
    mrktCtg: string | null;
    itmsNm: string | null;
    corpNm: string | null;
    activeYn: string | null;
    basDt: string | null;
    currentPrice: number | null;
    vs: number | null;
    fltRt: number | null;
}

export interface StockSearchResult {
    query: string;
    size: number;
    total: number;
    items: StockSearchItem[];
}

export interface StockSearchV1 {
    search(body: StockSearchRequest): Promise<ServerResponse<StockSearchResult>>;
    autocomplete(q: string, size?: number): Promise<ServerResponse<StockSearchResult>>;
    getBySrtnCd(srtnCd: string): Promise<ServerResponse<StockSearchItem>>;
}

export class StockSearchService extends BaseAPIService implements StockSearchV1 {
    constructor(baseUrl: string) {
        super(baseUrl, "v1", "stocks/search");
    }

    search(body: StockSearchRequest) {
        return this.post<StockSearchResult, StockSearchRequest>("", body);
    }

    autocomplete(q: string, size = 10) {
        return this.get<StockSearchResult>(
            `/autocomplete?q=${encodeURIComponent(q)}&size=${size}`
        );
    }

    getBySrtnCd(srtnCd: string) {
        return this.get<StockSearchItem>(`/${encodeURIComponent(srtnCd)}`);
    }
}