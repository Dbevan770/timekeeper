import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import { WageObjectProps } from "../../../database/database";
import { Add, Delete } from "@mui/icons-material";
import { useState } from "react";

interface ShiftItemCardProps {
  wage: WageObjectProps;
  handleDelete: () => void;
}

const ShiftItemCard = ({ wage, handleDelete }: ShiftItemCardProps) => {
  const [chips, setChips] = useState([
    { id: 1, label: "Hrs", content: wage.totalHours.toFixed(2) },
  ]);
  const chipOptions = [
    {
      label: "Hrs",
      content: wage.totalHours.toFixed(2),
    },
    {
      label: "Brks",
      content: wage.breaks,
    },
    {
      label: "Brk Tm",
      content: wage.breakTime,
    },
    {
      label: "Start",
      content: wage.startTime,
    },
    {
      label: "End",
      content: wage.endTime,
    },
  ];

  return (
    <>
      <Card
        sx={{
          width: "50%",
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
            sx={{ fontWeight: "400", userSelect: "none" }}
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
      <Box
        sx={{
          width: "50%",
          height: "100%",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          backgroundColor: "#FF5353",
        }}
      >
        <IconButton onClick={handleDelete}>
          <Delete fontSize="large" />
        </IconButton>
      </Box>
    </>
  );
};

export default ShiftItemCard;
