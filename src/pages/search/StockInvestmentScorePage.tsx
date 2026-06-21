import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Divider,
    LinearProgress,
    Stack,
    Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import DatasetRoundedIcon from "@mui/icons-material/DatasetRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import { useNavigate, useParams } from "react-router-dom";
import { useStockInvestmentScoreQuery } from "../../services/search/useStockInvestmentScoreQuery";
import type { InvestmentOpinion } from "../../module/common/StockInvestmentScoreService";

function formatPercent(value?: number | null) {
    if (value === null || value === undefined) return "-";
    return `${value.toFixed(2)}%`;
}

function formatPrice(value?: number | null) {
    if (value === null || value === undefined) return "-";
    return `₩${Math.round(value).toLocaleString("ko-KR")}`;
}

function formatRatio(value?: number | null) {
    if (value === null || value === undefined) return "-";
    return `${value.toFixed(2)}배`;
}

function getOpinionLabel(opinion?: InvestmentOpinion) {
    switch (opinion) {
        case "STRONG":
            return "매우 긍정";
        case "POSITIVE":
            return "긍정";
        case "WATCH":
            return "관심";
        case "CAUTION":
            return "주의";
        case "AVOID":
            return "회피";
        default:
            return "-";
    }
}

function getOpinionDescription(opinion?: InvestmentOpinion) {
    switch (opinion) {
        case "STRONG":
            return "추세와 모멘텀이 모두 강한 편입니다.";
        case "POSITIVE":
            return "전반적인 투자 의견이 양호한 편입니다.";
        case "WATCH":
            return "관심 종목으로 지켜볼 수 있는 구간입니다.";
        case "CAUTION":
            return "변동성이나 추세 약화에 주의가 필요합니다.";
        case "AVOID":
            return "현재 기준에서는 보수적으로 접근하는 것이 좋습니다.";
        default:
            return "투자 의견 데이터가 없습니다.";
    }
}

function ScoreBar({
                      label,
                      score,
                      max,
                      icon,
                  }: {
    label: string;
    score: number;
    max: number;
    icon: React.ReactNode;
}) {
    const percent = max > 0 ? Math.min(100, Math.max(0, (score / max) * 100)) : 0;

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.8}>
                <Stack direction="row" spacing={1} alignItems="center">
                    {icon}
                    <Typography sx={{ fontWeight: 800, fontSize: 14 }}>
                        {label}
                    </Typography>
                </Stack>

                <Typography sx={{ fontWeight: 900, fontSize: 14 }}>
                    {score} / {max}
                </Typography>
            </Stack>

            <LinearProgress
                variant="determinate"
                value={percent}
                sx={{
                    height: 9,
                    borderRadius: 99,
                }}
            />
        </Box>
    );
}

function MetricCard({
                        label,
                        value,
                        helper,
                    }: {
    label: string;
    value: string;
    helper?: string;
}) {
    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 3,
                height: "100%",
            }}
        >
            <CardContent>
                <Typography sx={{ fontSize: 13, color: "text.secondary", fontWeight: 700 }}>
                    {label}
                </Typography>
                <Typography sx={{ mt: 0.8, fontSize: 20, fontWeight: 900 }}>
                    {value}
                </Typography>
                {helper && (
                    <Typography sx={{ mt: 0.5, fontSize: 12, color: "text.secondary" }}>
                        {helper}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}

export default function StockInvestmentScorePage() {
    const navigate = useNavigate();
    const { srtnCd } = useParams<{ srtnCd: string }>();

    const { data, isLoading, isError } = useStockInvestmentScoreQuery(srtnCd);

    if (isLoading) {
        return (
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Typography sx={{ fontWeight: 800 }}>투자 리포트를 불러오는 중입니다.</Typography>
                <LinearProgress sx={{ mt: 2 }} />
            </Container>
        );
    }

    if (isError || !data) {
        return (
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Button
                    startIcon={<ArrowBackRoundedIcon />}
                    onClick={() => navigate("/market")}
                    sx={{ mb: 2 }}
                >
                    검색으로 돌아가기
                </Button>

                <Card variant="outlined" sx={{ borderRadius: 3 }}>
                    <CardContent>
                        <Typography sx={{ fontWeight: 900, fontSize: 18 }}>
                            투자 리포트를 불러오지 못했습니다.
                        </Typography>
                        <Typography sx={{ mt: 1, color: "text.secondary" }}>
                            종목 코드가 올바른지 확인해주세요.
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    const metrics = data.metrics;

    return (
        <Box sx={{ minHeight: "100%", bgcolor: "background.default" }}>
            <Container maxWidth="sm" sx={{ py: 3 }}>
                <Button
                    startIcon={<ArrowBackRoundedIcon />}
                    onClick={() => navigate("/market")}
                    sx={{ mb: 2, fontWeight: 800 }}
                >
                    종목 검색
                </Button>

                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: "1px solid",
                        borderColor: "divider",
                        overflow: "hidden",
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box>
                                <Typography sx={{ fontSize: 13, color: "text.secondary", fontWeight: 800 }}>
                                    투자 의견 리포트
                                </Typography>

                                <Typography sx={{ mt: 0.6, fontSize: 26, fontWeight: 950 }}>
                                    {data.itmsNm}
                                </Typography>

                                <Typography sx={{ mt: 0.5, color: "text.secondary", fontWeight: 700 }}>
                                    {data.srtnCd} · 기준일 {data.basDt ?? "-"}
                                </Typography>
                            </Box>

                            <Chip
                                label={getOpinionLabel(data.opinion)}
                                sx={{
                                    fontWeight: 900,
                                    borderRadius: 2,
                                }}
                            />
                        </Stack>

                        <Stack direction="row" alignItems="flex-end" spacing={1.5} mt={3}>
                            <Typography sx={{ fontSize: 56, fontWeight: 950, lineHeight: 1 }}>
                                {data.totalScore}
                            </Typography>
                            <Typography sx={{ mb: 0.8, fontSize: 18, fontWeight: 900, color: "text.secondary" }}>
                                / 100
                            </Typography>
                        </Stack>

                        <Typography sx={{ mt: 1.5, color: "text.secondary", fontWeight: 700 }}>
                            {getOpinionDescription(data.opinion)}
                        </Typography>
                    </CardContent>
                </Card>

                <Card
                    variant="outlined"
                    sx={{
                        mt: 2,
                        borderRadius: 4,
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Typography sx={{ fontSize: 18, fontWeight: 950, mb: 2 }}>
                            점수 구성
                        </Typography>

                        <Stack spacing={2.2}>
                            <ScoreBar
                                label="추세 점수"
                                score={data.trendScore}
                                max={30}
                                icon={<TrendingUpRoundedIcon fontSize="small" />}
                            />

                            <ScoreBar
                                label="모멘텀 점수"
                                score={data.momentumScore}
                                max={20}
                                icon={<ShowChartRoundedIcon fontSize="small" />}
                            />

                            <ScoreBar
                                label="변동성 위험 점수"
                                score={data.volatilityRiskScore}
                                max={20}
                                icon={<ShieldRoundedIcon fontSize="small" />}
                            />

                            <ScoreBar
                                label="데이터 신뢰도"
                                score={data.dataReliabilityScore}
                                max={10}
                                icon={<DatasetRoundedIcon fontSize="small" />}
                            />

                            <ScoreBar
                                label="포트폴리오 적합도"
                                score={data.portfolioFitScore}
                                max={20}
                                icon={<AccountBalanceWalletRoundedIcon fontSize="small" />}
                            />
                        </Stack>
                    </CardContent>
                </Card>

                <Card
                    variant="outlined"
                    sx={{
                        mt: 2,
                        borderRadius: 4,
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Typography sx={{ fontSize: 18, fontWeight: 950, mb: 2 }}>
                            주요 지표
                        </Typography>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                                gap: 1.4,
                            }}
                        >
                            <MetricCard
                                label="5일 수익률"
                                value={formatPercent(metrics.return5d)}
                            />
                            <MetricCard
                                label="20일 수익률"
                                value={formatPercent(metrics.return20d)}
                            />
                            <MetricCard
                                label="60일 수익률"
                                value={formatPercent(metrics.return60d)}
                            />
                            <MetricCard
                                label="20일 변동성"
                                value={formatPercent(metrics.volatility20d)}
                            />
                            <MetricCard
                                label="5일 이동평균"
                                value={formatPrice(metrics.movingAverage5d)}
                            />
                            <MetricCard
                                label="20일 이동평균"
                                value={formatPrice(metrics.movingAverage20d)}
                            />
                            <MetricCard
                                label="60일 이동평균"
                                value={formatPrice(metrics.movingAverage60d)}
                            />
                            <MetricCard
                                label="20일 고가 근접도"
                                value={formatPercent(metrics.highProximity20d)}
                            />
                            <MetricCard
                                label="거래량 비율"
                                value={formatRatio(metrics.volumeRatio5dTo20d)}
                                helper="최근 5일 평균 / 최근 20일 평균"
                            />
                            <MetricCard
                                label="20일 고점 대비 낙폭"
                                value={formatPercent(metrics.drawdownFromHigh20d)}
                            />
                            <MetricCard
                                label="급락 횟수"
                                value={`${metrics.sharpDropCount20d ?? 0}회`}
                                helper="최근 20일 중 -5% 이하"
                            />
                            <MetricCard
                                label="가격 데이터"
                                value={metrics.latestPriceData ? "최신" : "지연"}
                                helper={`${metrics.tradingDayCount}거래일 사용`}
                            />
                        </Box>
                    </CardContent>
                </Card>

                <Card
                    variant="outlined"
                    sx={{
                        mt: 2,
                        borderRadius: 4,
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Typography sx={{ fontSize: 18, fontWeight: 950 }}>
                            판단 사유
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        {data.reasons.length > 0 ? (
                            <Stack spacing={1.2}>
                                {data.reasons.map((reason, index) => (
                                    <Box
                                        key={`${reason}-${index}`}
                                        sx={{
                                            p: 1.4,
                                            borderRadius: 2,
                                            bgcolor: "action.hover",
                                            fontSize: 14,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {reason}
                                    </Box>
                                ))}
                            </Stack>
                        ) : (
                            <Typography sx={{ color: "text.secondary" }}>
                                표시할 판단 사유가 없습니다.
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}