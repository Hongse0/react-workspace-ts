export type AssetSnapshotMonthlyItem = {
    snapshotYm: string;
    cashBalance: string | number | null;
    stockEvaluationAmount: string | number | null;
    totalAssetValue: string | number | null;
    holdingCount: number | null;
};

export type AssetSnapshotWeeklyItem = {
    snapshotDate: string;
    cashBalance: string | number | null;
    stockEvaluationAmount: string | number | null;
    totalAssetValue: string | number | null;
    holdingCount: number | null;
};

export type AssetSnapshotHistoryResponse<
    T = AssetSnapshotMonthlyItem
> = {
    items: T[];
};