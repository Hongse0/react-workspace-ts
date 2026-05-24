import { useMutation } from "@tanstack/react-query";
import { envConfig } from "../../module/constants/envConfig";
import {
    StockBatchService,
    type ManualBatchResult,
} from "../../module/common/StockBatchService.ts";

const stockBatchService = new StockBatchService(envConfig.API_URL);

export type BatchType = "STOCK_KRX" | "STOCK_ES" | "ETF";

export interface RunBatchPayload {
    type: BatchType;
    basDt?: string;
}

export const useRunStockBatchMutation = () => {
    return useMutation({
        mutationFn: async ({
                               type,
                               basDt,
                           }: RunBatchPayload): Promise<ManualBatchResult> => {
            try {
                const response =
                    type === "STOCK_KRX"
                        ? await stockBatchService.syncStockKrx(basDt)
                        : type === "STOCK_ES"
                            ? await stockBatchService.syncStockEs(basDt)
                            : await stockBatchService.syncEtf(basDt);

                const {
                    data: { code, result, messages },
                } = response;

                if (code !== "000000") {
                    throw new Error(messages?.[0] ?? "배치 수동 실행 실패");
                }

                return result;
            } catch (error: unknown) {
                if (error instanceof Error) {
                    throw error;
                }

                throw new Error("배치 수동 실행 중 알 수 없는 오류가 발생했습니다.");
            }
        },
    });
};