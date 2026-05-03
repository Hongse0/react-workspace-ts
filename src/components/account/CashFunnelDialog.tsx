import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

type CashType = "DEPOSIT" | "WITHDRAW";
type Step = "TYPE" | "AMOUNT" | "CONFIRM";

type Account = {
    accountId: number;
    accountName?: string | null;
    brokerName?: string | null;
    accountNumber?: string | null;
    cashBalance?: string | number | null;
};

type Props = {
    open: boolean;
    onClose: () => void;
    account: Account | null;
    onSubmit: (draft: {
        accountId: number;
        type: CashType;
        amount: number;
        memo: string;
    }) => Promise<void> | void;
};

const steps: { key: Step; label: string }[] = [
    { key: "TYPE", label: "구분" },
    { key: "AMOUNT", label: "금액" },
    { key: "CONFIRM", label: "확인" },
];

const toNumber = (v: string | number | null | undefined) => {
    if (v == null) return 0;
    if (typeof v === "number") return v;
    const n = Number(String(v).replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
};

const formatCurrency = (value: number) => {
    return `₩${Math.round(value).toLocaleString("ko-KR")}`;
};

export default function CashFunnelDialog({
                                             open,
                                             onClose,
                                             account,
                                             onSubmit,
                                         }: Props) {
    const [step, setStep] = useState<Step>("TYPE");
    const [type, setType] = useState<CashType>("DEPOSIT");
    const [amountText, setAmountText] = useState("");
    const [memo, setMemo] = useState("");

    const amount = useMemo(() => {
        const n = Number(amountText.replace(/,/g, ""));
        return Number.isFinite(n) ? n : 0;
    }, [amountText]);

    const cashBalance = toNumber(account?.cashBalance);

    useEffect(() => {
        if (!open) {
            setStep("TYPE");
            setType("DEPOSIT");
            setAmountText("");
            setMemo("");
        }
    }, [open]);

    const handleClose = () => {
        onClose();
    };

    const handleNextAmount = () => {
        if (amount <= 0) {
            alert("금액을 입력해주세요.");
            return;
        }

        if (type === "WITHDRAW" && amount > cashBalance) {
            alert("인출 금액이 현재 현금 잔액보다 큽니다.");
            return;
        }

        setStep("CONFIRM");
    };

    const handleSubmit = async () => {
        if (!account) return;

        await onSubmit({
            accountId: account.accountId,
            type,
            amount,
            memo,
        });
    };

    const currentStepIndex = steps.findIndex((s) => s.key === step);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="xs"
            PaperProps={{
                sx: {
                    borderRadius: "22px",
                    overflow: "hidden",
                },
            }}
        >
            <DialogTitle
                sx={{
                    px: 2.5,
                    pt: 2.3,
                    pb: 1.5,
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        <Typography fontSize={20} fontWeight={900} letterSpacing="-0.04em">
                            입금/인출 등록
                        </Typography>
                        <Typography mt={0.5} fontSize={13} color="text.secondary" fontWeight={700}>
                            {account?.accountName || account?.brokerName || "선택 계좌"}
                        </Typography>
                    </Box>

                    <IconButton
                        onClick={handleClose}
                        size="small"
                        sx={{
                            width: 36,
                            height: 36,
                            bgcolor: "#f3f4f6",
                            color: "#4b5563",
                            "&:hover": {
                                bgcolor: "#e5e7eb",
                            },
                        }}
                    >
                        <CloseRoundedIcon />
                    </IconButton>
                </Box>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 1,
                        mt: 2,
                    }}
                >
                    {steps.map((s, index) => {
                        const active = s.key === step;
                        const done = index < currentStepIndex;

                        return (
                            <Box
                                key={s.key}
                                sx={{
                                    height: 34,
                                    borderRadius: "999px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 12,
                                    fontWeight: 900,
                                    bgcolor: active || done ? "#111827" : "#f3f4f6",
                                    color: active || done ? "#ffffff" : "#9ca3af",
                                }}
                            >
                                {index + 1}. {s.label}
                            </Box>
                        );
                    })}
                </Box>
            </DialogTitle>

            <DialogContent
                sx={{
                    px: 2.5,
                    pb: 2.5,
                }}
            >
                {step === "TYPE" && (
                    <Stack spacing={2}>
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: "16px",
                                bgcolor: "#f8fafc",
                                border: "1px solid #edf0f3",
                            }}
                        >
                            <Typography fontSize={12} color="text.secondary" fontWeight={800}>
                                현재 현금
                            </Typography>
                            <Typography mt={0.5} fontSize={24} fontWeight={900}>
                                {formatCurrency(cashBalance)}
                            </Typography>
                        </Box>

                        <Stack direction="row" spacing={1}>
                            <Button
                                fullWidth
                                variant={type === "DEPOSIT" ? "contained" : "outlined"}
                                onClick={() => setType("DEPOSIT")}
                                sx={{
                                    height: 50,
                                    borderRadius: "15px",
                                    fontWeight: 900,
                                    bgcolor: type === "DEPOSIT" ? "#d32f2f" : undefined,
                                    borderColor: "#e5e7eb",
                                }}
                            >
                                입금
                            </Button>

                            <Button
                                fullWidth
                                variant={type === "WITHDRAW" ? "contained" : "outlined"}
                                onClick={() => setType("WITHDRAW")}
                                sx={{
                                    height: 50,
                                    borderRadius: "15px",
                                    fontWeight: 900,
                                    bgcolor: type === "WITHDRAW" ? "#1565c0" : undefined,
                                    borderColor: "#e5e7eb",
                                }}
                            >
                                인출
                            </Button>
                        </Stack>

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => setStep("AMOUNT")}
                            sx={{
                                height: 52,
                                borderRadius: "16px",
                                fontWeight: 900,
                                bgcolor: "#111827",
                            }}
                        >
                            다음
                        </Button>
                    </Stack>
                )}

                {step === "AMOUNT" && (
                    <Stack spacing={2}>
                        <TextField
                            label={type === "DEPOSIT" ? "입금 금액" : "인출 금액"}
                            value={amountText}
                            onChange={(e) => {
                                const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
                                setAmountText(onlyNumber);
                            }}
                            placeholder="금액을 입력하세요"
                            fullWidth
                            inputProps={{ inputMode: "numeric" }}
                        />

                        <TextField
                            label="메모"
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            placeholder="예: 예수금 입금, 생활비 인출"
                            fullWidth
                        />

                        <Box
                            sx={{
                                p: 2,
                                borderRadius: "16px",
                                bgcolor: "#f8fafc",
                                border: "1px solid #edf0f3",
                            }}
                        >
                            <Typography fontSize={12} color="text.secondary" fontWeight={800}>
                                입력 금액
                            </Typography>
                            <Typography mt={0.5} fontSize={24} fontWeight={900}>
                                {formatCurrency(amount)}
                            </Typography>
                        </Box>

                        <Stack direction="row" spacing={1}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => setStep("TYPE")}
                                sx={{
                                    height: 52,
                                    borderRadius: "16px",
                                    fontWeight: 900,
                                    borderColor: "#e5e7eb",
                                    color: "#111827",
                                }}
                            >
                                이전
                            </Button>

                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleNextAmount}
                                sx={{
                                    height: 52,
                                    borderRadius: "16px",
                                    fontWeight: 900,
                                    bgcolor: "#111827",
                                }}
                            >
                                다음
                            </Button>
                        </Stack>
                    </Stack>
                )}

                {step === "CONFIRM" && (
                    <Stack spacing={2}>
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: "16px",
                                bgcolor: "#f8fafc",
                                border: "1px solid #edf0f3",
                            }}
                        >
                            <Typography fontSize={12} color="text.secondary" fontWeight={800}>
                                구분
                            </Typography>
                            <Typography
                                mt={0.5}
                                fontSize={18}
                                fontWeight={900}
                                color={type === "DEPOSIT" ? "#d32f2f" : "#1565c0"}
                            >
                                {type === "DEPOSIT" ? "입금" : "인출"}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                p: 2,
                                borderRadius: "16px",
                                bgcolor: "#f8fafc",
                                border: "1px solid #edf0f3",
                            }}
                        >
                            <Typography fontSize={12} color="text.secondary" fontWeight={800}>
                                금액
                            </Typography>
                            <Typography mt={0.5} fontSize={26} fontWeight={900}>
                                {formatCurrency(amount)}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                p: 2,
                                borderRadius: "16px",
                                bgcolor: "#f8fafc",
                                border: "1px solid #edf0f3",
                            }}
                        >
                            <Typography fontSize={12} color="text.secondary" fontWeight={800}>
                                메모
                            </Typography>
                            <Typography mt={0.5} fontSize={14} fontWeight={700}>
                                {memo || "-"}
                            </Typography>
                        </Box>

                        <Stack direction="row" spacing={1}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => setStep("AMOUNT")}
                                sx={{
                                    height: 52,
                                    borderRadius: "16px",
                                    fontWeight: 900,
                                    borderColor: "#e5e7eb",
                                    color: "#111827",
                                }}
                            >
                                이전
                            </Button>

                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleSubmit}
                                sx={{
                                    height: 52,
                                    borderRadius: "16px",
                                    fontWeight: 900,
                                    bgcolor: type === "DEPOSIT" ? "#d32f2f" : "#1565c0",
                                }}
                            >
                                등록하기
                            </Button>
                        </Stack>
                    </Stack>
                )}
            </DialogContent>
        </Dialog>
    );
}