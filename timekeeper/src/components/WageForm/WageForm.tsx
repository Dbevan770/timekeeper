import {
  TextField,
  MenuItem,
  InputAdornment,
  Typography,
  Button,
  Backdrop,
  CircularProgress,
  Box,
  Stack,
  Snackbar,
  SnackbarCloseReason,
  Alert,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { ThemeContext } from "../../context/ThemeContext";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { useState, useContext, SyntheticEvent } from "react";
import { calculateTotalBreaks, calculateEarned } from "../../utils/calcHelper";
import BreakInput from "../BreakInput/BreakInput";
import dayjs from "dayjs";

interface WageFormProps {
  onSubmit: (
    totalHours: number,
    shiftDate: Date | null,
    rate: string,
    currency: string,
    startTime: Date | null,
    endTime: Date | null,
    totalEarned: string,
    breaks: { hours: string; minutes: string }[]
  ) => void;
}

const WageForm = ({ onSubmit }: WageFormProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  // Error states
  const [breakErrors, setBreakErrors] = useState<{
    [key: number]: { hours: boolean; minutes: boolean };
  }>({});

  const { themeMode } = useContext(ThemeContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [rate, setRate] = useState<string>(
    localStorage.getItem("defaultRate") || ""
  );
  const [shiftDate, setShiftDate] = useState<Date | null>(new Date());
  const [currency, setCurrency] = useState<string>(
    localStorage.getItem("defaultCurrency") || ""
  );
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [breaks, setBreaks] = useState<
    Array<{ hours: string; minutes: string }>
  >([]);

  const defaultRate = localStorage.getItem("defaultRate") || "";

  const currencies = [
    {
      value: "USD",
      label: "$ USD",
      symbol: "$",
    },
    {
      value: "EUR",
      label: "€ Euro",
      symbol: "€",
    },
  ];

  const openSnackbar = (message: string) => {
    setMessage(message);
    setOpen(true);
  };

  const closeErrorSnackbar = (
    _?: SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleBreakChange = (
    index: number,
    breakValue: { hours: string; minutes: string }
  ) => {
    setBreaks((prevBreaks) => {
      const newBreaks = [...prevBreaks];
      newBreaks[index] = breakValue;
      return newBreaks;
    });

    setBreakErrors((prevErrors) => {
      if (!prevErrors[index]) return prevErrors;
      const newErrors = { ...prevErrors };
      newErrors[index] = { hours: false, minutes: false };
      return newErrors;
    });
  };

  const handleAddOrRemoveBreak = (increment: number) => {
    if (increment < 0 && breaks.length === 0) return;

    setBreaks((prevBreaks) => {
      if (increment > 0) {
        return [...prevBreaks, { hours: "", minutes: "" }];
      } else {
        return prevBreaks.slice(0, -1);
      }
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (shiftDate === null) {
      openSnackbar("Shift date cannot be empty.");
      return;
    }

    if (startTime === null || endTime === null) {
      openSnackbar("Start or End time cannot be empty");
      return;
    }

    let hasError = false;
    for (let i = 0; i < breaks.length; i++) {
      const breakObj = breaks[i];
      if (!breakObj.hours && !breakObj.minutes) {
        hasError = true;
        setBreakErrors((prevErrors) => {
          let newErrors = { ...prevErrors };
          newErrors[i] = { hours: true, minutes: true };
          return newErrors;
        });
      }
    }
    if (hasError) {
      openSnackbar("Breaks must include either the hours or minutes or both.");
      return;
    }

    setLoading(true);

    const totalHoursWorked = endTime.diff(startTime, "hours", true);
    const totalBreaks = calculateTotalBreaks(breaks);
    const actualHoursWorked = totalHoursWorked - totalBreaks;
    const earned = calculateEarned(actualHoursWorked, rate);
    const dateStartTime = startTime.toDate();
    const dateEndTime = endTime.toDate();
    setLoading(false);

    onSubmit(
      actualHoursWorked,
      shiftDate,
      rate,
      currency,
      dateStartTime,
      dateEndTime,
      earned,
      breaks
    );
  };

  return (
    <Box
      sx={{
        flex: "1 1 auto",
        maxHeight: "calc(100vh - (100vh * 0.05))",
        overflowY: "auto",
        p: "0.75rem 2.5rem 0.75rem 2.5rem",
      }}
    >
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={closeErrorSnackbar}
      >
        <Alert
          onClose={closeErrorSnackbar}
          severity="error"
          sx={{ width: "100%" }}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
      <form
        id="add-wages-form"
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
      >
        <Backdrop open={loading} sx={{ color: "#fff", zIndex: 1 }}>
          <CircularProgress color="primary" />
        </Backdrop>
        <Stack spacing={0.75} direction="row">
          <TextField
            id="select-currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            disabled={loading}
            select
            label="Currency"
            defaultValue="EUR"
            fullWidth
          >
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="rate"
            defaultValue={defaultRate}
            onChange={(e) => setRate(e.target.value)}
            disabled={loading}
            variant="outlined"
            label="Rate"
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body2">/hr</Typography>
                </InputAdornment>
              ),
            }}
            inputProps={{
              style: {
                color: themeMode === "dark" ? "#e1e1e1" : "#000000",
              },
            }}
          ></TextField>
        </Stack>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date of Shift"
            value={dayjs(shiftDate)}
            onChange={(date: Dayjs | null) =>
              setShiftDate(date?.toDate() ?? null)
            }
            disabled={loading}
          />
          <TimePicker
            label="Start Time*"
            value={startTime}
            onChange={(newTime) => setStartTime(newTime)}
            disabled={loading}
          />
          <TimePicker
            label="End Time*"
            value={endTime}
            onChange={(newTime) => setEndTime(newTime)}
            disabled={loading}
          />
        </LocalizationProvider>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ mt: "1rem" }}
        >
          <Stack direction="row" spacing={0.5}>
            <Button
              variant="outlined"
              onClick={() => handleAddOrRemoveBreak(-1)}
              disabled={loading}
            >
              <Remove />
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleAddOrRemoveBreak(1)}
              disabled={loading}
            >
              <Add />
            </Button>
          </Stack>
          <Typography variant="h6">Breaks: {breaks.length}</Typography>
        </Stack>
        {breaks.map((breakValue, index) => (
          <BreakInput
            breakValue={breakValue}
            onChange={handleBreakChange}
            index={index}
            errors={breakErrors[index]}
            disabled={loading}
            key={index}
          />
        ))}
        <Button
          variant="contained"
          type="submit"
          sx={{ marginTop: "1rem" }}
          disabled={loading}
        >
          Calculate
        </Button>
      </form>
    </Box>
  );
};

export default WageForm;
