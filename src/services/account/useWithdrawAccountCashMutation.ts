import { useMutation, useQueryClient } from "@tanstack/react-query";
import { envConfig } from "../../module/constants/envConfig";
import {AccountService} from "../../module/common/AccountService.ts";

const accountService = new AccountService(envConfig.API_URL);

export interface WithdrawAccountCashMutationRequest {
    accountId: number;
    amount: number;
}

export const useWithdrawAccountCashMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["account", "cash", "withdraw"],
        mutationFn: async ({ accountId, amount }: WithdrawAccountCashMutationRequest) => {
            const {
                data: { code, result, messages },
            } = await accountService.withdrawCash(accountId, { amount });

            if (code !== "000000") {
                const msg = messages?.[0] ?? "출금 처리에 실패했습니다.";
                throw new Error(msg);
            }

            return result;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["account"],
            });
        },
    });
};