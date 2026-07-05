import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auto/useAuthStore";
import { NAV_ITEMS, isActivePath } from "./navItems";
import "./SideNav.css";

export default function SideNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const nickname = useAuthStore((s) => s.nickname);

    return (
        <aside className="sidenav desktop-only">
            <div className="sidenav__brand">
                <img
                    src="/asset-flow-icon.png"
                    alt="GrowFolio"
                    className="sidenav__brand-mark"
                />
                <span className="sidenav__brand-name">GrowFolio</span>
            </div>

            <nav className="sidenav__menu">
                {NAV_ITEMS.map((item) => {
                    const active = isActivePath(location.pathname, item.path);
                    return (
                        <button
                            key={item.path}
                            type="button"
                            className={`sidenav__item ${active ? "is-active" : ""}`}
                            onClick={() => navigate(item.path)}
                        >
                            <span className="sidenav__icon">{item.icon}</span>
                            <span className="sidenav__label">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="sidenav__footer">
                <div className="sidenav__user-avatar">
                    {nickname ? nickname.slice(0, 1) : "G"}
                </div>
                <div className="sidenav__user-meta">
                    <div className="sidenav__user-name">{nickname ?? "회원"}</div>
                    <div className="sidenav__user-sub">로그인됨</div>
                </div>
            </div>
        </aside>
    );
}
