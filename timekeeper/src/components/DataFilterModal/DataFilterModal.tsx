import {
  Box,
  Paper,
  Tabs,
  Tab,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState, useEffect, SyntheticEvent } from "react";
import { useWages } from "../../context/WagesContext";

const DataFilterModal = ({ openDataFilter }: { openDataFilter: boolean }) => {
  const { setDateRange } = useWages();
  const [tabValue, setTabValue] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setStartDate(null);
    setEndDate(null);
    setTabValue(newValue);
    switch (newValue) {
      case 0:
        setDateRange({ queryType: "currentWeek" });
        break;
      case 1:
        setDateRange({ queryType: "pastMonth" });
        break;
      case 2:
        setDateRange({ queryType: "pastSixMonths" });
        break;
      case 3:
        setDateRange({ queryType: "pastYear" });
        break;
      default:
        break;
    }
  };

  const handleDateChange = () => {
    if (startDate && endDate) {
      setDateRange({ queryType: "custom", startDate, endDate });
    }
  };

  useEffect(() => {
    handleDateChange();
  }, [startDate, endDate]);

  return (
    <Box
      sx={{
        position: "absolute",
        right: "2.5%",
        top: "3.5rem",
        zIndex: "10",
        maxWidth: "95%",
        display: openDataFilter ? "block" : "none",
      }}
    >
      <Paper elevation={5}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ minHeight: "32px" }}
        >
          <Tab label="W" sx={{ p: "0", minHeight: "32px" }} />
          <Tab label="M" sx={{ p: "0", minHeight: "32px" }} />
          <Tab label="6M" sx={{ p: "0", minHeight: "32px" }} />
          <Tab label="Y" sx={{ p: "0", minHeight: "32px" }} />
        </Tabs>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ margin: "1rem 1rem 0.5rem 1rem" }}
          spacing={2}
        >
          <Divider sx={{ borderWidth: "2px", flex: "1 1 auto" }} />
          <Typography variant="body1">OR</Typography>
          <Divider sx={{ borderWidth: "2px", flex: "1 1 auto" }} />
        </Stack>
        <Typography variant="subtitle1" sx={{ marginBottom: "0.5rem" }}>
          Custom Date Range
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={2}
          alignItems="center"
          sx={{ margin: "0 1rem", paddingBottom: "2rem" }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
            />
          </LocalizationProvider>
          <Typography variant="body1"> to </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
            />
          </LocalizationProvider>
        </Stack>
      </Paper>
    </Box>
  );
};

export default DataFilterModal;
