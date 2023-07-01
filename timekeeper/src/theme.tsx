import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5fff51",
    },
    secondary: {
      main: "#f151ff",
    },
    background: {
      default: "#242424",
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#e1e1e1",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            color: "rgba(255,255,255,0.23)",
          },
          "& .MuiOutlinedInput-root": {
            fieldset: {
              borderColor: "rgba(255,255,255,0.23)",
              borderWidth: "2px",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255,255,255,0.23)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#5fff51",
            },
          },
        },
      },
      defaultProps: {
        inputProps: {
          style: {
            color: "#e1e1e1",
            borderColor: "#e1e1e1",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
        },
      },
    },
  },
});

export default theme;
