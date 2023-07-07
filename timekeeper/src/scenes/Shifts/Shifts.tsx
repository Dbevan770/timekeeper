import { Box } from "@mui/material";
import { AccessTime } from "@mui/icons-material";
import NavHeader from "../../components/NavHeader/NavHeader";
import ShiftItem from "../../components/ShiftItem/ShiftItem";
import Loading from "../../components/Loading/Loading";
import { useWages } from "../../context/WagesContext";
import { useState } from "react";
import PullToRefresh from "react-pull-to-refresh";

const Shifts = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { wages, refreshWages } = useWages();

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await refreshWages();
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ width: "100%", height: "100dvh", p: "0.5rem" }}>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <NavHeader label="Shifts" setLoading={setLoading} icon={AccessTime} />
        <PullToRefresh onRefresh={handleRefresh}>
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
        </PullToRefresh>
      </Box>
    </Box>
  );
};

export default Shifts;
