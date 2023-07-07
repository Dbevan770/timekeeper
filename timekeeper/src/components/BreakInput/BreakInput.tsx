import { TextField } from "@mui/material";
import { useState } from "react";
import "./BreakInput.css";

interface BreakInputProps {
  index: number;
  breakValue: { hours: string; minutes: string };
  onChange: (
    index: number,
    breakValue: { hours: string; minutes: string }
  ) => void;
  disabled: boolean;
}

const BreakInput = ({
  index,
  breakValue,
  onChange,
  disabled,
}: BreakInputProps) => {
  const [currentBreakHours, setCurrentBreakHours] = useState<string>(
    breakValue.hours || ""
  );
  const [currentBreakMinutes, setCurrentBreakMinutes] = useState<string>(
    breakValue.minutes || ""
  );

  const handleBreakHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!/^\d*$/.test(e.target.value)) return;

    setCurrentBreakHours(e.target.value);
    onChange(index, { hours: e.target.value, minutes: currentBreakMinutes });
  };

  const handleBreakMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!/^\d*$/.test(e.target.value)) return;

    setCurrentBreakMinutes(e.target.value);
    onChange(index, { hours: currentBreakHours, minutes: e.target.value });
  };

  return (
    <div className="break-container">
      <TextField
        variant="outlined"
        key={`${index}-hours`}
        label={`Hours`}
        value={breakValue.hours}
        onChange={handleBreakHoursChange}
        disabled={disabled}
        fullWidth
        required
      ></TextField>
      <TextField
        variant="outlined"
        key={`${index}-minutes`}
        label={`Minutes`}
        value={breakValue.minutes}
        onChange={handleBreakMinutesChange}
        disabled={disabled}
        fullWidth
        required
      ></TextField>
    </div>
  );
};

export default BreakInput;
