import { Outlet } from 'react-router-dom';
import BottomTabBar from './BottomTabBar';
import SideNav from './SideNav';

export default function MainLayout() {
    return (
        <div className="app-shell">
            <SideNav />
            <main className="app-shell__main">
                <Outlet />
            </main>
            <BottomTabBar />
        </div>
    );
}
