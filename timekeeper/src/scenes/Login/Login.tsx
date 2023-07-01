import {
  Typography,
  Button,
  TextField,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { SignIn } from "../../auth/signin";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const [showPass, setShowPass] = useState<boolean>(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { result, error } = await SignIn(email, pass);

    if (error) console.log(error);

    console.log(result);
  };

  const handleShowPass = () => setShowPass((show) => !show);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  return (
    <div className="login-form-container">
      <Typography
        variant="h4"
        sx={{ margin: "4rem auto 0 auto", maxWidth: "75%" }}
      >
        TIMEKEEPER
      </Typography>
      <form id="login-form" onSubmit={handleSubmit} className="login-form">
        <Typography
          variant="h5"
          sx={{
            marginBottom: "2rem",
            letterSpacing: ".5rem",
            fontWeight: "300",
          }}
        >
          WELCOME
        </Typography>
        <TextField
          variant="outlined"
          id="email"
          label="E-Mail"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <EmailIcon sx={{ color: "rgba(255,255,255,0.23)" }} />
              </InputAdornment>
            ),
          }}
        ></TextField>
        <TextField
          id="pass"
          variant="outlined"
          label="Password"
          type={showPass ? "text" : "password"}
          onChange={(e) => setPass(e.target.value)}
          fullWidth
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleShowPass}
                  edge="end"
                  sx={{
                    padding: "0 12px 0 0",
                    color: "rgba(255,255,255,0.23)",
                  }}
                >
                  {showPass ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        ></TextField>
        <Typography
          variant="body2"
          sx={{
            textAlign: "right",
            color: "rgba(255,255,255,0.8)",
            marginBottom: "1.5rem",
          }}
        >
          Forgot Password?
        </Typography>
        <Button variant="contained" type="submit">
          SIGN IN
        </Button>
      </form>
      <div className="login-form-footer">
        <Typography variant="body1">Don't have an account?</Typography>
        <Link href="/register" underline="none" color="secondary">
          Create new account
        </Link>
      </div>
    </div>
  );
}

export default Login;
