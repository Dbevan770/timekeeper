import {
  Box,
  Switch,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent,
} from "@mui/material";
import { Settings } from "@mui/icons-material";
import NavHeader from "../../components/NavHeader/NavHeader";
import Loading from "../../components/Loading/Loading";
import { useContext, useState, useRef, useEffect } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const SettingsPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [rate, setRate] = useState<string>(
    localStorage.getItem("defaultRate") || ""
  );
  const [currency, setCurrency] = useState<string>(
    localStorage.getItem("defaultCurrency") || ""
  );
  const { switchThemeMode, themeMode } = useContext(ThemeContext);

  const rateTimeout = useRef<any>(null);

  const handleRateChange = (value: string) => {
    if (!value || value.match(/^\d+(\.\d{0,2})?$/)) {
      setRate(value);
    } else {
      return;
    }

    if (rateTimeout.current !== null) {
      clearTimeout(rateTimeout.current);
    }
    rateTimeout.current = setTimeout(() => {
      localStorage.setItem("defaultRate", value);
      rateTimeout.current = null;
    }, 500);
  };

  const handleCurrencyChange = (event: SelectChangeEvent) => {
    setCurrency(event.target.value as string);
    localStorage.setItem("defaultCurrency", event.target.value);
  };

  useEffect(() => {
    return () => {
      if (rateTimeout.current) {
        clearTimeout(rateTimeout.current);
      }
    };
  }, []);

  return (
    <>
      {!loading ? (
        <Box sx={{ width: "100%", height: "100dvh", p: "0.5rem" }}>
          <NavHeader label="Settings" icon={Settings} setLoading={setLoading} />
          <Box sx={{ height: "calc(100% - (5% + 1rem))", mt: "0.5rem" }}>
            <List>
              <ListItem>
                <ListItemText primary="Light Mode(BETA)" />
                <Switch
                  checked={themeMode === "light"}
                  onChange={() => switchThemeMode()}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Default Pay Rate" />
                <TextField
                  sx={{ maxWidth: "3rem", textAlign: "center" }}
                  variant="standard"
                  value={rate}
                  onChange={(e) => handleRateChange(e.target.value)}
                  inputProps={{
                    style: {
                      color: themeMode === "dark" ? "#e1e1e1" : "black",
                    },
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Default Currency" />
                <Select
                  value={currency}
                  sx={{ width: "6rem" }}
                  onChange={handleCurrencyChange}
                >
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                </Select>
              </ListItem>
            </List>
          </Box>
        </Box>
      ) : (
        <Loading label="Loading..." />
      )}
    </>
  );
};

export default SettingsPage;
