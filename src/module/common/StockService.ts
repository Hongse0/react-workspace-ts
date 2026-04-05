import BaseAPIService from "../api/BaseAPIService";
import type { ServerResponse } from "../api/Types";

export interface BuyStockRequest {
    accountId: number;
    symbolCode: string;
    quantity: number;
    price: number;
    tradeDate: string;
    memo?: string;
}

export interface StockTradeResponse {
    message?: string;
}

export interface StockV1 {
    buyKorea(body: BuyStockRequest): Promise<ServerResponse<StockTradeResponse>>;
}

export class StockService extends BaseAPIService implements StockV1 {
    constructor(baseUrl: string) {
        super(baseUrl, "v1", "stocks");
    }

    /** 국내 주식 매수 */
    buyKorea(body: BuyStockRequest) {
        return this.post<StockTradeResponse, BuyStockRequest>("/korea/buy", body);
    }
}