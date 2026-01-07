import { useMemo, useState } from 'react';
import { Box, Card, Typography, TextField, Button, InputAdornment } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auto/useAuthStore.ts';

const Page = styled(Box)({
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    padding: '18px 16px',
    background: 'linear-gradient(180deg, #F4F5FF 0%, #F7F2FF 100%)',
});

const Shell = styled(Box)({
    width: '100%',
    maxWidth: 420,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    paddingTop: 14,
});

const Hero = styled(Box)({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
});

const LogoCircle = styled(Box)({
    width: 72,
    height: 72,
    borderRadius: 999,
    display: 'grid',
    placeItems: 'center',
    background: 'radial-gradient(circle at 30% 20%, #7A8BFF 0%, #7B5CFF 55%, #A15BFF 100%)',
    boxShadow: '0 10px 24px rgba(122, 107, 255, 0.30)',
});

const LogoSquare = styled(Box)({
    width: 30,
    height: 30,
    borderRadius: 10,
    background: 'rgba(255,255,255,0.9)',
    display: 'grid',
    placeItems: 'center',
    boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
});

const FormCard = styled(Card)({
    width: '100%',
    borderRadius: 22,
    padding: 16,
    boxShadow: '0 18px 42px rgba(60, 64, 67, 0.14)',
});

const FieldLabel = styled(Typography)({
    fontSize: 13,
    fontWeight: 800,
    marginBottom: 6,
});

const RoundedTextField = styled(TextField)({
    '& .MuiInputBase-root': {
        borderRadius: 14,
        backgroundColor: '#F3F3F6',
        height: 46,
    },
    '& input': {
        padding: '0 14px',
        fontSize: 14,
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'transparent',
    },
    '& .MuiFormHelperText-root': {
        display: 'none',
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'transparent',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(123, 92, 255, 0.35)',
    },
});

const GradientButton = styled(Button)({
    height: 50,
    borderRadius: 16,
    fontWeight: 900,
    fontSize: 15,
    color: '#fff',
    background: 'linear-gradient(90deg, #4E7BFF 0%, #9A56FF 100%)',
    boxShadow: '0 12px 26px rgba(122, 107, 255, 0.32)',
    textTransform: 'none',
});

type LocationState = {
    from?: string;
};

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const login = useAuthStore((s) => s.login);

    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [error, setError] = useState<string | null>(null);

    const canSubmit = useMemo(() => {
        return email.trim().length > 0 && pw.trim().length > 0;
    }, [email, pw]);

    const onSubmit = async () => {
        setError(null);

        if (!canSubmit) return;

        if (!email.includes('@')) {
            setError('이메일 형식을 확인해주세요.');
            return;
        }

        // TODO: 실제 로그인 API 연동 시 accessToken 넣기
        const fakeToken = 'fake-access-token';
        login(fakeToken);

        const state = (location.state as LocationState) ?? {};
        navigate(state.from ?? '/', { replace: true });
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
