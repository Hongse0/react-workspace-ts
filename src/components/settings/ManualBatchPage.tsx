import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DatasetRoundedIcon from "@mui/icons-material/DatasetRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    type BatchType,
    type RunBatchResult,
    useRunStockBatchMutation,
} from "../../services/settings/useRunStockBatchMutation.ts";
import "./manual-batch.css";

interface BatchItem {
    type: BatchType;
    title: string;
    description: string;
    endpoint: string;
    icon: React.ReactNode;
    useBasDt: boolean;
}

const BATCH_ITEMS: BatchItem[] = [
    {
        type: "STOCK_KRX",
        title: "주식 KRX 마스터 동기화",
        description: "국내 주식 종목 마스터 데이터를 MySQL에 저장합니다.",
        endpoint: "POST /v1/stocks/sync/krx",
        icon: <StorageRoundedIcon />,
        useBasDt: true,
    },
    {
        type: "STOCK_ES",
        title: "주식 ES 검색 인덱스 이관",
        description: "MySQL 종목 데이터를 Elasticsearch 검색 인덱스로 이관합니다.",
        endpoint: "POST /v1/stocks/sync/es",
        icon: <SearchRoundedIcon />,
        useBasDt: false,
    },
    {
        type: "ETF",
        title: "ETF 종목 마스터 동기화",
        description: "ETF 종목 마스터 데이터를 MySQL에 저장합니다.",
        endpoint: "POST /v1/stocks/sync/etf",
        icon: <DatasetRoundedIcon />,
        useBasDt: true,
    },
    {
        type: "STOCK_INVESTMENT_SCORE",
        title: "종목 투자 의견 점수 동기화",
        description:
            "가격 데이터 기반으로 종목별 투자점수, 의견 코드, 요약 사유를 계산하고 저장합니다.",
        endpoint: "POST /v1/stocks/investment-scores/sync",
        icon: <InsightsRoundedIcon />,
        useBasDt: false,
    },
];

function getTodayBasDt() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    return `${yyyy}${mm}${dd}`;
}

function isInvestmentScoreSyncResult(
    result: RunBatchResult
): result is { targetCount: number; savedCount: number; failCount: number } {
    return (
        "targetCount" in result &&
        "savedCount" in result &&
        "failCount" in result
    );
}

function formatBatchResult(result: RunBatchResult) {
    if (isInvestmentScoreSyncResult(result)) {
        return [
            `대상 ${result.targetCount.toLocaleString()}건`,
            `저장 ${result.savedCount.toLocaleString()}건`,
            `실패 ${result.failCount.toLocaleString()}건`,
        ].join(" / ");
    }

    return [
        `총 ${(result.totalCount ?? 0).toLocaleString()}건`,
        `저장 ${(result.saved ?? 0).toLocaleString()}건`,
        `페이지 ${(result.totalPages ?? 0).toLocaleString()}개`,
    ].join(" / ");
}

export default function ManualBatchPage() {
    const navigate = useNavigate();

    const [basDt, setBasDt] = useState("");
    const [runningType, setRunningType] = useState<BatchType | null>(null);
    const [lastResult, setLastResult] = useState<{
        title: string;
        result: RunBatchResult;
    } | null>(null);

    const { mutateAsync, isPending, error } = useRunStockBatchMutation();

    const normalizedBasDt = useMemo(() => {
        return basDt.replace(/-/g, "").trim();
    }, [basDt]);

    const handleRunBatch = async (item: BatchItem) => {
        if (item.useBasDt && normalizedBasDt && !/^\d{8}$/.test(normalizedBasDt)) {
            alert("기준일자는 YYYYMMDD 형식으로 입력해주세요. 예: 20260524");
            return;
        }

        const confirmMessage = item.useBasDt
            ? `${item.title}를 실행할까요?\n\n기준일자: ${
                normalizedBasDt || "서버 자동 계산"
            }`
            : `${item.title}를 실행할까요?\n\n이 배치는 기준일자를 사용하지 않습니다.`;

        const ok = window.confirm(confirmMessage);

        if (!ok) return;

        try {
            setRunningType(item.type);
            setLastResult(null);

            const result = await mutateAsync({
                type: item.type,
                basDt: item.useBasDt ? normalizedBasDt || undefined : undefined,
            });

            setLastResult({
                title: item.title,
                result,
            });
        } finally {
            setRunningType(null);
        }
    };

    return (
        <Box className="manual-batch-page">
            <Container maxWidth="sm" disableGutters className="manual-batch-container">
                <header className="manual-batch-header">
                    <button
                        type="button"
                        className="manual-batch-header__back"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowBackRoundedIcon />
                    </button>

                    <div>
                        <Typography className="manual-batch-header__eyebrow">
                            관리자 기능
                        </Typography>

                        <Typography className="manual-batch-header__title">
                            배치 수동 실행
                        </Typography>

                        <Typography className="manual-batch-header__desc">
                            기준일자를 입력하고 주식/ETF 동기화 및 투자점수 계산 배치를 직접 실행할 수 있어요.
                        </Typography>
                    </div>
                </header>

                <Paper elevation={0} className="manual-batch-date-card">
                    <Typography className="manual-batch-section-title">
                        기준일자
                    </Typography>

                    <TextField
                        fullWidth
                        value={basDt}
                        onChange={(e) => setBasDt(e.target.value)}
                        placeholder={`예: ${getTodayBasDt()}`}
                        inputProps={{
                            maxLength: 8,
                            inputMode: "numeric",
                        }}
                        helperText="비워두면 서버에서 기준일자를 자동 계산합니다. 투자 의견 점수 동기화 배치는 기준일자를 사용하지 않습니다."
                    />
                </Paper>

                <Stack spacing={1.5} mt={2}>
                    {BATCH_ITEMS.map((item) => {
                        const isRunning = isPending && runningType === item.type;

                        return (
                            <Paper
                                key={item.type}
                                elevation={0}
                                className="manual-batch-card"
                            >
                                <Box className="manual-batch-card__top">
                                    <Box className="manual-batch-card__icon">
                                        {item.icon}
                                    </Box>

                                    <Box className="manual-batch-card__content">
                                        <Typography className="manual-batch-card__title">
                                            {item.title}
                                        </Typography>

                                        <Typography className="manual-batch-card__desc">
                                            {item.description}
                                        </Typography>

                                        <Typography className="manual-batch-card__endpoint">
                                            {item.endpoint}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    disabled={isPending}
                                    onClick={() => handleRunBatch(item)}
                                    className="manual-batch-card__button"
                                    startIcon={
                                        isRunning ? (
                                            <CircularProgress size={16} color="inherit" />
                                        ) : (
                                            <SyncRoundedIcon />
                                        )
                                    }
                                >
                                    {isRunning ? "실행 중..." : "수동 실행"}
                                </Button>
                            </Paper>
                        );
                    })}
                </Stack>

                {lastResult && (
                    <Alert severity="success" className="manual-batch-result">
                        <strong>{lastResult.title}</strong>
                        <br />
                        {formatBatchResult(lastResult.result)}
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" className="manual-batch-result">
                        {error instanceof Error
                            ? error.message
                            : "배치 실행 중 오류가 발생했습니다."}
                    </Alert>
                )}
            </Container>
        </Box>
    );
}