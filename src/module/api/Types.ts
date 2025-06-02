import type {AxiosResponse} from "axios";

export type APIVersion = 'v1' | 'v2' | string;

export type EndPointType = string;

export type HttpHeaders = Record<string, string>;

/**
 * 서버에서 공통적으로 반환하는 응답 구조
 * @template T - 응답 데이터(result)의 타입
 * @template U - BaseAPIService와의 호환성을 위한 두 번째 타입 인수 (실제 사용되지 않음)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ServerResponse<T, _U = unknown> extends AxiosResponse { // <-- U = unknown 추가
    /** 상태 코드: ex) '000000'은 성공 */
    data: {
        code: string;
        result: T;
        messages: string[];
    };
}