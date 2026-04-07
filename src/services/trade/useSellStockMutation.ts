import { useMutation } from "@tanstack/react-query";
import { envConfig } from "../../module/constants/envConfig";
import { TradeService, type SellStockRequest } from "../../module/common/TradeService";

const tradeService = new TradeService(envConfig.API_URL);

export const useSellStockMutation = () => {
    return useMutation({
        mutationFn: async (body: SellStockRequest) => {
            const {
                data: { code, result, messages },
            } = await tradeService.sellKorea(body);

            if (code !== "000000") {
                throw new Error(messages?.[0] ?? "매도 등록 실패");
            }

            return result;
        },
    });
};