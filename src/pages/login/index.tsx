import { useMemo, useState } from 'react';
import { Box, Typography, InputAdornment } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auto/useAuthStore.ts';
import { useLoginMutation } from '../../services/cms/useAuthQuery.ts';

import {
    Page,
    Shell,
    Hero,
    LogoCircle,
    LogoSquare,
    FormCard,
    FieldLabel,
    RoundedTextField,
    GradientButton,
} from './LoginPage.styles';

type LocationState = {
    from?: string;
};

const LoginPage = () => {
    const { mutateAsync: loginMutateAsync, isPending } = useLoginMutation();

    const navigate = useNavigate();
    const location = useLocation();
    const login = useAuthStore((s) => s.login);

    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [error, setError] = useState<string | null>(null);

    const canSubmit = useMemo(() => {
        return email.trim().length > 0 && pw.trim().length > 0 && !isPending;
    }, [email, pw, isPending]);

    const onSubmit = async () => {
        setError(null);
        if (!canSubmit) return;

        if (!email.includes('@')) {
            setError('이메일 형식을 확인해주세요.');
            return;
        }

        try {
            const result = await loginMutateAsync({
                email: email.trim(),
                password: pw,
            });

            login(result.accessToken);

            const state = (location.state as LocationState) ?? {};
            navigate(state.from ?? '/', { replace: true });
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : '로그인에 실패했습니다.';
            setError(message);
        }
    };

    return (
        <Page>
            <Shell>
                <Hero>
                    <LogoCircle>
                        <LogoSquare>
                            <Typography fontWeight={900} color="#6A5CF6" sx={{ fontSize: 16 }}>
                                📈
                            </Typography>
                        </LogoSquare>
                    </LogoCircle>

                    <Typography
                        sx={{
                            fontSize: 24,
                            fontWeight: 900,
                            lineHeight: 1.1,
                            background: 'linear-gradient(90deg, #4E7BFF, #9A56FF)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        환영합니다
                    </Typography>

                    <Typography sx={{ fontSize: 13, color: 'rgba(0,0,0,0.55)', fontWeight: 600 }}>
                        주식 포트폴리오 관리
                    </Typography>
                </Hero>

                <FormCard>
                    <Box display="flex" flexDirection="column" gap={3}>
                        <Box>
                            <FieldLabel>이메일</FieldLabel>
                            <RoundedTextField
                                fullWidth
                                placeholder="example@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MailOutlineIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Box>
                            <FieldLabel>비밀번호</FieldLabel>
                            <RoundedTextField
                                fullWidth
                                placeholder="••••••••"
                                type="password"
                                value={pw}
                                onChange={(e) => setPw(e.target.value)}
                                autoComplete="current-password"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlinedIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        {error && (
                            <Typography sx={{ fontSize: 12, color: '#d32f2f', fontWeight: 800, mt: 2 }}>
                                {error}
                            </Typography>
                        )}

                        <Box mt={4}>
                            <GradientButton fullWidth disabled={!canSubmit} onClick={onSubmit}>
                                로그인
                            </GradientButton>
                        </Box>

                        <Box display="flex" justifyContent="center" mt={6}>
                            <Typography sx={{ fontSize: 13, color: 'rgba(0,0,0,0.65)', fontWeight: 700 }}>
                                계정이 없으신가요?{' '}
                                <Box
                                    component="span"
                                    onClick={() => navigate('/signup')}
                                    sx={{
                                        cursor: 'pointer',
                                        color: '#4E7BFF',
                                        textDecoration: 'underline',
                                        textUnderlineOffset: '3px',
                                        fontWeight: 900,
                                    }}
                                >
                                    회원가입
                                </Box>
                            </Typography>
                        </Box>
                    </Box>
                </FormCard>
            </Shell>
        </Page>
    );
};

export default LoginPage;
