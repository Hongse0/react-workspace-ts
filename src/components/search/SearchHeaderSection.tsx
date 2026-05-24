import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import KeyboardReturnRoundedIcon from "@mui/icons-material/KeyboardReturnRounded";
import { Box, TextField } from "@mui/material";

interface Props {
    keyword: string;
    trendingKeywords: string[];
    recentKeywords: string[];
    onChangeKeyword: (value: string) => void;
    onClickKeyword: (value: string) => void;
}

export default function SearchHeaderSection({
                                                keyword,
                                                onChangeKeyword,
                                            }: Props) {
    return (
        <Box className="search-header-section">
            <Box className="search-input-card">
                <Box className="search-input-card__row">
                    <Box className="search-input-card__icon-box">
                        <SearchRoundedIcon className="search-input-card__icon" />
                    </Box>

                    <TextField
                        fullWidth
                        variant="standard"
                        placeholder="종목명 또는 종목코드 검색"
                        value={keyword}
                        onChange={(e) => onChangeKeyword(e.target.value)}
                        InputProps={{
                            disableUnderline: true,
                        }}
                        inputProps={{
                            className: "search-input-card__input",
                        }}
                    />

                    <Box className="search-input-card__enter">
                        <KeyboardReturnRoundedIcon fontSize="small" />
                        <span>Enter</span>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}