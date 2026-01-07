import { Routes, Route } from 'react-router-dom';
import NoticeListPage from '../pages/NoticeListPage';
import Home from '../pages/Home';
import LayoutWrapper from '../module/layouts/LayoutWrapper';
import AuctionPage from '../pages/auction';
import AuthGuard from './AuthGuard.tsx';
import LoginPage from "../pages/login";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* 아래는 로그인 필수 */}
            <Route element={<AuthGuard />}>
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
            </Route>
        </Routes>
    );
};

export default AppRouter;
