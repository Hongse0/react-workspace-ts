import { useMemo, useState } from "react";
import { Box, Container, Stack, Typography, Divider } from "@mui/material";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useNavigate } from "react-router-dom";
import { useBuyStockMutation } from "../../services/trade/useBuyStockMutation";
import { useAccountHoldingsQuery } from "../../services/account/useAccountHoldingsQuery";
import { useSellStockMutation } from "../../services/trade/useSellStockMutation";

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
    ActionsRow,
    DepositButton,
    WithdrawButton,
    FloatingAddFab,
    AccountSwipeWrap,
    AccountSwipeItem,
} from "./AccountPage.styles";

import AddAccountDialog from "../../components/account/AddAccountDialog";
import { useAccountListQuery } from "../../services/account/useAccountListQuery";
import { useDeleteAccountMutation } from "../../services/account/useDeleteAccountMutation.ts";
import { useAuthStore } from "../../store/auto/useAuthStore";
import { useLogoutMutation } from "../../services/cms/useAuthQuery.ts";

type TradeSide = "BUY" | "SELL";

type Account = {
    accountId: number;
    accountName?: string | null;
    brokerName?: string | null;
    accountNumber?: string | null;
    cashBalance?: string | number | null;
    stockAssetValue?: string | number | null;
    totalAssetValue?: string | number | null;
    holdingCount?: number | null;
};

const toNumber = (v: string | number | null | undefined) => {
    if (v == null) return 0;
    if (typeof v === "number") return v;
    const n = Number(String(v).replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
};

export default function AccountPage() {
    const [openAdd, setOpenAdd] = useState(false);
    const [openTrade, setOpenTrade] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [tradeSide, setTradeSide] = useState<TradeSide>("BUY");

    const {
        data: accounts = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useAccountListQuery();

    const typedAccounts = accounts as Account[];

    const totalAsset = useMemo(() => {
        return typedAccounts.reduce(
            (sum, a) => sum + toNumber(a.totalAssetValue),
            0
        );
    }, [typedAccounts]);

    const totalCash = useMemo(() => {
        return typedAccounts.reduce(
            (sum, a) => sum + toNumber(a.cashBalance),
            0
        );
    }, [typedAccounts]);

    const totalStock = useMemo(() => {
        return typedAccounts.reduce(
            (sum, a) => sum + toNumber(a.stockAssetValue),
            0
        );
    }, [typedAccounts]);

    const {
        data: holdings = [],
        refetch: refetchHoldings,
    } = useAccountHoldingsQuery(
        selectedAccount ? Number(selectedAccount.accountId) : undefined,
        openTrade && tradeSide === "SELL"
    );

    const handleAddFirstAccount = () => setOpenAdd(true);
    const handleCloseAdd = () => setOpenAdd(false);

    const { mutate: deleteAccount } = useDeleteAccountMutation();

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

    const openTradeModal = (account: Account, side: TradeSide) => {
        setSelectedAccount(account);
        setTradeSide(side);
        setOpenTrade(true);
    };

    const closeTrade = () => setOpenTrade(false);

    const { mutateAsync: buyStockMutateAsync } = useBuyStockMutation();
    const { mutateAsync: sellStockMutateAsync } = useSellStockMutation();

    const handleSubmitTrade = async (draft: TradeDraft) => {
        try {
            const tradeDateTime = `${draft.tradeDate}T09:00:00`;

            if (draft.type === "BUY") {
                if (draft.market !== "KR") {
                    alert("현재는 국내 주식 매수만 지원합니다.");
                    return;
                }

                await buyStockMutateAsync({
                    accountId: Number(draft.accountId),
                    symbolCode: draft.symbolCode,
                    quantity: draft.quantity,
                    price: draft.price,
                    tradeDate: tradeDateTime,
                    memo: draft.memo,
                });

                await refetch();
                closeTrade();
                alert("매수 등록이 완료되었습니다.");
                return;
            }

            if (draft.type === "SELL") {
                if (draft.market !== "KR") {
                    alert("현재는 국내 주식 매도만 지원합니다.");
                    return;
                }

                await sellStockMutateAsync({
                    accountId: Number(draft.accountId),
                    symbolCode: draft.symbolCode,
                    quantity: draft.quantity,
                    price: draft.price,
                    tradeDateTime,
                    memo: draft.memo,
                    fee: 0,
                    tax: 0,
                });

                await Promise.all([refetch(), refetchHoldings()]);
                closeTrade();
                alert("매도 등록이 완료되었습니다.");
            }
        } catch (e) {
            console.error(e);
            alert(e instanceof Error ? e.message : "매매 등록 중 오류가 발생했습니다.");
        }
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
                        <TotalLabel>총 자산</TotalLabel>
                        <TotalValue>₩{totalAsset.toLocaleString("ko-KR")}</TotalValue>

                        <Stack direction="row" spacing={2} mt={1.5}>
                            <Box>
                                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                                    현금
                                </Typography>
                                <Typography fontWeight={700}>
                                    ₩{totalCash.toLocaleString("ko-KR")}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                                    보유 주식
                                </Typography>
                                <Typography fontWeight={700}>
                                    ₩{totalStock.toLocaleString("ko-KR")}
                                </Typography>
                            </Box>
                        </Stack>
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
                            <AccountSwipeWrap>
                                {typedAccounts.map((a) => {
                                    const cash = toNumber(a.cashBalance);
                                    const stock = toNumber(a.stockAssetValue);
                                    const total = toNumber(a.totalAssetValue);
                                    const holdingCount = a.holdingCount ?? 0;

                                    return (
                                        <AccountSwipeItem key={a.accountId}>
                                            <AccountCard
                                                elevation={0}
                                                onClick={() => openTradeModal(a, "BUY")}
                                                sx={{ cursor: "pointer", height: "100%" }}
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

                                                    <Box mt={2.5}>
                                                        <Typography fontSize={12} color="text.secondary">
                                                            총 자산
                                                        </Typography>
                                                        <Typography fontSize={24} fontWeight={800} lineHeight={1.2}>
                                                            ₩{total.toLocaleString("ko-KR")}
                                                        </Typography>

                                                        <Typography fontSize={12} color="text.secondary" mt={0.7}>
                                                            보유 종목 {holdingCount}개
                                                        </Typography>
                                                    </Box>

                                                    <Divider sx={{ my: 2 }} />

                                                    <Stack direction="row" spacing={2}>
                                                        <Box flex={1}>
                                                            <Typography fontSize={12} color="text.secondary">
                                                                현금
                                                            </Typography>
                                                            <Typography fontSize={17} fontWeight={700}>
                                                                ₩{cash.toLocaleString("ko-KR")}
                                                            </Typography>
                                                        </Box>

                                                        <Box flex={1}>
                                                            <Typography fontSize={12} color="text.secondary">
                                                                보유 주식
                                                            </Typography>
                                                            <Typography fontSize={17} fontWeight={700}>
                                                                ₩{stock.toLocaleString("ko-KR")}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>

                                                    <ActionsRow>
                                                        <DepositButton
                                                            variant="contained"
                                                            startIcon={<ArrowDownwardRoundedIcon />}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openTradeModal(a, "BUY");
                                                            }}
                                                        >
                                                            매수
                                                        </DepositButton>

                                                        <WithdrawButton
                                                            variant="contained"
                                                            startIcon={<ArrowUpwardRoundedIcon />}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openTradeModal(a, "SELL");
                                                            }}
                                                        >
                                                            매도
                                                        </WithdrawButton>
                                                    </ActionsRow>
                                                </AccountCardContent>
                                            </AccountCard>
                                        </AccountSwipeItem>
                                    );
                                })}
                            </AccountSwipeWrap>
                        </AccountListWrap>
                    )}
                </Container>
            </Body>

            <FloatingAddFab onClick={() => setOpenAdd(true)}>
                <AddRoundedIcon sx={{ fontSize: 34, color: "#fff" }} />
            </FloatingAddFab>

            <AddAccountDialog
                open={openAdd}
                onClose={handleCloseAdd}
                onSuccess={async () => {
                    await refetch();
                }}
            />

            <TradeFunnelDialog
                open={openTrade}
                onClose={closeTrade}
                account={selectedAccount}
                holdings={holdings}
                onSubmit={handleSubmitTrade}
                initialSide={tradeSide}
            />
        </Page>
    );
}