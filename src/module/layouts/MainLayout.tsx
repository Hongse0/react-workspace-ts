// MainLayout.tsx
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import BottomTabBar from './BottomTabBar';

export default function MainLayout() {
    return (
        <>
            <Box sx={{ pb: 10, minHeight: '100dvh' }}>
                <Outlet />
            </Box>
            <BottomTabBar />
        </>
    );
}
