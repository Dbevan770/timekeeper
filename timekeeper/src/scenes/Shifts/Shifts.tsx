import { Box } from "@mui/material";
import { AccessTime } from "@mui/icons-material";
import NavHeader from "../../components/NavHeader/NavHeader";
import ShiftItem from "../../components/ShiftItem/ShiftItem";
import Loading from "../../components/Loading/Loading";
import { useWages } from "../../context/WagesContext";
import { useState, useEffect } from "react";

const Shifts = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { wages, refreshWages } = useWages();

  useEffect(() => {
    const refreshData = async () => {
      try {
        setLoading(true);
        await refreshWages();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    refreshData();
  }, [refreshWages]);

  return (
    <Box sx={{ width: "100%", height: "100dvh", p: "0.5rem" }}>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <NavHeader label="Shifts" setLoading={setLoading} icon={AccessTime} />
        <Box
          sx={{
            flex: "1 1 auto",
            maxHeight: "calc(100vh - (100dvh * 0.05))",
            overflowY: "auto",
            p: "0.75rem 0.5rem 0 0",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {loading ? (
            <Loading label="Loading data..." />
          ) : wages.length > 0 ? (
            wages.map((wage) => {
              return <ShiftItem key={wage.docId} wage={wage} />;
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
