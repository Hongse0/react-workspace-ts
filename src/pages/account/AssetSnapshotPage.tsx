import { useEffect, useMemo, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import SavingsRoundedIcon from "@mui/icons-material/SavingsRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ViewWeekRoundedIcon from "@mui/icons-material/ViewWeekRounded";
import { useNavigate } from "react-router-dom";

import "./style.css";

import { useAssetSnapshotHistoryQuery } from "../../services/snapshot/useAssetSnapshotHistoryQuery";
import { useWeeklyAssetSnapshotHistoryQuery } from "../../services/snapshot/useWeeklyAssetSnapshotHistoryQuery";

type SnapshotViewType = "MONTHLY" | "WEEKLY";

type AssetSnapshotMonthlyItem = {
    snapshotYm: string;
    cashBalance?: string | number | null;
    stockEvaluationAmount?: string | number | null;
    totalAssetValue?: string | number | null;
    holdingCount?: number | null;
};

type AssetSnapshotWeeklyItem = {
    snapshotDate: string;
    cashBalance?: string | number | null;
    stockEvaluationAmount?: string | number | null;
    totalAssetValue?: string | number | null;
    holdingCount?: number | null;
};

type AssetSnapshotViewItem = {
    periodKey: string;
    periodLabel: string;
    chartLabel: string;
    yearLabel: string;
    cashBalance?: string | number | null;
    stockEvaluationAmount?: string | number | null;
    totalAssetValue?: string | number | null;
    holdingCount?: number | null;
};

const toNumber = (v: string | number | null | undefined) => {
    if (v == null) return 0;
    if (typeof v === "number") return v;

    const n = Number(String(v).replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
};

const formatCurrency = (value: number) => {
    return `₩${Math.round(value).toLocaleString("ko-KR")}`;
};

const formatCompactCurrency = (value: number) => {
    if (value >= 100000000) {
        return `${(value / 100000000).toFixed(1)}억`;
    }

    if (value >= 10000) {
        return `${Math.round(value / 10000).toLocaleString("ko-KR")}만`;
    }

    return value.toLocaleString("ko-KR");
};

const formatPercent = (value: number) => {
    if (!Number.isFinite(value)) return "0.0%";

    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
};

const toMonthlyViewItem = (item: AssetSnapshotMonthlyItem): AssetSnapshotViewItem => {
    return {
        periodKey: item.snapshotYm,
        periodLabel: item.snapshotYm,
        chartLabel: item.snapshotYm.slice(5),
        yearLabel: `${item.snapshotYm.slice(2, 4)}년`,
        cashBalance: item.cashBalance,
        stockEvaluationAmount: item.stockEvaluationAmount,
        totalAssetValue: item.totalAssetValue,
        holdingCount: item.holdingCount,
    };
};

const toWeeklyViewItem = (item: AssetSnapshotWeeklyItem): AssetSnapshotViewItem => {
    const date = item.snapshotDate; // YYYY-MM-DD
    const month = date.slice(5, 7);
    const day = date.slice(8, 10);

    return {
        periodKey: date,
        periodLabel: date,
        chartLabel: `${month}/${day}`,
        yearLabel: `${date.slice(2, 4)}년`,
        cashBalance: item.cashBalance,
        stockEvaluationAmount: item.stockEvaluationAmount,
        totalAssetValue: item.totalAssetValue,
        holdingCount: item.holdingCount,
    };
};

export default function AssetSnapshotPage() {
    const [viewType, setViewType] = useState<SnapshotViewType>("MONTHLY");
    const [selectedPeriodKey, setSelectedPeriodKey] = useState<string | null>(null);

    const navigate = useNavigate();

    const {
        data: monthlySnapshotHistory,
        isLoading: isMonthlyLoading,
        isError: isMonthlyError,
    } = useAssetSnapshotHistoryQuery(12);

    const {
        data: weeklySnapshotHistory,
        isLoading: isWeeklyLoading,
        isError: isWeeklyError,
    } = useWeeklyAssetSnapshotHistoryQuery(12, viewType === "WEEKLY");

    useEffect(() => {
        setSelectedPeriodKey(null);
    }, [viewType]);

    const snapshotItems = useMemo<AssetSnapshotViewItem[]>(() => {
        if (viewType === "MONTHLY") {
            if (!monthlySnapshotHistory || !Array.isArray(monthlySnapshotHistory.items)) {
                return [];
            }

            return (monthlySnapshotHistory.items as AssetSnapshotMonthlyItem[]).map(
                toMonthlyViewItem
            );
        }

        if (!weeklySnapshotHistory || !Array.isArray(weeklySnapshotHistory.items)) {
            return [];
        }

        return (weeklySnapshotHistory.items as AssetSnapshotWeeklyItem[]).map(
            toWeeklyViewItem
        );
    }, [viewType, monthlySnapshotHistory, weeklySnapshotHistory]);

    const isLoading = viewType === "MONTHLY" ? isMonthlyLoading : isWeeklyLoading;
    const isError = viewType === "MONTHLY" ? isMonthlyError : isWeeklyError;

    const latestSnapshot = useMemo<AssetSnapshotViewItem | null>(() => {
        if (snapshotItems.length === 0) return null;
        return snapshotItems[snapshotItems.length - 1];
    }, [snapshotItems]);

    const selectedSnapshot = useMemo<AssetSnapshotViewItem | null>(() => {
        if (snapshotItems.length === 0) return null;

        if (!selectedPeriodKey) {
            return latestSnapshot;
        }

        return (
            snapshotItems.find((item) => item.periodKey === selectedPeriodKey) ??
            latestSnapshot
        );
    }, [snapshotItems, selectedPeriodKey, latestSnapshot]);

    const firstSnapshot = useMemo<AssetSnapshotViewItem | null>(() => {
        if (snapshotItems.length === 0) return null;
        return snapshotItems[0];
    }, [snapshotItems]);

    const assetGrowthAmount = useMemo(() => {
        if (!latestSnapshot || !firstSnapshot) return 0;

        return (
            toNumber(latestSnapshot.totalAssetValue) -
            toNumber(firstSnapshot.totalAssetValue)
        );
    }, [latestSnapshot, firstSnapshot]);

    const assetGrowthRate = useMemo(() => {
        if (!latestSnapshot || !firstSnapshot) return 0;

        const firstTotalAsset = toNumber(firstSnapshot.totalAssetValue);

        if (firstTotalAsset <= 0) return 0;

        return (assetGrowthAmount / firstTotalAsset) * 100;
    }, [latestSnapshot, firstSnapshot, assetGrowthAmount]);

    const maxSnapshotAsset = useMemo(() => {
        const max = snapshotItems.reduce((maxValue, item) => {
            return Math.max(maxValue, toNumber(item.totalAssetValue));
        }, 0);

        return max <= 0 ? 1 : max;
    }, [snapshotItems]);

    const periodTitle = viewType === "MONTHLY" ? "12개월 추이" : "최근 12주 추이";
    const periodDescription =
        viewType === "MONTHLY" ? "월별 총자산 기준" : "주별 총자산 기준";
    const emptyDescription =
        viewType === "MONTHLY"
            ? "스냅샷을 생성하면 월별 자산 변화를 확인할 수 있어요."
            : "스냅샷을 생성하면 주별 자산 변화를 확인할 수 있어요.";

    return (
        <Box className="asset-snapshot-page">
            <Container maxWidth="sm" disableGutters className="asset-snapshot-container">
                <header className="asset-snapshot-header">
                    <button
                        type="button"
                        className="asset-snapshot-header__back"
                        onClick={() => navigate(-1)}
                        aria-label="뒤로가기"
                    >
                        <ArrowBackIosNewRoundedIcon />
                    </button>

                    <div>
                        <Typography className="asset-snapshot-header__eyebrow">
                            자산 리포트
                        </Typography>
                        <Typography className="asset-snapshot-header__title">
                            자산 변화
                        </Typography>
                    </div>
                </header>

                <section className="asset-snapshot-tab-card">
                    <button
                        type="button"
                        className={viewType === "MONTHLY" ? "is-active" : ""}
                        onClick={() => setViewType("MONTHLY")}
                    >
                        <CalendarMonthRoundedIcon />
                        월별
                    </button>

                    <button
                        type="button"
                        className={viewType === "WEEKLY" ? "is-active" : ""}
                        onClick={() => setViewType("WEEKLY")}
                    >
                        <ViewWeekRoundedIcon />
                        주별
                    </button>
                </section>

                {isLoading ? (
                    <section className="asset-snapshot-state-card">
                        자산 변화를 불러오는 중...
                    </section>
                ) : isError ? (
                    <section className="asset-snapshot-state-card is-error">
                        자산 변화 데이터를 불러오지 못했습니다.
                    </section>
                ) : snapshotItems.length === 0 ? (
                    <section className="asset-snapshot-empty-card">
                        <ShowChartRoundedIcon />
                        <strong>아직 자산 스냅샷이 없습니다</strong>
                        <p>{emptyDescription}</p>
                    </section>
                ) : (
                    <>
                        <section className="asset-snapshot-hero-card">
                            <div className="asset-snapshot-hero-card__top">
                                <div>
                                    <span>최근 총자산</span>
                                    <strong>
                                        {formatCurrency(
                                            toNumber(latestSnapshot?.totalAssetValue)
                                        )}
                                    </strong>
                                    <p>{latestSnapshot?.periodLabel} 기준</p>
                                </div>

                                <div className="asset-snapshot-hero-card__icon">
                                    <TrendingUpRoundedIcon />
                                </div>
                            </div>

                            <div className="asset-snapshot-hero-card__summary">
                                <div>
                                    <span>기간 변화</span>
                                    <strong className={assetGrowthAmount >= 0 ? "is-up" : "is-down"}>
                                        {assetGrowthAmount >= 0 ? "+" : ""}
                                        {formatCurrency(assetGrowthAmount)}
                                    </strong>
                                    <p>{formatPercent(assetGrowthRate)}</p>
                                </div>

                                <div>
                                    <span>보유 종목</span>
                                    <strong>{latestSnapshot?.holdingCount ?? 0}개</strong>
                                    <p>최근 스냅샷 기준</p>
                                </div>
                            </div>
                        </section>

                        <section className="asset-snapshot-chart-card">
                            <div className="asset-snapshot-section-title">
                                <strong>{periodTitle}</strong>
                                <span>{periodDescription}</span>
                            </div>

                            <div className="asset-snapshot-chart">
                                {snapshotItems.map((item) => {
                                    const total = toNumber(item.totalAssetValue);
                                    const cash = toNumber(item.cashBalance);
                                    const stock = toNumber(item.stockEvaluationAmount);

                                    const height = Math.max((total / maxSnapshotAsset) * 100, 18);

                                    return (
                                        <div
                                            className={
                                                selectedSnapshot?.periodKey === item.periodKey
                                                    ? "asset-snapshot-chart__item is-selected"
                                                    : "asset-snapshot-chart__item"
                                            }
                                            key={item.periodKey}
                                            title={`${item.periodLabel} 총자산 ${formatCurrency(total)}`}
                                            onMouseEnter={() => setSelectedPeriodKey(item.periodKey)}
                                            onClick={() => setSelectedPeriodKey(item.periodKey)}
                                        >
                                            <div className="asset-snapshot-chart__value">
                                                {formatCompactCurrency(total)}
                                            </div>

                                            <div className="asset-snapshot-chart__bar-wrap">
                                                <div
                                                    className="asset-snapshot-chart__bar"
                                                    style={{ height: `${height}%` }}
                                                >
                                                    <div className="asset-snapshot-chart__tooltip">
                                                        <strong>{item.periodLabel}</strong>
                                                        <span>총자산 {formatCurrency(total)}</span>
                                                        <span>현금 {formatCurrency(cash)}</span>
                                                        <span>주식 {formatCurrency(stock)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <p>{item.chartLabel}</p>
                                            <small>{item.yearLabel}</small>
                                        </div>
                                    );
                                })}
                            </div>

                            {selectedSnapshot && (
                                <div className="asset-snapshot-selected-card">
                                    <div>
                                        <span>선택한 기간</span>
                                        <strong>{selectedSnapshot.periodLabel}</strong>
                                    </div>

                                    <div>
                                        <span>총자산</span>
                                        <strong>
                                            {formatCurrency(
                                                toNumber(selectedSnapshot.totalAssetValue)
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>현금</span>
                                        <strong>
                                            {formatCurrency(
                                                toNumber(selectedSnapshot.cashBalance)
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>주식 평가</span>
                                        <strong>
                                            {formatCurrency(
                                                toNumber(
                                                    selectedSnapshot.stockEvaluationAmount
                                                )
                                            )}
                                        </strong>
                                    </div>
                                </div>
                            )}
                        </section>

                        <section className="asset-snapshot-breakdown-card">
                            <div className="asset-snapshot-section-title">
                                <strong>최근 자산 구성</strong>
                                <span>{latestSnapshot?.periodLabel} 기준</span>
                            </div>

                            <div className="asset-snapshot-breakdown-list">
                                <div>
                                    <span className="asset-snapshot-breakdown-list__icon is-cash">
                                        <SavingsRoundedIcon />
                                    </span>
                                    <div>
                                        <span>현금</span>
                                        <strong>
                                            {formatCurrency(
                                                toNumber(latestSnapshot?.cashBalance)
                                            )}
                                        </strong>
                                    </div>
                                </div>

                                <div>
                                    <span className="asset-snapshot-breakdown-list__icon is-stock">
                                        <ShowChartRoundedIcon />
                                    </span>
                                    <div>
                                        <span>주식 평가</span>
                                        <strong>
                                            {formatCurrency(
                                                toNumber(
                                                    latestSnapshot?.stockEvaluationAmount
                                                )
                                            )}
                                        </strong>
                                    </div>
                                </div>

                                <div>
                                    <span className="asset-snapshot-breakdown-list__icon is-total">
                                        <AccountBalanceWalletRoundedIcon />
                                    </span>
                                    <div>
                                        <span>총자산</span>
                                        <strong>
                                            {formatCurrency(
                                                toNumber(latestSnapshot?.totalAssetValue)
                                            )}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </Container>
        </Box>
    );
}