import BaseAPIService from "../api/BaseAPIService";
import type { ServerResponse } from "../api/Types";

export type InvestmentOpinion =
    | "STRONG"
    | "POSITIVE"
    | "WATCH"
    | "CAUTION"
    | "AVOID";

export interface StockInvestmentScoreMetrics {
    return5d: number | null;
    return20d: number | null;
    return60d: number | null;
    movingAverage5d: number | null;
    movingAverage20d: number | null;
    movingAverage60d: number | null;
    highProximity20d: number | null;
    volumeRatio5dTo20d: number | null;
    volatility20d: number | null;
    sharpDropCount20d: number | null;
    drawdownFromHigh20d: number | null;
    tradingDayCount: number;
    latestPriceData: boolean;
}

export interface StockInvestmentScore {
    srtnCd: string;
    itmsNm: string;
    basDt: string | null;

    totalScore: number;
    trendScore: number;
    momentumScore: number;
    volatilityRiskScore: number;
    dataReliabilityScore: number;
    portfolioFitScore: number;

    opinion: InvestmentOpinion;
    metrics: StockInvestmentScoreMetrics;
    reasons: string[];
}

export interface StockInvestmentScoreV1 {
    getInvestmentScore(srtnCd: string): Promise<ServerResponse<StockInvestmentScore>>;
}

export class StockInvestmentScoreService extends BaseAPIService implements StockInvestmentScoreV1 {
    constructor(baseUrl: string) {
        super(baseUrl, "v1", "stocks");
    }

    getInvestmentScore(srtnCd: string) {
        return this.get<StockInvestmentScore>(
            `/${encodeURIComponent(srtnCd)}/investment-score`
        );
    }
}