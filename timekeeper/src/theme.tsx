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
        default: mode === "dark" ? "#121212" : "hsl(0, 0%, 95%)",
      },
      text: {
        primary: mode === "dark" ? "#e1e1e1" : "#000000",
      },
    },
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            color: mode === "dark" ? "#e1e1e1" : "#000000",
            "&.MuiPickersToolbarText-root": {
              color:
                mode === "dark" ? "rgba(225,225,225,0.6)" : "rgba(0,0,0,0.6)",
              "&.Mui-selected": {
                color: mode === "dark" ? "#ffffff" : "#000000",
                fontWeight: 900,
              },
            },
          },
          h1: {
            color: mode == "dark" ? "#e1e1e1" : "#000000",
            "&.ShiftItemCurrency": {
              color: mode === "dark" ? "hsl(0, 0%, 90%)" : "hsl(0, 0%, 12%)",
            },
          },
          h5: {
            "&.NavHeaderText": {
              color: mode === "dark" ? "#e1e1e1" : "#ffffff",
            },
            "&.EmptyContentTitle": {
              color: mode === "dark" ? "#e1e1e1" : "#000000",
            },
          },
          body1: {
            color:
              mode === "dark" ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.48)",
            "&.WidgetTitle": {
              color:
                mode === "dark" ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.48)",
              textAlign: "left",
            },
            "&.EmailVerifyBody": {
              color: "#c22727",
            },
          },
          overline: {
            "&.MuiTypography-overline": {
              color: mode === "dark" ? "#e1e1e1" : "#000000",
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
              color: mode === "dark" ? "rgba(255,255,255,0.23)" : "#000000",
              "&.Mui-focused": {
                color: mode === "dark" ? "#5fff51" : "#0f7cdb",
              },
            },
            "& .MuiOutlinedInput-root": {
              fieldset: {
                borderColor:
                  mode === "dark"
                    ? "rgba(255,255,255,0.23)"
                    : "rgba(0,0,0,0.48)",
                borderWidth: "2px",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255,255,255,0.23)",
              },
              "&.Mui-focused fieldset": {
                borderColor: mode === "dark" ? "#5fff51" : "#0f7cdb",
              },
            },
            "& .MuiInputBase-root": {
              default: {
                color: mode === "dark" ? "#e1e1e1" : "#000000",
              },
            },
          },
        },
        defaultProps: {
          inputProps: {
            style: {
              color: mode === "dark" ? "#e1e1e1" : "#000000",
              borderColor: "#e1e1e1",
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            color: mode === "dark" ? "#e1e1e1" : "#000000",
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          input: {
            color: mode === "dark" ? "#e1e1e1" : "#000000",
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
            borderColor:
              mode === "dark" ? "rgba(255,255,255,0.23)" : "rgba(0,0,0,0.48)",
            padding: ".25rem",
            "&:hover": {
              borderWidth: "2px",
              borderColor: "rgba(255,255,255,0.23)",
            },
          },
          contained: {
            "&.GoogleSignInBtn": {
              backgroundColor: "#ffffff",
              textTransform: "none",
              boxShadow: mode === "dark" ? "none" : "hsla(0, 0%, 0%, 0.2)",
              color: "hsl(0,0%, 5%)",
            },
          },
        },
      },
      MuiButtonBase: {
        styleOverrides: {
          root: {
            "&.MuiPickersCalendarHeader-switchViewButton": {
              color: mode === "dark" ? "#e1e1e1" : "#000000",
            },
            "&.MuiPickersArrowSwitcher-button": {
              color: mode === "dark" ? "#e1e1e1" : "#000000",
            },
            "&.MuiPickersDay-root": {
              color: mode === "dark" ? "#e1e1e1" : "#000000",
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          select: {
            color: mode === "dark" ? "#e1e1e1" : "#000000",
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
            color: mode === "dark" ? "#e1e1e1" : "#000000",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paperAnchorRight: {
            backgroundColor: mode === "dark" ? "#222222" : "#0f7cdb",
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
            "& .MuiTypography-root": {
              "& .MuiTypography-h1": {
                color: mode === "dark" ? "#e1e1e1" : "#000000",
              },
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: mode === "dark" ? "#e1e1e1" : "#000000",
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: mode === "dark" ? "#e1e1e1" : "#000000",
          },
          fontSizeMedium: {
            color: mode === "dark" ? "#e1e1e1" : "#000000",
            "&.NavIcon": {
              color: mode === "dark" ? "#e1e1e1" : "#ffffff",
            },
            "&.FabIcon": {
              color: mode === "dark" ? "#121212" : "#000000",
            },
            "&.AddShiftIcon": {
              color: mode === "dark" ? "#121212" : "#ffffff",
            },
            "&.MuiSelect-icon": {
              color: mode === "dark" ? "#e1e1e1" : "#000000",
            },
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            color: mode === "dark" ? "#e1e1e1" : "#000000",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: mode === "dark" ? "#e1e1e1" : "#000000",
          },
        },
      },
    },
  });

  return responsiveFontSizes(theme);
};

export default getTheme;
