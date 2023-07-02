import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import { Add } from "@mui/icons-material";

const Dashboard = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dashboard/add-wages");
  };

  return (
    <div>
      dashboard
      <Typography variant="h5">Hello {user && user.displayName}!</Typography>
      <Typography variant="body1">Hmmm, there's nothing here!</Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={handleClick}
        sx={{ fontSize: "1rem", verticalAlign: "middle" }}
      >
        Add Wages
      </Button>
    </div>
  );
};

export default Dashboard;
