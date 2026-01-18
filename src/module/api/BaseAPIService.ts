import axios from "axios";
import type { AxiosInstance } from "axios";
import type { APIVersion, EndPointType, HttpHeaders, ServerResponse } from "./Types.ts";

class BaseAPIService {
    protected instance: AxiosInstance;

    constructor(baseUrl: string, apiVersion?: APIVersion, endPoint?: EndPointType) {
        const baseURL = new URL([apiVersion, endPoint].filter(Boolean).join("/"), baseUrl).toString();

        this.instance = axios.create({
            baseURL,
            withCredentials: true,
        });

        this.instance.interceptors.request.use((config) => {
            const token = BaseAPIService.getToken();
            if (token) {
                config.headers = config.headers ?? {};
                config.headers["Authorization"] = `Bearer ${token}`;
            }
            return config;
        });
    }

    static getToken(): string | null {
        try {
            const raw = localStorage.getItem("auth-store");
            if (!raw) return null;

            const parsed = JSON.parse(raw) as {
                state?: { accessToken?: string };
            };

            return parsed?.state?.accessToken ?? null;
        } catch {
            return null;
        }
    }

    protected get<ResponseData>(url: string, params?: Record<string, unknown>) {
        return this.instance.get<ResponseData, ServerResponse<ResponseData, unknown>>(url, { params });
    }

    protected post<ResponseData, RequestData>(url: string, data?: RequestData, headers?: HttpHeaders) {
        return this.instance.post<ResponseData, ServerResponse<ResponseData, RequestData>, RequestData>(
            url,
            data,
            { headers }
        );
    }

    protected put<ResponseData, RequestData>(url: string, data?: RequestData, headers?: HttpHeaders) {
        return this.instance.put<ResponseData, ServerResponse<ResponseData, RequestData>, RequestData>(
            url,
            data,
            { headers }
        );
    }

    protected delete<ResponseData>(url: string, headers?: HttpHeaders) {
        return this.instance.delete<ResponseData, ServerResponse<ResponseData, unknown>, unknown>(url, {
            headers,
        });
    }
}

export default BaseAPIService;
