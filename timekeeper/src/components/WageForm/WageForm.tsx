import {
  TextField,
  MenuItem,
  InputAdornment,
  Typography,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import "./WageForm.css";

interface WageFormProps {
  onSubmit: (
    rate: string,
    currency: string,
    startHour: string,
    startMin: string,
    startMeridian: string,
    endHour: string,
    endMin: string,
    endMeridian: string,
    totalEarned: string,
    breaks: string[]
  ) => void;
}

const WageForm = ({ onSubmit }: WageFormProps) => {
  const [rate, setRate] = useState<string>("");
  const [currency, setCurrency] = useState<string>("EUR");
  const [startHour, setStartHour] = useState<string>("");
  const [startHourError, setStartHourError] = useState<string>("");
  const [startMin, setStartMin] = useState<string>("");
  const [startMinError, setStartMinError] = useState<string>("");
  const [startMeridian, setStartMeridian] = useState<string>("AM");
  const [endHour, setEndHour] = useState<string>("");
  const [endHourError, setEndHourError] = useState<string>("");
  const [endMin, setEndMin] = useState<string>("");
  const [endMinError, setEndMinError] = useState<string>("");
  const [endMeridian, setEndMeridian] = useState<string>("AM");
  const [breaks, setBreaks] = useState<string[]>([]);

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
  const meridian = [
    {
      value: "AM",
      label: "AM",
    },
    {
      value: "PM",
      label: "PM",
    },
  ];

  const handleTimeChange = (
    value: string,
    setTime: React.Dispatch<React.SetStateAction<string>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
    upperLimit: number
  ) => {
    setError("");

    if (value === "") {
      setTime("");
      return;
    }

    if (!/^\d+$/.test(value)) {
      setError("Value must be a number");
    } else if (parseInt(value) < 0 || parseInt(value) > upperLimit) {
      setError(`Value must be between 0 and ${upperLimit}`);
    } else {
      setTime(parseInt(value).toString());
    }
  };

  const handleBreakChange = (increment: number) => {
    if (increment < 0 && breaks.length === 0) return;

    setBreaks((prev) => {
      if (increment > 0) {
        return [...prev, ""];
      } else {
        return prev.slice(0, -1);
      }
    });
  };

  const handleBreakInputChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) {
      return;
    }

    setBreaks((prev) => {
      const newBreaks = [...prev];
      newBreaks[index] = value;
      return newBreaks;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (startHour === null) return;

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

    console.log(`Start Time in 24H format: ${startHour24}:${startMin}`);
    console.log(`End time in 24H format: ${endHour24}:${endMin}`);

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

    console.log(`The difference is ${diffHours} hours`);

    const totalBreaks =
      breaks.reduce((acc, curr) => acc + parseInt(curr), 0) / 60;

    const earned = ((diffHours - totalBreaks) * parseFloat(rate)).toFixed(2);

    console.log(`Congrats! You earned €${earned} today!`);

    onSubmit(
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
  };

  return (
    <form id="add-wages-form" onSubmit={handleSubmit}>
      <div className="currency-rate">
        <TextField
          id="select-currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          select
          label="Currency"
          defaultValue="EUR"
          fullWidth
          sx={{ color: "rgba(255,255,255,0.23)" }}
        >
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="rate"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
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
        ></TextField>
      </div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker label="Date of Shift" />
      </LocalizationProvider>
      <Typography variant="subtitle1" sx={{ fontSize: ".75rem" }}>
        Start Time
      </Typography>
      <div className="time-container">
        <TextField
          value={startHour}
          onChange={(e) =>
            handleTimeChange(
              e.target.value,
              setStartHour,
              setStartHourError,
              12
            )
          }
          error={Boolean(startHourError)}
          helperText={startHourError}
          variant="outlined"
          label="HH"
          id="start-time-hour"
          required
          sx={{ maxWidth: "8rem" }}
        ></TextField>
        <Typography variant="h4">:</Typography>
        <TextField
          value={startMin}
          onChange={(e) =>
            handleTimeChange(e.target.value, setStartMin, setStartMinError, 59)
          }
          error={Boolean(startMinError)}
          helperText={startMinError}
          variant="outlined"
          label="MM"
          id="start-time-min"
          required
          sx={{ maxWidth: "8rem" }}
        ></TextField>
        <TextField
          value={startMeridian}
          onChange={(e) => setStartMeridian(e.target.value)}
          variant="outlined"
          id="start-time-meridian"
          defaultValue="AM"
          required
          fullWidth
          select
        >
          {meridian.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <Typography variant="subtitle1" sx={{ fontSize: ".75rem" }}>
        End Time
      </Typography>
      <div className="time-container">
        <TextField
          value={endHour}
          onChange={(e) =>
            handleTimeChange(e.target.value, setEndHour, setEndHourError, 12)
          }
          error={Boolean(endHourError)}
          helperText={endHourError}
          variant="outlined"
          label="HH"
          id="end-time-hour"
          required
          sx={{ maxWidth: "8rem" }}
        ></TextField>
        <Typography variant="h4">:</Typography>
        <TextField
          value={endMin}
          onChange={(e) =>
            handleTimeChange(e.target.value, setEndMin, setEndMinError, 59)
          }
          error={Boolean(endMinError)}
          helperText={endMinError}
          variant="outlined"
          label="MM"
          id="end-time-min"
          required
          sx={{ maxWidth: "8rem" }}
        ></TextField>
        <TextField
          value={endMeridian}
          onChange={(e) => setEndMeridian(e.target.value)}
          variant="outlined"
          id="end-time-meridian"
          defaultValue="AM"
          required
          fullWidth
          select
        >
          {meridian.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <div className="add-remove-breaks-container">
        <div className="add-remove-btns">
          <Button variant="outlined" onClick={() => handleBreakChange(-1)}>
            <RemoveIcon />
          </Button>
          <Button variant="outlined" onClick={() => handleBreakChange(1)}>
            <AddIcon />
          </Button>
        </div>
        <Typography variant="h6">Breaks: {breaks.length}</Typography>
      </div>
      {breaks.map((breakValue, index) => (
        <TextField
          variant="outlined"
          key={index}
          label={`Break ${index + 1}`}
          value={breakValue}
          onChange={(e) => handleBreakInputChange(e.target.value, index)}
          fullWidth
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.23)" }}
                >
                  minutes
                </Typography>
              </InputAdornment>
            ),
          }}
        ></TextField>
      ))}
      <Button variant="contained" type="submit" sx={{ marginTop: "1rem" }}>
        Calculate
      </Button>
    </form>
  );
};

export default WageForm;
