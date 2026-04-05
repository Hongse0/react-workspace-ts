import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogContent,
    IconButton,
    Stack,
    TextField,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    Divider,
    InputAdornment,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import {KrStockAutocomplete} from "./KrStockAutocomplete.tsx";

// 실제 파일 있으면 import로 빼도 됨
type StockSearchItem = {
    srtnCd: string;
    isinCd: string;
    mrktCtg: string;
    itmsNm: string;
    corpNm: string;
    activeYn: string;
    basDt: string;
};

type TradeType = "BUY" | "SELL";
type Market = "KR" | "US";

export type TradeDraft = {
    type: TradeType;
    accountId: number | string;
    accountName?: string;
    brokerName?: string;

    market: Market;
    symbolName: string;
    symbolCode: string;

    quantity: number;
    price: number;

    tradeDate: string;
    memo: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    account: {
        accountId: number | string;
        accountName?: string | null;
        brokerName?: string | null;
        accountNumber?: string | null;
        cashBalance?: string | number | null;
        stockAssetValue?: string | number | null;
        totalAssetValue?: string | number | null;
        holdingCount?: number | null;
    } | null;
    onSubmit?: (draft: TradeDraft) => Promise<void> | void;
    initialSide?: TradeType;
};

const todayISO = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

const formatKRDate = (iso: string) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${y}. ${m}. ${d}.`;
};

const toNumber = (v: string | number | null | undefined): number => {
    if (v == null) return 0;
    if (typeof v === "number") return v;

    const n = Number(String(v).replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
};

const money = (n: number) => `₩${n.toLocaleString("ko-KR")}`;

function ProgressBar({ stepIndex, total }: { stepIndex: number; total: number }) {
    return (
        <Stack direction="row" spacing={1} sx={{ px: 0.5 }}>
            {Array.from({ length: total }).map((_, i) => {
                const active = i <= stepIndex;
                return (
                    <Box
                        key={i}
                        sx={{
                            height: 8,
                            flex: 1,
                            borderRadius: 999,
                            background: active
                                ? "linear-gradient(90deg, #2F7BFF 0%, #B54CFF 100%)"
                                : "#E9ECF2",
                            transition: "all .2s",
                        }}
                    />
                );
            })}
        </Stack>
    );
}

function SelectCard({
                        selected,
                        title,
                        icon,
                        onClick,
                        tone,
                    }: {
    selected: boolean;
    title: string;
    icon: React.ReactNode;
    onClick: () => void;
    tone?: "red" | "blue" | "gray";
}) {
    const toneMap = {
        red: {
            border: selected ? "1.5px solid #FF4D4F" : "1.5px solid #E6E8EE",
            bg: selected ? "rgba(255, 77, 79, 0.08)" : "#fff",
            color: selected ? "#FF4D4F" : "#6B7280",
        },
        blue: {
            border: selected ? "1.5px solid #2F7BFF" : "1.5px solid #E6E8EE",
            bg: selected ? "rgba(47, 123, 255, 0.10)" : "#fff",
            color: selected ? "#2F7BFF" : "#6B7280",
        },
        gray: {
            border: selected ? "1.5px solid #111827" : "1.5px solid #E6E8EE",
            bg: selected ? "rgba(17, 24, 39, 0.04)" : "#fff",
            color: selected ? "#111827" : "#6B7280",
        },
    }[tone ?? "gray"];

    return (
        <Box
            role="button"
            onClick={onClick}
            sx={{
                userSelect: "none",
                cursor: "pointer",
                flex: 1,
                height: 132,
                borderRadius: 3,
                border: toneMap.border,
                background: toneMap.bg,
                boxShadow: selected ? "0 12px 24px rgba(17,24,39,0.08)" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all .18s",
            }}
        >
            <Stack spacing={1.2} alignItems="center">
                <Box sx={{ color: toneMap.color }}>{icon}</Box>
                <Typography sx={{ fontWeight: 800, color: toneMap.color }}>{title}</Typography>
            </Stack>
        </Box>
    );
}

export default function TradeFunnelDialog({
                                              open,
                                              onClose,
                                              account,
                                              onSubmit,
                                              initialSide = "BUY",
                                          }: Props) {
    const totalSteps = 4;
    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const [type, setType] = useState<TradeType>("BUY");
    const [market, setMarket] = useState<Market>("KR");
    const [symbolName, setSymbolName] = useState("");
    const [symbolCode, setSymbolCode] = useState("");
    const [quantity, setQuantity] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);
    const [tradeDate, setTradeDate] = useState<string>(todayISO());
    const [memo, setMemo] = useState("");
    const [selectedKrStock, setSelectedKrStock] = useState<StockSearchItem | null>(null);

    useEffect(() => {
        if (market === "KR") {
            setSymbolName(selectedKrStock?.itmsNm ?? "");
            setSymbolCode(selectedKrStock?.srtnCd ?? "");
        } else {
            setSelectedKrStock(null);
            setSymbolName("");
            setSymbolCode("");
        }
    }, [market, selectedKrStock]);

    useEffect(() => {
        if (!open) return;

        setStep(0);
        setType(initialSide);
        setMarket("KR");
        setSymbolName("");
        setSymbolCode("");
        setQuantity(0);
        setPrice(0);
        setTradeDate(todayISO());
        setMemo("");
        setSelectedKrStock(null);
    }, [open, initialSide]);

    const canNext = useMemo(() => {
        if (step === 0) return !!type && !!account;

        if (step === 1) {
            if (market === "KR") {
                return !!selectedKrStock && !!symbolName.trim() && !!symbolCode.trim();
            }
            return !!market && symbolName.trim().length > 0 && symbolCode.trim().length > 0;
        }

        if (step === 2) return quantity > 0 && price > 0;
        if (step === 3) return true;

        return false;
    }, [step, type, account, market, selectedKrStock, symbolName, symbolCode, quantity, price]);

    const totalAmount = useMemo(() => quantity * price, [quantity, price]);

    const handleNext = () => {
        if (!canNext) return;
        setStep((s) => Math.min(s + 1, totalSteps - 1));
    };

    const handlePrev = () => setStep((s) => Math.max(s - 1, 0));

    const handleSubmit = async () => {
        if (!account) return;

        const draft: TradeDraft = {
            type,
            accountId: account.accountId,
            accountName: account.accountName ?? undefined,
            brokerName: account.brokerName ?? undefined,
            market,
            symbolName: symbolName.trim(),
            symbolCode: symbolCode.trim(),
            quantity,
            price,
            tradeDate,
            memo: memo.trim(),
        };

        try {
            setSubmitting(true);
            await onSubmit?.(draft);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 5,
                    overflow: "hidden",
                    boxShadow: "0 18px 50px rgba(17, 24, 39, 0.22)",
                },
            }}
        >
            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ position: "relative", px: 3, pt: 3, pb: 2 }}>
                    <IconButton
                        onClick={onClose}
                        disabled={submitting}
                        sx={{ position: "absolute", right: 12, top: 12 }}
                        aria-label="close"
                    >
                        <CloseRoundedIcon />
                    </IconButton>

                    <Typography
                        sx={{
                            textAlign: "center",
                            fontWeight: 900,
                            fontSize: 28,
                            lineHeight: 1.1,
                            background: "linear-gradient(90deg, #2F7BFF 0%, #B54CFF 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            letterSpacing: -0.5,
                        }}
                    >
                        매매 등록
                    </Typography>

                    <Box sx={{ mt: 2.2 }}>
                        <ProgressBar stepIndex={step} total={totalSteps} />
                    </Box>

                    <Typography sx={{ mt: 1.6, textAlign: "center", color: "#6B7280", fontWeight: 700 }}>
                        단계 {step + 1}/{totalSteps}
                    </Typography>
                </Box>

                <Divider />

                <Box sx={{ px: 3, py: 3 }}>
                    {step === 0 && (
                        <Stack spacing={2.2}>
                            <Typography sx={{ fontSize: 20, fontWeight: 900 }}>매매 유형을 선택하세요</Typography>

                            <Stack direction="row" spacing={2}>
                                <SelectCard
                                    selected={type === "BUY"}
                                    title="매수"
                                    tone="red"
                                    icon={<TrendingDownRoundedIcon sx={{ fontSize: 34 }} />}
                                    onClick={() => setType("BUY")}
                                />
                                <SelectCard
                                    selected={type === "SELL"}
                                    title="매도"
                                    tone="gray"
                                    icon={<TrendingUpRoundedIcon sx={{ fontSize: 34 }} />}
                                    onClick={() => setType("SELL")}
                                />
                            </Stack>

                            <Box sx={{ mt: 1 }}>
                                <Typography sx={{ fontWeight: 900, mb: 1 }}>계좌 선택</Typography>

                                <Box
                                    sx={{
                                        borderRadius: 3,
                                        border: "2px solid #2F7BFF",
                                        background: "rgba(47, 123, 255, 0.06)",
                                        p: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Box>
                                        <Typography sx={{ fontWeight: 900, fontSize: 16 }}>
                                            {account?.accountName ?? "예금"}
                                        </Typography>
                                        <Typography sx={{ color: "#6B7280", fontWeight: 700, mt: 0.4 }}>
                                            {account?.brokerName ?? "증권사"}
                                        </Typography>
                                    </Box>

                                    <Typography sx={{ fontWeight: 900, color: "#2F7BFF", fontSize: 18 }}>
                                        {money(toNumber(account?.cashBalance))}
                                    </Typography>
                                </Box>
                            </Box>
                        </Stack>
                    )}

                    {step === 1 && (
                        <Stack spacing={2.2}>
                            <Typography sx={{ fontSize: 20, fontWeight: 900 }}>종목 정보를 입력하세요</Typography>

                            <Typography sx={{ fontWeight: 900 }}>시장 선택</Typography>
                            <ToggleButtonGroup
                                exclusive
                                value={market}
                                onChange={(_, v) => {
                                    if (!v) return;
                                    setMarket(v);
                                    setSelectedKrStock(null);
                                    setSymbolName("");
                                    setSymbolCode("");
                                }}
                                sx={{
                                    "& .MuiToggleButton-root": {
                                        flex: 1,
                                        height: 84,
                                        borderRadius: 3,
                                        border: "1.5px solid #E6E8EE",
                                        fontWeight: 900,
                                    },
                                    "& .Mui-selected": {
                                        border: "2px solid #2F7BFF !important",
                                        background: "rgba(47, 123, 255, 0.10) !important",
                                        color: "#2F7BFF",
                                    },
                                }}
                            >
                                <ToggleButton value="KR">한국</ToggleButton>
                                <ToggleButton value="US">미국</ToggleButton>
                            </ToggleButtonGroup>

                            {market === "KR" ? (
                                <>
                                    <KrStockAutocomplete
                                        value={selectedKrStock}
                                        onSelect={(item) => {
                                            setSelectedKrStock(item);
                                            setSymbolName(item?.itmsNm ?? "");
                                            setSymbolCode(item?.srtnCd ?? "");
                                        }}
                                    />

                                    <TextField
                                        value={symbolCode}
                                        label="종목코드"
                                        fullWidth
                                        disabled
                                        InputProps={{
                                            sx: {
                                                borderRadius: 3,
                                                background: "#F4F6FA",
                                                "& fieldset": { borderColor: "transparent" },
                                            },
                                        }}
                                    />
                                </>
                            ) : (
                                <>
                                    <TextField
                                        value={symbolName}
                                        onChange={(e) => setSymbolName(e.target.value)}
                                        placeholder="예: Apple"
                                        label="종목명"
                                        fullWidth
                                        InputProps={{
                                            sx: {
                                                borderRadius: 3,
                                                background: "#F4F6FA",
                                                "& fieldset": { borderColor: "transparent" },
                                            },
                                        }}
                                    />

                                    <TextField
                                        value={symbolCode}
                                        onChange={(e) => setSymbolCode(e.target.value.toUpperCase())}
                                        placeholder="예: AAPL"
                                        label="종목코드"
                                        fullWidth
                                        InputProps={{
                                            sx: {
                                                borderRadius: 3,
                                                background: "#F4F6FA",
                                                "& fieldset": { borderColor: "transparent" },
                                            },
                                        }}
                                    />
                                </>
                            )}
                        </Stack>
                    )}

                    {step === 2 && (
                        <Stack spacing={2.2}>
                            <Typography sx={{ fontSize: 20, fontWeight: 900 }}>수량과 가격을 입력하세요</Typography>

                            <TextField
                                value={quantity === 0 ? "" : String(quantity)}
                                onChange={(e) => setQuantity(Math.max(0, Math.floor(toNumber(e.target.value))))}
                                label="수량"
                                placeholder="0"
                                fullWidth
                                inputMode="numeric"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">주</InputAdornment>,
                                    sx: {
                                        borderRadius: 3,
                                        background: "#F4F6FA",
                                        "& fieldset": { borderColor: "transparent" },
                                    },
                                }}
                            />

                            <TextField
                                value={price === 0 ? "" : String(price)}
                                onChange={(e) => setPrice(Math.max(0, Math.floor(toNumber(e.target.value))))}
                                label="가격"
                                placeholder="0"
                                fullWidth
                                inputMode="numeric"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">₩</InputAdornment>,
                                    sx: {
                                        borderRadius: 3,
                                        background: "#F4F6FA",
                                        "& fieldset": { borderColor: "transparent" },
                                    },
                                }}
                            />

                            <Box
                                sx={{
                                    borderRadius: 3,
                                    background: "rgba(47, 123, 255, 0.08)",
                                    p: 2,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Typography sx={{ fontWeight: 900, color: "#374151" }}>총 금액</Typography>
                                <Typography sx={{ fontWeight: 900, color: "#2F7BFF", fontSize: 18 }}>
                                    {money(totalAmount)}
                                </Typography>
                            </Box>
                        </Stack>
                    )}

                    {step === 3 && (
                        <Stack spacing={2.2}>
                            <Typography sx={{ fontSize: 20, fontWeight: 900 }}>최종 확인</Typography>

                            <Box sx={{ borderRadius: 3, background: "#F7F8FB", p: 2 }}>
                                <Stack spacing={1.4}>
                                    <Row label="거래 유형" value={type === "BUY" ? "매수" : "매도"} valueColor={type === "BUY" ? "#FF4D4F" : "#111827"} />
                                    <Row label="종목" value={symbolName || "-"} />
                                    <Row label="수량" value={`${quantity}주`} />
                                    <Row label="가격" value={money(price)} />
                                    <Row label="총 금액" value={money(totalAmount)} valueColor="#2F7BFF" />
                                </Stack>
                            </Box>

                            <Typography sx={{ fontWeight: 900 }}>거래일</Typography>
                            <TextField
                                value={tradeDate}
                                onChange={(e) => setTradeDate(e.target.value)}
                                type="date"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarMonthRoundedIcon />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        borderRadius: 3,
                                        background: "#F4F6FA",
                                        "& fieldset": { borderColor: "transparent" },
                                    },
                                }}
                                helperText={tradeDate ? formatKRDate(tradeDate) : ""}
                            />

                            <TextField
                                value={memo}
                                onChange={(e) => setMemo(e.target.value)}
                                label="메모 (선택)"
                                placeholder="메모를 입력하세요"
                                fullWidth
                                InputProps={{
                                    sx: {
                                        borderRadius: 3,
                                        background: "#F4F6FA",
                                        "& fieldset": { borderColor: "transparent" },
                                    },
                                }}
                            />

                            <Stack direction="row" spacing={1} alignItems="center">
                                <Chip label={market === "KR" ? "한국" : "미국"} sx={{ fontWeight: 800 }} />
                                <Chip label={`코드: ${symbolCode || "-"}`} sx={{ fontWeight: 800 }} />
                            </Stack>
                        </Stack>
                    )}
                </Box>

                <Box sx={{ px: 3, pb: 3 }}>
                    <Stack direction="row" spacing={2}>
                        {step > 0 ? (
                            <Button
                                onClick={handlePrev}
                                variant="outlined"
                                fullWidth
                                sx={{
                                    height: 56,
                                    borderRadius: 999,
                                    fontWeight: 900,
                                    borderColor: "#E6E8EE",
                                    color: "#111827",
                                }}
                            >
                                이전
                            </Button>
                        ) : (
                            <Button
                                onClick={onClose}
                                variant="outlined"
                                fullWidth
                                sx={{
                                    height: 56,
                                    borderRadius: 999,
                                    fontWeight: 900,
                                    borderColor: "#E6E8EE",
                                    color: "#111827",
                                }}
                            >
                                닫기
                            </Button>
                        )}

                        {step < totalSteps - 1 ? (
                            <Button
                                onClick={handleNext}
                                disabled={!canNext}
                                variant="contained"
                                fullWidth
                                sx={{
                                    height: 56,
                                    borderRadius: 999,
                                    fontWeight: 900,
                                    background: "linear-gradient(90deg, #2F7BFF 0%, #B54CFF 100%)",
                                    boxShadow: "0 16px 30px rgba(76, 68, 255, 0.18)",
                                    "&:disabled": {
                                        background: "#D7DBE6",
                                        color: "#fff",
                                    },
                                }}
                            >
                                다음
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                variant="contained"
                                fullWidth
                                disabled={submitting}
                                sx={{
                                    height: 56,
                                    borderRadius: 999,
                                    fontWeight: 900,
                                    background: "linear-gradient(90deg, #2F7BFF 0%, #B54CFF 100%)",
                                    boxShadow: "0 16px 30px rgba(76, 68, 255, 0.18)",
                                }}
                            >
                                {submitting ? "등록 중..." : "등록"}
                            </Button>
                        )}
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

function Row({
                 label,
                 value,
                 valueColor,
             }: {
    label: string;
    value: string;
    valueColor?: string;
}) {
    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ color: "#6B7280", fontWeight: 800 }}>{label}</Typography>
            <Typography sx={{ fontWeight: 900, color: valueColor ?? "#111827" }}>{value}</Typography>
        </Box>
    );
}