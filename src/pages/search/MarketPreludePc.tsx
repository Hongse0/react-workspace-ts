import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { InvestmentOpinion } from "../../module/common/StockSearchService";
import type { OpinionFilter } from "../../module/common/StockRankingService";
import { useStockRankingQuery } from "../../services/search/useStockRankingQuery";

const OPINION_TABS: { key: OpinionFilter; label: string }[] = [
    { key: "ALL", label: "전체" },
    { key: "STRONG", label: "매우 긍정" },
    { key: "POSITIVE", label: "긍정" },
    { key: "WATCH", label: "관심" },
    { key: "CAUTION", label: "주의" },
    { key: "AVOID", label: "회피" },
];

const OPINION_LABEL: Record<InvestmentOpinion, string> = {
    STRONG: "매우 긍정",
    POSITIVE: "긍정",
    WATCH: "관심",
    CAUTION: "주의",
    AVOID: "회피",
};

function formatCurrency(value: number): string {
    return `₩${Math.round(value).toLocaleString("ko-KR")}`;
}

function formatSignedRate(value: number): string {
    if (value > 0) return `+${value.toFixed(2)}%`;
    if (value < 0) return `${value.toFixed(2)}%`;
    return "0.00%";
}

function getStockColorClass(value: number): string {
    if (value > 0) return "is-rise";
    if (value < 0) return "is-fall";
    return "is-flat";
}

function getOpinionClass(op: InvestmentOpinion): string {
    return `opinion-tag opinion-${op.toLowerCase()}`;
}

export default function MarketPreludePc() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<OpinionFilter>("ALL");

    const { data, isLoading, isFetching, isError, error } =
        useStockRankingQuery(filter, 20);

    const items = data?.items ?? [];
    const counts = data?.counts;
    const total = data?.total ?? 0;

    const getTabCount = (key: OpinionFilter): number => {
        if (key === "ALL") return total;
        return counts?.[key] ?? 0;
    };

    const goToScorePage = (code: string) => {
        navigate(`/market/${encodeURIComponent(code)}/investment-score`);
    };

    return (
        <div className="market-prelude-pc">
            <section className="market-prelude-pc__section">
                <div className="market-prelude-pc__section-head">
                    <div>
                        <h2>투자점수 랭킹</h2>
                        <p>
                            {data?.basDt
                                ? `${data.basDt} 기준 투자점수 순위입니다.`
                                : "실시간 투자점수 기준으로 정렬된 종목입니다."}
                        </p>
                    </div>
                    <span className="market-prelude-pc__badge">
                        {isFetching ? "불러오는 중" : `${items.length}개`}
                    </span>
                </div>

                <div className="market-prelude-pc__tabs" role="tablist">
                    {OPINION_TABS.map((tab) => {
                        const active = tab.key === filter;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                role="tab"
                                aria-selected={active}
                                className={`market-prelude-pc__tab ${active ? "is-active" : ""}`}
                                onClick={() => setFilter(tab.key)}
                            >
                                {tab.label}
                                <span className="market-prelude-pc__tab-count">
                                    {getTabCount(tab.key)}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="market-prelude-pc__table">
                    <div className="market-prelude-pc__table-head">
                        <span>순위</span>
                        <span>종목</span>
                        <span>평가</span>
                        <span className="col-num">투자점수</span>
                        <span className="col-num">현재가</span>
                        <span className="col-num">등락률</span>
                    </div>

                    {isLoading ? (
                        <div className="market-prelude-pc__empty">
                            랭킹을 불러오는 중입니다...
                        </div>
                    ) : isError ? (
                        <div className="market-prelude-pc__empty">
                            {(error as Error)?.message ?? "랭킹을 불러오지 못했습니다."}
                        </div>
                    ) : items.length === 0 ? (
                        <div className="market-prelude-pc__empty">
                            해당 평가에 해당하는 종목이 없습니다.
                        </div>
                    ) : (
                        items.map((item) => (
                            <button
                                key={item.stockCode}
                                type="button"
                                className="market-prelude-pc__row"
                                onClick={() => goToScorePage(item.stockCode)}
                            >
                                <span className="market-prelude-pc__rank">{item.rank}</span>

                                <span className="market-prelude-pc__stock">
                                    <strong>{item.stockName}</strong>
                                    <em>{item.stockCode} · {item.market}</em>
                                </span>

                                <span className={getOpinionClass(item.opinion)}>
                                    {OPINION_LABEL[item.opinion]}
                                </span>

                                <span className="col-num market-prelude-pc__score">
                                    {item.investmentScore}
                                </span>

                                <span className="col-num">
                                    {formatCurrency(item.currentPrice)}
                                </span>

                                <span className={`col-num ${getStockColorClass(item.changeRate)}`}>
                                    {formatSignedRate(item.changeRate)}
                                </span>
                            </button>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
