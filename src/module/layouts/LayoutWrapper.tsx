import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import TopBar from "./TopBar.tsx";
import BottomTabBar from "./BottomTabBar.tsx";

interface LayoutWrapperProps {
    children: ReactNode;
    headerTitle?: string;
    hideHeader?: boolean;
    showBackButton?: boolean;
}
//ㄷ

const LayoutWrapper = ({
                           children,
                           headerTitle,
                           hideHeader = false,
                           showBackButton = false,
                       }: LayoutWrapperProps) => {
    return (
        <>
            {!hideHeader && <TopBar title={headerTitle} showBackButton={showBackButton} />}
            <Box sx={{ pb: 10, minHeight: '100dvh' }}>
                {children}
            </Box>
            <BottomTabBar />
        </>
    );
};

export default LayoutWrapper;