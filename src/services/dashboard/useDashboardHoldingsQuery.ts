import { useQuery } from "@tanstack/react-query";
import { envConfig } from "../../module/constants/envConfig";
import {
    DashboardService,
    type DashboardHoldingsResult,
} from "../../module/common/DashboardService";

export const DASHBOARD_HOLDINGS_QK = ["dashboard", "holdings"] as const;

const dashboardService = new DashboardService(envConfig.API_URL);

export const useDashboardHoldingsQuery = () => {
    return useQuery<DashboardHoldingsResult>({
        queryKey: DASHBOARD_HOLDINGS_QK,
        queryFn: async () => {
            try {
                const {
                    data: { code, result, messages },
                } = await dashboardService.getHoldings();

                if (code !== "000000") {
                    throw new Error(messages?.[0] ?? "대시보드 조회 실패");
                }

                return result;
            } catch (error: unknown) {
                if (error instanceof Error) {
                    throw error;
                }
                throw new Error("대시보드 조회 중 알 수 없는 오류가 발생했습니다.");
            }
        },
    });
};