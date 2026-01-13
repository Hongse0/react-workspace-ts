import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../module/layouts/MainLayout';
import LoginPage from "../pages/login";
import Home from "../pages/search/Home"
import AccountPage from "../pages/account"

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/market" element={<LoginPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/settings" element={<LoginPage />} />
                </Route>
            </Route>

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

