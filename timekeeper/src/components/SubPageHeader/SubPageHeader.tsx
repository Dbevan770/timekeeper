import { Typography, IconButton, Box } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useTheme } from "@mui/system";

interface SubPageHeaderProps {
  label: string;
  navigateUrl: string;
}

const SubPageHeader = ({ label, navigateUrl }: SubPageHeaderProps) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleNavigate = () => {
    navigate(navigateUrl);
  };

  return (
    <Box
      sx={{
        position: "sticky",
        top: "0",
        left: "0",
        height: "calc(5% + 1rem)",
        zIndex: "1",
        display: "flex",
        justifyContent: "left",
        alignItems: "center",
        p: "0.5rem 0.5rem 0.5rem 1rem",
        m: "-0.5rem -0.5rem 0 -0.5rem",
        borderBottom: "1px solid rgba(255,255,255,0.23)",
        boxShadow: "0 5px 10px rgba(0, 0, 0, 0.6)",
        backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#0f7cdb",
      }}
    >
      <IconButton
        aria-label="menu"
        sx={{ color: "#e1e1e1", mr: "0.5rem" }}
        onClick={handleNavigate}
      >
        <ArrowBack sx={{ fontSize: "2rem" }} className="NavIcon" />
      </IconButton>
      <Typography
        variant="h5"
        sx={{ textAlign: "left" }}
        className="NavHeaderText"
      >
        {label}
      </Typography>
    </Box>
  );
};

export default SubPageHeader;
