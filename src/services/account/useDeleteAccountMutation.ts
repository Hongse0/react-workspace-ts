import { useMutation, useQueryClient } from "@tanstack/react-query";
import { envConfig } from "../../module/constants/envConfig";
import { AccountService } from "../../module/common/AccountService";
import { ACCOUNT_LIST_QK } from "./useAccountListQuery";

const accountService = new AccountService(envConfig.API_URL);

export const useDeleteAccountMutation = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (accountId: number) => {
            const {
                data: { code, messages },
            } = await accountService.deleteAccount(accountId);

            if (code !== "000000") {
                throw new Error(messages?.[0] ?? "계좌 삭제 실패");
            }

            return true;
        },
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ACCOUNT_LIST_QK });
        },
    });
};
