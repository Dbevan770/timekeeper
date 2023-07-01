import { Typography, Button, TextField, Link } from "@mui/material";
import { useState } from "react";
import { SignIn } from "../../auth/signin";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [pass, setPass] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { result, error } = await SignIn(email, pass);

    if (error) console.log(error);

    console.log(result);
  };
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
        ></TextField>
        <TextField
          id="pass"
          variant="outlined"
          label="Password"
          type="password"
          onChange={(e) => setPass(e.target.value)}
          fullWidth
          required
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
