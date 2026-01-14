import { Stack, TextField } from '@mui/material';
import {type FormEvent, type ReactNode, useMemo, useState} from 'react';

export type AccountFormValues = {
    brokerage: string;
    name: string;
    accountNumber: string;
    initialBalance: number;
};

type Props = {
    disabled?: boolean;
    onSubmit: (values: AccountFormValues) => void | Promise<void>;
    renderActions: (args: { canSubmit: boolean }) => ReactNode;
};

const onlyNumberAndDash = (v: string) => v.replace(/[^0-9-]/g, '');

export default function AccountForm({ disabled, onSubmit, renderActions }: Props) {
    const [values, setValues] = useState<AccountFormValues>({
        brokerage: '',
        name: '',
        accountNumber: '',
        initialBalance: 0,
    });

    const errors = useMemo(() => {
        const e: Partial<Record<keyof AccountFormValues, string>> = {};

        if (!values.brokerage.trim()) e.brokerage = '증권사를 입력해 주세요';
        if (!values.name.trim()) e.name = '계좌명을 입력해 주세요';

        const acc = values.accountNumber.trim();
        if (!acc) e.accountNumber = '계좌번호를 입력해 주세요';
        else if (acc.replace(/-/g, '').length < 8) e.accountNumber = '계좌번호가 너무 짧아요';

        if (Number.isNaN(values.initialBalance) || values.initialBalance < 0) {
            e.initialBalance = '0 이상 숫자만 가능해요';
        }

        return e;
    }, [values]);

    const canSubmit = useMemo(() => Object.keys(errors).length === 0, [errors]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!canSubmit || disabled) return;
        onSubmit(values);
    };

    const scrollIntoViewOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setTimeout(() => {
            e.target.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }, 150);
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                paddingTop: 12,
            }}
        >
            <Stack spacing={2}>
                <Stack spacing={0.8}>
                    <TextField
                        label="증권사"
                        placeholder="예: 키움증권, NH투자증권"
                        value={values.brokerage}
                        onChange={(e) => setValues((p) => ({ ...p, brokerage: e.target.value }))}
                        disabled={disabled}
                        error={!!errors.brokerage}
                        helperText={errors.brokerage}
                        onFocus={scrollIntoViewOnFocus}
                        fullWidth
                    />
                </Stack>

                <TextField
                    label="계좌명"
                    placeholder="예: 주식투자계좌, ISA계좌"
                    value={values.name}
                    onChange={(e) => setValues((p) => ({ ...p, name: e.target.value }))}
                    disabled={disabled}
                    error={!!errors.name}
                    helperText={errors.name}
                    fullWidth
                />

                <TextField
                    label="계좌번호"
                    placeholder="예: 123-456-789012"
                    value={values.accountNumber}
                    onChange={(e) =>
                        setValues((p) => ({ ...p, accountNumber: onlyNumberAndDash(e.target.value) }))
                    }
                    disabled={disabled}
                    error={!!errors.accountNumber}
                    helperText={errors.accountNumber}
                    fullWidth
                    inputProps={{ inputMode: 'numeric' }}
                />

                <TextField
                    label="초기 잔액"
                    placeholder="0"
                    value={String(values.initialBalance)}
                    onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, '');
                        const num = raw === '' ? 0 : Number(raw);
                        setValues((p) => ({ ...p, initialBalance: num }));
                    }}
                    disabled={disabled}
                    error={!!errors.initialBalance}
                    helperText={errors.initialBalance}
                    fullWidth
                    inputProps={{ inputMode: 'numeric' }}
                />

                {renderActions({ canSubmit })}
            </Stack>
        </form>
    );
}
