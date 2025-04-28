import BarChartIcon from "@mui/icons-material/BarChart";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TvIcon from "@mui/icons-material/Tv";
import GridViewIcon from "@mui/icons-material/GridView";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SearchIcon from "@mui/icons-material/Search";

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
  useMediaQuery,
  useTheme,
  InputBase,
  Paper,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 220;

const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const [open, setOpen] = useState(!isMobile);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const handleMenuItemClick = () => {
    if (isMobile) {
      setOpen(false);
    }
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
      <Box
        sx={{
          position: "fixed",
          top: 13,
          left: 10,
          zIndex: 1201,
          display: "flex",
          gap: 1,
        }}
      >
        <IconButton
          onClick={toggleDrawer}
          sx={{
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

        {/* Mobile Search Button */}
        {isMobile && (
          <IconButton
            onClick={toggleSearch}
            sx={{
              backgroundColor: "#000",
              color: "#00FFFF",
              borderRadius: "50%",
              transition: "all 0.3s ease-in-out",
              boxShadow: "0 0 5px #00FFFF, 0 0 10px #00FFFF, 0 0 15px #00FFFF",
              "&:hover": {
                boxShadow:
                  "0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF",
              },
            }}
          >
            <SearchIcon />
          </IconButton>
        )}
      </Box>

      {/* Mobile Search Bar */}
      {isMobile && searchOpen && (
        <Paper
          sx={{
            position: "fixed",
            top: 70,
            left: 10,
            right: 10,
            zIndex: 1200,
            p: 1,
            display: "flex",
            alignItems: "center",
            backgroundColor: "#000",
            border: "1px solid #00FFFF",
            boxShadow: "0 0 10px #00FFFF",
          }}
        >
          <InputBase
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{
              ml: 1,
              flex: 1,
              color: "#fff",
              "&::placeholder": {
                color: "#aaa",
              },
            }}
          />
          <IconButton type="button" sx={{ color: "#00FFFF" }}>
            <SearchIcon />
          </IconButton>
        </Paper>
      )}

      {/* Sidebar Drawer with Neon Border */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={() => isMobile && setOpen(false)}
        sx={{
          width: open ? drawerWidth : isMobile ? 0 : 80,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : isMobile ? 0 : 80,
            boxSizing: "border-box",
            background: "#000",
            color: "#FFFFFF",
            transition: "width 0.3s ease-in-out",
            borderRight: "1px solid #00FFFF",
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: open ? "center" : "flex-start",
            paddingLeft: open ? 0 : 2,
            minHeight: "64px !important",
          }}
        >
          {open && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#00FFFF",
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
                onClick={handleMenuItemClick}
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
                    },
                    "& .MuiTypography-root": {
                      color: "#00FFFF",
                    },
                  },
                  ...(location.pathname === item.path && {
                    backgroundColor: "rgba(252, 226, 18, 0.1)",
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
