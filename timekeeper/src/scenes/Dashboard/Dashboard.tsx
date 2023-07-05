import { useAuthContext } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Fab, SwipeableDrawer, Box } from "@mui/material";
import { Add, Home } from "@mui/icons-material";
import { GetWages, WageObjectProps } from "../../database/database";
import SignOut from "../../auth/signout";
import Loading from "../../components/Loading/Loading";
import "./Dashboard.css";
import NavHeader from "../../components/NavHeader/NavHeader";
import NavDrawer from "../../components/NavDrawer/NavDrawer";
import Widget from "../../components/Widget/Widget";

const Dashboard = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoadingWages, setIsLoadingWages] = useState<boolean>(false);
  const [wages, setWages] = useState<WageObjectProps[]>([]);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dashboard/add-wages");
  };

  const handleSignOut = async () => {
    setLoading(true);
    const { result, error } = await SignOut();

    if (error) {
      console.log(error);
      setLoading(false);
    }

    console.log(result);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    setLoading(true);
    if (!user) {
      navigate("/login");
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    const getWages = async () => {
      setIsLoadingWages(true);
      let result: WageObjectProps[] = [];
      if (user) {
        result = await GetWages(user);

        const now = Date.now();
        const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

        result = result.filter(
          (wage) => wage.shiftDate.toMillis() >= oneWeekAgo
        );
      }

      setWages(result);
      setIsLoadingWages(false);
    };

    getWages();
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
              <Add />
            </Fab>
          )}
          <NavHeader
            label="Dashboard"
            toggleDrawer={toggleDrawer}
            icon={Home}
          />
          <SwipeableDrawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer}
            onOpen={toggleDrawer}
          >
            <NavDrawer
              toggleDrawer={toggleDrawer}
              handleSignOut={handleSignOut}
            />
          </SwipeableDrawer>
          <div className="dashboard-content">
            {isLoadingWages ? (
              <Loading label="Loading data..." />
            ) : wages.length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
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
              </Box>
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
