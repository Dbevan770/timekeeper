import {
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Backdrop,
  CircularProgress,
  Stack,
  Divider,
} from "@mui/material";
import { Email, Visibility, VisibilityOff } from "@mui/icons-material";
import { GoogleLogo } from "../IconComponents/GoogleLogo/GoogleLogo";
import { useState } from "react";
import { SignIn } from "../../auth/signin";
import { GoogleSignIn } from "../../auth/googleSignIn";

export interface LoginFormProps {
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setSeverity: React.Dispatch<React.SetStateAction<"error" | "success">>;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginForm = ({
  setMessage,
  setSeverity,
  setOpenSnackbar,
}: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    const { value } = e.target;
    setEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    const { value } = e.target;
    setPass(value);
  };

  const handleShowPassChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPass((prev) => !prev);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const { error } = await SignIn(email, pass);

    if (error) {
      setLoading(false);
      setError(true);
      setMessage("E-mail or password is incorrect.");
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleGoogleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await GoogleSignIn();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form
      id="login-form"
      onSubmit={handleSubmit}
      className="login-form"
      data-testid="login-form"
    >
      <Backdrop open={loading} sx={{ color: "#fff", zIndex: 1 }}>
        <CircularProgress color="primary" />
      </Backdrop>
      <Typography
        variant="h5"
        sx={{
          marginBottom: "1rem",
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
        value={email}
        error={error}
        onChange={handleEmailChange}
        fullWidth
        required
        disabled={loading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Email />
            </InputAdornment>
          ),
        }}
      ></TextField>
      <TextField
        id="pass"
        variant="outlined"
        label="Password"
        type={showPass ? "text" : "password"}
        onChange={handlePasswordChange}
        fullWidth
        required
        value={pass}
        error={error}
        disabled={loading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleShowPassChange}
                disabled={loading}
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
      <Button variant="contained" type="submit" disabled={loading}>
        SIGN IN
      </Button>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{ margin: "1rem 0" }}
        spacing={2}
      >
        <Divider sx={{ borderWidth: "2px", flex: "1 1 auto" }} />
        <Typography variant="body1">OR</Typography>
        <Divider sx={{ borderWidth: "2px", flex: "1 1 auto" }} />
      </Stack>
      <Button
        variant="contained"
        type="button"
        className="GoogleSignInBtn"
        disabled={loading}
        onClick={handleGoogleSignIn}
        startIcon={<GoogleLogo />}
      >
        Sign in with Google
      </Button>
    </form>
  );
};
