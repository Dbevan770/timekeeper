import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Typography,
  InputAdornment,
  Stack,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useWages } from "../../context/WagesContext";
import { WageObjectProps } from "../../database/database";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { useState } from "react";
import { calculateEarned, calculateTotalBreaks } from "../../utils/calcHelper";
import BreakInput from "../BreakInput/BreakInput";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";

interface FormDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  wageItem: WageObjectProps;
  openSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setSeverity: React.Dispatch<React.SetStateAction<"error" | "success">>;
}

// Functions to support legacy time strings in Firebase
const timeStringToDate = (time: string): Date => {
  const today = new Date();
  const [_, hours, minutes, period] = time.match(/(\d+):(\d+)(\w+)/) || [];

  let hourNumber = parseInt(hours ?? "");
  if (period.toUpperCase() === "PM" && hourNumber !== 12) {
    hourNumber += 12;
  } else if (period.toUpperCase() === "AM" && hourNumber === 12) {
    hourNumber = 0;
  }

  today.setHours(hourNumber, parseInt(minutes), 0);

  return today;
};

// Convert either legacy data or current data to Date object
const convertToDate = (input: any): Date | null => {
  if (typeof input === "string") {
    return timeStringToDate(input);
  } else if (input && "seconds" in input) {
    return new Timestamp(input.seconds, input.nanoseconds).toDate();
  } else {
    return null;
  }
};

const FormDialog = ({
  open,
  setOpen,
  wageItem,
  openSnackbar,
  setMessage,
  setSeverity,
}: FormDialogProps) => {
  const [currency, setCurrency] = useState(wageItem.currency);
  const [rate, setRate] = useState<string>(wageItem.rate.toString());
  const [startTime, setStartTime] = useState<Date | null>(
    convertToDate(wageItem.startTime)
  );
  const [endTime, setEndTime] = useState<Date | null>(
    convertToDate(wageItem.endTime)
  );
  const [shiftDate, setShiftDate] = useState<Date | null>(
    wageItem.shiftDate.toDate()
  );
  const [breaks, setBreaks] = useState<
    Array<{ hours: string; minutes: string }>
  >(wageItem.breaks);
  const [breakErrors, setBreakErrors] = useState<{
    [key: number]: { hours: boolean; minutes: boolean };
  }>({});
  const [disabled, setDisabled] = useState(false);

  const { updateWage } = useWages();

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

  const handleSave = async () => {
    if (shiftDate === null) {
      openSnackbar(true);
      setMessage("Shift Date cannot be empty.");
      setSeverity("error");
      return;
    }

    if (startTime === null || endTime === null) {
      openSnackbar(true);
      setMessage("Start or end time cannot be null");
      setSeverity("error");
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
      openSnackbar(true);
      setMessage("Breaks must include either the hours or minutes or both.");
      setSeverity("error");
      return;
    }

    setDisabled(true);
    const totalHoursWorked = dayjs(endTime).diff(
      dayjs(startTime),
      "hours",
      true
    );
    const totalBreaks = calculateTotalBreaks(breaks);
    const actualHoursWorked = totalHoursWorked - totalBreaks;
    const earned = calculateEarned(actualHoursWorked, rate);

    try {
      const updatedWageItem: WageObjectProps = {
        ...wageItem,
        totalHours: actualHoursWorked,
        currency: currency,
        rate: parseFloat(rate),
        shiftDate: Timestamp.fromDate(shiftDate!),
        startTime: Timestamp.fromDate(startTime),
        breaks: breaks,
        numBreaks: totalBreaks,
        endTime: Timestamp.fromDate(endTime),
        totalEarned: parseFloat(earned),
      };

      const response = await updateWage(updatedWageItem);

      if (response.success) {
        openSnackbar(true);
        setMessage("Successfully updated shift!");
        setSeverity("success");
        handleClose();
      } else {
        openSnackbar(true);
        setMessage("Failed to update shift.");
        setSeverity("error");
        setDisabled(false);
        console.error(response.msg);
      }
    } catch (err) {
      openSnackbar(true);
      setMessage("Failed to update shift.");
      setSeverity("error");
      setDisabled(false);
      console.error(err);
    }
  };

  const handleClose = () => {
    setDisabled(false);
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Shift</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <Stack spacing={0.75} direction="row" sx={{ mt: "0.5rem" }}>
            <TextField
              id="select-currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              disabled={disabled}
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
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              variant="outlined"
              label="Rate"
              disabled={disabled}
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body2">/hr</Typography>
                  </InputAdornment>
                ),
              }}
            ></TextField>
          </Stack>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of Shift"
              value={dayjs(shiftDate)}
              disabled={disabled}
              onChange={(date: Dayjs | null) =>
                setShiftDate(date?.toDate() ?? null)
              }
            />
            <TimePicker
              label="Start Time*"
              value={startTime}
              onChange={(newTime) => setStartTime(newTime)}
            />
            <TimePicker
              label="End Time*"
              value={endTime}
              onChange={(newTime) => setEndTime(newTime)}
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
                disabled={disabled}
              >
                <Remove />
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleAddOrRemoveBreak(1)}
                disabled={disabled}
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
              disabled={disabled}
              key={index}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FormDialog;
