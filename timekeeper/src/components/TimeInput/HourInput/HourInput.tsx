import { TextField } from "@mui/material";

interface HourInputProps {
  hour: string;
  setHour: React.Dispatch<React.SetStateAction<string>>;
}

const HourInput = ({ hour, setHour }: HourInputProps) => {
  const handleHourChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const intValue = parseInt(value);

    if (isNaN(intValue)) {
      setter("");
      return;
    } else if (intValue > 12 || intValue < 0 || value.length > 2) {
      return;
    } else {
      if (value.length === 2 && value[1] === "0") {
        setter(value.slice(1));
      } else {
        setter(value);
      }
      return;
    }
  };

  return (
    <TextField
      value={hour}
      onChange={(e) => handleHourChange(e.target.value, setHour)}
      variant="outlined"
      label="HH"
      required
      sx={{ maxWidth: "8rem" }}
    ></TextField>
  );
};

export default HourInput;
