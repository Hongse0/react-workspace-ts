import { useEffect, useMemo, useState } from "react";
import { Autocomplete, CircularProgress, TextField, Box, Typography } from "@mui/material";
import type {StockSearchItem} from "../../module/common/StockSearchService.ts";
import {useDebounce} from "../../services/search/useDebounce.ts";
import {useStockAutocompleteQuery} from "../../services/search/useStockAutocompleteQuery.ts";

type Props = {
    value: StockSearchItem | null;
    onSelect: (item: StockSearchItem | null) => void;
};

export function KrStockAutocomplete({ value, onSelect }: Props) {
    const [inputValue, setInputValue] = useState("");

    const debouncedKeyword = useDebounce(inputValue, 300);

    const { data, isFetching } = useStockAutocompleteQuery(debouncedKeyword, 10);

    const options = useMemo(() => {
        return (data?.items ?? []).filter((item) => item.activeYn === "Y");
    }, [data]);

    useEffect(() => {
        if (!value) return;
        setInputValue(value.itmsNm ?? '');
    }, [value]);

    return (
        <Autocomplete
            value={value}
            onChange={(_, newValue) => onSelect(newValue)}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue);
            }}
            options={options}
            loading={isFetching}
            getOptionLabel={(option) => option?.itmsNm ?? ""}
            isOptionEqualToValue={(option, selected) => option.srtnCd === selected.srtnCd}
            noOptionsText={inputValue.trim() ? "검색 결과가 없습니다." : "종목명을 입력하세요."}
            renderOption={(props, option) => (
                <Box component="li" {...props} sx={{ display: "flex", flexDirection: "column", py: 1 }}>
                    <Typography sx={{ fontWeight: 800 }}>{option.itmsNm}</Typography>
                    <Typography variant="body2" sx={{ color: "#6B7280" }}>
                        {option.srtnCd} · {option.mrktCtg} · {option.corpNm}
                    </Typography>
                </Box>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="한국 주식 검색"
                    placeholder="예: 삼성전자"
                    fullWidth
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {isFetching ? <CircularProgress color="inherit" size={18} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                        sx: {
                            borderRadius: 3,
                            background: "#F4F6FA",
                            "& fieldset": { borderColor: "transparent" },
                        },
                    }}
                />
            )}
        />
    );
}