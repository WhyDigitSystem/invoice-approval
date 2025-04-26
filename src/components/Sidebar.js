import BarChartIcon from "@mui/icons-material/BarChart";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MenuIcon from "@mui/icons-material/Menu";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import TvIcon from "@mui/icons-material/Tv";
import GridViewIcon from "@mui/icons-material/GridView";
import ReceiptIcon from "@mui/icons-material/Receipt";

import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 260;

const Sidebar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const hiddenPaths = ["/login", "/register", "/authenticate"];
  if (hiddenPaths.includes(location.pathname)) return null;

  // Menu items
  const menuItems = [
    { text: "Dashboard1", icon: <DashboardIcon />, path: "/Dashboard1" },
    { text: "User Creation", icon: <PersonAddIcon />, path: "/userCreation" },
    { text: "Screen", icon: <TvIcon />, path: "/screen" },
    { text: "Transactions", icon: <GridViewIcon />, path: "/transactions" },
    { text: "Reports", icon: <BarChartIcon />, path: "/reports" },
    { text: "Ticket", icon: <ReceiptIcon />, path: "/ticket" },
  ];

  const responseScreens = localStorage.getItem("responseScreens");
  let parsedScreens = [];

  try {
    if (responseScreens) {
      parsedScreens = JSON.parse(responseScreens);
    }
  } catch (error) {
    console.error("Error parsing responseScreens:", error);
  }

  const filteredMenuItems = menuItems.filter((menu) =>
    parsedScreens.includes(menu.text.toUpperCase())
  );

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#000" }}>
      {/* Toggle Button with Neon Effect */}
      <IconButton
        onClick={toggleDrawer}
        sx={{
          position: "fixed",
          top: 13,
          left: open ? 10 : 10,
          zIndex: 1201,
          backgroundColor: "#000",
          color: "#00FFFF",
          borderRadius: "50%",
          transition: "all 0.3s ease-in-out",
          boxShadow: "0 0 5px #00FFFF, 0 0 10px #00FFFF, 0 0 15px #00FFFF",
          "&:hover": {
            boxShadow: "0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF",
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Sidebar Drawer with Neon Border */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 80,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : 80,
            boxSizing: "border-box",
            background: "#000",
            color: "#FFFFFF",
            transition: "width 0.3s ease-in-out",
            borderRight: "1px solid #00FFFF",
            // boxShadow: "0 0 10px #FCE212, 0 0 20px rgba(252, 226, 18, 0.5)",
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: open ? "center" : "flex-start",
            paddingLeft: open ? 0 : 2,
          }}
        >
          {open && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#00FFFF",
                textShadow: "0 0 5px #00FFFF, 0 0 10px #00FFFF",
              }}
            >
              Dashboard
            </Typography>
          )}
        </Toolbar>
        <Box sx={{ padding: "20px 10px" }}>
          <List>
            {filteredMenuItems.map((item, index) => (
              <ListItem
                button
                component={Link}
                to={item.path}
                key={index}
                sx={{
                  marginBottom: 1,
                  borderRadius: "12px",
                  color: "#FFFFFF",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "rgba(0, 92, 92, 0.1)",
                    "& .MuiListItemIcon-root": {
                      color: "#00FFFF",
                      filter: "drop-shadow(0 0 5px #00FFFF)",
                    },
                    "& .MuiTypography-root": {
                      color: "#00FFFF",
                      textShadow: "0 0 5px #00FFFF",
                    },
                  },
                  ...(location.pathname === item.path && {
                    backgroundColor: "rgba(252, 226, 18, 0.1)",
                    // boxShadow:"0 0 5px #FCE212, 0 0 10px rgba(252, 226, 18, 0.5)",
                    "& .MuiListItemIcon-root": {
                      color: "#00FFFF",
                      filter: "drop-shadow(0 0 5px #0FF)",
                    },
                    "& .MuiTypography-root": {
                      color: "#00FFFF",
                      textShadow: "0 0 5px #0FF",
                    },
                  }),
                  flexDirection: open ? "row" : "column",
                  justifyContent: "center",
                  alignItems: "center",
                  px: open ? 2 : 1,
                  py: open ? 1 : 1.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: open ? 40 : "auto",
                    color: "#FFFFFF",
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!open && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.65rem",
                      fontWeight: "500",
                      color: "#FFFFFF",
                      textAlign: "center",
                      lineHeight: 1.2,
                      transition: "all 0.3s ease-in-out",
                    }}
                  >
                    {item.text.split(" ")[0]}
                  </Typography>
                )}
                {open && (
                  <ListItemText
                    primary={item.text}
                    sx={{
                      "& .MuiTypography-root": {
                        fontSize: "1rem",
                        fontWeight: "500",
                        color: "#FFFFFF",
                        transition: "all 0.3s ease-in-out",
                      },
                    }}
                  />
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
