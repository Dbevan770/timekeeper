import { TextField } from "@mui/material";
import "./BreakInput.css";

interface BreakInputProps {
  index: number;
  breakValue: { hours: string; minutes: string };
  onChange: (
    index: number,
    breakValue: { hours: string; minutes: string }
  ) => void;
  errors: { hours: boolean; minutes: boolean };
  disabled: boolean;
}

const BreakInput = ({
  index,
  breakValue,
  onChange,
  errors,
  disabled,
}: BreakInputProps) => {
  const handleBreakHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!/^\d*$/.test(e.target.value)) return;
    onChange(index, { hours: e.target.value, minutes: breakValue.minutes });
  };

  const handleBreakMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!/^\d*$/.test(e.target.value)) return;
    onChange(index, { hours: breakValue.hours, minutes: e.target.value });
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
        error={errors?.hours}
        fullWidth
      ></TextField>
      <TextField
        variant="outlined"
        key={`${index}-minutes`}
        label={`Minutes`}
        value={breakValue.minutes}
        onChange={handleBreakMinutesChange}
        disabled={disabled}
        error={errors?.minutes}
        fullWidth
      ></TextField>
    </div>
  );
};

export default BreakInput;
