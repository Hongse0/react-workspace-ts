import {useInfiniteQuery} from '@tanstack/react-query';
import {NoticeService} from '../../module/common/NoticeService';
import {envConfig} from '../../module/constants/envConfig';

interface UseNoticeListQueryParams {
    perPage: number;
}

const noticeService = new NoticeService(envConfig.API_URL);

export const useNoticeListQuery = ({perPage} : UseNoticeListQueryParams) => {
    return useInfiniteQuery({
        queryKey: ['noticeList', perPage],
        queryFn: async ({pageParam}) => {
            const {
                data: {code, result, messages},
            } = await noticeService.getNoticeList({page: pageParam, perPage});

            if (code != '000000') {
                console.error(`${code}: ${messages[0]}`);
                return;
            }

            return result;
        },
        initialPageParam: 1,
        getNextPageParam: lastPage => {
            if (!lastPage) return;
            if (lastPage.pagination.page === lastPage.pagination.totalPage) return;
            return lastPage.pagination.page + 1;
        },
    });
};
