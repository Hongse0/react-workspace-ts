import { Outlet } from 'react-router-dom';
import BottomTabBar from './BottomTabBar';
import SideNav from './SideNav';
import ChatBot from '../chatbot/ChatBot';

export default function MainLayout() {
    return (
        <div className="app-shell">
            <SideNav />
            <main className="app-shell__main">
                <Outlet />
            </main>
            <BottomTabBar />
            <ChatBot />
        </div>
    );
}
