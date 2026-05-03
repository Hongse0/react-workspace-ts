// src/module/layouts/BottomTabBar.tsx
import { BottomNavigation, BottomNavigationAction, Box, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const COLORS = {
    selected: "#2F6BFF",
    idle: "#9CA3AF",
    textSelected: "#2F6BFF",
    textIdle: "#6B7280",
    bg: "#FFFFFF",
    border: "#E5E7EB",
    shadow: "0 -4px 16px rgba(15, 23, 42, 0.04)",
};

const DIM = {
    height: 74,
    indicatorWidth: 42,
    indicatorHeight: 4,
    iconSize: 28,
};

type TabItem = {
    label: string;
    path: string;
    icon: React.ReactNode;
};

const TABS: TabItem[] = [
    { label: "홈", path: "/", icon: <HomeOutlinedIcon /> },
    { label: "시장", path: "/market", icon: <TrendingUpOutlinedIcon /> },
    { label: "계좌", path: "/account", icon: <AccountBalanceWalletOutlinedIcon /> },
    { label: "설정", path: "/settings", icon: <SettingsOutlinedIcon /> },
];

const Dock = styled(Box)(({ theme }) => ({
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: theme.zIndex.appBar + 1,
    paddingBottom: "env(safe-area-inset-bottom)",
}));

const Bar = styled(Paper)(() => ({
    width: "100%",
    borderRadius: 0,
    backgroundColor: COLORS.bg,
    borderTop: `1px solid ${COLORS.border}`,
    boxShadow: COLORS.shadow,
}));

const Nav = styled(BottomNavigation)(() => ({
    height: DIM.height,
    backgroundColor: COLORS.bg,
}));

const Tab = styled(BottomNavigationAction)(() => ({
    position: "relative",
    minWidth: 0,
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    color: COLORS.idle,
    transition: "all .15s ease",

    "& .MuiSvgIcon-root": {
        fontSize: DIM.iconSize,
    },

    "& .MuiBottomNavigationAction-label": {
        fontSize: 12,
        fontWeight: 700,
        marginTop: 2,
        color: COLORS.textIdle,
        transition: "all .15s ease",
    },

    "&.Mui-selected": {
        color: COLORS.selected,
    },

    "&.Mui-selected .MuiBottomNavigationAction-label": {
        color: COLORS.textSelected,
        fontWeight: 800,
    },

    "&.Mui-selected::before": {
        content: '""',
        position: "absolute",
        top: 6,
        left: "50%",
        transform: "translateX(-50%)",
        width: DIM.indicatorWidth,
        height: DIM.indicatorHeight,
        borderRadius: 999,
        backgroundColor: COLORS.selected,
        boxShadow: "none",
    },
}));

const BottomTabBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const value = useMemo(() => {
        const idx = TABS.findIndex((t) =>
            t.path === "/" ? location.pathname === "/" : location.pathname.startsWith(t.path)
        );
        return idx === -1 ? 0 : idx;
    }, [location.pathname]);

    return (
        <Dock>
            <Bar elevation={0}>
                <Nav
                    value={value}
                    onChange={(_, newValue) => navigate(TABS[newValue].path)}
                    showLabels
                >
                    {TABS.map((t) => (
                        <Tab key={t.path} label={t.label} icon={t.icon} />
                    ))}
                </Nav>
            </Bar>
        </Dock>
    );
};

export default BottomTabBar;