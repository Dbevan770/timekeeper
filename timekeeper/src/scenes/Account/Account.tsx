import NavHeader from "../../components/NavHeader/NavHeader";
import { verifyUser } from "../../auth/verify";
import { useAuthContext } from "../../context/AuthContext";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import { Person, Close } from "@mui/icons-material";
import { useState } from "react";

const Account = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showVerified, setShowVerified] = useState<string>(
    localStorage.getItem("verifiedCta") || "show"
  );
  const { user } = useAuthContext();

  const handleClick = async () => {
    if (!user) return;
    const response = await verifyUser(user);

    if (response?.success) {
      console.log("Success!");
    } else {
      console.log("Failed!");
    }
  };

  const handleClose = () => {
    // localStorage.setItem("verifiedCta", "hide");
    setShowVerified("hide");
  };

  return (
    <Box sx={{ width: "100%", height: "100dvh", p: "0.5rem" }}>
      <NavHeader setLoading={setLoading} label="Account" icon={Person} />
      <Box sx={{ margin: "2rem" }}>
        {!user?.emailVerified ? (
          <Paper
            sx={{
              backgroundColor: "#160B0B",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: "3rem 1rem",
              borderRadius: ".5rem",
              boxShadow: "none",
            }}
          >
            <Stack alignItems="flex-start">
              <Typography variant="body1" className="EmailVerifyBody">
                Action Required:
              </Typography>
              <Typography variant="body1" className="EmailVerifyBody">
                Your e-mail is not verified
              </Typography>
            </Stack>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#131830",
                borderColor: "#5c95ff",
                color: "#5c95ff",
              }}
              onClick={handleClick}
            >
              Verify
            </Button>
          </Paper>
        ) : (
          showVerified === "show" && (
            <Paper
              sx={{
                position: "relative",
                backgroundColor: "#0C130D",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                p: "3rem 1rem",
                borderRadius: ".5rem",
                boxShadow: "none",
              }}
            >
              <Typography variant="body1" sx={{ color: "#AEC7AF" }}>
                Your e-mail is verified!
              </Typography>
              <IconButton
                sx={{ position: "absolute", top: ".1rem", right: ".1rem" }}
                onClick={handleClose}
              >
                <Close sx={{ color: "#AEC7AF" }} />
              </IconButton>
            </Paper>
          )
        )}
      </Box>
    </Box>
  );
};

export default Account;
