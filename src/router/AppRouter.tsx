import { Routes, Route } from 'react-router-dom';
import NoticeListPage from '../pages/NoticeListPage';
import Home from '../pages/Home';
import LayoutWrapper from "../module/layouts/LayoutWrapper.tsx";
import AuctionPage from "../pages/auction";


const AppRouter = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <LayoutWrapper hideHeader>
                        <Home />
                    </LayoutWrapper>
                }
            />
            <Route
                path="/notice"
                element={
                    <LayoutWrapper headerTitle="공지사항" showBackButton>
                        <NoticeListPage />
                    </LayoutWrapper>
                }
            />
            <Route
                path="/auction"
                element={
                    <LayoutWrapper headerTitle="경매" showBackButton>
                        <AuctionPage />
                    </LayoutWrapper>
                }
            />
        </Routes>
    );
};

export default AppRouter;
