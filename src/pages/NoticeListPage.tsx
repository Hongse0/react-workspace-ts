import {
    Box,
    Typography,
    CircularProgress,
    Card,
    CardContent,
} from '@mui/material';
import { useEffect } from 'react';
import { useNoticeListQuery } from '../services/cms/UseNoticeListQuery.ts';
import MainLayout from "../module/layouts/MainLayout.tsx";

const NoticeListPage = () => {
    const { data, fetchNextPage, hasNextPage, isLoading } = useNoticeListQuery({
        perPage: 10,
    });

    // 무한 스크롤
    useEffect(() => {
        const onScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 100 >=
                document.documentElement.offsetHeight
            ) {
                if (hasNextPage) fetchNextPage();
            }
        };

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [hasNextPage, fetchNextPage]);

    if (isLoading) {
        return (
            <MainLayout>
                <Box display="flex" justifyContent="center" mt={5}>
                    <CircularProgress />
                </Box>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Box px={2}>
                <Typography variant="h5" mb={3}>
                    공지사항
                </Typography>

                <Box display="flex" flexDirection="column" gap={2}>
                    {data?.pages.map((page, pageIndex) =>
                        page?.list.map((notice) => (
                            <Card key={`${pageIndex}-${notice.noticeId}`} variant="outlined">
                                <CardContent>
                                    <Typography variant="h6">{notice.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {notice.createdAt?.split('T')[0] || '작성일 없음'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </Box>
            </Box>
        </MainLayout>
    );
};

export default NoticeListPage;
