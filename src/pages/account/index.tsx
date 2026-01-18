import { useMemo, useState } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";

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
import {useDeleteAccountMutation} from "../../services/account/useDeleteAccountMutation.ts";

const toNumber = (v: string | number | null | undefined) => {
    if (v == null) return 0;
    if (typeof v === "number") return v;
    const n = Number(String(v).replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
};

export default function AccountPage() {
    const [openAdd, setOpenAdd] = useState(false);

    const { data: accounts = [], isLoading, isError, error } = useAccountListQuery();

    const totalBalance = useMemo(() => {
        return accounts.reduce((sum, a) => sum + toNumber(a.cashBalance), 0);
    }, [accounts]);

    const handleAddFirstAccount = () => setOpenAdd(true);
    const handleCloseAdd = () => setOpenAdd(false);

    const { mutate: deleteAccount} = useDeleteAccountMutation();

    return (
        <Page>
            <Header>
                <HeaderGlow />
                <Container maxWidth="sm" disableGutters>
                    <HeaderTitle>증권 계좌 관리</HeaderTitle>

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
                    ) : accounts.length === 0 ? (
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
                                {accounts.map((a) => (
                                    <AccountCard key={a.accountId} elevation={0}>
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
                                                    onClick={() => {
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
                                                    onClick={() => console.log("deposit", a.accountId)}
                                                >
                                                    입금
                                                </DepositButton>

                                                <WithdrawButton
                                                    variant="contained"
                                                    startIcon={<ArrowUpwardRoundedIcon />}
                                                    onClick={() => console.log("withdraw", a.accountId)}
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
        </Page>
    );
}
