import { useEffect, useMemo, useState } from "react";
import MainLayout from "../module/layouts/MainLayout.tsx";
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Card,
    CardContent,
    CircularProgress,
    List,
    ListItemButton,
    ListItemText,
    Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useStockSearchQuery } from "../services/search/useStockSearchQuery";
import { useStockSuggestQuery } from "../services/search/useStockSuggestQuery";

const useDebounce = (value: string, delay = 200) => {
    const [v, setV] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setV(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return v;
};



const Home = () => {
    const [q, setQ] = useState("");
    const [submittedQ, setSubmittedQ] = useState("");
    const debouncedQ = useDebounce(q, 200);

    const { data: suggestData, isFetching: isSuggestFetching, error: suggestError } =
        useStockSuggestQuery({ q: debouncedQ, size: 8 });

    const {
        data: searchData,
        isFetching: isSearchFetching,
        error: searchError
    } = useStockSearchQuery({ q: submittedQ, size: 20 });

    const suggestions = useMemo(() => suggestData?.items ?? [], [suggestData]);
    const results = useMemo(() => searchData?.items ?? [], [searchData]);

    const runSearch = () => {
        const keyword = q.trim();
        if (!keyword) return;
        setSubmittedQ(keyword);
        // submittedQ 바뀌면 자동으로 쿼리 실행되지만,
        // 즉시 실행을 원하면 refetch()도 가능
    };

    const onPickSuggestion = (name: string) => {
        setQ(name);
        setSubmittedQ(name);
    };

    const showDropdown = q.trim().length > 0 && suggestions.length > 0;


    return (
        <MainLayout>
            <Box sx={{ px: 2, py: 2, maxWidth: 960, mx: "auto" }}>
                <Typography variant="h5" fontWeight={900} mb={0.5}>
                    주식 검색
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                    오타 허용 · 자동완성 · 동의어 검색 (Elasticsearch)
                </Typography>

                {/* 검색 입력 */}
                <Box sx={{ position: "relative" }}>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <TextField
                            fullWidth
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="예: 삼전, 삼성전지, A005930"
                            size="small"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") runSearch();
                            }}
                        />
                        <IconButton onClick={runSearch} disabled={!q.trim()}>
                            <SearchIcon />
                        </IconButton>
                    </Box>

                    {/* 자동완성 드롭다운 */}
                    {showDropdown && (
                        <Paper
                            elevation={6}
                            sx={{
                                position: "absolute",
                                top: "42px",
                                left: 0,
                                right: 48,
                                zIndex: 10,
                                borderRadius: 2,
                                overflow: "hidden",
                            }}
                        >
                            <Box sx={{ px: 1.5, py: 1, borderBottom: "1px solid #eee" }}>
                                <Typography variant="caption" color="text.secondary">
                                    {isSuggestFetching ? "추천 불러오는 중..." : "추천 검색어"}
                                </Typography>
                            </Box>

                            <List dense sx={{ p: 0 }}>
                                {suggestions.map((s) => (
                                    <ListItemButton
                                        key={s.srtnCd}
                                        onClick={() => onPickSuggestion(s.itmsNm)}
                                    >
                                        <ListItemText
                                            primary={s.itmsNm}
                                            secondary={`${s.srtnCd}${s.mrktCtg ? ` · ${s.mrktCtg}` : ""}`}
                                        />
                                    </ListItemButton>
                                ))}
                            </List>
                        </Paper>
                    )}
                </Box>

                {/* 에러 표시 */}
                {(suggestError || searchError) && (
                    <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: "#fff5f5", border: "1px solid #ffe3e3" }}>
                        <Typography variant="body2" color="error">
                            {suggestError instanceof Error
                                ? suggestError.message
                                : searchError instanceof Error
                                    ? searchError.message
                                    : "오류가 발생했습니다."}
                        </Typography>

                    </Box>
                )}

                {/* 검색 결과 */}
                <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="h6" fontWeight={900}>
                            검색 결과
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {isSearchFetching ? "조회 중..." : `${results.length}건`}
                        </Typography>
                    </Box>

                    {isSearchFetching ? (
                        <Box display="flex" justifyContent="center" mt={2}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box display="flex" flexDirection="column" gap={1.2}>
                            {submittedQ && results.length === 0 ? (
                                <Box sx={{ p: 2, border: "1px solid #eee", borderRadius: 2, color: "text.secondary" }}>
                                    검색 결과가 없어요.
                                </Box>
                            ) : (
                                results.map((r) => (
                                    <Card key={r.srtnCd} variant="outlined" sx={{ borderRadius: 2 }}>
                                        <CardContent sx={{ py: 1.5 }}>
                                            <Typography fontWeight={900}>{r.itmsNm}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {r.srtnCd} {r.mrktCtg ? `· ${r.mrktCtg}` : ""}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </Box>
                    )}
                </Box>
            </Box>
        </MainLayout>
    );
};

export default Home;
