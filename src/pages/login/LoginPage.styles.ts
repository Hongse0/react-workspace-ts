import { styled } from '@mui/material/styles';
import { Box, Button, TextField, Typography } from '@mui/material';

export const Page = styled(Box)(() => ({
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
    background: `
      radial-gradient(circle at 15% 20%, rgba(78, 123, 255, 0.16), transparent 24%),
      radial-gradient(circle at 85% 18%, rgba(168, 85, 247, 0.14), transparent 24%),
      radial-gradient(circle at 80% 82%, rgba(59, 130, 246, 0.12), transparent 22%),
      linear-gradient(180deg, #f8fbff 0%, #f3f6fc 100%)
    `,
    '&::before': {
        content: '""',
        position: 'absolute',
        width: '520px',
        height: '520px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.28)',
        filter: 'blur(40px)',
        top: '-160px',
        right: '-140px',
        pointerEvents: 'none',
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.22)',
        filter: 'blur(40px)',
        bottom: '-160px',
        left: '-120px',
        pointerEvents: 'none',
    },
}));

export const Shell = styled(Box)(() => ({
    width: '100%',
    maxWidth: '460px',
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

export const Hero = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '28px',
}));

export const HeroBadge = styled(Typography)(() => ({
    fontSize: '11px',
    fontWeight: 800,
    letterSpacing: '0.12em',
    color: '#4E7BFF',
    background: 'rgba(78, 123, 255, 0.08)',
    border: '1px solid rgba(78, 123, 255, 0.12)',
    borderRadius: '999px',
    padding: '8px 12px',
    marginBottom: '18px',
}));

export const LogoCircle = styled(Box)(() => ({
    width: '84px',
    height: '84px',
    borderRadius: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    background: 'linear-gradient(135deg, rgba(78,123,255,0.18), rgba(168,85,247,0.20))',
    boxShadow: '0 20px 48px rgba(78, 123, 255, 0.18)',
}));

export const LogoSquare = styled(Box)(() => ({
    width: '48px',
    height: '48px',
    borderRadius: '16px',
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.10)',
}));

export const HeroTitle = styled(Typography)(() => ({
    fontSize: '32px',
    fontWeight: 900,
    lineHeight: 1.18,
    letterSpacing: '-0.03em',
    color: '#0f172a',
    marginBottom: '12px',
}));

export const HeroDescription = styled(Typography)(() => ({
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: 1.6,
    color: 'rgba(15, 23, 42, 0.60)',
}));

export const FormCard = styled(Box)(() => ({
    width: '100%',
    background: 'rgba(255,255,255,0.84)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.78)',
    borderRadius: '32px',
    padding: '30px 26px',
    boxShadow: '0 24px 80px rgba(15, 23, 42, 0.10)',
}));

export const CardTitle = styled(Typography)(() => ({
    fontSize: '24px',
    fontWeight: 900,
    color: '#0f172a',
    lineHeight: 1.2,
}));

export const CardDescription = styled(Typography)(() => ({
    marginTop: '8px',
    fontSize: '13px',
    fontWeight: 600,
    color: 'rgba(15, 23, 42, 0.56)',
    lineHeight: 1.5,
}));

export const FieldLabel = styled(Typography)(() => ({
    fontSize: '13px',
    fontWeight: 800,
    color: 'rgba(15, 23, 42, 0.82)',
    marginBottom: '8px',
}));

export const RoundedTextField = styled(TextField)(() => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '18px',
        backgroundColor: 'rgba(248, 250, 252, 0.92)',
        transition: 'all 0.2s ease',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(148, 163, 184, 0.24)',
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(78,123,255,0.38)',
    },
    '& .MuiOutlinedInput-root.Mui-focused': {
        backgroundColor: '#ffffff',
        boxShadow: '0 0 0 4px rgba(78,123,255,0.08)',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#4E7BFF',
        borderWidth: '1.5px',
    },
    '& .MuiInputAdornment-root': {
        color: 'rgba(15, 23, 42, 0.42)',
    },
    '& .MuiInputBase-input': {
        padding: '15px 14px',
        fontSize: '14px',
        fontWeight: 600,
        color: '#0f172a',
    },
    '& .MuiInputBase-input::placeholder': {
        color: 'rgba(100, 116, 139, 0.82)',
        opacity: 1,
        fontWeight: 500,
    },
}));

export const GradientButton = styled(Button)(() => ({
    borderRadius: '18px',
    minHeight: '54px',
    fontSize: '15px',
    fontWeight: 800,
    textTransform: 'none',
    color: '#ffffff',
    background: 'linear-gradient(90deg, #4E7BFF 0%, #8B5CF6 100%)',
    boxShadow: '0 16px 30px rgba(78,123,255,0.26)',
    '&:hover': {
        background: 'linear-gradient(90deg, #3f6df2 0%, #7b50ec 100%)',
        boxShadow: '0 18px 34px rgba(78,123,255,0.30)',
    },
    '&.Mui-disabled': {
        color: 'rgba(255,255,255,0.78)',
        background: 'linear-gradient(90deg, #b7c8ff 0%, #cfbcff 100%)',
        boxShadow: 'none',
    },
}));

export const SubtleTextButton = styled(Button)(() => ({
    padding: 0,
    minWidth: 'auto',
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: 900,
    color: '#4E7BFF',
    borderRadius: 0,
    '&:hover': {
        background: 'transparent',
        opacity: 0.75,
    },
}));

export const FooterText = styled(Typography)(() => ({
    fontSize: '13px',
    color: 'rgba(15, 23, 42, 0.60)',
    fontWeight: 700,
}));

export const ErrorText = styled(Typography)(() => ({
    fontSize: '12px',
    color: '#dc2626',
    fontWeight: 800,
    lineHeight: 1.5,
}));

export const SuccessText = styled(Typography)(() => ({
    fontSize: '12px',
    color: '#15803d',
    fontWeight: 800,
    lineHeight: 1.5,
}));