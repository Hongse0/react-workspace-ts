import { useMutation } from "@tanstack/react-query";
import { envConfig } from "../../module/constants/envConfig";
import {
  AccountService,
  type AccountCreateRequest,
  type AccountResponse,
} from "../../module/common/AccountService";

const accountService = new AccountService(envConfig.API_URL);

export const useCreateAccountMutation = () => {
  return useMutation({
    mutationFn: async (body: AccountCreateRequest) => {
      const {
        data: { code, result, messages },
      } = await accountService.registerAccount(body);

      if (code !== "000000") {
        const msg = messages?.[0] ?? "계좌 등록 실패";
        console.error(`${code}: ${msg}`);
        throw new Error(msg);
      }

      return result as AccountResponse;
    },
  });
};
