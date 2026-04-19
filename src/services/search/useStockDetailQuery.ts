import { useQuery } from "@tanstack/react-query";
import { envConfig } from "../../module/constants/envConfig";
import { StockSearchService } from "../../module/common/StockSearchService";

const stockSearchService = new StockSearchService(envConfig.API_URL);

export const STOCK_DETAIL_QK = ["stockDetail"];

export const useStockDetailQuery = (srtnCd?: string | null) => {
    return useQuery({
        queryKey: [...STOCK_DETAIL_QK, srtnCd],
        enabled: !!srtnCd,
        staleTime: 1000 * 60 * 5,
        queryFn: async () => {
            const {
                data: { code, result, messages },
            } = await stockSearchService.getBySrtnCd(srtnCd!);

            if (code !== "000000") {
                throw new Error(messages?.[0] ?? "종목 상세 조회 실패");
            }

            return result;
        },
    });
};