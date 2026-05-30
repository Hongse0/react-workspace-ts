import BaseAPIService from "../api/BaseAPIService";
import type { ServerResponse } from "../api/Types";
import type { AssetSnapshotHistoryResponse } from "../../services/snapshot/snapshot.types";
import type {AssetSnapshotWeeklyItem} from "../../services/snapshot/useWeeklyAssetSnapshotHistoryQuery.ts";

export interface SnapshotV1 {
    getMonthlyHistory(months?: number): Promise<ServerResponse<AssetSnapshotHistoryResponse>>;
    getMonthlyHistoryForTest(
        memberId: number,
        months?: number
    ): Promise<ServerResponse<AssetSnapshotHistoryResponse>>;
}

export class SnapshotService extends BaseAPIService implements SnapshotV1 {
    constructor(baseUrl: string) {
        super(baseUrl, "v1", "snapshot");
    }

    /** 월별 자산 변화 조회 */
    getMonthlyHistory(months: number = 12) {
        return this.get<AssetSnapshotHistoryResponse>("/monthly", {
            months,
        });
    }

    /** 월별 자산 변화 조회 - memberId 직접 지정 테스트용 */
    getMonthlyHistoryForTest(memberId: number, months: number = 12) {
        return this.get<AssetSnapshotHistoryResponse>("/monthly/test", {
            memberId,
            months,
        });
    }

    /**
     * 주간 자산 스냅샷 조회
     */
    selectWeeklyHistory(size: number) {
        return this.get<AssetSnapshotHistoryResponse<AssetSnapshotWeeklyItem>>(
            `/weekly?size=${size}`
        );
    }
}