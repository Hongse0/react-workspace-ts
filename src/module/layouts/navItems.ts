import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import type { ReactNode } from "react";
import { createElement } from "react";

export type NavItem = {
    label: string;
    path: string;
    icon: ReactNode;
};

export const NAV_ITEMS: NavItem[] = [
    { label: "홈", path: "/", icon: createElement(HomeOutlinedIcon) },
    { label: "시장", path: "/market", icon: createElement(TrendingUpOutlinedIcon) },
    { label: "계좌", path: "/account", icon: createElement(AccountBalanceWalletOutlinedIcon) },
    { label: "설정", path: "/settings", icon: createElement(SettingsOutlinedIcon) },
];

export function isActivePath(pathname: string, target: string): boolean {
    if (target === "/") return pathname === "/";
    return pathname.startsWith(target);
}
