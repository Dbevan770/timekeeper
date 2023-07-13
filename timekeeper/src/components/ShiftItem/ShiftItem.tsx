import { WageObjectProps } from "../../database/database";
import { Box, Collapse } from "@mui/material";
import { useState, useEffect, useRef, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useSwipeable } from "react-swipeable";
import ShiftItemCard from "./ShiftItemCard/ShiftItemCard";

interface ShiftItemProps {
  wage: WageObjectProps;
  handleDelete: (docId: string) => void;
  isCollapsed: boolean;
}

const ShiftItem = ({ wage, handleDelete, isCollapsed }: ShiftItemProps) => {
  const { themeMode } = useContext(ThemeContext);
  const [swipeDist, setSwipeDist] = useState(0);
  const [minSwipeDist, setMinSwipeDist] = useState(0);
  const [maxSwipeDist, setMaxSwipeDist] = useState(0);
  const [deletionTrigger, setDeletionTrigger] = useState(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const [deletionTriggered, setDeletionTriggered] = useState(false);
  const swipeOffset = useRef(0);
  const swipableRef = useRef<HTMLDivElement | null>(null);

  const handlers = useSwipeable({
    onSwipeStart: () => {
      setIsSwiping(true);
      swipeOffset.current = swipeDist;
    },
    onSwiping: (eventData) => {
      let currentSwipeDist = swipeDist;
      const baseSwipe = swipeOffset.current - eventData.deltaX + 10;

      if (baseSwipe > deletionTrigger) {
        // Amount by which we've exceeded the deletionTrigger
        const overSwipe = baseSwipe - deletionTrigger;

        // Apply scaling factor to the overSwipe only, so that we slow down the more we are past the deletionTrigger.
        const scalingFactor = 0.25; // Modify to adjust the rate of slowing down.
        currentSwipeDist = Math.min(
          maxSwipeDist,
          deletionTrigger + scalingFactor * overSwipe
        );
      } else {
        currentSwipeDist = Math.min(maxSwipeDist, baseSwipe);
      }

      setSwipeDist(currentSwipeDist);
    },
    onSwiped: (eventData) => {
      if (eventData.dir === "Left" && swipeDist > deletionTrigger) {
        setDeletionTriggered(true);
      } else if (
        eventData.dir === "Left" &&
        (swipeDist > minSwipeDist || swipeDist > 0)
      ) {
        setSwipeDist(minSwipeDist);
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
        handleDelete(wage.docId);
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
      setMinSwipeDist(width * 0.0705);
    }
  }, []);

  return (
    <Collapse in={!isCollapsed}>
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
    </Collapse>
  );
};

export default ShiftItem;
