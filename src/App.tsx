import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './router/AppRouter';
import {CssBaseline} from '@mui/material';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <CssBaseline />
                <AppRouter />
            </BrowserRouter>
        </QueryClientProvider>
    );
}


export default App;
