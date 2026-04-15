import BaseAPIService from "../api/BaseAPIService";
import type { ServerResponse } from "../api/Types";

export interface DashboardSummary {
    totalBuyAmount: number;
    totalEvaluationAmount: number;
    totalProfitLoss: number;
    totalProfitRate: number;
    holdingCount: number;
}

export interface DashboardHoldingItem {
    stockId: number;
    stockName: string;
    stockCode: string;
    market: "KOSPI" | "KOSDAQ" | string;
    quantity: number;
    avgBuyPrice: number;
    currentPrice: number;
    buyAmount: number;
    evaluationAmount: number;
    profitLoss: number;
    profitRate: number;
}

export interface DashboardRecentTradeItem {
    tradeId: number;
    stockId: number;
    stockName: string;
    stockCode: string;
    tradeType: "BUY" | "SELL" | string;
    quantity: number;
    price: number;
    totalAmount: number;
    tradedAt: string;
}

export interface DashboardHoldingsResult {
    summary: DashboardSummary;
    holdings: DashboardHoldingItem[];
    recentTrades: DashboardRecentTradeItem[];
}

export interface DashboardV1 {
    getHoldings(): Promise<ServerResponse<DashboardHoldingsResult>>;
}

export class DashboardService extends BaseAPIService implements DashboardV1 {
    constructor(baseUrl: string) {
        super(baseUrl, "v1", "dashboard");
    }

    getHoldings() {
        return this.get<DashboardHoldingsResult>("/holdings");
    }
}