import type { ReactNode } from 'react';
import TopBar from "./TopBar.tsx";
import MainLayout from "./MainLayout.tsx";

interface LayoutWrapperProps {
    children: ReactNode;
    headerTitle?: string;
    hideHeader?: boolean;
    showBackButton?: boolean;
}

const LayoutWrapper = ({
                           children,
                           headerTitle,
                           hideHeader = false,
                           showBackButton = false,
                       }: LayoutWrapperProps) => {
    return (
        <>
            {!hideHeader && <TopBar title={headerTitle} showBackButton={showBackButton} />}
            <MainLayout hasTopBar={!hideHeader}>{children}</MainLayout>
        </>
    );
};

export default LayoutWrapper;
