import { useQuery } from "@tanstack/react-query";
import { envConfig } from "../../module/constants/envConfig";
import {
    StockInvestmentScoreService,
    type StockInvestmentScore,
} from "../../module/common/StockInvestmentScoreService";

const stockInvestmentScoreService = new StockInvestmentScoreService(envConfig.API_URL);

export const STOCK_INVESTMENT_SCORE_QK = ["stockInvestmentScore"];

const emptyInvestmentScore = (srtnCd: string): StockInvestmentScore => ({
    srtnCd,
    itmsNm: "-",
    basDt: null,

    totalScore: 10,
    trendScore: 0,
    momentumScore: 0,
    volatilityRiskScore: 0,
    dataReliabilityScore: 0,
    portfolioFitScore: 10,

    opinion: "AVOID",
    metrics: {
        return5d: null,
        return20d: null,
        return60d: null,
        movingAverage5d: null,
        movingAverage20d: null,
        movingAverage60d: null,
        highProximity20d: null,
        volumeRatio5dTo20d: null,
        volatility20d: null,
        sharpDropCount20d: null,
        drawdownFromHigh20d: null,
        tradingDayCount: 0,
        latestPriceData: false,
    },
    reasons: ["가격 데이터가 부족합니다."],
});

export const useStockInvestmentScoreQuery = (srtnCd?: string) => {
    return useQuery({
        queryKey: [...STOCK_INVESTMENT_SCORE_QK, srtnCd],
        enabled: Boolean(srtnCd),
        staleTime: 1000 * 60 * 5,
        queryFn: async () => {
            if (!srtnCd) {
                throw new Error("종목 코드가 없습니다.");
            }

            const {
                data: { code, result, messages },
            } = await stockInvestmentScoreService.getInvestmentScore(srtnCd);

            if (code !== "000000") {
                throw new Error(messages?.[0] ?? "투자 의견 점수 조회 실패");
            }

            return result ?? emptyInvestmentScore(srtnCd);
        },
    });
};