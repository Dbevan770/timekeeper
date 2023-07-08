import "./ShiftItem.css";
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
import { useCallback, useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { useWages } from "../../context/WagesContext";

interface ShiftItemProps {
  wage: WageObjectProps;
}

const ShiftItem = ({ wage }: ShiftItemProps) => {
  const [swipeDist, setSwipeDist] = useState(0);
  const [startDeltaX, setStartDeltaX] = useState(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const [offsetApplied, setOffsetApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletionTriggered, setDeletionTriggered] = useState(false);
  const { deleteWage, refreshWages } = useWages();

  const handleDelete = useCallback(async () => {
    setLoading(true);
    await deleteWage(wage.docId);
    await refreshWages();
    setLoading(false);
  }, [deleteWage, refreshWages, wage.docId]);

  const handlers = useSwipeable({
    onSwipeStart: () => {
      setIsSwiping(true);
      setOffsetApplied(false);
    },
    onSwiping: (eventData) => {
      let currentSwipeDist = swipeDist;
      if (eventData.dir === "Left") {
        currentSwipeDist = Math.min(Math.abs(eventData.deltaX), 250);
        setSwipeDist(currentSwipeDist);
      } else if (eventData.dir === "Right") {
        if (swipeDist === 51 && !startDeltaX) {
          setStartDeltaX(eventData.deltaX);
        }

        const actualDelta = Math.abs(eventData.deltaX - startDeltaX);
        currentSwipeDist = Math.max(0, 51 - actualDelta);
        if (!offsetApplied) {
          currentSwipeDist += 10;
          setOffsetApplied(true);
        }
        setSwipeDist(currentSwipeDist);
      }
    },
    onSwiped: (eventData) => {
      if (eventData.dir === "Left" && swipeDist > 183) {
        setDeletionTriggered(true);
      } else if (swipeDist > 51) {
        setSwipeDist(51);
      } else {
        setSwipeDist(0);
      }
      setIsSwiping(false);
      setStartDeltaX(0);
    },
    delta: { up: 250, down: 250, left: 10, right: 0 },
    preventScrollOnSwipe: true,
  });

  useEffect(() => {
    let deletionTimeout: ReturnType<typeof setTimeout>;
    if (deletionTriggered) {
      setSwipeDist(366);

      deletionTimeout = setTimeout(() => {
        handleDelete();
      }, 300);
    }

    return () => {
      clearTimeout(deletionTimeout);
    };
  }, [deletionTriggered]);

  return (
    <Box
      sx={{
        borderRadius: "0.25rem",
        overflow: "hidden",
        width: "100%",
        minHeight: "8.625rem",
        position: "relative",
      }}
    >
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
            transition: isSwiping ? "none" : `transform 0.3s ease`,
            borderRadius: "0.25rem",
            overflow: "hidden",
          }}
        >
          <Card
            sx={{
              width: "50%",
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
            }}
          >
            <IconButton onClick={handleDelete}>
              <Delete fontSize="large" />
            </IconButton>
          </Box>
        </Box>
      </div>
    </Box>
  );
};

export default ShiftItem;
