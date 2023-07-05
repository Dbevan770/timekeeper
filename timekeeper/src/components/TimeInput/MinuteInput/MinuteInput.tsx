import { TextField } from "@mui/material";
import React from "react";

interface MinuteInputProps {
  minute: string;
  setMin: React.Dispatch<React.SetStateAction<string>>;
  disabled: boolean;
}

const MinuteInput = ({ minute, setMin, disabled }: MinuteInputProps) => {
  const handleMinuteChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const intValue = parseInt(value);
    if (isNaN(intValue)) {
      setter("");
      return;
    } else if (intValue > 59 || intValue < 0 || value.length > 2) {
      return;
    } else {
      setter(value);
      return;
    }
  };

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
