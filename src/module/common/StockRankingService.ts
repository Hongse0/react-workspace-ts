import BaseAPIService from "../api/BaseAPIService";
import type { ServerResponse } from "../api/Types";
import type { InvestmentOpinion } from "./StockSearchService";

export type OpinionFilter = InvestmentOpinion | "ALL";

export interface StockRankingRequest {
    opinion?: OpinionFilter;
    size?: number;
    page?: number;
    basDt?: string;
}

export interface StockRankingItem {
    rank: number;
    stockCode: string;
    stockName: string;
    market: string;
    corpName: string | null;
    investmentScore: number;
    opinion: InvestmentOpinion;
    currentPrice: number;
    changeRate: number;
}

export interface StockRankingCounts {
    STRONG: number;
    POSITIVE: number;
    WATCH: number;
    CAUTION: number;
    AVOID: number;
}

export interface StockRankingResult {
    basDt: string;
    total: number;
    counts: StockRankingCounts;
    items: StockRankingItem[];
}

export class StockRankingService extends BaseAPIService {
    constructor(baseUrl: string) {
        super(baseUrl, "v1", "stocks/ranking");
    }

    getRanking(params: StockRankingRequest): Promise<ServerResponse<StockRankingResult>> {
        return this.get<StockRankingResult>("", params);
    }
}
