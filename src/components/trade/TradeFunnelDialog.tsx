import { useEffect, useMemo, useState } from "react";
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
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import { KrStockAutocomplete } from "./KrStockAutocomplete.tsx";
import type {StockSearchItem} from "../../module/common/StockSearchService.ts";

// type StockSearchItem = {
//     srtnCd: string;
//     isinCd: string;
//     mrktCtg: string;
//     itmsNm: string;
//     corpNm: string;
//     activeYn: string;
//     basDt: string;
// };

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

export type HoldingItem = {
    stockId: number | string;
    symbolCode: string;
    symbolName: string;
    quantity: number;
    availableQuantity?: number;
    avgPrice?: number;
    currentPrice?: number;
    evaluationAmount?: number;
    profitLoss?: number;
    profitRate?: number;
    rate?: number;
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
    holdings?: HoldingItem[];
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

export default function TradeFunnelDialog({
                                              open,
                                              onClose,
                                              account,
                                              holdings = [],
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
    const [selectedHolding, setSelectedHolding] = useState<HoldingItem | null>(null);

    const sellableQuantity = useMemo(() => {
        if (!selectedHolding) return 0;
        return selectedHolding.availableQuantity ?? selectedHolding.quantity ?? 0;
    }, [selectedHolding]);

    useEffect(() => {
        if (market === "KR" && type === "BUY") {
            setSymbolName(selectedKrStock?.itmsNm ?? "");
            setSymbolCode(selectedKrStock?.srtnCd ?? "");
        }
    }, [market, selectedKrStock, type]);

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
        setSelectedHolding(null);
    }, [open, initialSide]);

    const canNext = useMemo(() => {
        if (step === 0) return !!account;

        if (step === 1) {
            if (type === "SELL") {
                return !!selectedHolding;
            }

            if (market === "KR") {
                return !!selectedKrStock && !!symbolName.trim() && !!symbolCode.trim();
            }

            return !!market && symbolName.trim().length > 0 && symbolCode.trim().length > 0;
        }

        if (step === 2) {
            if (type === "SELL") {
                return quantity > 0 && quantity <= sellableQuantity && price > 0;
            }
            return quantity > 0 && price > 0;
        }

        if (step === 3) return true;
        return false;
    }, [
        step,
        account,
        type,
        market,
        selectedKrStock,
        symbolName,
        symbolCode,
        selectedHolding,
        quantity,
        price,
        sellableQuantity,
    ]);

    const totalAmount = useMemo(() => quantity * price, [quantity, price]);

    const selectedHoldingProfitColor = useMemo(() => {
        const value = selectedHolding?.profitLoss ?? 0;
        if (value > 0) return "#2563EB";
        if (value < 0) return "#FF4D4F";
        return "#111827";
    }, [selectedHolding]);

    const handleNext = () => {
        if (!canNext) return;
        setStep((s) => Math.min(s + 1, totalSteps - 1));
    };

    const handlePrev = () => {
        setStep((s) => Math.max(s - 1, 0));
    };

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
            onClose={submitting ? undefined : onClose}
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
                            <Typography sx={{ fontSize: 20, fontWeight: 900 }}>
                                거래 유형을 확인하세요
                            </Typography>

                            <Box
                                sx={{
                                    borderRadius: 3,
                                    border:
                                        type === "BUY"
                                            ? "1.5px solid #FF4D4F"
                                            : "1.5px solid #2F7BFF",
                                    background:
                                        type === "BUY"
                                            ? "rgba(255, 77, 79, 0.06)"
                                            : "rgba(47, 123, 255, 0.08)",
                                    p: 2.2,
                                }}
                            >
                                <Stack direction="row" spacing={1.4} alignItems="center">
                                    {type === "BUY" ? (
                                        <TrendingDownRoundedIcon sx={{ fontSize: 28, color: "#FF4D4F" }} />
                                    ) : (
                                        <TrendingUpRoundedIcon sx={{ fontSize: 28, color: "#2F7BFF" }} />
                                    )}

                                    <Box>
                                        <Typography sx={{ fontWeight: 900, fontSize: 18 }}>
                                            {type === "BUY" ? "매수" : "매도"}
                                        </Typography>
                                        <Typography sx={{ color: "#6B7280", fontWeight: 700, mt: 0.4 }}>
                                            {type === "BUY"
                                                ? "선택한 계좌로 종목을 매수합니다."
                                                : "현재 계좌의 보유 종목을 선택해 매도합니다."}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>

                            <Box sx={{ mt: 1 }}>
                                <Typography sx={{ fontWeight: 900, mb: 1 }}>계좌 확인</Typography>

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
                                            {account?.accountName ?? "계좌"}
                                        </Typography>
                                        <Typography sx={{ color: "#6B7280", fontWeight: 700, mt: 0.4 }}>
                                            {account?.brokerName ?? "증권사"}
                                        </Typography>
                                        <Typography sx={{ color: "#9CA3AF", fontWeight: 700, mt: 0.3, fontSize: 13 }}>
                                            {account?.accountNumber ?? "-"}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ textAlign: "right" }}>
                                        <Typography sx={{ fontWeight: 900, color: "#2F7BFF", fontSize: 18 }}>
                                            {money(toNumber(account?.cashBalance))}
                                        </Typography>
                                        <Typography sx={{ color: "#6B7280", fontWeight: 700, mt: 0.4, fontSize: 13 }}>
                                            보유종목 {account?.holdingCount ?? 0}개
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Stack>
                    )}

                    {step === 1 && type === "BUY" && (
                        <Stack spacing={2.2}>
                            <Typography sx={{ fontSize: 20, fontWeight: 900 }}>
                                종목 정보를 입력하세요
                            </Typography>

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
                                {/*<ToggleButton value="US">미국</ToggleButton>*/}
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

                    {step === 1 && type === "SELL" && (
                        <Stack spacing={2.2}>
                            <Box>
                                <Typography sx={{ fontSize: 20, fontWeight: 900 }}>
                                    보유 주식을 선택하세요
                                </Typography>
                                <Typography sx={{ mt: 0.8, color: "#6B7280", fontWeight: 700 }}>
                                    현재 계좌에 보유 중인 종목만 매도할 수 있습니다.
                                </Typography>
                            </Box>

                            {!holdings.length ? (
                                <Box
                                    sx={{
                                        borderRadius: 3,
                                        background: "#F7F8FB",
                                        border: "1px dashed #D1D5DB",
                                        p: 3,
                                        textAlign: "center",
                                    }}
                                >
                                    <Inventory2RoundedIcon sx={{ fontSize: 34, color: "#9CA3AF" }} />
                                    <Typography sx={{ fontWeight: 800, color: "#6B7280", mt: 1.2 }}>
                                        현재 보유 중인 주식이 없습니다.
                                    </Typography>
                                </Box>
                            ) : (
                                <Stack spacing={1.4}>
                                    {holdings.map((item) => {
                                        const isSelected = selectedHolding?.stockId === item.stockId;
                                        const qty = item.availableQuantity ?? item.quantity ?? 0;
                                        const rate = Number(item.profitRate ?? item.rate ?? 0);
                                        const profitColor = rate > 0 ? "#2563EB" : rate < 0 ? "#FF4D4F" : "#111827";

                                        return (
                                            <Box
                                                key={item.stockId}
                                                onClick={() => {
                                                    setSelectedHolding(item);
                                                    setMarket("KR");
                                                    setSymbolName(item.symbolName);
                                                    setSymbolCode(item.symbolCode);
                                                }}
                                                sx={{
                                                    cursor: "pointer",
                                                    borderRadius: 3,
                                                    border: isSelected ? "2px solid #2F7BFF" : "1.5px solid #E6E8EE",
                                                    background: isSelected ? "rgba(47,123,255,0.08)" : "#fff",
                                                    p: 2,
                                                    transition: "all .18s",
                                                    boxShadow: isSelected ? "0 10px 24px rgba(47,123,255,0.10)" : "none",
                                                }}
                                            >
                                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                    <Box>
                                                        <Typography sx={{ fontWeight: 900, fontSize: 17 }}>
                                                            {item.symbolName}
                                                        </Typography>
                                                        <Typography sx={{ mt: 0.4, color: "#6B7280", fontWeight: 700 }}>
                                                            {item.symbolCode}
                                                        </Typography>

                                                        <Stack direction="row" spacing={1} mt={1.2} flexWrap="wrap">
                                                            <Chip
                                                                size="small"
                                                                icon={<ShowChartRoundedIcon />}
                                                                label={`평균단가 ${money(item.avgPrice ?? 0)}`}
                                                                sx={{ fontWeight: 800 }}
                                                            />
                                                        </Stack>
                                                    </Box>

                                                    <Box sx={{ textAlign: "right" }}>
                                                        <Typography sx={{ fontWeight: 900 }}>
                                                            {qty}주
                                                        </Typography>
                                                        <Typography
                                                            sx={{
                                                                mt: 0.5,
                                                                color: profitColor,
                                                                fontWeight: 900,
                                                                fontSize: 13,
                                                            }}
                                                        >
                                                            수익률 {rate > 0 ? "+" : ""}{rate.toFixed(2)}%
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            )}
                        </Stack>
                    )}

                    {step === 2 && (
                        <Stack spacing={2.2}>
                            <Typography sx={{ fontSize: 20, fontWeight: 900 }}>
                                {type === "BUY" ? "수량과 가격을 입력하세요" : "매도 수량과 가격을 입력하세요"}
                            </Typography>

                            {type === "SELL" && selectedHolding && (
                                <Box
                                    sx={{
                                        borderRadius: 3,
                                        background: "linear-gradient(135deg, rgba(47,123,255,0.08), rgba(181,76,255,0.08))",
                                        p: 2,
                                    }}
                                >
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                        <Box>
                                            <Typography sx={{ fontWeight: 900, fontSize: 16 }}>
                                                {selectedHolding.symbolName}
                                            </Typography>
                                            <Typography sx={{ mt: 0.4, color: "#6B7280", fontWeight: 700 }}>
                                                {selectedHolding.symbolCode}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ textAlign: "right" }}>
                                            <Typography sx={{ fontWeight: 900 }}>
                                                보유 {sellableQuantity}주
                                            </Typography>
                                            <Typography sx={{ mt: 0.4, color: "#6B7280", fontWeight: 700, fontSize: 13 }}>
                                                평균단가 {money(selectedHolding.avgPrice ?? 0)}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    <Divider sx={{ my: 1.5 }} />

                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography sx={{ color: "#6B7280", fontWeight: 800 }}>평가손익</Typography>
                                        <Typography sx={{ fontWeight: 900, color: selectedHoldingProfitColor }}>
                                            {money(selectedHolding.profitLoss ?? 0)}
                                        </Typography>
                                    </Stack>
                                </Box>
                            )}

                            <TextField
                                value={quantity === 0 ? "" : String(quantity)}
                                onChange={(e) => {
                                    const next = Math.max(0, Math.floor(toNumber(e.target.value)));
                                    setQuantity(next);
                                }}
                                label="수량"
                                placeholder="0"
                                fullWidth
                                inputMode="numeric"
                                error={type === "SELL" && quantity > sellableQuantity}
                                helperText={
                                    type === "SELL"
                                        ? `최대 ${sellableQuantity}주까지 매도할 수 있습니다.`
                                        : " "
                                }
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
                                label={type === "BUY" ? "매수가격" : "매도가격"}
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
                                <Typography sx={{ fontWeight: 900, color: "#374151" }}>
                                    {type === "BUY" ? "총 매수 금액" : "예상 매도 금액"}
                                </Typography>
                                <Typography sx={{ fontWeight: 900, color: "#2F7BFF", fontSize: 18 }}>
                                    {money(totalAmount)}
                                </Typography>
                            </Box>
                        </Stack>
                    )}

                    {step === 3 && (
                        <Stack spacing={2.2}>
                            <Box
                                sx={{
                                    borderRadius: 3,
                                    p: 2,
                                    background:
                                        type === "BUY"
                                            ? "linear-gradient(135deg, rgba(255,77,79,0.08), rgba(255,148,120,0.08))"
                                            : "linear-gradient(135deg, rgba(47,123,255,0.08), rgba(181,76,255,0.08))",
                                }}
                            >
                                <Typography sx={{ fontWeight: 900, fontSize: 16 }}>
                                    {type === "BUY" ? "매수 주문 확인" : "매도 주문 확인"}
                                </Typography>
                                <Typography sx={{ mt: 0.6, color: "#6B7280", fontWeight: 700 }}>
                                    입력한 주문 정보를 확인한 뒤 등록하세요.
                                </Typography>
                            </Box>

                            <Box sx={{ borderRadius: 3, background: "#F7F8FB", p: 2 }}>
                                <Stack spacing={1.4}>
                                    <Row
                                        label="거래 유형"
                                        value={type === "BUY" ? "매수" : "매도"}
                                        valueColor={type === "BUY" ? "#FF4D4F" : "#2563EB"}
                                    />
                                    <Row label="계좌" value={account?.accountName ?? "-"} />
                                    <Row label="종목" value={symbolName || "-"} />
                                    <Row label="종목코드" value={symbolCode || "-"} />
                                    <Row label="수량" value={`${quantity}주`} />
                                    <Row label="가격" value={money(price)} />
                                    <Row
                                        label={type === "BUY" ? "총 매수 금액" : "예상 매도 금액"}
                                        value={money(totalAmount)}
                                        valueColor="#2F7BFF"
                                    />
                                    {type === "SELL" && selectedHolding && (
                                        <Row
                                            label="보유 가능 수량"
                                            value={`${sellableQuantity}주`}
                                        />
                                    )}
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
                                placeholder={type === "BUY" ? "매수 메모를 입력하세요" : "매도 메모를 입력하세요"}
                                fullWidth
                                InputProps={{
                                    sx: {
                                        borderRadius: 3,
                                        background: "#F4F6FA",
                                        "& fieldset": { borderColor: "transparent" },
                                    },
                                }}
                            />

                            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                <Chip label={market === "KR" ? "한국" : "미국"} sx={{ fontWeight: 800 }} />
                                <Chip label={`코드: ${symbolCode || "-"}`} sx={{ fontWeight: 800 }} />
                                <Chip label={type === "BUY" ? "매수 주문" : "매도 주문"} sx={{ fontWeight: 800 }} />
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
                                disabled={submitting || !canNext}
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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
            <Typography sx={{ color: "#6B7280", fontWeight: 800 }}>{label}</Typography>
            <Typography sx={{ fontWeight: 900, color: valueColor ?? "#111827", textAlign: "right" }}>
                {value}
            </Typography>
        </Box>
    );
}