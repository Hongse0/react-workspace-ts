import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../module/layouts/MainLayout";
import LoginPage from "../pages/login";
import AccountPage from "../pages/account";
import AssetSnapshotPage from "../pages/account/AssetSnapshotPage";
import HomePage from "../pages/home";
import StockSearchPage from "../pages/search";
import SettingsPage from "../pages/settings";
import ManualBatchPage from "../components/settings/ManualBatchPage";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/market" element={<StockSearchPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/account/snapshot" element={<AssetSnapshotPage />} />

                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/settings/security" element={<ManualBatchPage />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}