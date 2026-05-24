import { Box, Paper, Typography } from "@mui/material";
import type { StockItem } from "../../pages/search/types";

interface Props {
    stockList: StockItem[];
    selectedStockId: string | null;
    onSelectStock: (stock: StockItem) => void;
}

function formatPrice(value?: number | null) {
    if (!value) return "-";
    return value.toLocaleString("ko-KR");
}

function formatRate(value?: number | null) {
    const rate = Number(value ?? 0);

    if (rate > 0) return `+${rate.toFixed(2)}%`;
    if (rate < 0) return `${rate.toFixed(2)}%`;

    return "0.00%";
}

function getRateClass(value?: number | null) {
    const rate = Number(value ?? 0);

    if (rate > 0) return "is-rise";
    if (rate < 0) return "is-fall";

    return "is-flat";
}

export default function SearchResultSection({
                                                stockList,
                                                selectedStockId,
                                                onSelectStock,
                                            }: Props) {
    return (
        <Box className="search-result-section">
            <Box className="search-result-section__list">
                {stockList.length === 0 ? (
                    <Paper elevation={0} className="search-empty-card">
                        <Typography className="search-empty-card__title">
                            검색 결과가 없습니다
                        </Typography>
                        <Typography className="search-empty-card__desc">
                            종목명이나 종목코드를 입력하고 Enter를 눌러보세요
                        </Typography>
                    </Paper>
                ) : (
                    stockList.map((item) => {
                        const isSelected = item.stockCode === selectedStockId;
                        const rateClass = getRateClass(item.changeRate);

                        return (
                            <button
                                key={item.stockCode}
                                type="button"
                                className={`stock-result-row ${isSelected ? "is-selected" : ""}`}
                                onClick={() => onSelectStock(item)}
                            >
                                <div className="stock-result-row__left">
                                    <strong>{item.stockName}</strong>
                                    <span>
                                        {item.stockCode} · {item.market}
                                    </span>
                                </div>

                                <div className="stock-result-row__right">
                                    <strong>
                                        {formatPrice(item.price)}
                                    </strong>
                                    <span className={rateClass}>
                                        {formatRate(item.changeRate)}
                                    </span>
                                </div>
                            </button>
                        );
                    })
                )}
            </Box>
        </Box>
    );
}