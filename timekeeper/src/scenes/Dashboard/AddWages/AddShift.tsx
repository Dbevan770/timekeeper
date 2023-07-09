import WageForm from "../../../components/WageForm/WageForm";
import { useState } from "react";
import { Typography, Link, Button, Box } from "@mui/material";
import { CreateWageProps } from "../../../database/database";
import { useWages } from "../../../context/WagesContext";
import { useNavigate } from "react-router-dom";
import "./AddShift.css";
import Loading from "../../../components/Loading/Loading";
import SubPageHeader from "../../../components/SubPageHeader/SubPageHeader";

const AddShift = () => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>("");
  const [totalEarned, setTotalEarned] = useState<string>("");
  const [totalHours, setTotalHours] = useState<number>(0);
  const [shiftDate, setShiftDate] = useState<Date | null>(null);
  const [rate, setRate] = useState<string>("");
  const [startHour, setStartHour] = useState<string>("");
  const [startMin, setStartMin] = useState<string>("");
  const [startMeridian, setStartMeridian] = useState<string>("");
  const [endHour, setEndHour] = useState<string>("");
  const [endMin, setEndMin] = useState<string>("");
  const [endMeridian, setEndMeridian] = useState<string>("");
  const [breaks, setBreaks] = useState<
    Array<{ hours: string; minutes: string }>
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { addWage, refreshWages } = useWages();
  const navigate = useNavigate();

  const handleSetSubmit = (
    totalHours: number,
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
    breaks: { hours: string; minutes: string }[]
  ) => {
    setSubmitted(true);
    setTotalHours(totalHours);
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
    setTotalHours(0);
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
    setLoading(true);
    const startTime = `${startHour}:${startMin}${startMeridian}`;
    const endTime = `${endHour}:${endMin}${endMeridian}`;
    const totalBreaks = breaks.length;
    const totalBreakTime = breaks.reduce((acc, curr) => {
      const breakHours = parseInt(curr.hours) || 0;
      const breakMinutes = parseInt(curr.minutes) || 0;
      return acc + breakHours * 60 + breakMinutes;
    }, 0);
    if (!shiftDate) return;
    try {
      const wage: CreateWageProps = {
        totalHours: totalHours,
        shiftDate: shiftDate,
        startTime: startTime,
        endTime: endTime,
        breaks: totalBreaks,
        breakTime: totalBreakTime,
        rate: parseFloat(rate),
        totalEarned: parseFloat(totalEarned),
        currency: currency,
      };

      await addWage(wage);
      await refreshWages();
    } catch (err) {
      console.log(err);
    }

    navigate("/dashboard/add-wages/success");
  };
  return (
    <>
      {!loading ? (
        <Box sx={{ width: "100%", p: "0.5rem", height: "100dvh" }}>
          {!submitted ? (
            <Box
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <SubPageHeader label="Add Shift" navigateUrl="/dashboard" />
              <WageForm onSubmit={handleSetSubmit} />
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: "3rem",
              }}
            >
              <Typography
                className="congrats-title"
                variant="h6"
                sx={{ fontWeight: "300" }}
              >
                Congrats, you earned
              </Typography>
              <Typography variant="h1" className="total-earned">
                {currency === "EUR" ? "€" + totalEarned : "$" + totalEarned}
              </Typography>
              <Typography
                className="try-again"
                variant="body1"
                sx={{ marginBottom: "1.5rem" }}
              >
                Not right?{" "}
                <Link
                  onClick={handleResetForm}
                  underline="none"
                  color="secondary"
                  className="try-again"
                >
                  Try again
                </Link>
              </Typography>
              <Button
                className="save-btn"
                variant="contained"
                sx={{ width: "100%", fontSize: "1rem" }}
                onClick={handleSave}
              >
                Save
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        <Loading label="Saving..." />
      )}
    </>
  );
};

export default AddShift;
