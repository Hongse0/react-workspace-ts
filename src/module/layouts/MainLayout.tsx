import { Box } from '@mui/material';
import type { ReactNode } from 'react';

const MainLayout = ({ children, hasTopBar = true }: { children: ReactNode; hasTopBar?: boolean }) => {
    return (
        <Box
            sx={{
                paddingTop: hasTopBar ? '56px' : 0,
                paddingBottom: '64px',
                minHeight: '100vh',
                boxSizing: 'border-box',
            }}
        >
            {children}
        </Box>
    );
};

export default MainLayout;
