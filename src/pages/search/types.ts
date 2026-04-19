export interface StockItem {
    id: string;
    stockName: string;
    stockCode: string;
    market: string;
    companyName: string;
    price?: number;
    changeRate?: number;
    tags?: string[];
    description?: string;
}