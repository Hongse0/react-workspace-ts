import { useMutation, useQueryClient } from "@tanstack/react-query";
import { envConfig } from "../../module/constants/envConfig";
import {AccountService} from "../../module/common/AccountService.ts";

const accountService = new AccountService(envConfig.API_URL);

export interface DepositAccountCashMutationRequest {
    accountId: number;
    amount: number;
}

export const useDepositAccountCashMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["account", "cash", "deposit"],
        mutationFn: async ({ accountId, amount }: DepositAccountCashMutationRequest) => {
            const {
                data: { code, result, messages },
            } = await accountService.depositCash(accountId, { amount });

            if (code !== "000000") {
                const msg = messages?.[0] ?? "입금 처리에 실패했습니다.";
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