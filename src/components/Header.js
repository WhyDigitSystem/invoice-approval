import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  Toolbar,
  Typography,
  Autocomplete,
  TextField,
  CircularProgress,
  InputAdornment,
  Paper,
} from "@mui/material";
import { notification } from "antd";
import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ResetPasswordPopup from "../utils/ResetPassword";
import idea from "../idea.png";
import { gsap } from "gsap";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { ArrowDropDown, ArrowDropUp, Clear } from "@mui/icons-material";
import "./Header.css";
import {
  getHaiCustomerDetails,
  getPartyLedgerPartyName,
} from "../services/api";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8091";

const SuperPowerModal = ({ open, onClose }) => {
  const powers = [
    {
      name: "Customer",
      description: "View and manage customer information",
      color: "#FF6B6B",
      type: "CUSTOMER",
    },
    {
      name: "Vendor",
      description: "View and manage vendor information",
      color: "#4ECDC4",
      type: "VENDOR",
    },
    {
      name: "Product",
      description: "View and manage product information",
      color: "#45B7D1",
      type: "PRODUCT",
    },
    {
      name: "Employee",
      description: "View and manage employee information",
      color: "#96C93D",
      type: "EMPLOYEE",
    },
  ];

  const [currentPower, setCurrentPower] = useState(0);
  const [particles, setParticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [cusdata, setCusData] = useState([]);
  const [party, setParty] = useState("");
  const [ptype, setPtype] = useState("");
  const [partyNames, setPartyNames] = useState([]);
  const [selectedType, setSelectedType] = useState(powers[0].type);
  const [showDropdown, setShowDropdown] = useState(false);

  const [selectedParty, setSelectedParty] = useState(null); // Track the selected party
  const [filteredParties, setFilteredParties] = useState([]);

  const customerDetails = cusdata.map((item) => ({
    name: item.partyCode,
    description: `Code: ${item.partyName}`,
    color: "#FF6B6B", // Assign a fixed or dynamic color if needed
    type: "CUSTOMER",
  }));

  const handleClearSelection = () => {
    setSelectedParty(null);
    setSearchTerm("");
    setShowDropdown(true);
  };
  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Fetch data when modal opens or selectedType changes
  useEffect(() => {
    if (open && selectedType) {
      fetchPartyNames(selectedType);
    }
  }, [open, selectedType]);

  // Fetch party names with wildcard search
  const fetchPartyNames = useCallback(async (type) => {
    setLoading(true);
    try {
      const response = await getPartyLedgerPartyName(type);
      setPartyNames(response || []);
      console.log("partyName", partyNames);
    } catch (error) {
      console.error("Error fetching party names:", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch party names",
      });
      setPartyNames([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((type, searchTerm) => {
      fetchPartyNames(type, searchTerm);
    }, 500),
    [fetchPartyNames]
  );

  // Handle search term changes
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (selectedType) {
      debouncedSearch(selectedType, value);
    }
  };

  // Handle power selection
  const handlePowerClick = (index) => {
    setCurrentPower(index);
    const type = powers[index].type;
    setSelectedType(type);
    setSearchTerm("");
    fetchPartyNames(type);
  };

  const handlePartySelect = (party) => {
    setSelectedParty(party);
    setShowDropdown(false);
    // You can add additional handling here
    console.log("Selected party:", party);
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = partyNames.filter((party) =>
        (party.subledgerName || party)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredParties(filtered);
    } else {
      setFilteredParties(partyNames);
    }
  }, [searchTerm, partyNames]);

  const fetchData = (selectedValue) => {
    setLoading(true);

    getHaiCustomerDetails(selectedValue)
      .then((response) => {
        // Set data state with the updated data (result + grand total)
        setCusData(response);
        setLoading(false);
      })
      .catch(() => {
        notification.error({
          message: "Data Fetch Error",
          description: "Failed to fetch updated data for the listing.",
        });
        setLoading(false);
      });
  };

  const updatePower = (index) => {
    setCurrentPower(index);

    // Create particles animation
    // const newParticles = [];
    // for (let i = 0; i < 15; i++) {
    //   setTimeout(() => {
    //     const particle = {
    //       id: Date.now() + i,
    //       x: Math.random() * 100,
    //       y: Math.random() * 100,
    //       color: powers[index].color,
    //     };
    //     newParticles.push(particle);
    //     setParticles((prev) => [...prev, particle]);

    //     setTimeout(() => {
    //       setParticles((prev) => prev.filter((p) => p.id !== particle.id));
    //     }, 1500);
    //   }, i * 50);
    // }
  };

  const handleTypeChange = (value) => {
    setPtype(value); // Update the Type state
    fetchPartyByType(value); // Fetch Party Names based on selected Type
  };

  // Fetch parties based on selected Type
  const fetchPartyByType = (selectedType) => {
    setLoading(true); // Set loading to true when fetching data
    getPartyLedgerPartyName(selectedType)
      .then((response) => {
        setParty(response); // Update party state with fetched data
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch(() => {
        notification.error({
          message: "Data Fetch Error",
          description: "Failed to fetch Party Names based on selected Type.",
        });
        setLoading(false);
      });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        style: {
          background: "rgba(15, 23, 42, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background:
            "linear-gradient(135deg, rgba(255,107,107,0.2) 0%, rgba(78,205,196,0.2) 100%)",
          color: "white",
          padding: "1.5rem 2rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          height: "100px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            background: "linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            fontFamily: "'Playfair Display', serif",
            fontWeight: "bold",
          }}
        >
          HAI
        </Typography>
        <Box
          sx={{
            display: "flex",
            // justifyContent: "space-between",
            marginBottom: "2rem",
            gap: "0.7rem",
            flexWrap: "wrap",
            marginLeft: "-370px",
          }}
        >
          {powers.map((power, index) => (
            <Box
              key={index}
              onClick={() => updatePower(index)}
              sx={{
                flex: 1,
                minWidth: "30px",
                maxWidth: "60px",
                minHeight: "30px",
                maxHeight: "60px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
                opacity: currentPower === index ? 1 : 0.6,
                transition: "all 0.3s ease",
                cursor: "pointer",
                padding: "0.7rem",
                borderRadius: "12px",
                // background: "rgba(255, 255, 255, 0.1)",
                // border:
                //   currentPower === index
                //     ? "1px solid rgba(255, 255, 255, 0.3)"
                //     : "1px solid transparent",
                // backdropFilter: "blur(5px)",
                // boxShadow:
                //   currentPower === index
                //     ? "0 8px 15px rgba(255, 255, 255, 0.1)"
                //     : "0 4px 6px rgba(0, 0, 0, 0.1)",
                // "&:hover": {
                //   opacity: 1,
                //   transform: "scale(1.05)",
                //   borderColor: "rgba(255, 255, 255, 0.3)",
                //   background: "rgba(255, 255, 255, 0.15)",
                // },
              }}
            >
              <Typography sx={{ fontSize: "1.6rem" }}>
                {getPowerEmoji(index)}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  textAlign: "center",
                  fontWeight: 500,
                  color: "white",
                }}
              >
                {power.name}
              </Typography>
            </Box>
          ))}
          {/* <div
            class="form__group field"
            style={{ marginRight: "-300px", marginTop: "20px" }}
          >
            <input
              type="input"
              class="form__field"
              placeholder="Search..."
              required=""
            />
            <label for="name" class="form__label">
              Search
            </label>
          </div>{" "} */}
          {/* } */}
          <div
            class="form__group field"
            // style={{ marginRight: "-300px", marginTop: "20px" }}
            style={{
              marginRight: "-300px",
              marginTop: "20px",
              position: "relative",
              width: "300px",
              backgroundColor: "transparent",
              color: "white",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                backgroundColor: "transparent",
                color: "white",
              }}
            >
              {/* Search Input */}
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true); // Show dropdown when typing
                }}
                placeholder={`Search ${powers[currentPower].name}...`}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "4px",
                  // backgroundColor: "white",
                  backgroundColor: "transparent",
                  color: "white",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />

              {/* Dropdown List */}
              {showDropdown && searchTerm && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 5px)",
                    left: 0,
                    right: 0,
                    maxHeight: "300px",
                    overflowY: "auto",
                    backgroundColor: "transparent",
                    border: "1px solid #e0e0e0000000",
                    borderRadius: "4px",
                    zIndex: 1000,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  {loading ? (
                    <div
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#666",
                      }}
                    >
                      Loading...
                    </div>
                  ) : partyNames.length > 0 ? (
                    partyNames
                      .filter((party) => {
                        const partyName = (party.subledgerName || party)
                          .toString()
                          .toLowerCase();
                        return partyName.startsWith(searchTerm.toLowerCase());
                      })
                      .map((party, index) => (
                        <div
                          key={`party-${index}`}
                          style={{
                            padding: "12px 16px",
                            color: "#333",
                            cursor: "pointer",
                            borderBottom: "1px solid #f0f0f0",
                            transition: "background-color 0.2s ease",
                            backgroundColor:
                              selectedParty === party ? "#f5f5f5" : "white",
                            ":hover": {
                              backgroundColor: "#f5f5  f5",
                            },
                          }}
                          onClick={() => {
                            const selectedValue = party.subledgerName || party;
                            setSearchTerm(selectedValue);
                            setSelectedParty(party);
                            fetchData(selectedValue);
                            setShowDropdown(false); // Close dropdown after selection
                          }}
                        >
                          {party.subledgerName || party}
                        </div>
                      ))
                  ) : (
                    <div
                      style={{
                        padding: "12px 16px",
                        color: "#666",
                        fontStyle: "italic",
                      }}
                    >
                      No results found for "{searchTerm}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Search and Dropdown */}
        </Box>

        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: "2rem",
          background:
            "radial-gradient(circle at 20% 20%, rgba(255, 107, 107, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(69, 183, 209, 0.1) 0%, transparent 50%)",
        }}
      >
        <Box
          sx={{
            maxWidth: "800px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "white",
              opacity: 0.8,
              marginBottom: "2rem",
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 300,
            }}
          >
            {/* Discover Your Ultimate Power */}
          </Typography>

          <Box
            sx={{
              position: "relative",
              marginBottom: "2rem",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "100%",
                pointerEvents: "none",
              }}
            >
              {particles.map((particle) => (
                <Box
                  key={particle.id}
                  sx={{
                    position: "absolute",
                    width: "10px",
                    height: "10px",
                    backgroundColor: particle.color,
                    borderRadius: "50%",
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "2rem",
              gap: "0.7rem",
              flexWrap: "wrap",
            }}
          >
            {powers.map((power, index) => (
              <Box
                key={index}
                onClick={() => updatePower(index)}
                sx={{
                  flex: 1,
                  minWidth: "90px",
                  maxWidth: "130px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                  opacity: currentPower === index ? 1 : 0.6,
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  padding: "0.7rem",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border:
                    currentPower === index
                      ? "1px solid rgba(255, 255, 255, 0.3)"
                      : "1px solid transparent",
                  backdropFilter: "blur(5px)",
                  boxShadow:
                    currentPower === index
                      ? "0 8px 15px rgba(255, 255, 255, 0.1)"
                      : "0 4px 6px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    opacity: 1,
                    transform: "scale(1.05)",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    background: "rgba(255, 255, 255, 0.15)",
                  },
                }}
              >
                <Typography sx={{ fontSize: "1.6rem" }}>
                  {getPowerEmoji(index)}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    textAlign: "center",
                    fontWeight: 500,
                    color: "white",
                  }}
                >
                  {power.name}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              padding: "1.5rem",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "15px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(5px)",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                marginBottom: "1rem",
                background: "linear-gradient(135deg, #FF6B6B, #4ECDC4)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              {powers[currentPower].name}
            </Typography>
            <Typography
              sx={{
                color: "white",
                opacity: 0.9,
                lineHeight: 1.6,
              }}
            >
              {powers[currentPower].description}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          padding: "1rem 2rem",
          background: "rgba(15, 23, 42, 0.7)",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* <Button
          onClick={onClose}
          sx={{
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          Close
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

const getPowerEmoji = (index) => {
  const emojis = ["💪", "⚡", "🧠", "🔮", "💫", "🦅", "👻"];
  return emojis[index];
};

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [time, setTime] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);

  const hiddenPaths = ["/login", "/register", "/authenticate"];

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getDayWithSuffix = (day) => {
    if (day > 3 && day < 21) return `${day}`;
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

  const dayOfWeek = time.toLocaleString("en-US", { weekday: "short" });
  const dayWithSuffix = getDayWithSuffix(time.getDate());
  const month = time.toLocaleString("en-US", { month: "short" });
  const year = time.getFullYear();
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  const formattedDate = `${dayOfWeek} ${dayWithSuffix} ${month} ${year}`;
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/logout?userName=${localStorage.getItem(
          "userName"
        )}`
      );

      if (response.status === 200 || response.status === 201) {
        notification.success({
          message: "Success",
          description: "Successfully Logged Out.",
          duration: 3,
        });
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
    localStorage.clear();
    navigate("/login");
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#1B2631",
        }}
      >
        <Toolbar>
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              marginLeft: 7,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "bold",
              letterSpacing: "2px",
              color: "#ffffff",
            }}
          >
            UNIWORLD
          </Typography>

          <p style={{ fontSize: "18px", fontWeight: "bold" }}>
            {formattedDate} - {formattedTime}
          </p>

          <IconButton
            onClick={handleOpenModal}
            sx={{
              marginX: 3,
              "&:hover": {
                transform: "scale(1.1)",
                transition: "transform 0.3s ease",
              },
            }}
          >
            <img
              src={idea}
              width="40px"
              height="40px"
              alt="Idea"
              style={{ cursor: "pointer" }}
            />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", marginRight: 2 }}>
            <Avatar
              sx={{ marginRight: 1 }}
              alt="User"
              src="/static/images/avatar/1.jpg"
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
              Welcome!!! &nbsp; {localStorage.getItem("nickName")}
            </Typography>
          </Box>

          <ResetPasswordPopup />

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

          <Button
            variant="contained"
            color="secondary"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              backgroundColor: "#f44336",
              "&:hover": { backgroundColor: "#d32f2f" },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <SuperPowerModal open={modalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default Header;
