import { Container, Stack } from '@mui/material';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

import {
    Page,
    Header,
    HeaderGlow,
    HeaderTitle,
    TotalCard,
    TotalLabel,
    TotalValue,
    Body,
    EmptyWrap,
    EmptyIconCircle,
    EmptyText,
    AddFirstButton,
    AddFirstButtonHover,
} from './AccountPage.styles';

export default function AccountPage() {
    const totalBalance = 0;

    const handleAddFirstAccount = () => {
        console.log('add first account');
    };

    return (
        <Page>
            <Header>
                <HeaderGlow />

                <Container maxWidth="sm" disableGutters>
                    <HeaderTitle>증권 계좌 관리</HeaderTitle>

                    <TotalCard elevation={0}>
                        <TotalLabel>총 잔액</TotalLabel>
                        <TotalValue>₩{totalBalance.toLocaleString('ko-KR')}</TotalValue>
                    </TotalCard>
                </Container>
            </Header>

            <Body>
                <Container maxWidth="sm">
                    <EmptyWrap>
                        <Stack spacing={2.2} alignItems="center">
                            <EmptyIconCircle>
                                <ReceiptLongRoundedIcon sx={{ fontSize: 44 }} color="primary" />
                            </EmptyIconCircle>

                            <EmptyText>등록된 계좌가 없습니다</EmptyText>

                            <AddFirstButton
                                onClick={handleAddFirstAccount}
                                startIcon={<AddRoundedIcon />}
                                variant="contained"
                                sx={AddFirstButtonHover}
                            >
                                첫 계좌 추가하기
                            </AddFirstButton>
                        </Stack>
                    </EmptyWrap>
                </Container>
            </Body>
        </Page>
    );
}
