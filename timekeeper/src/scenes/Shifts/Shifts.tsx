import { Box } from "@mui/material";
import { AccessTime } from "@mui/icons-material";
import NavHeader from "../../components/NavHeader/NavHeader";
import ShiftItem from "../../components/ShiftItem/ShiftItem";
import Loading from "../../components/Loading/Loading";
import { useWages } from "../../context/WagesContext";
import { useState } from "react";

const Shifts = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [stopScroll, setStopScroll] = useState<boolean>(false);
  const { wages } = useWages();

  return (
    <Box sx={{ width: "100%", height: "100dvh", p: "0.5rem" }}>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <NavHeader label="Shifts" setLoading={setLoading} icon={AccessTime} />
        <Box
          sx={{
            flex: "1 1 auto",
            maxHeight: "calc(100vh - (100dvh * 0.05))",
            overflowY: "auto",
            overflowX: "hidden",
            margin: "0.75rem 0.5rem 0 0",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            touchAction: stopScroll ? "none" : "auto",
          }}
        >
          {loading ? (
            <Loading label="Loading data..." />
          ) : wages.length > 0 ? (
            wages.map((wage) => {
              return (
                <ShiftItem
                  key={wage.docId}
                  wage={wage}
                  setStopScroll={setStopScroll}
                />
              );
            })
          ) : (
            <div>No wages</div>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Shifts;
