import { useQuery } from "@tanstack/react-query";
import { envConfig } from "../../module/constants/envConfig";
import {
    AccountService,
    type AccountHoldingItem,
} from "../../module/common/AccountService";

const accountService = new AccountService(envConfig.API_URL);

export const getAccountHoldingsQK = (accountId?: number) => [
    "accountHoldings",
    accountId,
];

const toNumber = (value: unknown): number => {
    if (value == null) return 0;

    if (typeof value === "number") {
        return Number.isFinite(value) ? value : 0;
    }

    const n = Number(String(value).replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
};

const normalizeHolding = (item: AccountHoldingItem): AccountHoldingItem => {
    const quantity = toNumber(item.quantity);
    const avgPrice = toNumber(item.avgPrice);
    const currentPrice = toNumber(item.currentPrice);
    const buyAmount = toNumber(item.buyAmount);
    const evaluationAmount = toNumber(item.evaluationAmount);
    const profitLoss = toNumber(item.profitLoss);

    const profitRate = toNumber(item.profitRate ?? item.rate ?? 0);

    return {
        ...item,
        quantity,
        availableQuantity: toNumber(item.availableQuantity ?? quantity),
        avgPrice,
        currentPrice,
        buyAmount,
        evaluationAmount,
        profitLoss,
        profitRate,
        rate: profitRate,
    };
};

export const useAccountHoldingsQuery = (
    accountId?: number,
    enabled: boolean = true
) => {
    return useQuery<AccountHoldingItem[]>({
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

            return (result ?? []).map(normalizeHolding);
        },
    });
};