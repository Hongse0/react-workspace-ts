import { Box, Card, Button, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

export const Page = styled(Box)({
    minHeight: '100dvh',
    backgroundColor: '#F5F6FF',
});

export const Header = styled(Box)({
    position: 'relative',
    padding: '26px 16px 42px',
    background: 'linear-gradient(135deg, #5B74FF 0%, #8C4BFF 55%, #FF4D8D 100%)',
    overflow: 'hidden',
});

export const HeaderGlow = styled(Box)({
    position: 'absolute',
    inset: -80,
    background:
        'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 55%)',
    pointerEvents: 'none',
});

export const HeaderTitle = styled(Typography)({
    color: '#fff',
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: -0.5,
    paddingLeft: 8,
    paddingRight: 8,
});

export const TotalCard = styled(Card)({
    marginTop: 12,
    marginLeft: 12,
    marginRight: 12,
    borderRadius: 18,
    padding: 14,
    minHeight: 92,
    color: '#fff',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.20), rgba(255,255,255,0.12))',
    backdropFilter: 'blur(8px)',
    border: `1px solid ${alpha('#FFFFFF', 0.18)}`,
});

export const TotalLabel = styled(Typography)({
    fontSize: 13,
    fontWeight: 700,
    opacity: 0.9,
});

export const TotalValue = styled(Typography)({
    marginTop: 4,
    fontSize: 30,
    fontWeight: 900,
    letterSpacing: -1,
    lineHeight: 1.05,
});

export const Body = styled(Box)({
    marginTop: -26,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: '#F5F6FF',
    paddingTop: 34,
    paddingBottom: 80,
});

export const EmptyWrap = styled(Box)({
    marginTop: 28,
    paddingLeft: 16,
    paddingRight: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
});

export const EmptyIconCircle = styled(Box)(({ theme }) => ({
    width: 92,
    height: 92,
    borderRadius: 999,
    display: 'grid',
    placeItems: 'center',
    background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(
        theme.palette.primary.main,
        0.06
    )})`,
}));

export const EmptyText = styled(Typography)({
    fontSize: 16,
    fontWeight: 700,
    color: '#6B7280',
});

export const AddFirstButton = styled(Button)({
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 999,
    fontWeight: 800,
    textTransform: 'none',
    background: 'linear-gradient(135deg, #5B74FF 0%, #8C4BFF 55%, #FF4D8D 100%)',
    boxShadow: `0 10px 22px ${alpha('#5B74FF', 0.25)}`,
});

export const AddFirstButtonHover = {
    '&:hover': {
        background: 'linear-gradient(135deg, #4E68FF 0%, #7C3FFF 55%, #FF3F82 100%)',
    },
};
