import { useAuthContext } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Link, Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import { GetWages, WageObjectProps } from "../../database/database";
import SignOut from "../../auth/signout";
import Loading from "../../components/Loading/Loading";
import "./Dashboard.css";
import ShiftItem from "../../components/ShiftItem/ShiftItem";

const Dashboard = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [wages, setWages] = useState<WageObjectProps[]>([]);
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

  useEffect(() => {
    setLoading(true);
    if (!user) {
      navigate("/login");
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    const getWages = async () => {
      let result: WageObjectProps[] = [];
      if (user) {
        result = await GetWages(user);
      }

      setWages(result);
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
              sx={{ position: "absolute", bottom: "4.5rem", right: "2rem" }}
              onClick={handleClick}
            >
              <Add />
            </Fab>
          )}
          <div className="dashboard-header">
            <Typography variant="h3">
              Hello {user && user.displayName}!
            </Typography>
          </div>
          <div className="dashboard-content">
            {wages.length > 0 ? (
              <div className="shift-items-container">
                {wages.map((wage: WageObjectProps, index: number) => (
                  <ShiftItem wage={wage} key={index} />
                ))}
              </div>
            ) : (
              <>
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
                  Add Wages
                </Button>
              </>
            )}
          </div>
          <div className="dashboard-footer">
            <Link color="secondary" onClick={handleSignOut} underline="none">
              Sign Out
            </Link>
          </div>
        </div>
      ) : (
        <Loading label="Logging out..." />
      )}
    </>
  );
};

export default Dashboard;
