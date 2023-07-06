import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Home,
  AttachMoney,
  Person,
  Settings,
  Logout,
  AccessTimeFilled,
} from "@mui/icons-material";
import "./NavDrawer.css";
import { useNavigate } from "react-router";

interface NavDrawerProps {
  toggleDrawer: () => void;
  handleSignOut: () => void;
}

const NavDrawer = ({ toggleDrawer, handleSignOut }: NavDrawerProps) => {
  const navigate = useNavigate();

  const handleNavigate = (navigateUrl: string) => {
    navigate(navigateUrl);
  };
  return (
    <Box
      sx={{ width: "200px", height: "100%" }}
      role="presentation"
      onClick={toggleDrawer}
    >
      <div className="side-drawer-items">
        <List>
          {[
            { label: "Dashboard", icon: <Home />, url: "/dashboard" },
            { label: "Earnings", icon: <AttachMoney />, url: "/earnings" },
            { label: "Shifts", icon: <AccessTimeFilled />, url: "/shifts" },
          ].map(({ label, icon, url }) => (
            <ListItem key={label} disablePadding>
              <ListItemButton
                onClick={url ? () => handleNavigate(url) : undefined}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <List>
          {[
            { label: "Account", icon: <Person />, url: "/account" },
            { label: "Settings", icon: <Settings />, url: "/settings" },
            { label: "Sign Out", icon: <Logout /> },
          ].map(({ label, icon, url }, index) => (
            <ListItem key={label} disablePadding>
              <ListItemButton
                onClick={
                  index === 2
                    ? handleSignOut
                    : url
                    ? () => handleNavigate(url)
                    : undefined
                }
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
    </Box>
  );
};

export default NavDrawer;
