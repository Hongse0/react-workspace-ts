import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ title = '', showBackButton = false }: { title?: string; showBackButton?: boolean }) => {
    const navigate = useNavigate();

    return (
        <AppBar position="fixed" color="default" elevation={1}>
            <Toolbar>
                {showBackButton && (
                    <IconButton edge="start" onClick={() => navigate(-1)}>
                        <ArrowBackIcon />
                    </IconButton>
                )}
                <Typography variant="h6" sx={{ ml: showBackButton ? 1 : 0 }}>
                    {title}
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
