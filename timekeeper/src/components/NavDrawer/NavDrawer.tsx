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
import { ThemeContext } from "../../context/ThemeContext";
import { useContext } from "react";
import SignOut from "../../auth/signout";

interface NavDrawerProps {
  toggleDrawer: () => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavDrawer = ({ toggleDrawer, setLoading }: NavDrawerProps) => {
  const navigate = useNavigate();
  const { themeMode } = useContext(ThemeContext);

  const handleSignOut = async () => {
    setLoading(true);
    const { result, error } = await SignOut();

    if (error) {
      console.log(error);
      setLoading(false);
    }

    console.log(result);
  };

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
            {
              label: "Dashboard",
              icon: <Home className="NavIcon" />,
              url: "/dashboard",
            },
            {
              label: "Earnings",
              icon: <AttachMoney className="NavIcon" />,
              url: "/earnings",
            },
            {
              label: "Shifts",
              icon: <AccessTimeFilled className="NavIcon" />,
              url: "/shifts",
            },
          ].map(({ label, icon, url }) => (
            <ListItem key={label} disablePadding>
              <ListItemButton
                onClick={url ? () => handleNavigate(url) : undefined}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText
                  primary={
                    <span
                      style={{
                        color: themeMode === "dark" ? "#e1e1e1" : "#ffffff",
                      }}
                    >
                      {label}
                    </span>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <List>
          {[
            {
              label: "Account",
              icon: <Person className="NavIcon" />,
              url: "/account",
            },
            {
              label: "Settings",
              icon: <Settings className="NavIcon" />,
              url: "/settings",
            },
            { label: "Sign Out", icon: <Logout className="NavIcon" /> },
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
                <ListItemText
                  primary={
                    <span
                      style={{
                        color: themeMode === "dark" ? "#e1e1e1" : "#ffffff",
                      }}
                    >
                      {label}
                    </span>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
    </Box>
  );
};

export default NavDrawer;
