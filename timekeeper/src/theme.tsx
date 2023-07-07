import { createTheme, responsiveFontSizes } from "@mui/material";

const getTheme = (mode: "light" | "dark") => {
  let theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: mode === "dark" ? "#5fff51" : "#0f7cdb",
      },
      secondary: {
        main: "#f151ff",
      },
      background: {
        default: mode === "dark" ? "#121212" : "#ffffff",
      },
      text: {
        primary: "#e1e1e1",
      },
    },
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            color: mode === "dark" ? "#e1e1e1" : "black",
            "&.MuiPickersToolbarText-root": {
              color: "#e1e1e1",
              "&.Mui-selected": {
                color: "white",
              },
            },
          },
          h5: {
            "&.NavHeaderText": {
              color: mode === "dark" ? "#e1e1e1" : "#ffffff",
            },
          },
          body1: {
            "&.WidgetTitle": {
              color:
                mode === "dark" ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.48)",
              textAlign: "left",
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
            backgroundColor: mode === "dark" ? "#222222" : "#ffffff",
            color: "#e1e1e1",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paperAnchorRight: {
            backgroundColor: mode === "dark" ? "#222222" : "#0f16db",
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
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: mode === "dark" ? "#e1e1e1" : "black",
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: mode === "dark" ? "#e1e1e1" : "black",
          },
          fontSizeMedium: {
            color: mode === "dark" ? "#121212" : "black",
            "&.NavIcon": {
              color: mode === "dark" ? "#e1e1e1" : "#ffffff",
            },
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            color: mode === "dark" ? "#e1e1e1" : "#ffffff",
          },
        },
      },
    },
  });

  return responsiveFontSizes(theme);
};

export default getTheme;
