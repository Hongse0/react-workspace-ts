import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
} from "@mui/material";
import { useMemo, useState } from "react";

import AccountForm, { type AccountFormValues } from "./AccountForm";
import { useCreateAccountMutation } from "../../services/account/useCreateAccount"; // 경로 확인

type Props = {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
};

export default function AddAccountDialog({ open, onClose, onSuccess }: Props) {
    const [submitting, setSubmitting] = useState(false);
    const { mutateAsync } = useCreateAccountMutation();

    const paperSx = useMemo(
        () => ({
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            m: 0,
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            maxWidth: 560,
            mx: "auto",
            "@media (min-width: 1024px)": {
                position: "relative",
                bottom: "auto",
                left: "auto",
                right: "auto",
                borderRadius: "24px",
                maxWidth: 480,
                mx: "auto",
                my: 4,
            },
        }),
        []
    );

    const handleSubmit = async (values: AccountFormValues) => {
        try {
            setSubmitting(true);
            await mutateAsync({
                brokerName: values.brokerage.trim(),
                accountName: values.name.trim(),
                accountNumber: values.accountNumber.trim(),
                baseCurrency: "KRW",
                initialBalance: values.initialBalance,
            });

            await onSuccess?.();
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={submitting ? undefined : onClose}
            fullWidth
            PaperProps={{ sx: paperSx }}
        >
            <DialogTitle
                sx={{
                    textAlign: "center",
                    fontWeight: 800,
                    py: 1.0,
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                    backgroundColor: "background.paper",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                계좌 추가
                <IconButton
                    onClick={onClose}
                    disabled={submitting}
                    sx={{ position: "absolute", right: 10, top: 10 }}
                    aria-label="close"
                >
                    <CloseRoundedIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 1.5, pb: 2.5 }}>
                <AccountForm
                    disabled={submitting}
                    onSubmit={handleSubmit}
                    renderActions={({ canSubmit }) => (
                        <Stack direction="row" spacing={1.2} sx={{ mt: 2.5 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={onClose}
                                disabled={submitting}
                                sx={{ height: 48, borderRadius: 3 }}
                            >
                                취소
                            </Button>

                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                disabled={!canSubmit || submitting}
                                sx={{
                                    height: 48,
                                    borderRadius: 3,
                                    background:
                                        "linear-gradient(135deg, #4E7BFF 0%, #9B4DFF 100%)",
                                }}
                            >
                                {submitting ? "등록 중..." : "추가"}
                            </Button>
                        </Stack>
                    )}
                />

                <Box sx={{ height: 10 }} />
            </DialogContent>
        </Dialog>
    );
}
