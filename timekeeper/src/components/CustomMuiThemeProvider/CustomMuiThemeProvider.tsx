import { useContext, ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { ThemeContext } from "../../context/ThemeContext";

const CustomMuiThemeProvider = ({ children }: { children: ReactNode }) => {
  const themeContext = useContext(ThemeContext);

  return (
    <MuiThemeProvider theme={themeContext?.theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default CustomMuiThemeProvider;
