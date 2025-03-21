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
import { notification, Select, Spin } from "antd"; // Impor
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ResetPasswordPopup from "../utils/ResetPassword";
import {
  LogoutOutlined,
  MoonOutlined,
  RightCircleOutlined,
  SunOutlined,
} from "@ant-design/icons";
import LightDarkButton from "./LightDarkButton";
import BulbButtonTheme from "./BulbButtonTheme";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8091";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const username = localStorage.getItem("userName");
  const [time, setTime] = useState(new Date());

  const hiddenPaths = ["/login", "/register", "/authenticate"]; // Add other paths as needed
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date()); // Update the state with the current time
    }, 1000); // Update every second

    // Clean up the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  // Get the day of the week (e.g., "Monday", "Tuesday")
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date()); // Update the state with the current time
    }, 1000); // Update every second

    // Clean up the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  // Function to add the correct ordinal suffix to the day of the month
  const getDayWithSuffix = (day) => {
    if (day > 3 && day < 21) return `${day}`; // Special case for 11th, 12th, 13th, etc.
    switch (day % 10) {
      case 1:
        return `${day}`;
      case 2:
        return `${day}`;
      case 3:
        return `${day}`;
      default:
        return `${day}`;
    }
  };

  // Get the day of the week (e.g., "Saturday", "Sunday", etc.)
  const dayOfWeek = time.toLocaleString("en-US", { weekday: "short" });

  // Format the date
  const dayWithSuffix = getDayWithSuffix(time.getDate());
  const month = time.toLocaleString("en-US", { month: "short" }); // Get full month name
  const year = time.getFullYear();

  // Format time
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  const formattedDate = `${dayOfWeek} ${dayWithSuffix} ${month} ${year}`;
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  // const toggleTheme = () => {
  //   const newTheme = theme === "light" ? "dark" : "light";
  //   setTheme(newTheme);
  //   localStorage.setItem("theme", newTheme);
  // };

  // useEffect(() => {
  //   if (theme === "dark") {
  //     // document.body.style.backgroundColor = "#1c1c1c"; // Dark background for the entire page
  //     document.body.style.backgroundColor = "#5D576B";
  //     document.body.style.color = "#fff"; // White text for dark mode
  //   } else {
  //     document.body.style.backgroundColor = "#fff"; // Light background for the body
  //     document.body.style.color = "#000"; // Black text for light mode
  //   }
  // }, [theme]);

  const themeConfig =
    theme === "dark"
      ? {
          token: {
            // colorPrimary: '#1890ff', // Adjust as needed for dark mode
            colorPrimary: "#5D576B",
            // colorBgBase: '#1c1c1c', // Dark background
            colorBgBase: "#5D576B",
            colorTextBase: "#fff", // White text for dark mode
            // colorTextBase: 'black',
            colorLink: "#40a9ff", // Link color for dark mode
          },
        }
      : {};

  // Hide the sidebar if the current path matches one of the hidden paths
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  // Handle Logout
  const handleLogout = async () => {
    // Add your logout logic here (e.g., clearing authentication tokens)
    try {
      // Make the POST request using axios
      const response = await axios.post(
        `${API_URL}/api/auth/logout?userName=${localStorage.getItem(
          "userName"
        )}`
      );

      // Check if the response is successful
      if (response.status === 200 || response.status === 201) {
        // Show success toast message
        notification.success({
          message: "Success",
          description: "Successfully Logged Out.",
          duration: 3, // Time in seconds for the toast to stay visible
        });
      }
    } catch (error) {
      // Handle error during the request
      console.error("Error saving user:", error);
    }
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
        backgroundColor: "#1B2631", //
        // Custom AppBar color/
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
        <Box sx={{ textAlign: "left" }}>
          {/* <LightDarkButton /> */}
          {/* <BulbButtonTheme /> */}

          {/* <Button
            type="text"
            icon={theme === "light" ? <MoonOutlined /> : <SunOutlined />}
            onClick={toggleTheme}
            size="small"
            style={{ marginLeft: "10px", color: "white" }}
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </Button> */}
        </Box>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {/* User Avatar and Name */}
        <p style={{ fontSize: "18px", fontWeight: "bold" }}>
          {formattedDate} - {formattedTime}
        </p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
            Welcome!!! &nbsp; {localStorage.getItem("nickName")}{" "}
            {/* Replace with actual user's name */}
          </Typography>
        </Box>
        <ResetPasswordPopup />
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
