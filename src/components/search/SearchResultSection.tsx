import { Box, Chip, Paper, Typography } from "@mui/material";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import type { StockItem } from "../../pages/search/types"

interface Props {
    stockList: StockItem[];
    selectedStockId: number | null;
    onSelectStock: (stock: StockItem) => void;
}

export default function SearchResultSection({
                                                stockList,
                                                selectedStockId,
                                                onSelectStock,
                                            }: Props) {
    return (
        <Box className="search-result-section">
            <Box className="search-result-section__header">
                <Typography className="search-result-section__title">
                    검색 결과
                </Typography>
                <Typography className="search-result-section__count">
                    총 {stockList.length}개
                </Typography>
            </Box>

            <Box className="search-result-section__list">
                {stockList.length === 0 ? (
                    <Paper elevation={0} className="search-empty-card">
                        <Typography className="search-empty-card__title">
                            검색 결과가 없습니다
                        </Typography>
                        <Typography className="search-empty-card__desc">
                            종목명이나 종목코드를 다시 입력해보세요
                        </Typography>
                    </Paper>
                ) : (
                    stockList.map((item) => {
                        const isSelected = item.id === selectedStockId;

                        return (
                            <Paper
                                key={item.id}
                                elevation={0}
                                className={`stock-result-card ${isSelected ? "is-selected" : ""}`}
                                onClick={() => onSelectStock(item)}
                            >
                                <Box className="stock-result-card__top">
                                    <Box className="stock-result-card__left">
                                        <Typography className="stock-result-card__name">
                                            {item.stockName}
                                        </Typography>

                                        <Box className="stock-result-card__meta">
                                            <Chip
                                                label={item.market}
                                                size="small"
                                                className="stock-result-card__market"
                                            />
                                            <Typography className="stock-result-card__code">
                                                {item.stockCode}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box className="stock-result-card__price-wrap">
                                        <Typography className="stock-result-card__price">
                                            ₩{item.price.toLocaleString("ko-KR")}
                                        </Typography>
                                        <Typography
                                            className={`stock-result-card__change ${
                                                item.changeRate >= 0 ? "up" : "down"
                                            }`}
                                        >
                                            <TrendingUpRoundedIcon sx={{ fontSize: 14 }} />
                                            {item.changeRate > 0 ? "+" : ""}
                                            {item.changeRate}%
                                        </Typography>
                                    </Box>
                                </Box>

                                <Typography className="stock-result-card__company">
                                    {item.companyName}
                                </Typography>

                                <Typography className="stock-result-card__description">
                                    {item.description}
                                </Typography>

                                <Box className="stock-result-card__tag-wrap">
                                    {item.tags.map((tag) => (
                                        <span key={tag} className="stock-result-card__tag">
                                            #{tag}
                                        </span>
                                    ))}
                                </Box>
                            </Paper>
                        );
                    })
                )}
            </Box>
        </Box>
    );
}