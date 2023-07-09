import { CircularProgress, Typography, Box } from "@mui/material";
import "./Loading.css";

interface LoadingProps {
  label: string;
}

const Loading = ({ label }: LoadingProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h4">{label}</Typography>
      <CircularProgress color="primary" />
    </Box>
  );
};

export default Loading;
