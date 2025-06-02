import BaseAPIService from '../api/BaseAPIService';
import type { ServerResponse } from '../api/Types';

export interface Notice {
    noticeId: number;
    title: string;
    content: string;
    createdAt: string | null;
    updatedAt: string | null;
    deleteYn: string | null;
}

export interface Pagination {
    page: number;
    perPage: number;
    totalPage: number;
    offset: number;
    total: number;
    sortField: string;
    sortType: string;
}

export interface NoticePage {
    list: Notice[];
    pagination: Pagination;
}

export interface NoticeV1 {
    getNoticeList(params: { page: number; perPage: number }): Promise<ServerResponse<NoticePage>>;
}

export class NoticeService extends BaseAPIService implements NoticeV1 {
    constructor(baseUrl: string, token?: string) {
        super(baseUrl, 'v1', 'cms', token); // 요청 경로 예: /v1/cms/notice
    }

    /** 공지사항 리스트 조회 */
    getNoticeList(params: { page: number; perPage: number }): Promise<ServerResponse<NoticePage>> {
        return this.get<NoticePage>('/notice', params);
    }
}
