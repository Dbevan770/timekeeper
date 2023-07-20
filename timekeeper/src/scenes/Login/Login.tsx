import { Typography, Link, Snackbar, Alert } from "@mui/material";
import Loading from "../../components/Loading/Loading";
import { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../../components/LoginForm/LoginForm";
import "./Login.css";

function Login() {
  const [redirectLoading, setRedirectLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"error" | "success">("error");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    setRedirectLoading(true);
    if (user) {
      navigate("/dashboard");
    }
    setRedirectLoading(false);
  }, [user]);

  return (
    <>
      {!redirectLoading ? (
        <div className="login-form-container">
          <Snackbar
            open={openSnackbar}
            onClose={handleCloseSnackbar}
            autoHideDuration={5000}
          >
            <Alert
              severity={severity}
              onClose={handleCloseSnackbar}
              sx={{ width: "100%" }}
              variant="filled"
            >
              {message}
            </Alert>
          </Snackbar>
          <Typography
            variant="h4"
            sx={{ margin: "4rem auto 0 auto", maxWidth: "75%" }}
          >
            TIMEKEEPER
          </Typography>
          <LoginForm
            setMessage={setMessage}
            setSeverity={setSeverity}
            setOpenSnackbar={setOpenSnackbar}
          />
          <div className="login-form-footer">
            <Typography variant="body1">Don't have an account?</Typography>
            <Link href="/register" underline="none" color="secondary">
              Create new account
            </Link>
          </div>
        </div>
      ) : (
        <Loading label="Loading..." />
      )}
    </>
  );
}

export default Login;
