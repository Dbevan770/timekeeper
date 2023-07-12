import { TextField } from "@mui/material";
import { handleHourChange } from "../../../utils/timeHelper";

interface HourInputProps {
  hour: string;
  setHour: React.Dispatch<React.SetStateAction<string>>;
  setHourError: React.Dispatch<React.SetStateAction<boolean>>;
  error: boolean;
  disabled: boolean;
}

const HourInput = ({
  hour,
  setHour,
  setHourError,
  error,
  disabled,
}: HourInputProps) => {
  return (
    <TextField
      value={hour}
      onChange={(e) => handleHourChange(e.target.value, setHour, setHourError)}
      error={error}
      disabled={disabled}
      variant="outlined"
      label="HH"
      required
      sx={{ maxWidth: "8rem" }}
    ></TextField>
  );
};

export default HourInput;
