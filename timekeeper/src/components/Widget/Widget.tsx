import { WageObjectProps } from "../../database/database";
import { Paper, Typography, Box, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";

interface WidgetProps {
  label: string;
  wages?: WageObjectProps[];
  width?: "half" | "full";
  content:
    | "totalEarned"
    | "totalHours"
    | "totalShifts"
    | "breaks"
    | "breakTime";
  contentType: "int" | "float" | "currency";
}

const Widget = ({ label, wages, width = "half", content }: WidgetProps) => {
  const [value, setValue] = useState<number>(0);

  const currencyFormatter = (amount: number) => {
    if (wages && wages.length > 0 && wages[0].currency) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: wages[0].currency,
      }).format(amount);
    }

    return "";
  };

  // decide the number of decimal places based on content
  const decimalPlaces = () => {
    switch (content) {
      case "totalEarned":
        return 2; // currency
      case "totalHours":
      case "breakTime":
        return 2; // float
      default:
        return 0; // int
    }
  };

  useEffect(() => {
    const filterWages = async () => {
      if (wages)
        if (content === "totalShifts") {
          await setValue(wages.length);
        } else {
          await setValue(wages.reduce((sum, wage) => sum + wage[content], 0));
        }
    };

    filterWages();
  }, [wages]);

  if (!wages || wages.length === 0) {
    return null;
  }

  return wages.length === 0 ? (
    <Skeleton animation="wave" />
  ) : (
    <Box sx={{ gridColumn: width === "half" ? "span 1" : "span 2" }}>
      <Paper sx={{ padding: "1rem" }}>
        <Typography
          variant="body1"
          sx={{ textAlign: "left", color: "rgba(255,255,255,0.48)" }}
        >
          {label}
        </Typography>
        <Typography variant="h1" sx={{ textAlign: "left" }}>
          {content === "totalEarned"
            ? currencyFormatter(value)
            : value.toFixed(decimalPlaces())}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Widget;
