import { CircularProgress, Typography } from "@mui/material";
import "./Loading.css";

interface LoadingProps {
  label: string;
}

const Loading = ({ label }: LoadingProps) => {
  return (
    <div className="loading-container">
      <Typography variant="h4">{label}</Typography>
      <CircularProgress sx={{ color: "#5fff51" }} />
    </div>
  );
};

export default Loading;
