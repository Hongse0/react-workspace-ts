import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from "./router/AppRouter.tsx";
import BottomTabBar from "./module/layouts/BottomTabBar.tsx";


const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AppRouter />
                <BottomTabBar />
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
