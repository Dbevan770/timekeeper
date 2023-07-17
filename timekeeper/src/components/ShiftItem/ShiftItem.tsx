import { WageObjectProps } from "../../database/database";
import { Box, Collapse, IconButton, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useState, useEffect, useRef, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useSwipeable } from "react-swipeable";
import ShiftItemCard from "./ShiftItemCard/ShiftItemCard";
import FormDialog from "../FormDialog/FormDialog";
import "./ShiftItem.css";

interface ShiftItemProps {
  wage: WageObjectProps;
  handleDelete: (docId: string) => void;
  isCollapsed: boolean;
  setSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setSeverity: React.Dispatch<React.SetStateAction<"error" | "success">>;
}

const ShiftItem = ({
  wage,
  handleDelete,
  isCollapsed,
  setSnackbarOpen,
  setMessage,
  setSeverity,
}: ShiftItemProps) => {
  const { themeMode } = useContext(ThemeContext);
  const [deletionIsMaxWidth, setDeletionIsMaxWidth] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [swipeDist, setSwipeDist] = useState(0);
  const [minSwipeDist, setMinSwipeDist] = useState(0);
  const [maxSwipeDist, setMaxSwipeDist] = useState(0);
  const [deletionTrigger, setDeletionTrigger] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
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

      if (baseSwipe <= deletionTrigger) {
        currentSwipeDist = Math.max(0, Math.min(maxSwipeDist, baseSwipe));
        setDeletionIsMaxWidth(false);
      } else {
        // Amount by which we've exceeded the deletionTrigger
        const overSwipe = baseSwipe - deletionTrigger;
        setDeletionIsMaxWidth(true);
        // Apply scaling factor to the overSwipe only, so that we slow down the more we are past the deletionTrigger.
        const scalingFactor = 0.25; // Modify to adjust the rate of slowing down.
        currentSwipeDist = Math.min(
          maxSwipeDist,
          deletionTrigger + scalingFactor * overSwipe
        );
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
      setDeletionIsMaxWidth(false);
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
      setMaxSwipeDist(width * 0.5);
      setDeletionTrigger(width * 0.28);
      setMinSwipeDist(width * 0.142);
    }
  }, []);

  return (
    <Collapse in={!isCollapsed}>
      <FormDialog
        open={formDialogOpen}
        setOpen={setFormDialogOpen}
        wageItem={wage}
        openSnackbar={setSnackbarOpen}
        setMessage={setMessage}
        setSeverity={setSeverity}
      />
      <Box
        sx={{
          borderRadius: "0.25rem",
          overflow: "hidden",
          width: "100%",
          height: "100%",
          position: "relative",
          boxShadow:
            themeMode === "dark" ? "none" : "0 2px 6px 0 hsla(0, 0%, 0%, 0.2)",
        }}
        {...handlers}
      >
        <div
          ref={swipableRef}
          style={{
            position: "relative",
            display: "flex",
            height: "100%",
            width: "200%",
            transform: `translateX(-${swipeDist}px)`,
            transition: isSwiping ? "none" : "transform 0.3s ease",
            borderRadius: "0.25rem",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", width: "50%" }}>
            <ShiftItemCard wage={wage} />
          </div>
          <Box
            sx={{
              width: "50%",
              height: "100%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              backgroundColor: "#f5e76c",
            }}
          >
            <IconButton
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => setFormDialogOpen(true)}
            >
              <Edit fontSize="large" sx={{ color: "#000000" }} />
              <Typography variant="body2" sx={{ color: "#000000" }}>
                Edit
              </Typography>
            </IconButton>
          </Box>
          <div
            className={
              swipeDist > deletionTrigger
                ? "expand"
                : swipeDist <= deletionTrigger
                ? "collapse"
                : ""
            }
            style={
              {
                position: "absolute",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                top: "0",
                right: "0",
                width: "50%",
                height: "100%",
                backgroundColor: "#FF5353",
                zIndex: 1,
                "--swipeDist": `${swipeDist / 2}px`,
                transform: deletionIsMaxWidth
                  ? "translateX(0px)"
                  : `translateX(${swipeDist / 2}px)`,

                transition: isSwiping ? "none" : "transform 0.3s ease",
              } as React.CSSProperties & { [key: string]: any }
            }
          >
            <IconButton
              onClick={() => handleDelete(wage.docId)}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Delete fontSize="large" />
              <Typography variant="body2">Delete</Typography>
            </IconButton>
          </div>
        </div>
      </Box>
    </Collapse>
  );
};

export default ShiftItem;
