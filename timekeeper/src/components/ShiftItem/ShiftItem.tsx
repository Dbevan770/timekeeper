import { WageObjectProps } from "../../database/database";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  CircularProgress,
  Button,
  Stack,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { useCallback, useState, useEffect, useRef, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useSwipeable } from "react-swipeable";
import { useWages } from "../../context/WagesContext";

interface ShiftItemProps {
  wage: WageObjectProps;
}

const ShiftItem = ({ wage }: ShiftItemProps) => {
  const { themeMode } = useContext(ThemeContext);

  const [swipeDist, setSwipeDist] = useState(0);
  const [maxSwipeDist, setMaxSwipeDist] = useState(0);
  const [deletionTrigger, setDeletionTrigger] = useState(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [deletionTriggered, setDeletionTriggered] = useState(false);
  const { deleteWage, refreshWages } = useWages();
  const swipeOffset = useRef(0);
  const swipableRef = useRef<HTMLDivElement | null>(null);

  const handleDelete = useCallback(async () => {
    setLoading(true);
    await deleteWage(wage.docId);
    await refreshWages();
    setLoading(false);
  }, [deleteWage, refreshWages, wage.docId]);

  const handlers = useSwipeable({
    onSwipeStart: () => {
      setIsSwiping(true);
      swipeOffset.current = swipeDist;
    },
    onSwiping: (eventData) => {
      let currentSwipeDist = swipeDist;
      if (!loading) {
        currentSwipeDist = Math.min(
          Math.max(0, swipeOffset.current - eventData.deltaX + 10),
          maxSwipeDist
        );
        setSwipeDist(currentSwipeDist);
      }
    },
    onSwiped: (eventData) => {
      if (eventData.dir === "Left" && swipeDist > deletionTrigger) {
        setDeletionTriggered(true);
      } else if (swipeDist > 51) {
        setSwipeDist(51);
      } else {
        setSwipeDist(0);
      }
      setIsSwiping(false);
    },
    delta: { up: 250, down: 250, left: 10, right: 10 },
    preventScrollOnSwipe: true,
  });

  useEffect(() => {
    let deletionTimeout: ReturnType<typeof setTimeout>;
    if (deletionTriggered) {
      setSwipeDist(maxSwipeDist);

      deletionTimeout = setTimeout(() => {
        handleDelete();
      }, 300);
    }

    return () => {
      clearTimeout(deletionTimeout);
    };
  }, [deletionTriggered]);

  useEffect(() => {
    if (swipableRef.current) {
      const width = swipableRef.current.offsetWidth;
      setMaxSwipeDist(width / 2);
      setDeletionTrigger(width / 4);
    }
  }, []);

  return (
    <Box
      sx={{
        borderRadius: "0.25rem",
        overflow: "hidden",
        width: "100%",
        height: "auto",
        position: "relative",
        border: themeMode === "dark" ? "none" : "1px solid rgba(0,0,0,0.48)",
        boxShadow:
          themeMode === "dark" ? "none" : "10px 5px 5px rgba(0,0,0,0.6)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          position: "relative",
        }}
        {...handlers}
      >
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
        <div
          ref={swipableRef}
          style={{
            display: "flex",
            height: "100%",
            width: "200%",
            transform: `translateX(-${swipeDist}px)`,
            transition: isSwiping ? "none" : "transform 0.3s ease",
            borderRadius: "0.25rem",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", width: "100%" }}>
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
                <Typography variant="h1" sx={{ fontWeight: "400" }}>
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: wage.currency,
                  }).format(wage.totalEarned)}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip
                    size="small"
                    label={"Tot. Hrs: " + wage.totalHours.toFixed(2)}
                    color="primary"
                    onDelete={() => console.log("I've been deleted :(")}
                  />
                  <Chip
                    size="small"
                    label={"Tot. Hrs: " + wage.totalHours.toFixed(2)}
                    color="primary"
                    onDelete={() => console.log("I've been deleted :(")}
                  />
                  <Chip
                    size="small"
                    label={"Tot. Hrs: " + wage.totalHours.toFixed(2)}
                    color="primary"
                    onDelete={() => console.log("I've been deleted :(")}
                  />
                  <Chip
                    size="small"
                    label={"Tot. Hrs: " + wage.totalHours.toFixed(2)}
                    color="primary"
                    onDelete={() => console.log("I've been deleted :(")}
                  />
                  <Button
                    variant="outlined"
                    sx={{
                      p: "0",
                      borderRadius: "16px",
                    }}
                  >
                    <Add sx={{ fontSize: "1.25rem" }} />
                  </Button>
                </Stack>
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
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default ShiftItem;
