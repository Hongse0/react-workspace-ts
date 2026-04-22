import { useMemo, useState } from 'react';
import {
    Box,
    Typography,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auto/useAuthStore.ts';
import { useLoginMutation, useSignupMutation } from '../../services/cms/useAuthQuery.ts';

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
    const { mutateAsync: signupMutateAsync, isPending: isSignupPending } = useSignupMutation();

    const navigate = useNavigate();
    const location = useLocation();
    const login = useAuthStore((s) => s.login);

    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [openSignup, setOpenSignup] = useState(false);
    const [signupError, setSignupError] = useState<string | null>(null);
    const [signupSuccess, setSignupSuccess] = useState<string | null>(null);

    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupNickname, setSignupNickname] = useState('');

    const canSubmit = useMemo(() => {
        return email.trim().length > 0 && pw.trim().length > 0 && !isPending;
    }, [email, pw, isPending]);

    const canSignupSubmit = useMemo(() => {
        return (
            signupEmail.trim().length > 0 &&
            signupPassword.trim().length > 0 &&
            signupName.trim().length > 0 &&
            signupNickname.trim().length > 0 &&
            !isSignupPending
        );
    }, [signupEmail, signupPassword, signupName, signupNickname, isSignupPending]);

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

    const resetSignupForm = () => {
        setSignupEmail('');
        setSignupPassword('');
        setSignupName('');
        setSignupNickname('');
        setSignupError(null);
        setSignupSuccess(null);
    };

    const handleOpenSignup = () => {
        resetSignupForm();
        setOpenSignup(true);
    };

    const handleCloseSignup = () => {
        setOpenSignup(false);
        setSignupError(null);
        setSignupSuccess(null);
    };

    const onSignupSubmit = async () => {
        setSignupError(null);
        setSignupSuccess(null);

        if (!canSignupSubmit) return;

        if (!signupEmail.includes('@')) {
            setSignupError('이메일 형식을 확인해주세요.');
            return;
        }

        if (signupPassword.length < 8) {
            setSignupError('비밀번호는 8자 이상 입력해주세요.');
            return;
        }

        try {
            await signupMutateAsync({
                email: signupEmail.trim(),
                password: signupPassword,
                name: signupName.trim(),
                nickname: signupNickname.trim(),
            });

            setSignupSuccess('회원가입이 완료되었습니다.');

            // 가입 후 로그인 input 자동 채우기
            setEmail(signupEmail.trim());
            setPw(signupPassword);

            setTimeout(() => {
                setOpenSignup(false);
                setSignupSuccess(null);
            }, 700);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : '회원가입에 실패했습니다.';
            setSignupError(message);
        }
    };

    return (
        <>
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
                                    {isPending ? '로그인 중...' : '로그인'}
                                </GradientButton>
                            </Box>

                            <Box display="flex" justifyContent="center" mt={6}>
                                <Typography sx={{ fontSize: 13, color: 'rgba(0,0,0,0.65)', fontWeight: 700 }}>
                                    계정이 없으신가요?{' '}
                                    <Box
                                        component="span"
                                        onClick={handleOpenSignup}
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

            <Dialog
                open={openSignup}
                onClose={handleCloseSignup}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        borderRadius: '24px',
                        p: 1,
                    },
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                            <Typography sx={{ fontSize: 22, fontWeight: 900 }}>회원가입</Typography>
                            <Typography sx={{ fontSize: 13, color: 'rgba(0,0,0,0.55)', mt: 0.5 }}>
                                간단한 정보만 입력하면 바로 시작할 수 있어요
                            </Typography>
                        </Box>

                        <IconButton onClick={handleCloseSignup}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent sx={{ pt: 1 }}>
                    <Box display="flex" flexDirection="column" gap={2.2}>
                        <Box>
                            <FieldLabel>이메일</FieldLabel>
                            <RoundedTextField
                                fullWidth
                                placeholder="example@email.com"
                                value={signupEmail}
                                onChange={(e) => setSignupEmail(e.target.value)}
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
                                placeholder="8자 이상 입력"
                                type="password"
                                value={signupPassword}
                                onChange={(e) => setSignupPassword(e.target.value)}
                                autoComplete="new-password"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlinedIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Box>
                            <FieldLabel>이름</FieldLabel>
                            <RoundedTextField
                                fullWidth
                                placeholder="홍세영"
                                value={signupName}
                                onChange={(e) => setSignupName(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <BadgeOutlinedIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Box>
                            <FieldLabel>닉네임</FieldLabel>
                            <RoundedTextField
                                fullWidth
                                placeholder="세영테스트"
                                value={signupNickname}
                                onChange={(e) => setSignupNickname(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonOutlineIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        {signupError && (
                            <Typography sx={{ fontSize: 12, color: '#d32f2f', fontWeight: 800 }}>
                                {signupError}
                            </Typography>
                        )}

                        {signupSuccess && (
                            <Typography sx={{ fontSize: 12, color: '#2e7d32', fontWeight: 800 }}>
                                {signupSuccess}
                            </Typography>
                        )}

                        <Box mt={1}>
                            <GradientButton fullWidth disabled={!canSignupSubmit} onClick={onSignupSubmit}>
                                {isSignupPending ? '가입 중...' : '회원가입'}
                            </GradientButton>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default LoginPage;