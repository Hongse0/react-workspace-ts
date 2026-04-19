import { Box, Container, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import type { StockItem } from "./types";
import "./style.css";
import SearchResultSection from "../../components/search/SearchResultSection.tsx";
import SearchHeaderSection from "../../components/search/SearchHeaderSection.tsx";

const MOCK_STOCK_LIST: StockItem[] = [
    {
        id: 1,
        stockName: "삼성전자",
        stockCode: "005930",
        market: "KOSPI",
        companyName: "삼성전자 주식회사",
        price: 84500,
        changeRate: 1.84,
        tags: ["반도체", "대형주", "전자"],
        description: "국내 대표 반도체·전자 기업",
    },
    {
        id: 2,
        stockName: "SK하이닉스",
        stockCode: "000660",
        market: "KOSPI",
        companyName: "에스케이하이닉스",
        price: 219000,
        changeRate: 3.12,
        tags: ["HBM", "AI", "메모리"],
        description: "메모리 반도체 중심 기업",
    },
    {
        id: 3,
        stockName: "NAVER",
        stockCode: "035420",
        market: "KOSPI",
        companyName: "네이버",
        price: 192300,
        changeRate: -0.45,
        tags: ["플랫폼", "인터넷"],
        description: "플랫폼 및 커머스 중심 기업",
    },
    {
        id: 4,
        stockName: "카카오",
        stockCode: "035720",
        market: "KOSPI",
        companyName: "카카오",
        price: 41250,
        changeRate: 0.66,
        tags: ["모바일", "플랫폼"],
        description: "모바일 플랫폼 기반 기업",
    },
    {
        id: 5,
        stockName: "TIGER 미국S&P500",
        stockCode: "360750",
        market: "ETF",
        companyName: "미래에셋자산운용",
        price: 18420,
        changeRate: 0.21,
        tags: ["ETF", "미국", "지수"],
        description: "미국 대표 지수 추종 ETF",
    },
];

const TRENDING_KEYWORDS = ["삼성전자", "SK하이닉스", "ETF", "반도체", "2차전지"];
const RECENT_KEYWORDS = ["NAVER", "카카오", "TIGER"];

export default function StockSearchPage() {
    const [keyword, setKeyword] = useState("");
    const [selectedStockId, setSelectedStockId] = useState<number | null>(1);

    const filteredStockList = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();

        if (!normalizedKeyword) {
            return MOCK_STOCK_LIST;
        }

        return MOCK_STOCK_LIST.filter((item) => {
            const text = [
                item.stockName,
                item.stockCode,
                item.companyName,
                item.market,
                ...item.tags,
            ]
                .join(" ")
                .toLowerCase();

            return text.includes(normalizedKeyword);
        });
    }, [keyword]);

    const selectedStock =
        filteredStockList.find((item) => item.id === selectedStockId) ?? filteredStockList[0] ?? null;

    return (
        <Box className="stock-search-page">
            <Box className="stock-search-page__header">
                <Box className="stock-search-page__header-glow" />

                <Container maxWidth="sm" disableGutters>
                    <Stack spacing={1.5}>
                        <Typography className="stock-search-page__title">
                            주식 종목 검색
                        </Typography>

                        <Typography className="stock-search-page__subtitle">
                            종목명, 종목코드로 원하는 주식을 빠르게 찾아보세요
                        </Typography>

                        <Box className="stock-search-page__hero-card">
                            <Box className="stock-search-page__hero-top">
                                <Box>
                                    <Typography className="stock-search-page__hero-label">
                                        오늘의 검색
                                    </Typography>
                                    <Typography className="stock-search-page__hero-value">
                                        {filteredStockList.length}개 종목
                                    </Typography>
                                </Box>

                                <Box className="stock-search-page__hero-icon">
                                    <SearchRoundedIcon />
                                </Box>
                            </Box>

                            <Box className="stock-search-page__hero-stats">
                                <Box className="stock-search-page__hero-stat">
                                    <TrendingUpRoundedIcon fontSize="small" />
                                    <span>인기 검색어 제공</span>
                                </Box>
                                <Box className="stock-search-page__hero-stat">
                                    <QueryStatsRoundedIcon fontSize="small" />
                                    <span>엘라스틱 검색 연동 예정</span>
                                </Box>
                            </Box>
                        </Box>
                    </Stack>
                </Container>
            </Box>

            <Box className="stock-search-page__body">
                <Container maxWidth="sm">
                    <SearchHeaderSection
                        keyword={keyword}
                        trendingKeywords={TRENDING_KEYWORDS}
                        recentKeywords={RECENT_KEYWORDS}
                        onChangeKeyword={setKeyword}
                        onClickKeyword={setKeyword}
                    />

                    <SearchResultSection
                        stockList={filteredStockList}
                        selectedStockId={selectedStock?.id ?? null}
                        onSelectStock={(stock) => setSelectedStockId(stock.id)}
                    />
                </Container>
            </Box>
        </Box>
    );
}