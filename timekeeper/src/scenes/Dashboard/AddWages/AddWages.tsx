import WageForm from "../../../components/WageForm/WageForm";
import { useState } from "react";
import { Typography, Link, Button } from "@mui/material";
import "./AddWages.css";

const AddWages = () => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>("");
  const [totalEarned, setTotalEarned] = useState<string>("");

  const handleSetSubmit = (
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
    setCurrency(currency);
    setTotalEarned(totalEarned);
  };

  const handleResetForm = () => {
    setSubmitted(false);
    setCurrency("");
    setTotalEarned("");
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
          <Button variant="contained" sx={{ width: "100%", fontSize: "1rem" }}>
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddWages;
