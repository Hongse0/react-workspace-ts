import { Box, Typography } from "@mui/material";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";

const ComingSoonPage = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
            minHeight="60vh"
            textAlign="center"
            px={2}
        >
            <ConstructionRoundedIcon sx={{ fontSize: 56, color: "#6A5CF6", mb: 2 }} />

            <Typography fontSize={22} fontWeight={900} mb={1}>
                준비중입니다 🚧
            </Typography>

            <Typography fontSize={14} color="rgba(0,0,0,0.55)" fontWeight={600}>
                더 좋은 기능으로 곧 찾아올게요!
            </Typography>
        </Box>
    );
};

export default ComingSoonPage;