import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './router/AppRouter';
import BottomTabBar from './module/layouts/BottomTabBar';
import {useAuthStore} from "./store/auto/useAuthStore.ts";
import { CssBaseline } from '@mui/material';

const queryClient = new QueryClient();

function App() {
    const isAuthed = useAuthStore((s) => s.isAuthed);

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <CssBaseline />
                <AppRouter />
                {isAuthed && <BottomTabBar />}
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
