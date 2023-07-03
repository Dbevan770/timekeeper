import { useAuthContext } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Link } from "@mui/material";
import { Add } from "@mui/icons-material";
import { GetWages, WageObjectProps } from "../../database/database";
import SignOut from "../../auth/signout";
import Loading from "../../components/Loading/Loading";
import "./Dashboard.css";

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
          <Typography variant="h3">
            Hello {user && user.displayName}!
          </Typography>
          <div className="shift-container">
            {wages.length > 0 ? (
              wages.map((wage, index) => (
                <div className="wage-item" key={index}>
                  {wage.totalEarned}
                  {wage.shiftDate}
                </div>
              ))
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
          <Link color="secondary" onClick={handleSignOut} underline="none">
            Sign Out
          </Link>
        </div>
      ) : (
        <Loading label="Logging out..." />
      )}
    </>
  );
};

export default Dashboard;
