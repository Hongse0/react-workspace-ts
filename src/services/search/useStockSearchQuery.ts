import { useQuery } from "@tanstack/react-query";
import { envConfig } from "../../module/constants/envConfig.ts";
import {StockSearchService} from "../../module/common/StockSearchService.ts";

const stockSearchService = new StockSearchService(envConfig.API_URL);

export const useStockSearchQuery = (params: { q: string; size?: number }) => {
    const q = params.q?.trim() ?? "";

    return useQuery({
        queryKey: ["stockSearch", q, params.size ?? 20],
        enabled: q.length > 0, // ✅ q 없으면 호출 안 함
        queryFn: async () => {
            const {
                data: { code, result, messages },
            } = await stockSearchService.searchStocks({ q, size: params.size ?? 20 });

            if (code !== "000000") {
                const msg = messages?.[0] ?? "검색 실패";
                console.error(`${code}: ${msg}`);
                throw new Error(msg);
            }

            return result;
        },
    });
};
