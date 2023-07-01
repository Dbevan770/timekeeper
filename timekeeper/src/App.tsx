import "./App.css";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/register");
  };
  return (
    <>
      <main className="main-page">
        <h1 className="main-title">Timekeeper</h1>
        <p className="main-subtitle">Never lose track of time again!</p>
        <Button id="main-btn" variant="contained" onClick={handleClick}>
          Get Started
        </Button>
      </main>
    </>
  );
};

export default App;
