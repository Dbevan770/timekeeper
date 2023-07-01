import "./App.css";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/register");
  };
  return (
    <>
      <main className="main-page">
        <Typography variant="h3">TIMEKEEPER</Typography>
        <Typography
          variant="subtitle1"
          sx={{ marginBottom: "1rem", color: "rgba(255,255,255,0.5)" }}
        >
          Never lose track of time again!
        </Typography>
        <Button variant="contained" onClick={handleClick}>
          Get Started
        </Button>
      </main>
    </>
  );
};

export default App;
