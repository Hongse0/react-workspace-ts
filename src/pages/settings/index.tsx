import { Box, Container, Paper, Stack, Typography, Avatar, Divider } from "@mui/material";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auto/useAuthStore";
import { useLogoutMutation } from "../../services/cms/useAuthQuery.ts";
import "./style.css";

interface SettingMenuItemProps {
    icon: React.ReactNode;
    title: string;
    description?: string;
    danger?: boolean;
    onClick?: () => void;
}

function SettingMenuItem({
                             icon,
                             title,
                             description,
                             danger = false,
                             onClick,
                         }: SettingMenuItemProps) {
    return (
        <Paper
            elevation={0}
            className={`settings-menu-item ${danger ? "is-danger" : ""}`}
            onClick={onClick}
        >
            <Box className={`settings-menu-item__icon ${danger ? "is-danger" : ""}`}>
                {icon}
            </Box>

            <Box className="settings-menu-item__content">
                <Typography className={`settings-menu-item__title ${danger ? "is-danger" : ""}`}>
                    {title}
                </Typography>
                {description ? (
                    <Typography className="settings-menu-item__description">
                        {description}
                    </Typography>
                ) : null}
            </Box>

            <ChevronRightRoundedIcon
                className={`settings-menu-item__arrow ${danger ? "is-danger" : ""}`}
            />
        </Paper>
    );
}

export default function SettingsPage() {
    const navigate = useNavigate();
    const logout = useAuthStore((s) => s.logout);
    const { mutateAsync: logoutMutateAsync } = useLogoutMutation();

    const handleLogout = async () => {
        const ok = window.confirm("로그아웃 하시겠습니까?");
        if (!ok) return;

        try {
            await logoutMutateAsync();
        } catch (e) {
            console.error(e);
        } finally {
            logout();
            navigate("/login", { replace: true });
        }
    };

    return (
        <Box className="settings-page">
            <Box className="settings-page__header">
                <Box className="settings-page__header-glow" />

                <Container maxWidth="sm" disableGutters>
                    <Stack spacing={1.5}>
                        <Typography className="settings-page__title">
                            설정
                        </Typography>

                        <Typography className="settings-page__subtitle">
                            계정, 알림, 공지사항과 앱 정보를 관리할 수 있어요
                        </Typography>

                        <Paper elevation={0} className="settings-profile-card">
                            <Box className="settings-profile-card__row">
                                <Avatar className="settings-profile-card__avatar">
                                    <PersonRoundedIcon />
                                </Avatar>

                                <Box className="settings-profile-card__content">
                                    <Typography className="settings-profile-card__name">
                                        사용자님
                                    </Typography>
                                    <Typography className="settings-profile-card__email">
                                        내 계정 및 서비스 설정을 확인해보세요
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Stack>
                </Container>
            </Box>

            <Box className="settings-page__body">
                <Container maxWidth="sm">
                    <Stack spacing={2}>
                        <Box>
                            <Typography className="settings-section-title">내 계정</Typography>

                            <Stack spacing={1.5} mt={1.5}>
                                <SettingMenuItem
                                    icon={<ManageAccountsRoundedIcon />}
                                    title="내 정보"
                                    description="프로필, 계정 기본 정보를 확인해요"
                                    onClick={() => alert("내 정보 페이지는 추후 연결")}
                                />

                                <SettingMenuItem
                                    icon={<SecurityRoundedIcon />}
                                    title="보안 및 로그인"
                                    description="배치 수동 실행 및 관리자 기능"
                                    onClick={() => navigate("/settings/security")}
                                />
                            </Stack>
                        </Box>

                        <Box>
                            <Typography className="settings-section-title">서비스</Typography>

                            <Stack spacing={1.5} mt={1.5}>
                                <SettingMenuItem
                                    icon={<NotificationsRoundedIcon />}
                                    title="알림 설정"
                                    description="푸시 알림 및 서비스 알림 관리"
                                    onClick={() => alert("알림 설정 페이지는 추후 연결")}
                                />

                                <SettingMenuItem
                                    icon={<CampaignRoundedIcon />}
                                    title="공지사항"
                                    description="업데이트 및 공지 내용을 확인해요"
                                    onClick={() => navigate("/notice")}
                                />
                            </Stack>
                        </Box>

                        <Box>
                            <Typography className="settings-section-title">앱 정보</Typography>

                            <Paper elevation={0} className="settings-info-card">
                                <Box className="settings-info-card__row">
                                    <Box className="settings-info-card__left">
                                        <InfoOutlinedIcon className="settings-info-card__icon" />
                                        <Typography className="settings-info-card__label">
                                            앱 버전
                                        </Typography>
                                    </Box>

                                    <Typography className="settings-info-card__value">
                                        v1.0.0
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 1.5 }} />

                                <Box className="settings-info-card__row">
                                    <Box className="settings-info-card__left">
                                        <SettingsRoundedIcon className="settings-info-card__icon" />
                                        <Typography className="settings-info-card__label">
                                            서비스 상태
                                        </Typography>
                                    </Box>

                                    <Typography className="settings-info-card__value">
                                        정상
                                    </Typography>
                                </Box>
                            </Paper>
                        </Box>

                        <Box pt={1}>
                            <SettingMenuItem
                                icon={<LogoutRoundedIcon />}
                                title="로그아웃"
                                description="현재 로그인된 계정에서 로그아웃합니다"
                                danger
                                onClick={handleLogout}
                            />
                        </Box>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}