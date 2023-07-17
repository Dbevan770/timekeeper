import { TextField } from "@mui/material";
import { handleMinuteChange } from "../../../utils/timeHelper";

interface MinuteInputProps {
  minute: string;
  setMin: React.Dispatch<React.SetStateAction<string>>;
  disabled: boolean;
}

const MinuteInput = ({ minute, setMin, disabled }: MinuteInputProps) => {
  return (
    <TextField
      value={minute}
      onChange={(e) => handleMinuteChange(e.target.value, setMin)}
      disabled={disabled}
      variant="outlined"
      label="MM"
      id="start-time-min"
      required
      sx={{ maxWidth: "8rem" }}
    ></TextField>
  );
};

export default MinuteInput;
