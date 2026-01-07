import {useAuthStore} from "../store/auto/useAuthStore.ts";
import { Navigate, Outlet, useLocation } from "react-router-dom";


const AuthGuard = () => {
    const isAuthed = useAuthStore((s) => s.isAuthed);
    const location = useLocation();

    if (!isAuthed) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export default AuthGuard;
