import { useMutation } from "@tanstack/react-query";
import { envConfig } from "../../module/constants/envConfig";
import {
    StockBatchService,
    type ManualBatchResult,
} from "../../module/common/StockBatchService.ts";
import {
    StockInvestmentScoreService,
    type SyncStockInvestmentScoreResult,
} from "../../module/common/StockInvestmentScoreService.ts";

const stockBatchService = new StockBatchService(envConfig.API_URL);
const stockInvestmentScoreService = new StockInvestmentScoreService(envConfig.API_URL);

export type BatchType =
    | "STOCK_KRX"
    | "STOCK_ES"
    | "ETF"
    | "STOCK_INVESTMENT_SCORE";

export type RunBatchResult =
    | ManualBatchResult
    | SyncStockInvestmentScoreResult;

export interface RunBatchPayload {
    type: BatchType;
    basDt?: string;
}

export const useRunStockBatchMutation = () => {
    return useMutation({
        mutationFn: async ({
                               type,
                               basDt,
                           }: RunBatchPayload): Promise<RunBatchResult> => {
            try {
                const response =
                    type === "STOCK_KRX"
                        ? await stockBatchService.syncStockKrx(basDt)
                        : type === "STOCK_ES"
                            ? await stockBatchService.syncStockEs(basDt)
                            : type === "ETF"
                                ? await stockBatchService.syncEtf(basDt)
                                : await stockInvestmentScoreService.syncInvestmentScores();

                const {
                    data: { code, result, messages },
                } = response;

                if (code !== "000000") {
                    throw new Error(messages?.[0] ?? "배치 수동 실행 실패");
                }

                if (!result) {
                    throw new Error("배치 실행 결과가 없습니다.");
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