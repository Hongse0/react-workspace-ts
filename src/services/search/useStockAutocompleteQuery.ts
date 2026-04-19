import { useQuery } from "@tanstack/react-query";
import { envConfig } from "../../module/constants/envConfig";
import {
    StockSearchService,
    type StockSearchResult,
} from "../../module/common/StockSearchService";

const stockSearchService = new StockSearchService(envConfig.API_URL);

export const STOCK_AUTOCOMPLETE_QK = ["stockAutocomplete"];

const emptyResult = (q: string, size: number): StockSearchResult => ({
    query: q,
    size,
    total: 0,
    items: [],
});

export const useStockAutocompleteQuery = (q: string, size = 10) => {
    return useQuery({
        queryKey: [...STOCK_AUTOCOMPLETE_QK, q, size],
        enabled: q.trim().length > 0,
        staleTime: 1000 * 60 * 5,
        queryFn: async () => {
            const {
                data: { code, result, messages },
            } = await stockSearchService.autocomplete(q, size);

            if (code !== "000000") {
                throw new Error(messages?.[0] ?? "종목 자동완성 조회 실패");
            }

            return result ?? emptyResult(q, size);
        },
    });
};