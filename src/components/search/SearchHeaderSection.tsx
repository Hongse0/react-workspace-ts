import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import { Box, Chip, Paper, TextField, Typography } from "@mui/material";

interface Props {
    keyword: string;
    trendingKeywords: string[];
    recentKeywords: string[];
    onChangeKeyword: (value: string) => void;
    onClickKeyword: (value: string) => void;
}

export default function SearchHeaderSection({
                                                keyword,
                                                trendingKeywords,
                                                recentKeywords,
                                                onChangeKeyword,
                                                onClickKeyword,
                                            }: Props) {
    return (
        <Box className="search-header-section">
            <Paper elevation={0} className="search-input-card">
                <Box className="search-input-card__row">
                    <SearchRoundedIcon className="search-input-card__icon" />
                    <TextField
                        fullWidth
                        variant="standard"
                        placeholder="예: 삼성전자, 005930, SK하이닉스"
                        value={keyword}
                        onChange={(e) => onChangeKeyword(e.target.value)}
                        InputProps={{
                            disableUnderline: true,
                        }}
                    />
                </Box>
            </Paper>

            <Paper elevation={0} className="keyword-card">
                <Box className="keyword-card__title-row">
                    <LocalFireDepartmentRoundedIcon fontSize="small" />
                    <Typography className="keyword-card__title">인기 검색어</Typography>
                </Box>

                <Box className="keyword-card__chip-wrap">
                    {trendingKeywords.map((item) => (
                        <Chip
                            key={item}
                            label={item}
                            onClick={() => onClickKeyword(item)}
                            className="keyword-card__chip"
                        />
                    ))}
                </Box>
            </Paper>

            <Paper elevation={0} className="keyword-card">
                <Box className="keyword-card__title-row">
                    <HistoryRoundedIcon fontSize="small" />
                    <Typography className="keyword-card__title">최근 검색</Typography>
                </Box>

                <Box className="keyword-card__chip-wrap">
                    {recentKeywords.map((item) => (
                        <Chip
                            key={item}
                            label={item}
                            onClick={() => onClickKeyword(item)}
                            className="keyword-card__chip"
                        />
                    ))}
                </Box>
            </Paper>
        </Box>
    );
}