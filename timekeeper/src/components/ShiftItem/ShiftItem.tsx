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
  const [swipeDist, setSwipeDist] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { deleteWage, refreshWages } = useWages();
  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      if (!loading) {
        if (eventData.deltaX < 0) {
          setSwipeDist(Math.min(Math.abs(eventData.deltaX), 128));
        } else if (eventData.deltaX > 0 && swipeDist > 0) {
          setSwipeDist(Math.max(0, swipeDist - eventData.deltaX / 2));
        }
      }
    },
    onSwiped: () => {
      // If the swipe distance exceeds 50% of the maximum, set it to the maximum
      if (swipeDist > 96) {
        setSwipeDist(96);
      } else if (swipeDist >= 48) {
        setSwipeDist(96);
      } else {
        // Otherwise, reset the swipe distance after the swipe is completed
        setSwipeDist(0);
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
    setSwipeDist(0);
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
            minWidth: swipeDist > 0 ? `calc(100% - ${swipeDist}px)` : "100%",
            transition:
              "min-width 0.2s ease, border-top-right-radius 0.2s ease, border-bottom-right-radius 0.2s ease",
            borderTopRightRadius: swipeDist > 0 ? "0" : "0.25rem",
            borderBottomRightRadius: swipeDist > 0 ? "0" : "0.25rem",
            height: "100%",
          }}
        >
          <CardContent
            sx={{
              minWidth: "100%",
              height: "100%",
              p: "1rem 1rem 0.5rem 1rem",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                textAlign: "left",
                color: "rgba(255,255,255,0.48)",
                fontSize: ".875rem",
              }}
            >
              {wage.shiftDate.toDate().toLocaleDateString() +
                " - " +
                wage.shiftDate
                  .toDate()
                  .toLocaleDateString("en-us", { weekday: "long" })}
            </Typography>
            <Typography variant="h1" sx={{ fontWeight: "400" }}>
              {wage.currency === "EUR"
                ? wage.totalEarned.toFixed(2) + "€"
                : "$" + wage.totalEarned.toFixed(2)}
            </Typography>
            <div className="chip-container">
              <Chip
                size="small"
                label={"Total Hours: " + wage.totalHours.toFixed(2)}
                color="primary"
              />
            </div>
          </CardContent>
        </Card>
        <Box
          sx={{
            width: swipeDist > 0 ? `${swipeDist}px` : "0",
            opacity: swipeDist > 0 ? 1 : 0,
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
              sx={{
                opacity: swipeDist > 0 ? `calc(${swipeDist / 96})` : 0,
                transition: "opacity 0.2s ease",
              }}
            />
          </IconButton>
        </Box>
      </Box>
    </div>
  );
};

export default ShiftItem;
