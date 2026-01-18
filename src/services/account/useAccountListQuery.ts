import { useQuery } from "@tanstack/react-query";
import { envConfig } from "../../module/constants/envConfig";
import { AccountService } from "../../module/common/AccountService";

const accountService = new AccountService(envConfig.API_URL);

export const ACCOUNT_LIST_QK = ["accountList"];

export const useAccountListQuery = () => {
    return useQuery({
        queryKey: ACCOUNT_LIST_QK,
        queryFn: async () => {
            const {
                data: { code, result, messages },
            } = await accountService.selectAll();

            if (code !== "000000") {
                throw new Error(messages?.[0] ?? "계좌 목록 조회 실패");
            }

            return result ?? [];
        },
    });
};
