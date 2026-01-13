import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auto/useAuthStore';

export default function ProtectedRoute() {
    const isAuthed = useAuthStore((s) => s.isAuthed);
    const location = useLocation();

    const token = localStorage.getItem('accessToken');

    if (!isAuthed && !token) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return <Outlet />;
}
