import { TextField, MenuItem } from "@mui/material";
import { useState } from "react";
import "./BreakInput.css";

interface BreakInputProps {
  index: number;
  breakValue: { value: string; unit: string };
  onChange: (
    index: number,
    breakValue: { value: string; unit: string }
  ) => void;
}

const BreakInput = ({ index, breakValue, onChange }: BreakInputProps) => {
  const [currentBreakValue, setCurrentBreakValue] = useState<string>(
    breakValue.value
  );
  const [breakUnit, setBreakUnit] = useState<string>(breakValue.unit);

  const breakUnits = [
    {
      value: "H",
      label: "hours",
    },
    {
      value: "M",
      label: "minutes",
    },
  ];

  const handleBreakValueChange = (e: any) => {
    if (!/^\d*$/.test(e.target.value)) {
      return;
    }

    setCurrentBreakValue(e.target.value);
    onChange(index, { value: e.target.value, unit: breakUnit });
  };

  const handleBreakUnitChange = (e: any) => {
    setBreakUnit(e.target.value);
    onChange(index, { value: currentBreakValue, unit: e.target.value });
  };

  return (
    <div className="break-container">
      <TextField
        variant="outlined"
        key={index}
        label={`Break ${index + 1}`}
        value={breakValue.value}
        onChange={handleBreakValueChange} // Here
        fullWidth
        required
      ></TextField>
      <TextField
        select
        variant="outlined"
        label="Unit"
        value={breakValue.unit}
        onChange={handleBreakUnitChange} // Here
        sx={{ minWidth: "8rem" }}
      >
        {breakUnits.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default BreakInput;
