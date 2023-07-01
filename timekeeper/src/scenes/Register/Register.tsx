import { TextField, Button } from "@mui/material";
import { useState } from "react";
import "./Register.css";

const Register = () => {
  const [user, setUser] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const [confPass, setConfPass] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (pass !== confPass) {
      setError(true);
      setErrorText("Passwords do not match!");
    }

    console.log("I was submitted!");
  };
  return (
    <div className="register-form-container">
      <h1 className="register-form-heading">Create an Account</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <TextField
          id="username"
          variant="outlined"
          label="Username"
          onChange={(e) => setUser(e.target.value)}
          sx={{
            label: {
              color: "#e1e1e1",
            },
            "label:focus": {
              color: "#60ff51 !important",
            },
            input: {
              color: "#e1e1e1",
              border: "2px solid #e1e1e1",
              borderRadius: ".25rem",
            },
            "fieldset:focus": {
              borderColor: "#60ff51",
              borderWidth: "2px",
            },
            "&.MuiOutlinedInput-notchedOutline": {
              color: "red",
            },
          }}
          fullWidth
          required
        ></TextField>
        <TextField
          id="email"
          variant="outlined"
          label="E-mail"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
        ></TextField>
        <TextField
          error={error}
          id="pass"
          variant="outlined"
          label="Password"
          type="password"
          onChange={(e) => setPass(e.target.value)}
          fullWidth
          helperText={errorText}
          required
        ></TextField>
        <TextField
          error={error}
          id="confirm-pass"
          variant="outlined"
          label="Confirm Password"
          type="password"
          onChange={(e) => setConfPass(e.target.value)}
          fullWidth
          required
        ></TextField>
        <Button variant="contained" type="submit">
          Sign Up
        </Button>
      </form>
    </div>
  );
};

export default Register;
