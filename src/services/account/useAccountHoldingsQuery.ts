import { useQuery } from "@tanstack/react-query";
import { envConfig } from "../../module/constants/envConfig";
import { AccountService } from "../../module/common/AccountService";

const accountService = new AccountService(envConfig.API_URL);

export const getAccountHoldingsQK = (accountId?: number) => ["accountHoldings", accountId];

export const useAccountHoldingsQuery = (accountId?: number, enabled: boolean = true) => {
    return useQuery({
        queryKey: getAccountHoldingsQK(accountId),
        enabled: enabled && !!accountId,
        queryFn: async () => {
            if (!accountId) return [];

            const {
                data: { code, result, messages },
            } = await accountService.selectHoldings(accountId);

            if (code !== "000000") {
                throw new Error(messages?.[0] ?? "보유 주식 조회 실패");
            }

            return result ?? [];
        },
    });
};