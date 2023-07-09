import {
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { Person, Email, Visibility, VisibilityOff } from "@mui/icons-material";
import Loading from "../../components/Loading/Loading";
import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { SignUp } from "../../auth/signup";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const { themeMode } = useContext(ThemeContext);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const [confPass, setConfPass] = useState<string>("");
  const [showPass, setShowPass] = useState<boolean>(false);
  const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [redirectLoading, setRedirectLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(false);
    setLoading(true);

    if (pass !== confPass) {
      setError(true);
      setErrorText("Passwords do not match!");
      return;
    }

    const { result, error } = await SignUp(email, pass, name);

    if (error) {
      setLoading(false);
      console.error(error);
      return;
    }

    console.log(result);
    navigate("/login");
  };

  const handleShowPassword = () => setShowPass((show) => !show);

  const handleShowConfirmPassword = () => setShowConfirmPass((show) => !show);

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
            <Backdrop open={loading} sx={{ color: "#fff", zIndex: 1 }}>
              <CircularProgress color="primary" />
            </Backdrop>
            <TextField
              id="name"
              variant="outlined"
              label="Display Name"
              type="text"
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Person />
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
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Email
                      sx={{
                        color: themeMode === "dark" ? "#e1e1e1" : "#000000",
                      }}
                    />
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
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleShowPassword}
                      edge="end"
                      sx={{
                        padding: "0 .75rem 0 0",
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
              disabled={loading}
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
              disabled={loading}
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
      ) : (
        <Loading label="Loading..." />
      )}
    </>
  );
};

export default Register;
