import { useMemo, useState } from 'react';
import {
    Box,
    Typography,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Divider,
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auto/useAuthStore.ts';
import { useLoginMutation, useSignupMutation } from '../../services/cms/useAuthQuery.ts';

import {
    Page,
    Shell,
    Hero,
    LogoCircle,
    LogoSquare,
    HeroTitle,
    HeroDescription,
    HeroBadge,
    FormCard,
    CardTitle,
    CardDescription,
    FieldLabel,
    RoundedTextField,
    GradientButton,
    SubtleTextButton,
    ErrorText,
    SuccessText,
    FooterText,
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

            login(result.accessToken, result.nickname);

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

            setSignupSuccess('회원가입이 완료되었습니다. 이제 로그인해보세요.');

            setEmail(signupEmail.trim());
            setPw(signupPassword);

            setTimeout(() => {
                setOpenSignup(false);
                setSignupSuccess(null);
            }, 900);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : '회원가입에 실패했습니다.';
            setSignupError(message);
        }
    };

    const handleLoginKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            void onSubmit();
        }
    };

    const handleSignupKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            void onSignupSubmit();
        }
    };

    return (
        <>
            <Page>
                <Shell>
                    <Hero>
                        <HeroBadge>SMART MONEY ROUTINE</HeroBadge>

                        <LogoCircle>
                            <LogoSquare>
                                <Typography fontWeight={900} color="#6A5CF6" sx={{ fontSize: 18 }}>
                                    💳
                                </Typography>
                            </LogoSquare>
                        </LogoCircle>

                        <HeroTitle>
                            더 깔끔하게,
                            <br />
                            더 똑똑하게 자산 관리
                        </HeroTitle>

                        <HeroDescription>
                            소비와 자산 흐름을 한눈에 정리하는
                            <br />
                            개인 재테크 관리 서비스
                        </HeroDescription>
                    </Hero>

                    <FormCard>
                        <Box display="flex" flexDirection="column" gap={3}>
                            <Box>
                                <CardTitle>로그인</CardTitle>
                                <CardDescription>
                                    계정 정보를 입력하고 서비스를 시작해보세요
                                </CardDescription>
                            </Box>

                            <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.18)' }} />

                            <Box>
                                <FieldLabel>이메일</FieldLabel>
                                <RoundedTextField
                                    fullWidth
                                    placeholder="이메일을 입력해주세요"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={handleLoginKeyDown}
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
                                    placeholder="비밀번호를 입력해주세요"
                                    type="password"
                                    value={pw}
                                    onChange={(e) => setPw(e.target.value)}
                                    onKeyDown={handleLoginKeyDown}
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

                            {error && <ErrorText>{error}</ErrorText>}

                            <Box mt={1}>
                                <GradientButton
                                    fullWidth
                                    disabled={!canSubmit}
                                    onClick={onSubmit}
                                    endIcon={<ArrowForwardRoundedIcon />}
                                >
                                    {isPending ? '로그인 중...' : '로그인'}
                                </GradientButton>
                            </Box>

                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                flexDirection="column"
                                mt={1}
                                gap={1}
                            >
                                <FooterText>
                                    아직 계정이 없으신가요?
                                </FooterText>
                                <SubtleTextButton onClick={handleOpenSignup}>
                                    회원가입하기
                                </SubtleTextButton>
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
                        borderRadius: '28px',
                        p: 1.5,
                        background: 'rgba(255,255,255,0.96)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 24px 80px rgba(15, 23, 42, 0.16)',
                    },
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                        <Box>
                            <Typography sx={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>
                                회원가입
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: 13,
                                    color: 'rgba(15, 23, 42, 0.58)',
                                    mt: 0.8,
                                    lineHeight: 1.5,
                                }}
                            >
                                간단한 정보 입력 후
                                <br />
                                나만의 자산 관리를 시작해보세요
                            </Typography>
                        </Box>

                        <IconButton
                            onClick={handleCloseSignup}
                            sx={{
                                backgroundColor: 'rgba(148, 163, 184, 0.12)',
                                '&:hover': {
                                    backgroundColor: 'rgba(148, 163, 184, 0.2)',
                                },
                            }}
                        >
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
                                placeholder="이메일을 입력해주세요"
                                value={signupEmail}
                                onChange={(e) => setSignupEmail(e.target.value)}
                                onKeyDown={handleSignupKeyDown}
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
                                placeholder="비밀번호를 입력해주세요"
                                type="password"
                                value={signupPassword}
                                onChange={(e) => setSignupPassword(e.target.value)}
                                onKeyDown={handleSignupKeyDown}
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
                                placeholder="이름을 입력해주세요"
                                value={signupName}
                                onChange={(e) => setSignupName(e.target.value)}
                                onKeyDown={handleSignupKeyDown}
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
                                placeholder="닉네임을 입력해주세요"
                                value={signupNickname}
                                onChange={(e) => setSignupNickname(e.target.value)}
                                onKeyDown={handleSignupKeyDown}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonOutlineIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        {signupError && <ErrorText>{signupError}</ErrorText>}
                        {signupSuccess && <SuccessText>{signupSuccess}</SuccessText>}

                        <Box mt={1}>
                            <GradientButton
                                fullWidth
                                disabled={!canSignupSubmit}
                                onClick={onSignupSubmit}
                                endIcon={<ArrowForwardRoundedIcon />}
                            >
                                {isSignupPending ? '가입 중...' : '회원가입 완료'}
                            </GradientButton>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default LoginPage;