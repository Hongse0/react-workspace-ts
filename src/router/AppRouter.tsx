import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../module/layouts/MainLayout';
import LoginPage from "../pages/login";
import AccountPage from "../pages/account"
import ComingSoonPage from "../pages/auction";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<ComingSoonPage />} />
                    <Route path="/market" element={<ComingSoonPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/settings" element={<ComingSoonPage />} />
                </Route>
            </Route>

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

