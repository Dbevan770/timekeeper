import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Home } from "@mui/icons-material";
import "./NavDrawer.css";

interface NavDrawerProps {
  toggleDrawer: () => void;
  handleSignOut: () => void;
}

const NavDrawer = ({ toggleDrawer, handleSignOut }: NavDrawerProps) => {
  return (
    <Box
      sx={{ width: "200px", height: "100%" }}
      role="presentation"
      onClick={toggleDrawer}
    >
      <div className="side-drawer-items">
        <List>
          {["Dashboard", "Earnings"].map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <List>
          {["Account", "Settings", "Sign Out"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={index === 2 ? handleSignOut : undefined}>
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
    </Box>
  );
};

export default NavDrawer;
