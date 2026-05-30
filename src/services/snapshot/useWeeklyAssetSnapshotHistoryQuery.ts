import { useQuery } from "@tanstack/react-query";
import { SnapshotService } from "../../module/common/SnapshotService";
import type { AssetSnapshotHistoryResponse } from "./snapshot.types";

const snapshotService = new SnapshotService(import.meta.env.VITE_API_URL);

export const WEEKLY_ASSET_SNAPSHOT_QK = ["weeklyAssetSnapshotHistory"];

export type AssetSnapshotWeeklyItem = {
    snapshotDate: string; // "2026-05-24"
    cashBalance?: string | number | null;
    stockEvaluationAmount?: string | number | null;
    totalAssetValue?: string | number | null;
    holdingCount?: number | null;
};

export const useWeeklyAssetSnapshotHistoryQuery = (
    size: number = 12,
    enabled: boolean = true
) => {
    return useQuery<AssetSnapshotHistoryResponse<AssetSnapshotWeeklyItem>>({
        queryKey: [...WEEKLY_ASSET_SNAPSHOT_QK, size],
        enabled,
        queryFn: async () => {
            const response = await snapshotService.selectWeeklyHistory(size);
            return response.data.result;
        },
        staleTime: 1000 * 60 * 5,
    });
};