import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
} from '@mui/material';
import { useMemo, useState } from 'react';
import type {BrokerageAccountCreate} from "./types.ts";
import AccountForm, {type AccountFormValues} from "./AccountForm.tsx";

type Props = {
    open: boolean;
    onClose: () => void;
    onCreate: (payload: BrokerageAccountCreate) => Promise<void> | void;
};

export default function AddAccountDialog({ open, onClose, onCreate }: Props) {
    const [submitting, setSubmitting] = useState(false);

    const paperSx = useMemo(
        () => ({
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            m: 0,
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            maxWidth: 560,
            mx: 'auto',
        }),
        []
    );

    const handleSubmit = async (values: AccountFormValues) => {
        try {
            setSubmitting(true);

            const payload: BrokerageAccountCreate = {
                brokerage: values.brokerage.trim(),
                name: values.name.trim(),
                accountNumber: values.accountNumber.trim(),
                initialBalance: values.initialBalance,
            };

            await onCreate(payload);
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
                    textAlign: 'center',
                    fontWeight: 800,
                    py: 1.0,

                    position: 'sticky',
                    top: 0,
                    zIndex: 2,
                    backgroundColor: 'background.paper',

                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                계좌 추가
                <IconButton
                    onClick={onClose}
                    disabled={submitting}
                    sx={{ position: 'absolute', right: 10, top: 10 }}
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
                                    background: 'linear-gradient(135deg, #4E7BFF 0%, #9B4DFF 100%)',
                                }}
                            >
                                추가
                            </Button>
                        </Stack>
                    )}
                />
                <Box sx={{ height: 10 }} />
            </DialogContent>
        </Dialog>
    );
}
