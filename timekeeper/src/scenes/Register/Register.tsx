import {
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState, useEffect } from "react";
import { SignUp } from "../../auth/signup";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const [confPass, setConfPass] = useState<string>("");
  const [showPass, setShowPass] = useState<boolean>(false);
  const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(false);

    if (pass !== confPass) {
      setError(true);
      setErrorText("Passwords do not match!");
      return;
    }

    const { result, error } = await SignUp(email, pass, name);

    if (error) {
      return console.error(error);
    }

    console.log(result);
    navigate("/login");
  };

  const handleShowPassword = () => setShowPass((show) => !show);

  const handleShowConfirmPassword = () => setShowConfirmPass((show) => !show);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  return (
    <div className="register-form-container">
      <Typography
        variant="h5"
        sx={{ margin: "4rem auto 0 auto", maxWidth: "75%" }}
      >
        CREATE NEW ACCOUNT
      </Typography>
      <form
        id="register-form"
        onSubmit={handleSubmit}
        className="register-form"
      >
        <TextField
          id="name"
          variant="outlined"
          label="Display Name"
          type="text"
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <PersonIcon sx={{ color: "rgba(255,255,255,0.23)" }} />
              </InputAdornment>
            ),
          }}
        ></TextField>
        <TextField
          id="email"
          variant="outlined"
          label="E-mail"
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
          error={error}
          id="pass"
          variant="outlined"
          label="Password"
          type={showPass ? "text" : "password"}
          onChange={(e) => setPass(e.target.value)}
          fullWidth
          helperText={errorText}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleShowPassword}
                  edge="end"
                  sx={{
                    padding: "0 .75rem 0 0",
                    color: "rgba(255,255,255,0.23)",
                  }}
                >
                  {showPass ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        ></TextField>
        <TextField
          error={error}
          id="confirm-pass"
          variant="outlined"
          label="Confirm Password"
          type={showConfirmPass ? "text" : "password"}
          onChange={(e) => setConfPass(e.target.value)}
          fullWidth
          required
          sx={{ marginBottom: "1.5rem" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleShowConfirmPassword}
                  edge="end"
                  sx={{
                    padding: "0 .75rem 0 0",
                    color: "rgba(255,255,255,0.23)",
                  }}
                >
                  {showConfirmPass ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        ></TextField>
        <Button
          form="register-form"
          variant="contained"
          type="submit"
          sx={{ marginBottom: ".5rem" }}
        >
          Create New Account
        </Button>
        <Typography
          variant="body1"
          sx={{
            fontSize: ".75rem",
            padding: "0 1rem",
            textWrap: "balance",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          By tapping "Create New Account" you agree to the{" "}
          <Link href="#" target="_blank" underline="none" color="secondary">
            terms & conditions
          </Link>
        </Typography>
      </form>
      <div className="login-form-footer">
        <Typography variant="body2">Already have an account?</Typography>
        <Link href="/login" underline="none" color="secondary">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
