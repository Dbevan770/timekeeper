import { CircularProgress, Typography, Box } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import "./Loading.css";

interface LoadingProps {
  label: string;
}

const Loading = ({ label }: LoadingProps) => {
  const { themeMode } = useContext(ThemeContext);

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
        backgroundColor: themeMode === "dark" ? "#242424" : "#ffffff",
      }}
    >
      <Typography
        variant="h4"
        sx={{ color: themeMode === "dark" ? "#e1e1e1" : "#000000" }}
      >
        {label}
      </Typography>
      <CircularProgress
        sx={{ color: themeMode === "dark" ? "#5fff51" : "0f7cdb" }}
      />
    </Box>
  );
};

export default Loading;
