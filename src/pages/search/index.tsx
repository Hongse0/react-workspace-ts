import { Box, Container, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import type { StockItem } from "./types";
import "./style.css";
import SearchResultSection from "../../components/search/SearchResultSection.tsx";
import SearchHeaderSection from "../../components/search/SearchHeaderSection.tsx";
import { useDebounce } from "../../services/search/useDebounce";
import { useStockSearchQuery } from "../../services/search/useStockSearchQuery";
import type { StockSearchItem } from "../../module/common/StockSearchService";

const TRENDING_KEYWORDS = ["삼성전자", "SK하이닉스", "ETF", "반도체", "2차전지"];
const RECENT_KEYWORDS = ["NAVER", "카카오", "TIGER"];

export const toStockUiItem = (item: StockSearchItem): StockItem => ({
    id: item.srtnCd,
    stockName: item.itmsNm ?? "-",
    stockCode: item.srtnCd ?? "-",
    market: item.mrktCtg ?? "-",
    companyName: item.corpNm ?? "-",
    price: 0,
    changeRate: 0,
    tags: [],
    description: item.corpNm ?? "",
});

export default function StockSearchPage() {
    const [keyword, setKeyword] = useState("");
    const [selectedStockCode, setSelectedStockCode] = useState<string | null>(null);

    const debouncedKeyword = useDebounce(keyword, 300);
    const { data, isFetching } = useStockSearchQuery(debouncedKeyword, 20);

    const stockList = useMemo(() => {
        return (data?.items ?? []).map(toStockUiItem);
    }, [data]);

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
                                        {keyword.trim().length === 0
                                            ? "검색어를 입력해보세요"
                                            : isFetching
                                                ? "검색 중..."
                                                : `${stockList.length}개 종목`}
                                    </Typography>
                                </Box>

                                <Box className="stock-search-page__hero-icon">
                                    <SearchRoundedIcon />
                                </Box>
                            </Box>

                            <Box className="stock-search-page__hero-stats">
                                <Box className="stock-search-page__hero-stat">
                                    <TrendingUpRoundedIcon fontSize="small" />
                                    <span>인기 검색어 제공 예정</span>
                                </Box>
                                <Box className="stock-search-page__hero-stat">
                                    <QueryStatsRoundedIcon fontSize="small" />
                                    <span>엘라스틱 검색 연동 완료</span>
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
                        stockList={stockList}
                        selectedStockId={selectedStock?.id ?? null}
                        onSelectStock={(stock) => setSelectedStockCode(String(stock.stockCode))}
                    />
                </Container>
            </Box>
        </Box>
    );
}