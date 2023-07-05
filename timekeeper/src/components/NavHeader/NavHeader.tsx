import { Typography, IconButton, Box } from "@mui/material";
import { Menu } from "@mui/icons-material";
import "./NavHeader.css";

interface NavHeaderProps {
  label?: string;
  toggleDrawer: () => void;
  icon?: React.ElementType;
}

const NavHeader = ({
  label,
  toggleDrawer,
  icon: IconComponent,
}: NavHeaderProps) => {
  return (
    <div className="nav-header-container">
      <Box sx={{ display: "flex", gap: "1rem" }}>
        {IconComponent && <IconComponent />}
        <Typography variant="h5" sx={{ textAlign: "left" }}>
          {label}
        </Typography>
      </Box>
      <IconButton
        aria-label="menu"
        sx={{ color: "#e1e1e1" }}
        onClick={toggleDrawer}
      >
        <Menu sx={{ fontSize: "2rem" }} />
      </IconButton>
    </div>
  );
};

export default NavHeader;
