import { Typography, TextField, MenuItem } from "@mui/material";
import HourInput from "./HourInput/HourInput";
import MinuteInput from "./MinuteInput/MinuteInput";

interface TimeInputProps {
  label: string;
  hour: string;
  setHour: React.Dispatch<React.SetStateAction<string>>;
  min: string;
  setMin: React.Dispatch<React.SetStateAction<string>>;
  meridian: string;
  setMeridian: React.Dispatch<React.SetStateAction<string>>;
}

const TimeInput = ({
  label,
  hour,
  setHour,
  min,
  setMin,
  meridian,
  setMeridian,
}: TimeInputProps) => {
  const meridians = [
    {
      value: "AM",
      label: "AM",
    },
    {
      value: "PM",
      label: "PM",
    },
  ];
  return (
    <>
      <Typography variant="subtitle1" sx={{ fontSize: ".75rem" }}>
        {label}
      </Typography>
      <div className="time-container">
        <HourInput hour={hour} setHour={setHour} />
        <Typography variant="h4">:</Typography>
        <MinuteInput minute={min} setMin={setMin} />
        <TextField
          value={meridian}
          onChange={(e) => setMeridian(e.target.value)}
          variant="outlined"
          defaultValue="AM"
          required
          fullWidth
          select
        >
          {meridians.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
    </>
  );
};

export default TimeInput;
