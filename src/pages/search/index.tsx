import { Box, Container, Typography } from "@mui/material";
import {type FormEvent, useEffect, useMemo, useState } from "react";
import type { StockItem } from "./types";
import "./style.css";
import SearchResultSection from "../../components/search/SearchResultSection.tsx";
import SearchHeaderSection from "../../components/search/SearchHeaderSection.tsx";
import { useStockSearchQuery } from "../../services/search/useStockSearchQuery";
import type { StockSearchItem } from "../../module/common/StockSearchService";
import {useNavigate} from "react-router-dom";

const TRENDING_KEYWORDS = ["삼성전자", "SK하이닉스", "ETF", "반도체", "2차전지"];
const RECENT_KEYWORDS = ["NAVER", "카카오", "TIGER"];

type StockUiItem = StockItem & {
    previousChange: number;
    previousClose: number;
    investmentScore: number;
    scoreLabel: string;
    baseDate: string | null;
};

function formatCurrency(value: number): string {
    if (!value) return "-";
    return `₩${Math.round(value).toLocaleString("ko-KR")}`;
}

function formatSignedCurrency(value: number): string {
    if (value > 0) return `+${Math.round(value).toLocaleString("ko-KR")}`;
    if (value < 0) return `${Math.round(value).toLocaleString("ko-KR")}`;
    return "0";
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

function calculateInvestmentScore(item: StockSearchItem): number {
    const activeScore = item.activeYn === "Y" ? 35 : 20;
    const marketScore = item.mrktCtg === "KOSPI" ? 25 : item.mrktCtg === "KOSDAQ" ? 20 : 15;

    const rate = Number(item.fltRt ?? 0);

    const momentumScore =
        rate >= 5 ? 25 :
            rate >= 2 ? 20 :
                rate >= 0 ? 15 :
                    rate >= -3 ? 10 :
                        6;

    const dataScore = item.basDt ? 15 : 8;

    return Math.min(100, activeScore + marketScore + momentumScore + dataScore);
}

function getScoreLabel(score: number): string {
    if (score >= 85) return "관심 높음";
    if (score >= 70) return "양호";
    if (score >= 55) return "보통";
    return "주의";
}

export const toStockUiItem = (item: StockSearchItem): StockUiItem => {
    const currentPrice = Number(item.currentPrice ?? 0);
    const previousChange = Number(item.vs ?? 0);
    const changeRate = Number(item.fltRt ?? 0);
    const investmentScore = calculateInvestmentScore(item);

    return {
        id: item.srtnCd,
        stockName: item.itmsNm ?? "-",
        stockCode: item.srtnCd ?? "-",
        market: item.mrktCtg ?? "-",
        companyName: item.corpNm ?? "-",
        price: currentPrice,
        previousChange,
        previousClose: currentPrice ? currentPrice - previousChange : 0,
        changeRate,
        investmentScore,
        scoreLabel: getScoreLabel(investmentScore),
        baseDate: item.basDt ?? null,
        tags: [item.mrktCtg ?? "국내주식"].filter(Boolean),
        description: item.corpNm ?? "",
    };
};

function normalizeText(value?: string | null) {
    return (value ?? "").replace(/\s/g, "").toLowerCase();
}

function rankStock(item: StockUiItem, keyword: string) {
    const target = normalizeText(keyword);
    const name = normalizeText(item.stockName);
    const code = normalizeText(item.stockCode);
    const company = normalizeText(item.companyName);

    if (!target) return 999;

    if (code === target) return 0;
    if (name === target) return 1;
    if (name.startsWith(target)) return 2;
    if (code.startsWith(target)) return 3;
    if (company.startsWith(target)) return 4;
    if (name.includes(target)) return 5;
    if (company.includes(target)) return 6;
    if (code.includes(target)) return 7;

    return 99;
}

function refineStockList(items: StockSearchItem[], keyword: string): StockUiItem[] {
    const seen = new Set<string>();

    return items
        .map(toStockUiItem)
        .filter((item) => item.stockCode && item.stockCode !== "-")
        .filter((item) => {
            if (seen.has(item.stockCode)) return false;
            seen.add(item.stockCode);
            return true;
        })
        .sort((a, b) => rankStock(a, keyword) - rankStock(b, keyword))
        .slice(0, 10);
}

export default function StockSearchPage() {
    const [keyword, setKeyword] = useState("");
    const [submittedKeyword, setSubmittedKeyword] = useState("");
    const [selectedStockCode, setSelectedStockCode] = useState<string | null>(null);

    const searchedKeyword = submittedKeyword.trim();

    const { data, isFetching } = useStockSearchQuery(searchedKeyword, 20);

    const stockList = useMemo(() => {
        if (!searchedKeyword) return [];
        return refineStockList(data?.items ?? [], searchedKeyword);
    }, [data, searchedKeyword]);

    const relatedKeywords = useMemo(() => {
        if (!searchedKeyword) {
            return [...RECENT_KEYWORDS, ...TRENDING_KEYWORDS].slice(0, 5);
        }

        return stockList
            .map((item) => item.stockName)
            .filter((name) => name && name !== "-")
            .slice(0, 5);
    }, [searchedKeyword, stockList]);

    useEffect(() => {
        if (!stockList.length) {
            setSelectedStockCode(null);
            return;
        }

        setSelectedStockCode((prev) => {
            if (prev && stockList.some((item) => item.stockCode === prev)) {
                return prev;
            }

            return stockList[0].stockCode;
        });
    }, [stockList]);

    const selectedStock =
        stockList.find((item) => item.stockCode === selectedStockCode) ?? stockList[0] ?? null;

    const hasSubmittedKeyword = searchedKeyword.length > 0;

    const submitSearch = (nextKeyword?: string) => {
        const value = (nextKeyword ?? keyword).trim();

        if (!value) {
            setSubmittedKeyword("");
            setSelectedStockCode(null);
            return;
        }

        setKeyword(value);
        setSubmittedKeyword(value);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        submitSearch();
    };

    const handleClickKeyword = (value: string) => {
        submitSearch(value);
    };

    const navigate = useNavigate();

    return (
        <Box className="stock-search-page">
            <Container maxWidth="sm" disableGutters className="stock-search-container">
                <header className="stock-search-header">
                    <div>
                        <Typography className="stock-search-header__eyebrow">
                            국내 주식
                        </Typography>
                        <Typography className="stock-search-header__title">
                            종목 검색
                        </Typography>
                    </div>

                    <div className="stock-search-header__status">
                        {isFetching ? "검색 중" : `${stockList.length}개`}
                    </div>
                </header>

                <section className="stock-search-panel">
                    <form onSubmit={handleSubmit} className="stock-search-input-form">
                        <SearchHeaderSection
                            keyword={keyword}
                            trendingKeywords={[]}
                            recentKeywords={[]}
                            onChangeKeyword={setKeyword}
                            onClickKeyword={handleClickKeyword}
                        />
                    </form>

                    <div className="related-keyword-area">
                        <div className="related-keyword-area__title">
                            {hasSubmittedKeyword ? "연관검색어" : "추천검색어"}
                        </div>

                        <div className="related-keyword-area__list">
                            {relatedKeywords.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    className="related-keyword-chip"
                                    onClick={() => handleClickKeyword(item)}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {selectedStock && (
                    <section
                        className="selected-stock-card"
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                            if (!selectedStock) return;
                            navigate(`/market/${encodeURIComponent(selectedStock.stockCode)}/investment-score`);
                        }}
                        onKeyDown={(event) => {
                            if (!selectedStock) return;

                            if (event.key === "Enter" || event.key === " ") {
                                navigate(`/market/${encodeURIComponent(selectedStock.stockCode)}/investment-score`);
                            }
                        }}
                    >
                        <div className="selected-stock-card__top">
                            <div className="selected-stock-card__title-box">
                                <div className="selected-stock-card__name-row">
                                    <strong>{selectedStock.stockName}</strong>
                                    <span>{selectedStock.market}</span>
                                </div>
                                <p>
                                    {selectedStock.stockCode} · {selectedStock.companyName}
                                </p>
                            </div>

                            <div className="selected-stock-card__score">
                                <span>투자점수</span>
                                <strong>{selectedStock.investmentScore}</strong>
                            </div>
                        </div>

                        <div className="selected-stock-card__price-row">
                            <div>
                                <span className="selected-stock-card__label">현재가</span>
                                <strong className="selected-stock-card__price">
                                    {formatCurrency(selectedStock.price ?? 0)}
                                </strong>
                            </div>

                            <div className="selected-stock-card__change">
                                <span className="selected-stock-card__label">전일대비</span>
                                <strong className={getStockColorClass(selectedStock.previousChange ?? 0)}>
                                    {formatSignedCurrency(selectedStock.previousChange ?? 0)}
                                </strong>
                                <em className={getStockColorClass(selectedStock.changeRate ?? 0)}>
                                    {formatSignedRate(selectedStock.changeRate ?? 0)}
                                </em>
                            </div>
                        </div>

                        <div className="selected-stock-card__meta">
                            <div>
                                <span>전일종가</span>
                                <strong>{formatCurrency(selectedStock.previousClose)}</strong>
                            </div>
                            <div>
                                <span>기준일</span>
                                <strong>{selectedStock.baseDate ?? "-"}</strong>
                            </div>
                            <div>
                                <span>평가</span>
                                <strong>{selectedStock.scoreLabel}</strong>
                            </div>
                        </div>
                    </section>
                )}

                <section className="stock-result-panel">
                    <div className="stock-result-panel__header">
                        <div>
                            <strong>검색 결과</strong>
                            <p>
                                {hasSubmittedKeyword
                                    ? `${stockList.length}개 종목이 검색되었습니다`
                                    : "종목명이나 종목코드를 입력 후 Enter를 눌러보세요"}
                            </p>
                        </div>
                    </div>

                    <SearchResultSection
                        stockList={stockList}
                        selectedStockId={selectedStock?.stockCode ?? null}
                        onSelectStock={(stock) => {
                            navigate(`/market/${encodeURIComponent(String(stock.stockCode))}/investment-score`);
                        }}
                    />
                </section>
            </Container>
        </Box>
    );
}