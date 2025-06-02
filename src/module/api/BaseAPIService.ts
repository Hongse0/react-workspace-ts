import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type {APIVersion, EndPointType, HttpHeaders, ServerResponse} from "./Types.ts";


/** @class BaseAPIService
 * @classDesc axios를 사용하여 api 통신하는 클래스, baseUrl, api version, endpoint, token을 주입받아 통신에 사용한다.
 * @param baseUrl {string} - base url, 프로젝트의 환경에 따라 주입한다.
 * @param apiVersion {APIVersion} - api 버전에 따라서 타입을 추가하고 호출 api에 따라 버전을 지정한다.
 * @param endPoint {EndPointType} - 호출하는 api 서비스의 컨트롤러 엔드포인트를 지정한다.
 * @param token {string} - 로그인이 필요한 기능들의 경우에는 로그인 후에 반환받은 토큰을 포함하여 전달하여야 한다.
 * */
class BaseAPIService {
    protected instance: AxiosInstance;
    constructor(baseUrl: string, apiVersion?: APIVersion, endPoint?: EndPointType, token?: string) {
        const baseURL = new URL([apiVersion, endPoint].join('/'), baseUrl).toString();
        this.instance = axios.create({
            baseURL,
            withCredentials: true,
        });
        this.instance.interceptors.request.use(config => {
            if (token) config.headers['Authorization'] = `Bearer ${token}`;
            return config;
        });
    }
    /** @method get
     * @param url {string} - 호출할 api의 완성된 url (searchParam 제외)
     * @param params {Record<string, unknown>} - url에 포함하여 요청됨.
     * */
    protected get<ResponseData>(url: string, params?: Record<string, unknown>) {
        return this.instance.get<ResponseData, ServerResponse<ResponseData, unknown>>(url, { params });
    }
    /** @method post */
    protected post<ResponseData, RequestData>(
        url: string,
        data?: RequestData,
        headers?: HttpHeaders,
    ) {
        return this.instance.post<ResponseData, ServerResponse<Response, RequestData>, RequestData>(
            url,
            data,
            {
                headers,
            },
        );
    }
    protected put<ResponseData, RequestData>(url: string, data?: RequestData, headers?: HttpHeaders) {
        return this.instance.put<Response, ServerResponse<ResponseData, RequestData>, RequestData>(
            url,
            data,
            {
                headers,
            },
        );
    }
    protected delete<ResponseData>(url: string, headers?: HttpHeaders) {
        return this.instance.delete<ResponseData, ServerResponse<ResponseData, unknown>, unknown>(url, {
            headers,
        });
    }
}
export default BaseAPIService;

