import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: "3rem",
      }}
    >
      <Typography variant="h1" sx={{ mb: "1.5rem" }}>
        Oops!
      </Typography>
      <Typography variant="body1" sx={{ mb: "1.5rem" }}>
        Looks like this page doesn't exist!
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        Return Home
      </Button>
    </Box>
  );
};

export default ErrorPage;
