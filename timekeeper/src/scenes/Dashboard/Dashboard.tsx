import { useAuthContext } from "../../context/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Fab,
  Box,
  Grid,
  Backdrop,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Add, Home, FilterAlt } from "@mui/icons-material";
import { useWages } from "../../context/WagesContext";
import Loading from "../../components/Loading/Loading";
import DataFilterModal from "../../components/DataFilterModal/DataFilterModal";
import "./Dashboard.css";
import NavHeader from "../../components/NavHeader/NavHeader";
import Widget from "../../components/Widget/Widget";

const Dashboard = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [openDataFilter, setOpenDataFiler] = useState<boolean>(false);
  const { wages, isLoadingWages } = useWages();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  let current = new Date();
  let first = current.getDate() - current.getDay();
  let last = first + 6;

  let firstDate = new Date(current.setDate(first)).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
  });
  let lastDate = new Date(current.setDate(last)).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
  });

  const handleClick = useCallback(() => {
    navigate("/dashboard/add-wages");
  }, [navigate]);

  useEffect(() => {
    setLoading(true);
    if (!user) {
      navigate("/login");
    }

    setLoading(false);
  }, [user]);

  return (
    <>
      {!loading ? (
        <div className="dashboard-container">
          {wages.length > 0 && (
            <Fab
              color="primary"
              sx={{ position: "absolute", bottom: "2rem", right: "2rem" }}
              onClick={handleClick}
            >
              <Add className="FabIcon" />
            </Fab>
          )}
          <NavHeader label="Dashboard" icon={Home} setLoading={setLoading} />
          <div className="dashboard-content">
            <Backdrop open={isLoadingWages} sx={{ color: "#fff", zIndex: 20 }}>
              <CircularProgress color="primary" />
            </Backdrop>
            <Box
              sx={{
                mt: "0.75rem",
                mb: "0.75rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: "0 1rem",
              }}
            >
              <Typography variant="h4" sx={{ textAlign: "left" }} noWrap>
                {firstDate + " - " + lastDate}
              </Typography>
              <IconButton
                sx={{
                  position: "relative",
                  backgroundColor: "hsla(210, 80%, 40%, 0.4) !important",
                  borderRadius: ".25rem !important",
                }}
                onClick={() => setOpenDataFiler(!openDataFilter)}
              >
                <FilterAlt sx={{ color: "#66B2FF" }} />
              </IconButton>
              <DataFilterModal openDataFilter={openDataFilter} />
            </Box>
            {wages.length > 0 ? (
              <>
                <Grid container spacing={1}>
                  <Widget
                    label="Total Earnings"
                    width="full"
                    wages={wages}
                    content="totalEarned"
                    contentType="currency"
                  />
                  <Widget
                    label="Total Hours"
                    wages={wages}
                    content="totalHours"
                    contentType="float"
                  />
                  <Widget
                    label="Total Shifts"
                    wages={wages}
                    content="totalShifts"
                    contentType="int"
                  />
                  <Widget
                    label="Total Breaks"
                    wages={wages}
                    content="numBreaks"
                    contentType="int"
                  />
                  <Widget
                    label="Total Break Time"
                    wages={wages}
                    content="breakTime"
                    contentType="float"
                  />
                </Grid>
              </>
            ) : (
              <div className="empty-content">
                <Typography
                  variant="h5"
                  sx={{
                    textWrap: "balance",
                    color: "rgba(255,255,255,0.48)",
                    marginBottom: "2rem",
                  }}
                  className="EmptyContentTitle"
                >
                  Hmm, there's nothing here!
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add className="AddShiftIcon" />}
                  onClick={handleClick}
                  sx={{ fontSize: "1rem", verticalAlign: "middle" }}
                >
                  Add Shift
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Loading label="Logging out..." />
      )}
    </>
  );
};

export default Dashboard;
