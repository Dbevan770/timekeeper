import { WageObjectProps } from "../../database/database";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { useWages } from "../../context/WagesContext";
import "./ShiftItem.css";

const ShiftItem = ({ wage }: { wage: WageObjectProps }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { deleteWage, refreshWages } = useWages();
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (!loading) {
        setOpen(true);
      }
    },
    onSwipedRight: () => {
      if (!loading) {
        setOpen(false);
      }
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteWage(wage.docId);
      await refreshWages();
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    setOpen(false);
  }, [wage]);

  return (
    <div className="shift-item-container" {...handlers}>
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.48)",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box sx={{ display: "flex", alignItems: "center", height: "8.625rem" }}>
        <Card
          sx={{
            minWidth: open ? "calc(100% - 6rem)" : "100%",
            transition:
              "min-width 0.2s ease, border-top-right-radius 0.2s ease, border-bottom-right-radius 0.2s ease",
            borderTopRightRadius: open ? "0" : "0.25rem",
            borderBottomRightRadius: open ? "0" : "0.25rem",
            height: "100%",
          }}
        >
          <CardContent sx={{ minWidth: "100%" }}>
            <Typography
              variant="subtitle1"
              sx={{ textAlign: "left", color: "rgba(255,255,255,0.48)" }}
            >
              {wage.shiftDate.toDate().toLocaleDateString()}
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: "400" }}>
              {wage.currency === "EUR"
                ? wage.totalEarned.toFixed(2) + "€"
                : "$" + wage.totalEarned.toFixed(2)}
            </Typography>
            <div className="chip-container">
              <Chip
                label={"Total Hours: " + wage.totalHours.toFixed(2)}
                color="primary"
              />
            </div>
          </CardContent>
        </Card>
        <Box
          sx={{
            width: open ? "6rem" : "0",
            opacity: open ? 1 : 0,
            transition: "opacity 0.2s ease, width 0.2s ease",
            height: "inherit",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FF5353",
            borderTopRightRadius: "0.25rem",
            borderBottomRightRadius: "0.25rem",
            overflow: "hidden",
          }}
        >
          <IconButton onClick={handleDelete}>
            <Delete
              fontSize="large"
              sx={{ opacity: open ? 1 : 0, transition: "opacity 0.2s ease" }}
            />
          </IconButton>
        </Box>
      </Box>
    </div>
  );
};

export default ShiftItem;
