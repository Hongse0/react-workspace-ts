import BaseAPIService from "../api/BaseAPIService";
import type { ServerResponse } from "../api/Types";

export interface BuyStockRequest {
    accountId: number;
    symbolCode: string;
    quantity: number;
    price: number;
    fee?: number;
    tax?: number;
    tradeDateTime: string;
    memo?: string;
}

export interface SellStockRequest {
    accountId: number;
    symbolCode: string;
    quantity: number;
    price: number;
    fee?: number;
    tax?: number;
    tradeDateTime: string;
    memo?: string;
}

export interface TradeV1 {
    buyKorea(body: BuyStockRequest): Promise<ServerResponse<string>>;
    sellKorea(body: SellStockRequest): Promise<ServerResponse<string>>;
}

export class TradeService extends BaseAPIService implements TradeV1 {
    constructor(baseUrl: string) {
        super(baseUrl, "v1", "stocks");
    }

    /** 국내 주식 매수 */
    buyKorea(body: BuyStockRequest) {
        return this.post<string, BuyStockRequest>("/korea/buy", body);
    }

    /** 국내 주식 매도 */
    sellKorea(body: SellStockRequest) {
        return this.post<string, SellStockRequest>("/korea/sell", body);
    }
}