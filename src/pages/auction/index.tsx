import { useState } from 'react';
import { styled } from '@mui/system';
import { Typography, Card, CardContent, Slider, Button } from '@mui/material';

const Container = styled('div')({
    width: '90%',
    padding: '10px',
});

const Title = styled(Typography)({
    textAlign: 'center',
    marginBottom: 16,
});

const PlayerCard = styled(Card)({
    marginBottom: 16,
    width: '100%',
});

const PlayerCardContent = styled(CardContent)({
    display: 'flex',
    alignItems: 'center',
    gap: 16,
});

const SliderSection = styled('div')({
    marginTop: 24,
    width: '100%',
});

const ButtonRow = styled('div')(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
    width: '100%',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
    },
}));

const StyledButton = styled(Button)({
    flex: 1,
    width: '100%',
});

const AuctionPage = () => {
    const [bid, setBid] = useState<number>(0);
    const [remainingPoints] = useState<number>(100);

    const currentPlayer = {
        name: '홍길동',
        skill: '공격형',
        profileImg: 'https://via.placeholder.com/80',
    };

    const handleBidSubmit = () => {
        console.log(`입찰가: ${bid}포인트`);
    };

    return (
        <Container>
            <Title variant="h5">🏆 팀 구성 경매</Title>

            <PlayerCard>
                <PlayerCardContent>
                    <img
                        src={currentPlayer.profileImg}
                        alt="profile"
                        width={80}
                        height={80}
                        style={{ borderRadius: '50%' }}
                    />
                    <div>
                        <Typography variant="h6">{currentPlayer.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            포지션: {currentPlayer.skill}
                        </Typography>
                    </div>
                </PlayerCardContent>
            </PlayerCard>

            <SliderSection>
                <Typography gutterBottom>💰 입찰 포인트 선택</Typography>
                <Slider
                    value={bid}
                    onChange={(_, newValue) => setBid(newValue as number)}
                    step={1}
                    min={0}
                    max={remainingPoints}
                    valueLabelDisplay="auto"
                />
                <Typography variant="caption" color="text.secondary">
                    보유 포인트: {remainingPoints}P
                </Typography>
            </SliderSection>

            <ButtonRow>
                <StyledButton variant="outlined" onClick={() => setBid(0)}>
                    입찰 취소
                </StyledButton>
                <StyledButton variant="contained" color="primary" onClick={handleBidSubmit}>
                    입찰하기
                </StyledButton>
            </ButtonRow>
        </Container>
    );
};

export default AuctionPage;
