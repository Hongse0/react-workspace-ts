import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { InvestmentOpinion } from "../../module/common/StockSearchService";

type OpinionFilter = InvestmentOpinion | "ALL";

interface RankingItem {
    stockCode: string;
    stockName: string;
    market: string;
    corpName: string;
    investmentScore: number;
    opinion: InvestmentOpinion;
    currentPrice: number;
    changeRate: number;
}

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

const MOCK_RANKING: RankingItem[] = [
    { stockCode: "005930", stockName: "삼성전자",   market: "KOSPI",  corpName: "삼성전자주식회사",       investmentScore: 92, opinion: "STRONG",   currentPrice: 78900, changeRate: 1.42 },
    { stockCode: "000660", stockName: "SK하이닉스", market: "KOSPI",  corpName: "에스케이하이닉스",       investmentScore: 90, opinion: "STRONG",   currentPrice: 214500, changeRate: 2.11 },
    { stockCode: "035420", stockName: "NAVER",     market: "KOSPI",  corpName: "네이버",                investmentScore: 84, opinion: "POSITIVE", currentPrice: 213000, changeRate: 0.71 },
    { stockCode: "035720", stockName: "카카오",     market: "KOSPI",  corpName: "카카오",                investmentScore: 78, opinion: "POSITIVE", currentPrice: 52400, changeRate: -0.38 },
    { stockCode: "005380", stockName: "현대차",     market: "KOSPI",  corpName: "현대자동차",             investmentScore: 74, opinion: "POSITIVE", currentPrice: 249500, changeRate: 0.20 },
    { stockCode: "051910", stockName: "LG화학",    market: "KOSPI",  corpName: "엘지화학",              investmentScore: 66, opinion: "WATCH",    currentPrice: 385000, changeRate: -0.65 },
    { stockCode: "068270", stockName: "셀트리온",   market: "KOSPI",  corpName: "셀트리온",              investmentScore: 62, opinion: "WATCH",    currentPrice: 191000, changeRate: 1.05 },
    { stockCode: "096770", stockName: "SK이노베이션", market: "KOSPI", corpName: "에스케이이노베이션",   investmentScore: 55, opinion: "WATCH",    currentPrice: 118600, changeRate: -1.24 },
    { stockCode: "047810", stockName: "한국항공우주", market: "KOSPI", corpName: "한국항공우주산업",     investmentScore: 48, opinion: "CAUTION",  currentPrice: 54900, changeRate: -0.72 },
    { stockCode: "042660", stockName: "한화오션",   market: "KOSPI",  corpName: "한화오션",              investmentScore: 44, opinion: "CAUTION",  currentPrice: 32050, changeRate: -1.85 },
    { stockCode: "010140", stockName: "삼성중공업", market: "KOSPI",  corpName: "삼성중공업",            investmentScore: 33, opinion: "AVOID",    currentPrice: 9280,  changeRate: -2.34 },
    { stockCode: "003490", stockName: "대한항공",   market: "KOSPI",  corpName: "대한항공",              investmentScore: 29, opinion: "AVOID",    currentPrice: 22550, changeRate: -0.88 },
];

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

    const filtered = useMemo(() => {
        const base = filter === "ALL"
            ? MOCK_RANKING
            : MOCK_RANKING.filter((it) => it.opinion === filter);

        return [...base].sort((a, b) => b.investmentScore - a.investmentScore);
    }, [filter]);

    const counts = useMemo(() => {
        const map: Record<OpinionFilter, number> = {
            ALL: MOCK_RANKING.length,
            STRONG: 0, POSITIVE: 0, WATCH: 0, CAUTION: 0, AVOID: 0,
        };
        MOCK_RANKING.forEach((it) => { map[it.opinion] += 1; });
        return map;
    }, []);

    const goToScorePage = (code: string) => {
        navigate(`/market/${encodeURIComponent(code)}/investment-score`);
    };

    return (
        <div className="market-prelude-pc">
            <section className="market-prelude-pc__section">
                <div className="market-prelude-pc__section-head">
                    <div>
                        <h2>투자점수 랭킹</h2>
                        <p>실시간 투자점수 기준으로 정렬된 종목입니다. (샘플 데이터)</p>
                    </div>
                    <span className="market-prelude-pc__badge">
                        총 {filtered.length}개
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
                                    {counts[tab.key]}
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

                    {filtered.length === 0 ? (
                        <div className="market-prelude-pc__empty">
                            해당 평가에 해당하는 종목이 없습니다.
                        </div>
                    ) : (
                        filtered.map((item, idx) => (
                            <button
                                key={item.stockCode}
                                type="button"
                                className="market-prelude-pc__row"
                                onClick={() => goToScorePage(item.stockCode)}
                            >
                                <span className="market-prelude-pc__rank">{idx + 1}</span>

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
