import LogoutIcon from "@mui/icons-material/Logout";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ResetPasswordPopup from "../utils/ResetPassword";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const hiddenPaths = ["/login", "/register","/authenticate"]; // Add other paths as needed

  // Hide the sidebar if the current path matches one of the hidden paths
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  // Handle Logout
  const handleLogout = () => {
    // Add your logout logic here (e.g., clearing authentication tokens)
    localStorage.clear(); // Example: Clear local storage
    navigate("/login"); // Redirect to login page
  };

  // Handle popover open
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle popover close
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  // Check if popover is open
  const open = Boolean(anchorEl);

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#1B2631", // Custom AppBar color
      }}
    >
      <Toolbar>
        {/* Dashboard Title */}
        <Typography
          variant="h5"
          component="div"
          sx={{
            flexGrow: 1,
            marginLeft: 7,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: "bold",
            letterSpacing: "2px",
            color: "#ffffff", // Elegant blue
          }}
        >
          UNIWORLD
        </Typography>

        {/* User Avatar and Name */}
        <Box sx={{ display: "flex", alignItems: "center", marginRight: 2 }}>
          <Avatar
            sx={{ marginRight: 1 }}
            alt="User"
            src="/static/images/avatar/1.jpg" // Replace with actual user avatar URL
            onClick={handlePopoverOpen}
            style={{ cursor: "pointer" }}
          />
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              color: "#ffffff",
              fontWeight: "bold",
            }}
            onClick={handlePopoverOpen}
            style={{ cursor: "pointer" }}
          >
         Welcome!!! &nbsp;   {localStorage.getItem("nickName")}{" "}
            {/* Replace with actual user's name */}
          </Typography>
        </Box>

        <ResetPasswordPopup/>
        &nbsp;&nbsp;

        {/* User Popover */}
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <List>
            <ListItem button>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Popover>

        {/* Logout Button */}
        <Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              backgroundColor: "#f44336", // Custom Logout Button color
              "&:hover": { backgroundColor: "#d32f2f" }, // Hover effect
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
