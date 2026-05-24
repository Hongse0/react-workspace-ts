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
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    type BatchType,
    useRunStockBatchMutation,
} from "../../services/settings/useRunStockBatchMutation.ts";
import type { ManualBatchResult } from "../../module/common/StockBatchService";
import "./manual-batch.css";

interface BatchItem {
    type: BatchType;
    title: string;
    description: string;
    endpoint: string;
    icon: React.ReactNode;
}

const BATCH_ITEMS: BatchItem[] = [
    {
        type: "STOCK_KRX",
        title: "주식 KRX 마스터 동기화",
        description: "국내 주식 종목 마스터 데이터를 MySQL에 저장합니다.",
        endpoint: "POST /v1/stocks/sync/krx",
        icon: <StorageRoundedIcon />,
    },
    {
        type: "STOCK_ES",
        title: "주식 ES 검색 인덱스 이관",
        description: "MySQL 종목 데이터를 Elasticsearch 검색 인덱스로 이관합니다.",
        endpoint: "POST /v1/stocks/sync/es",
        icon: <SearchRoundedIcon />,
    },
    {
        type: "ETF",
        title: "ETF 종목 마스터 동기화",
        description: "ETF 종목 마스터 데이터를 MySQL에 저장합니다.",
        endpoint: "POST /v1/stocks/sync/etf",
        icon: <DatasetRoundedIcon />,
    },
];

function getTodayBasDt() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    return `${yyyy}${mm}${dd}`;
}

function formatBatchResult(result: ManualBatchResult) {
    return `총 ${result.totalCount.toLocaleString()}건 / 저장 ${result.saved.toLocaleString()}건 / 페이지 ${result.totalPages.toLocaleString()}개`;
}

export default function ManualBatchPage() {
    const navigate = useNavigate();

    const [basDt, setBasDt] = useState("");
    const [runningType, setRunningType] = useState<BatchType | null>(null);
    const [lastResult, setLastResult] = useState<{
        title: string;
        result: ManualBatchResult;
    } | null>(null);

    const { mutateAsync, isPending, error } = useRunStockBatchMutation();

    const normalizedBasDt = useMemo(() => {
        return basDt.replace(/-/g, "").trim();
    }, [basDt]);

    const handleRunBatch = async (item: BatchItem) => {
        if (normalizedBasDt && !/^\d{8}$/.test(normalizedBasDt)) {
            alert("기준일자는 YYYYMMDD 형식으로 입력해주세요. 예: 20260524");
            return;
        }

        const ok = window.confirm(
            `${item.title}를 실행할까요?\n\n기준일자: ${
                normalizedBasDt || "서버 자동 계산"
            }`
        );

        if (!ok) return;

        try {
            setRunningType(item.type);
            setLastResult(null);

            const result = await mutateAsync({
                type: item.type,
                basDt: normalizedBasDt || undefined,
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
                            기준일자를 입력하고 주식/ETF 동기화 배치를 직접 실행할 수 있어요.
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
                        helperText="비워두면 서버에서 기준일자를 자동 계산합니다. 직접 입력 시 YYYYMMDD 형식으로 입력하세요."
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