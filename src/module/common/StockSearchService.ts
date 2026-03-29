import BaseAPIService from "../api/BaseAPIService";
import type { ServerResponse } from "../api/Types";

export interface StockSearchItem {
    srtnCd: string;
    isinCd: string;
    mrktCtg: string;
    itmsNm: string;
    corpNm: string;
    activeYn: string;
    basDt: string;
}

export interface StockSearchResult {
    query: string;
    size: number;
    total: number;
    items: StockSearchItem[];
}

export type StockSearchResponse = StockSearchResult;

export interface StockSearchV1 {
    autocomplete(q: string, size?: number): Promise<ServerResponse<StockSearchResponse>>;
    getBySrtnCd(srtnCd: string): Promise<ServerResponse<StockSearchItem>>;
}

export class StockSearchService extends BaseAPIService implements StockSearchV1 {
    constructor(baseUrl: string) {
        super(baseUrl, "v1", "stocks/search");
    }

    /** 자동완성: GET /v1/stocks/search/autocomplete?q=삼성&size=10 */
    autocomplete(q: string, size = 10) {
        return this.get<StockSearchResponse>("/autocomplete", {
            q,
            size,
        });
    }

    /** 단축코드 단건조회: GET /v1/stocks/search/A005930 */
    getBySrtnCd(srtnCd: string) {
        return this.get<StockSearchItem>(`/${srtnCd}`);
    }
}