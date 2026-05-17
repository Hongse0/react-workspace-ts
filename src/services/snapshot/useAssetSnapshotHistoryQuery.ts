import { useQuery } from "@tanstack/react-query";
import { SnapshotService } from "../../module/common/SnapshotService";
import type { AssetSnapshotHistoryResponse } from "./snapshot.types";

const snapshotService = new SnapshotService(import.meta.env.VITE_API_URL);

export const useAssetSnapshotHistoryQuery = (months: number = 12) => {
    return useQuery<AssetSnapshotHistoryResponse>({
        queryKey: ["assetSnapshotHistory", months],
        queryFn: async () => {
            const response = await snapshotService.getMonthlyHistory(months);
            return response.data.result;
        },
        staleTime: 1000 * 60 * 5,
    });
};