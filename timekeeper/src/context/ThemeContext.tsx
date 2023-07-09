import { createContext, useState, useEffect, ReactNode } from "react";
import getTheme from "../theme";
import { Theme } from "@mui/material";

type ThemeContextType = {
  theme: Theme;
  themeMode: "light" | "dark";
  switchThemeMode: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: getTheme("dark"),
  themeMode: "dark",
  switchThemeMode: () => {},
});

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">(
    (localStorage.getItem("themeMode") as "light" | "dark") || "dark"
  );

  useEffect(() => {
    localStorage.setItem("themeMode", themeMode);
  }, [themeMode]);

  const switchThemeMode = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = getTheme(themeMode);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, switchThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
