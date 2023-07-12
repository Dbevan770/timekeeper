import { WageObjectProps } from "../../database/database";
import { Box, CircularProgress } from "@mui/material";
import { useCallback, useState, useEffect, useRef, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useSwipeable } from "react-swipeable";
import { useWages } from "../../context/WagesContext";
import ShiftItemCard from "./ShiftItemCard/ShiftItemCard";

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
            <ShiftItemCard wage={wage} handleDelete={handleDelete} />
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default ShiftItem;
