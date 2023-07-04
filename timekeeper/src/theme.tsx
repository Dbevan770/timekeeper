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
      default: "#121212",
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#e1e1e1",
          "&.MuiPickersToolbarText-root": {
            color: "#e1e1e1",
            "&.Mui-selected": {
              color: "white",
            },
          },
        },
        overline: {
          "&.MuiTypography-overline": {
            color: "#e1e1e1",
          },
        },
        caption: {
          "&.MuiDayCalendar-weekDayLabel": {
            color: "rgba(255,255,255,0.6)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            color: "rgba(255,255,255,0.23)",
            "&.Mui-focused": {
              color: "#5fff51",
            },
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
        outlined: {
          color: "#e1e1e1",
          borderWidth: "2px",
          borderColor: "rgba(255,255,255,0.23)",
          padding: ".25rem",
          "&:hover": {
            borderWidth: "2px",
            borderColor: "rgba(255,255,255,0.23)",
          },
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          "&.MuiPickersCalendarHeader-switchViewButton": {
            color: "#e1e1e1",
          },
          "&.MuiPickersArrowSwitcher-button": {
            color: "#e1e1e1",
          },
          "&.MuiPickersDay-root": {
            color: "#e1e1e1",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          color: "#e1e1e1",
          textAlign: "left",
        },
        icon: {
          color: "rgba(255,255,255,0.23)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: "#e1e1e1",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#222222",
          color: "#e1e1e1",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          color: "#242424",
          fontWeight: 500,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "1rem",
          "&:last-child": {
            paddingBottom: "1rem",
          },
        },
      },
    },
  },
});

export default theme;
