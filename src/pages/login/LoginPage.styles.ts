import { Box, Card, Typography, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Page = styled(Box)({
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    padding: '18px 16px',
    background: 'linear-gradient(180deg, #F4F5FF 0%, #F7F2FF 100%)',
});

export const Shell = styled(Box)({
    width: '100%',
    maxWidth: 420,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    paddingTop: 14,
});

export const Hero = styled(Box)({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
});

export const LogoCircle = styled(Box)({
    width: 72,
    height: 72,
    borderRadius: 999,
    display: 'grid',
    placeItems: 'center',
    background: 'radial-gradient(circle at 30% 20%, #7A8BFF 0%, #7B5CFF 55%, #A15BFF 100%)',
    boxShadow: '0 10px 24px rgba(122, 107, 255, 0.30)',
});

export const LogoSquare = styled(Box)({
    width: 30,
    height: 30,
    borderRadius: 10,
    background: 'rgba(255,255,255,0.9)',
    display: 'grid',
    placeItems: 'center',
    boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
});

export const FormCard = styled(Card)({
    width: '100%',
    borderRadius: 22,
    padding: 16,
    boxShadow: '0 18px 42px rgba(60, 64, 67, 0.14)',
});

export const FieldLabel = styled(Typography)({
    fontSize: 13,
    fontWeight: 800,
    marginBottom: 6,
});

export const RoundedTextField = styled(TextField)({
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

export const GradientButton = styled(Button)({
    height: 50,
    borderRadius: 16,
    fontWeight: 900,
    fontSize: 15,
    color: '#fff',
    background: 'linear-gradient(90deg, #4E7BFF 0%, #9A56FF 100%)',
    boxShadow: '0 12px 26px rgba(122, 107, 255, 0.32)',
    textTransform: 'none',
});
