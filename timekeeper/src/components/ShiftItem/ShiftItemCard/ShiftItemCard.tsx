import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
} from "@mui/material";
import { WageObjectProps } from "../../../database/database";
import { Add } from "@mui/icons-material";
import { useState } from "react";

interface ShiftItemCardProps {
  wage: WageObjectProps;
}

const ShiftItemCard = ({ wage }: ShiftItemCardProps) => {
  const [chips, setChips] = useState([
    { id: 1, label: "Hrs", content: wage.totalHours.toFixed(2) },
  ]);

  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minWidth: "100%",
          minHeight: "4.5rem",
          p: "1rem 1rem 0.5rem 1rem",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            textAlign: "left",
            fontSize: ".875rem",
            color: "hsl(0, 0%, 74%)",
            fontWeight: "500",
          }}
        >
          {wage.shiftDate.toDate().toLocaleDateString() +
            " - " +
            wage.shiftDate
              .toDate()
              .toLocaleDateString("en-us", { weekday: "long" })}
        </Typography>
        <Typography
          variant="h1"
          className="ShiftItemCurrency"
          sx={{
            fontWeight: "600",
            userSelect: "none",
            color: "hsl(0, 0%, 90%)",
          }}
        >
          {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: wage.currency,
          }).format(wage.totalEarned)}
        </Typography>
        <Grid container spacing={1}>
          {chips.map((chip) => (
            <Grid item key={chip.id}>
              <Chip
                size="small"
                label={`${chip.label}: ${chip.content}`}
                color="primary"
                onDelete={() =>
                  setChips((prevChips) =>
                    prevChips.filter((item) => item.id !== chip.id)
                  )
                }
              />
            </Grid>
          ))}
          <Grid item>
            <Button
              variant="outlined"
              sx={{
                p: "0",
                borderRadius: "16px",
              }}
            >
              <Add sx={{ fontSize: "1.25rem" }} />
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ShiftItemCard;
