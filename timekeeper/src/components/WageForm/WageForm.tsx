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
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { useState, useContext, SyntheticEvent } from "react";
import {
  calculateTimeDifference,
  calculateTotalBreaks,
  calculateEarned,
} from "../../utils/calcHelper";
import "./WageForm.css";
import BreakInput from "../BreakInput/BreakInput";
import TimeInput from "../TimeInput/TimeInput";
import dayjs from "dayjs";

interface WageFormProps {
  onSubmit: (
    totalHours: number,
    shiftDate: Date | null,
    rate: string,
    currency: string,
    startHour: string,
    startMin: string,
    startMeridian: string,
    endHour: string,
    endMin: string,
    endMeridian: string,
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
  const [startHourError, setStartHourError] = useState<boolean>(false);
  const [endHourError, setEndHourError] = useState<boolean>(false);

  const { themeMode } = useContext(ThemeContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [rate, setRate] = useState<string>(
    localStorage.getItem("defaultRate") || ""
  );
  const [shiftDate, setShiftDate] = useState<Date | null>(new Date());
  const [currency, setCurrency] = useState<string>(
    localStorage.getItem("defaultCurrency") || ""
  );
  const [startHour, setStartHour] = useState<string>("");
  const [startMin, setStartMin] = useState<string>("");
  const [startMeridian, setStartMeridian] = useState<string>("AM");
  const [endHour, setEndHour] = useState<string>("");
  const [endMin, setEndMin] = useState<string>("");
  const [endMeridian, setEndMeridian] = useState<string>("AM");
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

    if (startHour === null || startHour === "0") {
      setStartHourError(true);
      openSnackbar("Start hour cannot be 0.");
      return;
    }
    if (endHour === null || endHour === "0") {
      setEndHourError(true);
      openSnackbar("End hour cannot be 0.");
      return;
    }

    if (shiftDate === null) {
      openSnackbar("Shift date cannot be empty.");
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

    const totalHoursWorked = calculateTimeDifference(
      startHour,
      startMin,
      startMeridian,
      endHour,
      endMin,
      endMeridian
    );
    const totalBreaks = calculateTotalBreaks(breaks);
    const actualHoursWorked = totalHoursWorked - totalBreaks;
    const earned = calculateEarned(actualHoursWorked, rate);

    // Padding the hours and minutes to avoid single digit times in the DB
    const paddedStartHour = startHour.padStart(2, "0");
    const paddedStartMin = startMin.padStart(2, "0");
    const paddedEndHour = endHour.padStart(2, "0");
    const paddedEndMin = endMin.padStart(2, "0");

    onSubmit(
      actualHoursWorked,
      shiftDate,
      rate,
      currency,
      paddedStartHour,
      paddedStartMin,
      startMeridian,
      paddedEndHour,
      paddedEndMin,
      endMeridian,
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
        </LocalizationProvider>
        <TimeInput
          label="Start Time"
          hour={startHour}
          setHour={setStartHour}
          setHourError={setStartHourError}
          min={startMin}
          setMin={setStartMin}
          meridian={startMeridian}
          setMeridian={setStartMeridian}
          hourError={startHourError}
          disabled={loading}
        />
        <TimeInput
          label="End Time"
          hour={endHour}
          setHour={setEndHour}
          setHourError={setEndHourError}
          min={endMin}
          setMin={setEndMin}
          meridian={endMeridian}
          setMeridian={setEndMeridian}
          hourError={endHourError}
          disabled={loading}
        />
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
