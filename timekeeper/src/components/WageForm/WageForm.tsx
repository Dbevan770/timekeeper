import {
  TextField,
  MenuItem,
  InputAdornment,
  Typography,
  Button,
  Backdrop,
  CircularProgress,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { ThemeContext } from "../../context/ThemeContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState, useContext } from "react";
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

  const handleBreakChange = (
    index: number,
    breakValue: { hours: string; minutes: string }
  ) => {
    setBreaks((prevBreaks) => {
      const newBreaks = [...prevBreaks];
      newBreaks[index] = breakValue;
      return newBreaks;
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
    setLoading(true);

    if (startHour === null || startHour === "0") return;
    if (endHour === null || endHour === "0") return;
    if (shiftDate === null) return;

    let startHour24 =
      startMeridian === "PM" && parseInt(startHour) < 12
        ? parseInt(startHour) + 12
        : parseInt(startHour);
    let endHour24 =
      endMeridian === "PM" && parseInt(endHour) < 12
        ? parseInt(endHour) + 12
        : parseInt(endHour);

    if (startMeridian === "AM" && startHour === "12") startHour24 = 0;
    if (endMeridian === "PM" && endHour === "12") endHour24 = 0;

    // Convert the hours and minutes to minutes
    const startMinutes = startHour24 * 60 + parseInt(startMin);
    const endMinutes = endHour24 * 60 + parseInt(endMin);

    // Calculate the difference in minutes
    let diffMinutes = endMinutes - startMinutes;

    // If the end time is less than the start time, add 24 hours (in minutes)
    if (diffMinutes < 0) {
      diffMinutes += 24 * 60;
    }

    // Convert the difference to hours
    const diffHours = diffMinutes / 60;

    const totalBreaks = breaks.reduce((total, breakObj) => {
      const breakHours = parseInt(breakObj.hours) || 0;
      const breakMinutes = parseInt(breakObj.minutes) || 0;
      const breakInHours = breakHours + breakMinutes / 60;
      return total + breakInHours;
    }, 0);

    const actualHoursWorked = diffHours - totalBreaks;

    const earned = (actualHoursWorked * parseFloat(rate)).toFixed(2);

    onSubmit(
      actualHoursWorked,
      shiftDate,
      rate,
      currency,
      startHour,
      startMin,
      startMeridian,
      endHour,
      endMin,
      endMeridian,
      earned,
      breaks
    );
    setLoading(false);
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
      <form id="add-wages-form" onSubmit={handleSubmit}>
        <Backdrop open={loading} sx={{ color: "#fff", zIndex: 1 }}>
          <CircularProgress color="primary" />
        </Backdrop>
        <div className="currency-rate">
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
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.23)" }}
                  >
                    /hr
                  </Typography>
                </InputAdornment>
              ),
            }}
            inputProps={{
              style: {
                color: themeMode === "dark" ? "#e1e1e1" : "#000000",
              },
            }}
          ></TextField>
        </div>
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
          min={startMin}
          setMin={setStartMin}
          meridian={startMeridian}
          setMeridian={setStartMeridian}
          disabled={loading}
        />
        <TimeInput
          label="End Time"
          hour={endHour}
          setHour={setEndHour}
          min={endMin}
          setMin={setEndMin}
          meridian={endMeridian}
          setMeridian={setEndMeridian}
          disabled={loading}
        />
        <div className="add-remove-breaks-container">
          <div className="add-remove-btns">
            <Button
              variant="outlined"
              onClick={() => handleAddOrRemoveBreak(-1)}
              disabled={loading}
            >
              <RemoveIcon />
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleAddOrRemoveBreak(1)}
              disabled={loading}
            >
              <AddIcon />
            </Button>
          </div>
          <Typography variant="h6">Breaks: {breaks.length}</Typography>
        </div>
        {breaks.map((breakValue, index) => (
          <BreakInput
            breakValue={breakValue}
            onChange={handleBreakChange}
            index={index}
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
