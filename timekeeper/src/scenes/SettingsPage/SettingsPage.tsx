import { Box, Switch, Typography } from "@mui/material";
import { Settings } from "@mui/icons-material";
import NavHeader from "../../components/NavHeader/NavHeader";
import { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const SettingsPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { switchThemeMode, themeMode } = useContext(ThemeContext);

  return (
    <Box sx={{ width: "100%", height: "100dvh", p: "0.5rem" }}>
      <NavHeader label="Settings" icon={Settings} setLoading={setLoading} />
      <Box sx={{ height: "calc(100% - (5% + 1rem))", mt: "0.5rem" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body1">Dark Mode</Typography>
          <Switch
            checked={themeMode === "dark"}
            onChange={() => switchThemeMode()}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsPage;
