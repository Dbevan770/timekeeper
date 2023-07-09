import { WageObjectProps } from "../../database/database";
import { Paper, Typography, Box, Skeleton } from "@mui/material";
import { ThemeContext } from "../../context/ThemeContext";
import { useEffect, useState, useContext } from "react";

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
  const { themeMode } = useContext(ThemeContext);
  const [value, setValue] = useState<number>(0);

  const contentFormatter = (content: string, value: number) => {
    switch (content) {
      case "totalEarned":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "EUR",
        }).format(value);
      case "breakTime":
        let time = "";
        if (value < 60) {
          time = value + "m";
        } else if (value % 60 === 0) {
          time = Math.floor(value / 60) + "h";
        } else {
          time = Math.floor(value / 60) + "h" + (value % 60) + "m";
        }
        return time;
      case "totalHours":
        return value.toFixed(2);
      default:
        return value.toFixed(0);
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
      <Paper sx={{ padding: "1rem" }} elevation={themeMode === "dark" ? 0 : 3}>
        <Typography variant="body1" className="WidgetTitle">
          {label}
        </Typography>
        <Typography variant="h1" sx={{ textAlign: "left" }}>
          {contentFormatter(content, value)}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Widget;
