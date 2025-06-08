import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const BottomTabBar = () => {
    const [value, setValue] = useState(0);
    const navigate = useNavigate();

    // 커밋용sdf
    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation
                value={value}
                onChange={(_, newValue) => {
                    setValue(newValue);
                    if (newValue === 0) navigate('/');
                    else if (newValue === 1) navigate('/notice');
                    else if (newValue === 2) navigate('/mypage');
                }}
                showLabels
            >
                <BottomNavigationAction label="홈" icon={<HomeIcon />} />
                <BottomNavigationAction label="공지" icon={<NotificationsIcon />} />
                <BottomNavigationAction label="마이" icon={<PersonIcon />} />
            </BottomNavigation>
        </Paper>
    );
};

export default BottomTabBar;
