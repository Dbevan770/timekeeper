import { Typography, Button } from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./Success.css";

const Success = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dashboard");
  };
  return (
    <div className="success-container">
      <CheckCircleOutline color="primary" fontSize="large" />
      <Typography variant="h4">Success!</Typography>
      <Typography
        variant="body1"
        sx={{ color: "rgba(255,255,255,0.48)", marginBottom: "2rem" }}
      >
        Your shift data has been saved
      </Typography>
      <Button variant="contained" onClick={handleClick}>
        Dashboard
      </Button>
    </div>
  );
};

export default Success;
