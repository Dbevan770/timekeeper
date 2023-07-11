import { Box, Stack } from "@mui/material";
import { AccessTime } from "@mui/icons-material";
import NavHeader from "../../components/NavHeader/NavHeader";
import ShiftItem from "../../components/ShiftItem/ShiftItem";
import Loading from "../../components/Loading/Loading";
import { useWages } from "../../context/WagesContext";
import { useState } from "react";

const Shifts = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { wages, isLoadingWages } = useWages();

  return (
    <Box sx={{ width: "100%", height: "100dvh", p: "0.5rem" }}>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <NavHeader label="Shifts" setLoading={setLoading} icon={AccessTime} />
        <Box
          sx={{
            flex: "1 0 auto",
            maxHeight: "90dvh",
            overflowY: "auto",
            overflowX: "hidden",
            margin: "0.75rem 0 0 0",
            paddingRight: "0.75rem",
          }}
        >
          {loading ? (
            <Loading label="Loading data..." />
          ) : !isLoadingWages ? (
            wages.length > 0 ? (
              <Stack
                spacing={1.5}
                sx={{ paddingBottom: "0.5rem", height: "100%" }}
              >
                {wages.map((wage) => {
                  return <ShiftItem key={wage.docId} wage={wage} />;
                })}
              </Stack>
            ) : (
              <div>No wages</div>
            )
          ) : (
            <Loading label="Loading data..." />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Shifts;
