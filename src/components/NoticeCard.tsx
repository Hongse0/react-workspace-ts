import { Card, CardContent, Typography } from '@mui/material';
import type {Notice} from "../module/common/NoticeService.ts";

const NoticeCard = ({ notice }: { notice: Notice }) => {
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h6">{notice.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {notice.createdAt?.split('T')[0] || '작성일 없음'}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default NoticeCard;
