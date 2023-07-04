import { WageObjectProps } from "../../database/database";
import { Card, CardContent, Typography, Chip } from "@mui/material";
import "./ShiftItem.css";

const ShiftItem = ({ wage }: { wage: WageObjectProps }) => {
  return (
    <div className="shift-item-container">
      <Card sx={{ minWidth: "100%" }}>
        <CardContent sx={{ minWidth: "100%" }}>
          <Typography
            variant="subtitle1"
            sx={{ textAlign: "left", color: "rgba(255,255,255,0.48)" }}
          >
            {wage.shiftDate}
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: "400" }}>
            {wage.currency === "EUR"
              ? wage.totalEarned.toFixed(2) + "€"
              : "$" + wage.totalEarned.toFixed(2)}
          </Typography>
          <div className="chip-container">
            <Chip label={"Total Hours: " + wage.totalHours} color="primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShiftItem;
