import { useMemo, useState } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useNavigate } from "react-router-dom";

import TradeFunnelDialog from "../../components/trade/TradeFunnelDialog";
import type { TradeDraft } from "../../components/trade/TradeFunnelDialog";

import {
    Page,
    Header,
    HeaderGlow,
    HeaderTitle,
    TotalCard,
    TotalLabel,
    TotalValue,
    Body,
    EmptyWrap,
    EmptyIconCircle,
    EmptyText,
    AddFirstButton,
    AddFirstButtonHover,
    AccountListWrap,
    AccountCard,
    AccountCardContent,
    AccountTitle,
    AccountSub,
    AccountNumberText,
    DeleteButton,
    AccountBalance,
    ActionsRow,
    DepositButton,
    WithdrawButton,
    FloatingAddFab,
} from "./AccountPage.styles";

import AddAccountDialog from "../../components/account/AddAccountDialog";
import { useAccountListQuery } from "../../services/account/useAccountListQuery";
import { useDeleteAccountMutation } from "../../services/account/useDeleteAccountMutation.ts";
import { useAuthStore } from "../../store/auto/useAuthStore";
import {useLogoutMutation} from "../../services/cms/useAuthQuery.ts";

type Account = {
    accountId: number;
    accountName?: string | null;
    brokerName?: string | null;
    accountNumber?: string | null;
    cashBalance?: string | number | null;
};

const toNumber = (v: string | number | null | undefined) => {
    if (v == null) return 0;
    if (typeof v === "number") return v;
    const n = Number(String(v).replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
};

export default function AccountPage() {
    const [openAdd, setOpenAdd] = useState(false);

    const { data: accounts = [], isLoading, isError, error } = useAccountListQuery();
    const typedAccounts = accounts as Account[];

    const totalBalance = useMemo(() => {
        return typedAccounts.reduce((sum, a) => sum + toNumber(a.cashBalance), 0);
    }, [typedAccounts]);

    const handleAddFirstAccount = () => setOpenAdd(true);
    const handleCloseAdd = () => setOpenAdd(false);

    const { mutate: deleteAccount } = useDeleteAccountMutation();

    const [openTrade, setOpenTrade] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

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

    const openTradeForAccount = (a: Account) => {
        setSelectedAccount(a);
        setOpenTrade(true);
    };

    const closeTrade = () => setOpenTrade(false);

    const handleSubmitTrade = (draft: TradeDraft) => {
        console.log("trade submit", draft);
    };

    return (
        <Page>
            <Header>
                <HeaderGlow />
                <Container maxWidth="sm" disableGutters>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <HeaderTitle sx={{ mb: 0 }}>증권 계좌 관리</HeaderTitle>

                        <DeleteButton
                            onClick={handleLogout}
                            sx={{
                                width: 42,
                                height: 42,
                                borderRadius: "12px",
                                bgcolor: "rgba(255,255,255,0.18)",
                                color: "#fff",
                                "&:hover": {
                                    bgcolor: "rgba(255,255,255,0.28)",
                                },
                            }}
                        >
                            <LogoutRoundedIcon />
                        </DeleteButton>
                    </Box>

                    <TotalCard elevation={0}>
                        <TotalLabel>총 잔액</TotalLabel>
                        <TotalValue>₩{totalBalance.toLocaleString("ko-KR")}</TotalValue>
                    </TotalCard>
                </Container>
            </Header>

            <Body>
                <Container maxWidth="sm">
                    {isLoading ? (
                        <Box py={3}>
                            <Typography>불러오는 중...</Typography>
                        </Box>
                    ) : isError ? (
                        <Box py={3}>
                            <Typography color="error">
                                {error instanceof Error ? error.message : "오류가 발생했습니다."}
                            </Typography>
                        </Box>
                    ) : typedAccounts.length === 0 ? (
                        <EmptyWrap>
                            <Stack spacing={2.2} alignItems="center">
                                <EmptyIconCircle>
                                    <ReceiptLongRoundedIcon sx={{ fontSize: 44 }} color="primary" />
                                </EmptyIconCircle>

                                <EmptyText>등록된 계좌가 없습니다</EmptyText>

                                <AddFirstButton
                                    onClick={handleAddFirstAccount}
                                    startIcon={<AddRoundedIcon />}
                                    variant="contained"
                                    sx={AddFirstButtonHover}
                                >
                                    첫 계좌 추가하기
                                </AddFirstButton>
                            </Stack>
                        </EmptyWrap>
                    ) : (
                        <AccountListWrap>
                            <Stack spacing={2}>
                                {typedAccounts.map((a) => (
                                    <AccountCard
                                        key={a.accountId}
                                        elevation={0}
                                        onClick={() => openTradeForAccount(a)}
                                        sx={{ cursor: "pointer" }}
                                    >
                                        <AccountCardContent>
                                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                <Box>
                                                    <AccountTitle>{a.accountName || a.brokerName}</AccountTitle>
                                                    <AccountSub>{a.brokerName}</AccountSub>
                                                    <AccountNumberText>{a.accountNumber}</AccountNumberText>
                                                </Box>

                                                <DeleteButton
                                                    size="small"
                                                    aria-label="delete"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const ok = window.confirm("이 계좌를 삭제할까요?");
                                                        if (!ok) return;
                                                        deleteAccount(a.accountId);
                                                    }}
                                                >
                                                    <DeleteOutlineRoundedIcon />
                                                </DeleteButton>
                                            </Stack>

                                            <AccountBalance>₩{toNumber(a.cashBalance).toLocaleString("ko-KR")}</AccountBalance>

                                            <ActionsRow>
                                                <DepositButton
                                                    variant="contained"
                                                    startIcon={<ArrowDownwardRoundedIcon />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        console.log("deposit", a.accountId);
                                                    }}
                                                >
                                                    입금
                                                </DepositButton>

                                                <WithdrawButton
                                                    variant="contained"
                                                    startIcon={<ArrowUpwardRoundedIcon />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        console.log("withdraw", a.accountId);
                                                    }}
                                                >
                                                    출금
                                                </WithdrawButton>
                                            </ActionsRow>
                                        </AccountCardContent>
                                    </AccountCard>
                                ))}
                            </Stack>
                        </AccountListWrap>
                    )}
                </Container>
            </Body>

            <FloatingAddFab onClick={() => setOpenAdd(true)}>
                <AddRoundedIcon sx={{ fontSize: 34, color: "#fff" }} />
            </FloatingAddFab>

            <AddAccountDialog open={openAdd} onClose={handleCloseAdd} />

            <TradeFunnelDialog
                open={openTrade}
                onClose={closeTrade}
                account={selectedAccount}
                onSubmit={handleSubmitTrade}
            />
        </Page>
    );
}