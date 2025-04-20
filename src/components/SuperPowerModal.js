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

import {
  getHaiCustomerDetails,
  getPartyLedgerPartyName,
  getHaiBranchCustomerDetails,
} from "../services/api";
import GaugeSpeedometer from "./GaugeSpeedometer";
import { Doughnut } from "react-chartjs-2";
import DChart from "./DChart";
const { Text } = Typography;
const getPowerEmoji = (index) => {
  const emojis = ["💫", "⚡", "🧠", "🔮", "💪", "🦅", "👻"];
  return emojis[index];
};

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
  const [totalDue, setTotalDue] = useState(0); // Initialize with 0
  const [selectedParty, setSelectedParty] = useState(null); // Track the selected party
  const [filteredParties, setFilteredParties] = useState([]);

  const [rawData, setRawData] = useState([]);
  const [totDue, setTotDue] = useState(0);
  const [brcusdata, setBrCusData] = useState([]);

  const backgroundColors = [
    "#2b92d8",
    "#2ab96a",
    "#e9c061",
    "#d95d6b",
    "#9173d8",
    "#9966FF",
    "#FF66B2",
    "#FF6666",
    "#66FF66",
    "#66FFFF",
    "#FF9966",
    "#FF33FF",
    "#00FFFF",
    "#99CCFF",
    "#CC99FF",
    "#FFCC99",
  ];

  const hoverBackgroundColors = [
    "#2b92d8",
    "#2ab96a",
    "#e9c061",
    "#d95d6b",
    "#9173d8",
    "#9966FF",
    "#FF66B2",
    "#FF6666",
    "#66FF66",
    "#66FFFF",
    "#FF9966",
    "#FF33FF",
    "#00FFFF",
    "#99CCFF",
    "#CC99FF",
    "#FFCC99",
  ];

  // const customerDetails = cusdata.flatMap((item) => [
  //   {
  //     name: (
  //       <>
  //         Category: <br /> {item.category}
  //         <br />
  //         Credit Days / Limit
  //         <br />
  //         {item.creditDays} / {item.creditLimit.toLocaleString("en-IN")}
  //       </>
  //     ),
  //     description: `Credit Days / Limit: ${item.creditDays} / ${item.creditLimit}`,
  //     color: "#4ECDC4",
  //     type: "VENDOR",
  //   },
  //   {
  //     name: (
  //       <>
  //         Ctrl Office: <br /> {item.ctrlOffice}
  //         <br />
  //         SalesPerson
  //         <br />
  //         {item.salesPersonName}
  //       </>
  //     ),
  //     description: `Salesperson: ${item.salesPersonName}`,
  //     color: "#96C93D",
  //     type: "EMPLOYEE",
  //   },
  //   {
  //     name: (
  //       <>
  //         On Year:
  //         <br />
  //         {item.onYear}
  //         <br />
  //         Total Due: <br /> {item.totDue.toLocaleString("en-IN")}
  //         <br />
  //       </>
  //     ),
  //     description: `Category: ${item.category}, Ctrl Office: ${item.ctrlOffice}, On Year: ${item.onYear}`,
  //     color: "#45B7D1",
  //     type: "PRODUCT",
  //   },
  // ]);

  const uniqueCusData = [
    ...new Map(
      cusdata.map((item) => {
        // Create a unique key excluding `totDue`
        const key = JSON.stringify({
          category: item.category,
          creditDays: item.creditDays,
          creditLimit: item.creditLimit,
          ctrlOffice: item.ctrlOffice,
          salesPersonName: item.salesPersonName,
          onYear: item.onYear,
        });
        return [key, item];
      })
    ).values(),
  ];
  console.log("uniqueCusData", uniqueCusData);

  const customerDetails = uniqueCusData.flatMap((item) => [
    {
      name: (
        <>
          On Year:
          {/* <br />
            Rank
            <br />
            Credit Days
            <br />
            {item.creditDays}
            <br />
            Limit
            {item.creditLimit.toLocaleString("en-IN")}
            <br />
            SalesPerson
            <br />
            {item.salesPersonName} */}
        </>
      ),
      description: `{item.onYear}`,
      color: "#4ECDC4",
      type: "VENDOR",
    },
    // {
    //   name: (
    //     <>
    //       Ctrl Office: <br /> {item.ctrlOffice}
    //       <br />
    //       SalesPerson
    //       <br />
    //       {item.salesPersonName}
    //     </>
    //   ),
    //   description: `Salesperson: ${item.salesPersonName}`,
    //   color: "#96C93D",
    //   type: "EMPLOYEE",
    // },
    {
      name: (
        <>
          On Year:
          <br />
          {item.onYear}
        </>
      ),
      description: `Category: ${item.category}, Ctrl Office: ${item.ctrlOffice}, On Year: ${item.onYear}`,
      color: "#45B7D1",
      type: "PRODUCT",
    },
  ]);

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

  // const fetchData = (selectedValue) => {
  //   setLoading(true);

  //   getHaiCustomerDetails(selectedValue)
  //     .then((response) => {
  //       // Set data state with the updated data (result + grand total)
  //       setCusData(response);

  //       // totalDue = response.paramObjectsMap.gethaiCustomerDetails.totDue || 0;

  //       setLoading(false);
  //     })
  //     .catch(() => {
  //       notification.error({
  //         message: "Data Fetch Error",
  //         description: "Failed to fetch updated data for the GET HAI.",
  //       });
  //       setLoading(true);

  //       getHaiBranchCustomerDetails(selectedValue)
  //         .then((response) => {
  //           setBrCusData(response);
  //           console.log("brCusData", brcusdata);
  //           setLoading(false);
  //         })
  //         .catch(() => {
  //           notification.error({
  //             message: "Data Fetch Error",
  //             description:
  //               "Failed to fetch updated data for the GET HAI (Branch).",
  //           });
  //           setLoading(false);
  //         });

  //       setLoading(false);
  //     });
  // };

  const fetchData = (selectedValue) => {
    setLoading(true);

    getHaiCustomerDetails(selectedValue)
      .then((response) => {
        if (response) {
          setCusData(response);
          setLoading(false); // ✅ Important to end loading on success
        } else {
          throw new Error("Empty response"); // force fallback
        }
      })
      .catch(() => {
        notification.error({
          message: "Data Fetch Error",
          description:
            "Failed to fetch data from GET HAI. Trying branch-level...",
        });
        setLoading(false); // ✅ Important to end loading on success
        // ✅ Now trigger fallback
      });
  };

  const fetchData1 = async (selectedValue) => {
    setLoading(true);
    try {
      const response = await getHaiBranchCustomerDetails(selectedValue);
      setBrCusData(response);
      console.log("Branch API Response:", brcusdata); // Debug log

      // Check if response has data
      if (
        response &&
        response.paramObjectsMap &&
        response.paramObjectsMap.gethaiBranchCustomerDetails
      ) {
        setBrCusData(response.paramObjectsMap.gethaiBranchCustomerDetails);
      } else {
        console.warn("No branch data found in response");
      }
    } catch (error) {
      console.error("Error fetching branch data:", error);
      notification.error({
        message: "Data Fetch Error",
        description: "Failed to fetch branch customer data",
      });
    } finally {
      setLoading(false);
    }
  };

  const chartData1a = {
    total: 64,
    wedges: [
      { id: "a", color: "#4FC1E9", value: 10 },
      { id: "b", color: "#A0D468", value: 16 },
      { id: "c", color: "#ED5565", value: 24 },
      { id: "d", color: "#AC92EC", value: 14 },
    ],
  };

  // const chartData = {
  //   total: brcusdata?.reduce((sum, item) => sum + (item.totDue || 0), 0) || 0,
  //   wedges:
  //     brcusdata?.map((item, index) => ({
  //       id: item.branchCode || `branch-${index}`,
  //       color: ["#4FC1E9", "#A0D468", "#ED5565", "#AC92EC"][index % 4],
  //       value: item.totDue || 0,
  //     })) || [],
  // };

  const [data1, setData1] = useState({
    total: 0,
    wedges: [],
  });
  useEffect(() => {
    const newData = {
      total:
        brcusdata
          ?.reduce((sum, item) => sum + item.totDue / 100000, 0)
          .toFixed(0) || 0,

      wedges:
        brcusdata
          ?.map((item, index) => ({
            id: item.branchCode || `branch-${index}`,
            color: ["#4FC1E9", "#A0D468", "#ED5565", "#AC92EC"][index % 4],
            value: (item.totDue / 100000).toFixed(0) || 0,
          }))
          .sort((a, b) => b.value - a.value) || [], // ✅ sort descending || [],
    };

    setData1(newData);
    console.log("chardata1", data1);
  }, [brcusdata]);

  useEffect(() => {
    console.log("brcusdata updated:", brcusdata);
  }, [brcusdata]);

  useEffect(() => {
    console.log("data1 updated:", data1);
  }, [data1]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setData1((prev) => (prev.total === 64 ? 0 : data1));
  //   }, 4000);
  //   return () => clearInterval(interval);
  // }, []);

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

  const chartData = [
    { title: "Tokyo", value: 120, color: "#2C3E50" },
    { title: "San Francisco", value: 80, color: "#FC4349" },
    { title: "New York", value: 70, color: "#6DBCDB" },
    { title: "London", value: 50, color: "#F7E248" },
    { title: "Sydney", value: 40, color: "#D7DADB" },
    { title: "Berlin", value: 20, color: "#FFF" },
  ];

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

  const colors = ["#0669AD", "#E62A39", "#FEDA3E", "#4CAF50", "#FF9800"];
  const multiGraphData = brcusdata.map((item, index) => ({
    name: item.branchCode,
    percentage: Number((item.totDue / 100000).toFixed(0)) || 0,
    fill: colors[index % colors.length],
  }));

  console.log("multiGraphData", multiGraphData);

  let currentAngle = 0;
  const graphData = multiGraphData.map((item) => {
    const angle = item.percentage * 1.8; // Each percentage = 1.8 deg (180 total)
    const startAngle = currentAngle;
    currentAngle += angle;

    return {
      ...item,
      startAngle,
      angle,
    };
  });

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
          maxHeight: "100vh",
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
            marginLeft: "-330px",
          }}
        >
          {powers.map((power, index) => (
            <Box
              key={index}
              onClick={() => {
                updatePower(index);
                setSelectedType(power.type); // Sets the selected type (e.g., "VENDOR")
              }}
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
                  width: "125%",
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
                        color: "white",
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
                            fetchData1(selectedValue);
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
              fontWeight: 200,
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
            {customerDetails.map((power, index) => (
              <Box
                key={index}
                sx={{
                  flex: 1,
                  minWidth: "90px",
                  maxWidth: "250px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.7rem",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(5px)",
                  boxShadow: "0 8px 15px rgba(255, 255, 255, 0.1)",
                  opacity: 1,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    background: "rgba(255, 255, 255, 0.15)",
                  },
                }}
              >
                <Typography sx={{ fontSize: "1.6rem" }}>
                  {/* {getPowerEmoji(index)} */}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    textAlign: "center",
                    fontWeight: 500,
                    color: "white",
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  {/* {power.name} */}

                  <Text>{power.name}:</Text>
                  <Text>{power.description}</Text>
                </Typography>
              </Box>
            ))}
          </Box>
          {cusdata[0]?.totDue && (
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
                {/* {powers[currentPower].name} */}
              </Typography>
              <Typography
                sx={{
                  color: "white",
                  opacity: 0.9,
                  lineHeight: 1.6,
                }}
              >
                {/* {powers[currentPower].description} */}
                {cusdata[0]?.totDue && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "80px", // Increase this value as needed
                      marginTop: "1px",
                    }}
                  >
                    <GaugeSpeedometer
                      // value={(cusdata[0].totDue / 100000).toFixed(0)}
                      value={(
                        data1.wedges.reduce(
                          (sum, wedge) => sum + wedge.value * 100000,
                          0
                        ) / 100000
                      ).toLocaleString("en-IN")}
                      display={`L - Due`}
                    />
                  </div>
                )}

                {/* {cusdata[0]?.totDue && <DChart data={data1} label="Total" />} */}

                {/* <div className="multi-graph">
                    {multiGraphData.map((item, index) => (
                      <div
                        key={index}
                        className="graph"
                        style={{
                          "--percentage": item.percentage,
                          "--fill": item.fill,
                        }}
                        data-name={item.name}
                      ></div>
                    ))}
                  </div> */}

                {/* <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "80px", // Increase this value as needed
                    marginTop: "-150px",
                    marginLeft: "550px",
                  }}
                >
                  {cusdata[0]?.totDue && (
                    <GaugeSpeedometer
                      value={(cusdata[0].totDue / 100000).toFixed(0)}
                      display={`L - OS`}
                    />
                  )}
                </div> */}
              </Typography>
            </Box>
          )}
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

export default SuperPowerModal;
