import WageForm from "../../../components/WageForm/WageForm";
import { useState } from "react";
import { Typography, Link, Button } from "@mui/material";
import { CreateWage } from "../../../database/database";
import { useAuthContext } from "../../../context/AuthContext";
import "./AddWages.css";

const AddWages = () => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>("");
  const [totalEarned, setTotalEarned] = useState<string>("");
  const [shiftDate, setShiftDate] = useState<Date | null>(null);
  const [rate, setRate] = useState<string>("");
  const [startHour, setStartHour] = useState<string>("");
  const [startMin, setStartMin] = useState<string>("");
  const [startMeridian, setStartMeridian] = useState<string>("");
  const [endHour, setEndHour] = useState<string>("");
  const [endMin, setEndMin] = useState<string>("");
  const [endMeridian, setEndMeridian] = useState<string>("");
  const [breaks, setBreaks] = useState<string[]>([]);
  const { user } = useAuthContext();

  const handleSetSubmit = (
    shiftDate: Date | null,
    rate: string,
    currency: string,
    startHour: string,
    startMin: string,
    startMeridian: string,
    endHour: string,
    endMin: string,
    endMeridian: string,
    totalEarned: string,
    breaks: string[]
  ) => {
    setSubmitted(true);
    setShiftDate(shiftDate);
    setCurrency(currency);
    setTotalEarned(totalEarned);
    setRate(rate);
    setStartHour(startHour);
    setStartMin(startMin);
    setStartMeridian(startMeridian);
    setEndHour(endHour);
    setEndMin(endMin);
    setEndMeridian(endMeridian);
    setBreaks(breaks);
  };

  const handleResetForm = () => {
    setSubmitted(false);
    setShiftDate(null);
    setCurrency("");
    setTotalEarned("");
    setRate("");
    setStartHour("");
    setStartMin("");
    setStartMeridian("");
    setEndHour("");
    setEndMin("");
    setEndMeridian("");
    setBreaks([]);
  };

  const handleSave = async () => {
    const startTime = `${startHour}:${startMin}${startMeridian}`;
    const endTime = `${endHour}:${endMin}${endMeridian}`;
    const totalBreaks = breaks.length;
    const totalBreakTime = breaks.reduce(
      (acc, curr) => acc + parseInt(curr),
      0
    );
    const result = await CreateWage(
      user,
      shiftDate,
      startTime,
      endTime,
      totalBreaks,
      totalBreakTime,
      parseFloat(rate),
      parseFloat(totalEarned),
      currency
    );

    console.log(result);
  };
  return (
    <div className="add-wages-container">
      {!submitted ? (
        <WageForm onSubmit={handleSetSubmit} />
      ) : (
        <div className="earned-wages-container">
          <Typography
            variant="h6"
            sx={{ fontWeight: "300", color: "rgba(255,255,255,0.48)" }}
          >
            Congrats, you earned
          </Typography>
          <Typography variant="h1">
            {currency === "EUR" ? "€" + totalEarned : "$" + totalEarned}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: "1.5rem" }}>
            Not right?{" "}
            <Link onClick={handleResetForm} underline="none" color="secondary">
              Try again
            </Link>
          </Typography>
          <Button
            variant="contained"
            sx={{ width: "100%", fontSize: "1rem" }}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddWages;
