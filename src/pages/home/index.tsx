import { useMemo, useState } from "react";
import "./style.css";
import { useDashboardHoldingsQuery } from "../../services/dashboard/useDashboardHoldingsQuery";
import { useAuthStore } from "../../store/auto/useAuthStore";

type TabType = "dashboard" | "trade";

function formatCurrency(value: number): string {
    return `₩${Math.round(value).toLocaleString("ko-KR")}`;
}

function formatSignedCurrency(value: number): string {
    if (value > 0) return `+${formatCurrency(value)}`;
    if (value < 0) return `-${formatCurrency(Math.abs(value))}`;
    return "₩0";
}

function formatSignedRate(value: number): string {
    if (value > 0) return `+${value.toFixed(2)}%`;
    if (value < 0) return `${value.toFixed(2)}%`;
    return "0.00%";
}

function formatDateTime(value: string): string {
    const date = new Date(value);
    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function getProfitClass(value: number): string {
    if (value > 0) return "is-profit";
    if (value < 0) return "is-loss";
    return "is-neutral";
}

export default function HomePage() {
    const [selectedTab, setSelectedTab] = useState<TabType>("dashboard");
    const nickname = useAuthStore((s) => s.nickname);

    const {
        data: dashboard,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useDashboardHoldingsQuery();

    const topSummary = useMemo(() => {
        if (!dashboard || dashboard.holdings.length === 0) {
            return {
                topGainer: null,
                topLoser: null,
            };
        }

        const sortedByProfit = [...dashboard.holdings].sort(
            (a, b) => b.profitRate - a.profitRate
        );

        return {
            topGainer: sortedByProfit[0],
            topLoser: sortedByProfit[sortedByProfit.length - 1],
        };
    }, [dashboard]);

    if (isLoading) {
        return <div className="home-page">로딩중</div>;
    }

    if (isError) {
        return (
            <div className="home-page">
                {(error as Error)?.message ?? "대시보드 조회 중 오류가 발생했습니다."}
            </div>
        );
    }

    if (!dashboard) {
        return <div className="home-page">데이터가 없습니다.</div>;
    }

    return (
        <div className="home-page">
            <section className="dashboard-hero">
                <div className="hero-greeting">
                    안녕하세요, {nickname ?? "회원"}님
                </div>
                <div className="hero-title-row">
                    <div className="hero-title">내 투자 대시보드</div>
                    <button
                        type="button"
                        className="hero-refresh-btn"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        aria-label="주가 새로고침"
                    >
                        <span className={`hero-refresh-icon ${isFetching ? "is-spinning" : ""}`}>
                            ↻
                        </span>
                        {isFetching ? "업데이트 중" : "새로고침"}
                    </button>
                </div>

                <div className="hero-amount">
                    {formatCurrency(dashboard.summary.totalEvaluationAmount)}
                </div>

                <div className="hero-summary-row">
                    <div
                        className={`hero-pill ${getProfitClass(
                            dashboard.summary.totalProfitLoss
                        )}`}
                    >
                        {formatSignedCurrency(dashboard.summary.totalProfitLoss)}
                    </div>
                    <div
                        className={`hero-rate ${getProfitClass(
                            dashboard.summary.totalProfitLoss
                        )}`}
                    >
                        수익률 {formatSignedRate(dashboard.summary.totalProfitRate)}
                    </div>
                </div>
            </section>

            <section className="home-tab-wrap">
                <button
                    type="button"
                    className={`home-tab ${selectedTab === "dashboard" ? "active" : ""}`}
                    onClick={() => setSelectedTab("dashboard")}
                >
                    대시보드
                </button>
                <button
                    type="button"
                    className={`home-tab ${selectedTab === "trade" ? "active" : ""}`}
                    onClick={() => setSelectedTab("trade")}
                >
                    거래기록
                </button>
            </section>

            {selectedTab === "dashboard" ? (
                <div className="home-content">
                    <section className="summary-grid">
                        <article className="summary-card">
                            <div className="summary-label">총 매수금액</div>
                            <div className="summary-value">
                                {formatCurrency(dashboard.summary.totalBuyAmount)}
                            </div>
                        </article>

                        <article className="summary-card">
                            <div className="summary-label">총 평가금액</div>
                            <div className="summary-value">
                                {formatCurrency(dashboard.summary.totalEvaluationAmount)}
                            </div>
                        </article>

                        <article className="summary-card">
                            <div className="summary-label">최고 수익 종목</div>
                            <div className="summary-stock-name">
                                {topSummary.topGainer?.stockName ?? "-"}
                            </div>
                            <div
                                className={`summary-stock-rate ${getProfitClass(
                                    topSummary.topGainer?.profitLoss ?? 0
                                )}`}
                            >
                                {formatSignedRate(topSummary.topGainer?.profitRate ?? 0)}
                            </div>
                        </article>

                        <article className="summary-card">
                            <div className="summary-label">최저 수익 종목</div>
                            <div className="summary-stock-name">
                                {topSummary.topLoser?.stockName ?? "-"}
                            </div>
                            <div
                                className={`summary-stock-rate ${getProfitClass(
                                    topSummary.topLoser?.profitLoss ?? 0
                                )}`}
                            >
                                {formatSignedRate(topSummary.topLoser?.profitRate ?? 0)}
                            </div>
                        </article>
                    </section>

                    <section className="section-block">
                        <div className="section-header">
                            <h2>보유 종목</h2>
                            <span>{dashboard.holdings.length}개</span>
                        </div>

                        <div className="holding-list">
                            {dashboard.holdings.map((item) => (
                                <article key={item.stockId} className="holding-card">
                                    <div className="holding-top">
                                        <div>
                                            <div className="holding-name-row">
                                                <h3>{item.stockName}</h3>
                                                <span className="market-badge">{item.market}</span>
                                            </div>
                                            <div className="holding-code">{item.stockCode}</div>
                                        </div>

                                        <div className="holding-price-box">
                                            <div className="holding-current-label">현재가</div>
                                            <div className="holding-current-price">
                                                {formatCurrency(item.currentPrice)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="holding-metrics">
                                        <div className="metric-item">
                                            <span>보유수량</span>
                                            <strong>{item.quantity.toLocaleString("ko-KR")}주</strong>
                                        </div>
                                        <div className="metric-item">
                                            <span>평균단가</span>
                                            <strong>{formatCurrency(item.avgBuyPrice)}</strong>
                                        </div>
                                        <div className="metric-item">
                                            <span>평가금액</span>
                                            <strong>{formatCurrency(item.evaluationAmount)}</strong>
                                        </div>
                                        <div className="metric-item">
                                            <span>수익금</span>
                                            <strong className={getProfitClass(item.profitLoss)}>
                                                {formatSignedCurrency(item.profitLoss)}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="holding-footer">
                                        <div className="holding-profit-rate-wrap">
                                            <span>수익률</span>
                                            <strong className={getProfitClass(item.profitLoss)}>
                                                {formatSignedRate(item.profitRate)}
                                            </strong>
                                        </div>

                                        <div className="holding-compare">
                                            매수가 대비{" "}
                                            {item.currentPrice > item.avgBuyPrice
                                                ? "상승"
                                                : item.currentPrice < item.avgBuyPrice
                                                    ? "하락"
                                                    : "보합"}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                </div>
            ) : (
                <div className="home-content">
                    <section className="section-block">
                        <div className="section-header">
                            <h2>최근 거래기록</h2>
                            <span>{dashboard.recentTrades.length}건</span>
                        </div>

                        <div className="trade-list">
                            {dashboard.recentTrades.map((trade) => {
                                const sideClass =
                                    trade.tradeType === "BUY" ? "is-buy" : "is-sell";

                                return (
                                    <article key={trade.tradeId} className="trade-card">
                                        <div className="trade-left-icon">
                                            <span className={sideClass}>
                                                {trade.tradeType === "BUY" ? "매수" : "매도"}
                                            </span>
                                        </div>

                                        <div className="trade-main">
                                            <div className="trade-top">
                                                <div>
                                                    <h3>
                                                        {trade.stockName}{" "}
                                                        {trade.tradeType === "BUY" ? "매수" : "매도"}
                                                    </h3>
                                                    <div className="trade-code">{trade.stockCode}</div>
                                                </div>

                                                <div className={`trade-total ${sideClass}`}>
                                                    {trade.tradeType === "BUY" ? "-" : "+"}
                                                    {formatCurrency(trade.totalAmount)}
                                                </div>
                                            </div>

                                            <div className="trade-meta">
                                                <div>{formatDateTime(trade.tradedAt)}</div>
                                                <div>
                                                    {trade.quantity.toLocaleString("ko-KR")}주 ×{" "}
                                                    {formatCurrency(trade.price)}
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}