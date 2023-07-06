import { Typography, IconButton, Box } from "@mui/material";
import { Menu } from "@mui/icons-material";

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
    <Box
      sx={{
        position: "sticky",
        top: "0",
        left: "0",
        height: "5%",
        zIndex: "1",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: "0 0.5rem 0.5rem 1.5rem",
        m: "0.5rem -0.5rem 0 -0.5rem",
        borderBottom: "1px solid rgba(255,255,255,0.23)",
        boxShadow: "0 5px 10px rgba(0, 0, 0, 0.6)",
      }}
    >
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
    </Box>
  );
};

export default NavHeader;
