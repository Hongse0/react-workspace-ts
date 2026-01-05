import { useQuery } from "@tanstack/react-query";
import { envConfig } from "../../module/constants/envConfig";
import {StockSearchService} from "../../module/common/StockSearchService.ts";

const stockSearchService = new StockSearchService(envConfig.API_URL);

// 간단 디바운스: 검색어가 자주 바뀌면 호출을 늦춤
export const useStockSuggestQuery = (params: { q: string; size?: number }) => {
    const q = params.q?.trim() ?? "";

    return useQuery({
        queryKey: ["stockSuggest", q, params.size ?? 8],
        enabled: q.length > 0,
        staleTime: 5_000,
        queryFn: async () => {
            const {
                data: { code, result, messages },
            } = await stockSearchService.suggestStocks({ q, size: params.size ?? 8 });

            if (code !== "000000") {
                const msg = messages?.[0] ?? "자동완성 실패";
                console.error(`${code}: ${msg}`);
                throw new Error(msg);
            }

            return result;
        },
    });
};
