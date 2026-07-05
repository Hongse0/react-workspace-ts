import { useQuery } from "@tanstack/react-query";
import { envConfig } from "../../module/constants/envConfig";
import {
    StockRankingService,
    type OpinionFilter,
    type StockRankingResult,
} from "../../module/common/StockRankingService";

const stockRankingService = new StockRankingService(envConfig.API_URL);

export const STOCK_RANKING_QK = ["stockRanking"];

const emptyResult: StockRankingResult = {
    basDt: "",
    total: 0,
    counts: { STRONG: 0, POSITIVE: 0, WATCH: 0, CAUTION: 0, AVOID: 0 },
    items: [],
};

export const useStockRankingQuery = (opinion: OpinionFilter = "ALL", size = 20) => {
    return useQuery({
        queryKey: [...STOCK_RANKING_QK, opinion, size],
        staleTime: 1000 * 60 * 5,
        queryFn: async () => {
            const {
                data: { code, result, messages },
            } = await stockRankingService.getRanking({ opinion, size });

            if (code !== "000000") {
                throw new Error(messages?.[0] ?? "투자점수 랭킹 조회 실패");
            }

            return result ?? emptyResult;
        },
    });
};
