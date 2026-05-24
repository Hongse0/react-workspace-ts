import BaseAPIService from "../api/BaseAPIService.ts";
import type { ServerResponse } from "../api/Types.ts";

export interface ManualBatchResult {
    totalCount: number;
    saved: number;
    totalPages: number;
}

export interface StockBatchV1 {
    syncStockKrx(basDt?: string): Promise<ServerResponse<ManualBatchResult>>;
    syncStockEs(basDt?: string): Promise<ServerResponse<ManualBatchResult>>;
    syncEtf(basDt?: string): Promise<ServerResponse<ManualBatchResult>>;
}

export class StockBatchService extends BaseAPIService implements StockBatchV1 {
    constructor(baseUrl: string) {
        super(baseUrl, "v1", "stocks/sync");
    }

    /** 주식 KRX 마스터 수동 동기화 */
    syncStockKrx(basDt?: string) {
        const query = this.createBasDtQuery(basDt);

        return this.post<ManualBatchResult, Record<string, never>>(
            `/krx${query}`,
            {}
        );
    }

    /** 주식 ES 검색 인덱스 수동 이관 */
    syncStockEs(basDt?: string) {
        const query = this.createBasDtQuery(basDt);

        return this.post<ManualBatchResult, Record<string, never>>(
            `/es${query}`,
            {}
        );
    }

    /** ETF 종목 마스터 수동 동기화 */
    syncEtf(basDt?: string) {
        const query = this.createBasDtQuery(basDt);

        return this.post<ManualBatchResult, Record<string, never>>(
            `/etf${query}`,
            {}
        );
    }

    private createBasDtQuery(basDt?: string) {
        const value = basDt?.trim();

        if (!value) {
            return "";
        }

        return `?basDt=${encodeURIComponent(value)}`;
    }
}