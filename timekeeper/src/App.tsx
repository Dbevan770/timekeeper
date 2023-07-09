import "./App.css";
import { Button, Typography } from "@mui/material";
import { useAuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "./components/Loading/Loading";

const App = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuthContext();

  const handleClick = () => {
    navigate("/register");
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }

    setLoading(false);
  }, []);

  return (
    <>
      {!loading ? (
        <main className="main-page">
          <Typography variant="h3">TIMEKEEPER</Typography>
          <Typography variant="subtitle1" sx={{ marginBottom: "1rem" }}>
            Never lose track of time again!
          </Typography>
          <Button variant="contained" onClick={handleClick}>
            Get Started
          </Button>
        </main>
      ) : (
        <Loading label="Loading..." />
      )}
    </>
  );
};

export default App;
