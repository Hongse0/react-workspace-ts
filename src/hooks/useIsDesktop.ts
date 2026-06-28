import { useMediaQuery } from "@mui/material";

export function useIsDesktop(): boolean {
    return useMediaQuery("(min-width: 1024px)", { noSsr: true });
}
