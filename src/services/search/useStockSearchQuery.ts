import { useQuery } from "@tanstack/react-query";
import { envConfig } from "../../module/constants/envConfig";
import {
    StockSearchService,
    type StockSearchResult,
} from "../../module/common/StockSearchService";

const stockSearchService = new StockSearchService(envConfig.API_URL);

export const STOCK_SEARCH_QK = ["stockSearch"];

const emptyResult = (keyword: string, size: number): StockSearchResult => ({
    query: keyword,
    size,
    total: 0,
    items: [],
});

export const useStockSearchQuery = (keyword: string, size = 20) => {
    return useQuery({
        queryKey: [...STOCK_SEARCH_QK, keyword, size],
        enabled: keyword.trim().length > 0,
        staleTime: 1000 * 60 * 5,
        queryFn: async () => {
            const {
                data: { code, result, messages },
            } = await stockSearchService.search({
                q: keyword,
                size,
                activeYn: "Y",
            });

            if (code !== "000000") {
                throw new Error(messages?.[0] ?? "종목 검색 실패");
            }

            return result ?? emptyResult(keyword, size);
        },
    });
};