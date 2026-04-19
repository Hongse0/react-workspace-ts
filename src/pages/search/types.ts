export interface StockItem {
    id: number;
    stockName: string;
    stockCode: string;
    market: "KOSPI" | "KOSDAQ" | "ETF";
    companyName: string;
    price: number;
    changeRate: number;
    tags: string[];
    description: string;
}