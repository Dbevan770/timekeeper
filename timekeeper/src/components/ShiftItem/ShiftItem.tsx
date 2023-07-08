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

interface ShiftItemProps {
  wage: WageObjectProps;
  setStopScroll: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShiftItem = ({ wage, setStopScroll }: ShiftItemProps) => {
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const [swipeDist, setSwipeDist] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { deleteWage, refreshWages } = useWages();
  let timer: ReturnType<typeof setTimeout> | undefined = undefined;

  const handlers = useSwipeable({
    onSwipeStart: () => {
      setStopScroll(true);
      setIsSwiping(true);
    },
    onSwiping: (eventData) => {
      if (!loading) {
        let newSwipeDist = swipeDist;
        if (eventData.dir === "Left") {
          newSwipeDist = Math.min(Math.abs(eventData.deltaX), 250);
        } else if (eventData.dir === "Right") {
          newSwipeDist = Math.max(0, swipeDist - eventData.deltaX);
        }
        setSwipeDist(newSwipeDist);
      }
    },
    onSwipedLeft: () => {
      if (swipeDist >= 183) {
        setSwipeDist(366);
        timer = setTimeout(() => handleDelete(), 300);
      } else if (swipeDist >= 26) {
        setSwipeDist(51);
      } else {
        setSwipeDist(0);
      }
    },
    onSwipedRight: () => {
      setSwipeDist(0);
    },
    onSwiped: () => {
      setStopScroll(false);
      setIsSwiping(false);
    },
    delta: 0,
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

  useEffect(() => {
    return () => clearTimeout(timer);
  }, []);

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
            zIndex: "10",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.48)",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: "8.625rem",
          width: "200%",
          transform: `translateX(-${swipeDist}px)`,
          transition: isSwiping ? "none" : "transform 0.3s ease",
        }}
      >
        <Card
          sx={{
            width: "50%",
            transition:
              "border-top-right-radius 0.2s ease, border-bottom-right-radius 0.2s ease",
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
            width: "50%",
            height: "inherit",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: "#FF5353",
            borderTopRightRadius: "0.25rem",
            borderBottomRightRadius: "0.25rem",
            overflow: "hidden",
          }}
        >
          <IconButton onClick={handleDelete}>
            <Delete fontSize="large" />
          </IconButton>
        </Box>
      </Box>
    </div>
  );
};

export default ShiftItem;
