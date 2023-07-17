import { Typography, TextField, MenuItem, Stack } from "@mui/material";
import HourInput from "./HourInput/HourInput";
import MinuteInput from "./MinuteInput/MinuteInput";

interface TimeInputProps {
  label: string;
  hour: string;
  setHour: React.Dispatch<React.SetStateAction<string>>;
  setHourError: React.Dispatch<React.SetStateAction<boolean>>;
  min: string;
  setMin: React.Dispatch<React.SetStateAction<string>>;
  meridian: string;
  setMeridian: React.Dispatch<React.SetStateAction<string>>;
  disabled: boolean;
  hourError: boolean;
}

const TimeInput = ({
  label,
  hour,
  setHour,
  setHourError,
  min,
  setMin,
  meridian,
  setMeridian,
  disabled,
  hourError,
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
      <Typography
        variant="subtitle1"
        sx={{ fontSize: ".75rem", textAlign: "center" }}
      >
        {label}
      </Typography>
      <Stack
        direction="row"
        spacing={0.5}
        alignItems="center"
        justifyContent="center"
      >
        <HourInput
          hour={hour}
          setHour={setHour}
          setHourError={setHourError}
          disabled={disabled}
          error={hourError}
        />
        <Typography variant="h4">:</Typography>
        <MinuteInput minute={min} setMin={setMin} disabled={disabled} />
        <TextField
          value={meridian}
          onChange={(e) => setMeridian(e.target.value)}
          disabled={disabled}
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
      </Stack>
    </>
  );
};

export default TimeInput;
