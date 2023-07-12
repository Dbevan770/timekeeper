import { useAuthContext } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Fab, Box, Grid } from "@mui/material";
import { Add, Home } from "@mui/icons-material";
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

  const handleClick = () => {
    navigate("/dashboard/add-wages");
  };

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
            {isLoadingWages ? (
              <Loading label="Loading data..." />
            ) : wages.length > 0 ? (
              <>
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
                  <Typography variant="h4">
                    Hello {user?.displayName}!
                  </Typography>
                  <Button
                    color="secondary"
                    variant="contained"
                    sx={{ position: "relative" }}
                    onClick={() => setOpenDataFiler(!openDataFilter)}
                  >
                    {firstDate + " - " + lastDate}
                  </Button>
                  {openDataFilter && <DataFilterModal />}
                </Box>
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
                    content="breaks"
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
                >
                  Hmm, there's nothing here!
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
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
