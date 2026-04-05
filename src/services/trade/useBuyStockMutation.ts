import { useMutation, useQueryClient } from "@tanstack/react-query";
import { envConfig } from "../../module/constants/envConfig";
import { StockService, type BuyStockRequest } from "../../module/common/StockService";
import { ACCOUNT_LIST_QK } from "../account/useAccountListQuery";

const stockService = new StockService(envConfig.API_URL);

export const useBuyStockMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (body: BuyStockRequest) => {
            try {
                const {
                    data: { code, result, messages },
                } = await stockService.buyKorea(body);

                if (code !== "000000") {
                    throw new Error(messages?.[0] ?? "주식 매수 등록 실패");
                }

                return result;
            } catch (error: unknown) {
                if (error instanceof Error) {
                    throw error;
                }
                throw new Error("주식 매수 등록 중 알 수 없는 오류가 발생했습니다.");
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ACCOUNT_LIST_QK,
            });
        },
    });
};