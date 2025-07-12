import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  getUserBranch,
  getPerformanceGoalsByUserName,
  getPerformanceGoalsById,
} from "../services/api";
import { notification, Select, Spin, Table, Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  DeleteOutlined,
  PlusOutlined,
  PlusCircleOutlined,
  UnorderedListOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Space,
  DatePicker,
  Col,
  Button,
  Switch,
  ConfigProvider,
  Input,
  Rate,
  Slider,
  Checkbox,
} from "antd";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SendIcon from "@mui/icons-material/Send";
import {
  LogoutOutlined,
  MoonOutlined,
  RightCircleOutlined,
  SunOutlined,
  FolderOpenOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import axios from "axios";
import confetti from "canvas-confetti";
import gsap from "gsap";
import Nobills from "../Nobills.jpg";
import rewindbutton from ".././rewindbutton.png";
import { useNavigate } from "react-router-dom";
import ButtonTrans from "./ButtonTrans";
import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SaveIcon from "@mui/icons-material/Save";
import "./PerformanceGoalsGD.css";
import "./PS.css";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { debounce } from "lodash";

const { Option } = Select;
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8091";

const clientReportData = [
  { name: "Self Review" },
  { name: "Employee Master" },
  { name: "Performance Goals" },
  { name: "Appraiser Review" },
];

const routes = {
  "Employee Master": "/EmployeeMaster",
  "Performance Goals": "/PerformanceGoalsGD",
  "Appraiser Review": "/AppraiserReviewGD",
};

const PS = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [partyNames, setPartyNames] = useState([]);
  const [selectedPartyName, setSelectedPartyName] = useState("");
  const createdBy = localStorage.getItem("userName");
  const [ptype, setPtype] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const [performanceGoalId, setPerformanceGoalId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 20, y: 20 });

  const [hue1, setHue1] = useState(() => {
    const savedHue1 = localStorage.getItem("menuHue1");
    return savedHue1 !== null ? parseInt(savedHue1) : 260; // Default to 255 if not found
  });

  const [hue2, setHue2] = useState(() => {
    const savedHue2 = localStorage.getItem("menuHue2");
    return savedHue2 !== null ? parseInt(savedHue2) : 160; // Default to 222 if not found
  });
  const menuRef = useRef(null);

  const [branchName, setBranchName] = useState("");
  const [fbranchName, setFBranchName] = useState("");
  const [tbranchName, setTBranchName] = useState("");
  const [status, setStatus] = useState("idle");
  const textRef = useRef(null);
  const iconRef = useRef(null);
  const [branchNames, setBranchNames] = useState([]);
  const [proforma, setProforma] = useState([]);
  const [docid, setDocid] = useState([]);
  const [selectedProfoma, setSelectedProfoma] = useState("");
  const [profoms, setProfoms] = useState([]);
  const [crRemarks, setCrRemarks] = useState([]);
  const [editId, setEditId] = useState("");

  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [data1, setData1] = useState([]);

  const [empName, setEmpName] = useState(localStorage.getItem("nickName"));

  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  const [attachments, setAttachments] = useState({});
  const [previews, setPreviews] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const defaultImagePath = "src/Nobills.jpg";
  const [filePreviews, setFilePreviews] = useState({});
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [searchTerm, setSearchTerm] = useState("");

  const themeConfig = {
    token: {
      colorPrimary: theme === "dark" ? "#6C63FF" : "#1890ff",
    },
  };

  // Update CSS variables and localStorage when hues change
  useEffect(() => {
    if (menuRef.current) {
      menuRef.current.style.setProperty("--hue1", hue1);
      menuRef.current.style.setProperty("--hue2", hue2);
    }
    localStorage.setItem("menuHue1", hue1);
    localStorage.setItem("menuHue2", hue2);
  }, [hue1, hue2]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Filter menu items based on allowedScreens
  const responseScreens = localStorage.getItem("responseScreens");
  let parsedScreens = [];

  try {
    if (responseScreens) {
      parsedScreens = JSON.parse(responseScreens);
    }
  } catch (error) {
    console.error("Error parsing responseScreens:", error);
  }

  // Filtered client report data based on screens
  const filteredMenuItems = clientReportData.filter((menu) =>
    parsedScreens.includes(menu.name.toUpperCase())
  );

  // Filter further based on the search term
  const filteredAndSearchedMenuItems = filteredMenuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Button styles
  const buttonStyles = {
    display: "flex",
    width: "200px",
    height: "40px",
    justifyContent: "center",
    alignItems: "center",
    margin: "0.5rem",
    marginTop: "35px",
    borderRadius: "5px",
    textAlign: "center",
    fontSize: "16px",
    color: "black",
    textDecoration: "none",
    transition: "all 0.35s",
    boxSizing: "border-box",
    cursor: "pointer",
  };

  const handleNavigate = (route) => {
    navigate(route);
  };

  useEffect(() => {
    if (theme === "dark") {
      document.body.style.backgroundColor = "#5D576B";
      document.body.style.color = "#fff";
    } else {
      document.body.style.backgroundColor = "#fff";
      document.body.style.color = "#000";
    }
  }, [theme]);

  return (
    <ConfigProvider theme={themeConfig}>
      <div
        className={`performance-goals-gd-container ${
          theme === "dark" ? "dark-mode" : ""
        }`}
      >
        <div
          style={{
            display: "revert",
            placecontent: "center",
            minheight: "90dvh",
            background: "#159957",
            background: "var(--bg-body-gradient)",
          }}
        >
          <div
            className="containerSG"
            style={{
              padding: "20px",
              marginTop: "50px",
              display: "revert",
              placecontent: "center",
              overflowY: "none",
              minheight: "80dvh",
              background: "#159957",
              background: "var(--bg-body-gradient)",

              // height: "87vh",
            }}
          >
            <div
              className="form-containerSG"
              style={{
                backdropFilter: "blur(10px)",
                borderRadius: "25px",
                boxShadow: "0 15px 35px rgba(108, 99, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                overflow: "hidden",
                position: "relative",
                height: "80vh", // Set a fixed height for the form container

                minHeight: "350px", // Minimum height
                minWidth: "1000px",
                marginTop: "-10px",
              }}
            >
              <div
                className="form-headerSG"
                style={{
                  padding: "1px",
                  color: "white",
                  textAlign: "center",
                  maxHeight: "500px",
                }}
              >
                <h3 className="performance-heading">Performance Review</h3>
                <p style={{ opacity: 0.9, fontWeight: 500, fontSize: "16px" }}>
                  Navigate and manage employee goals, reviews, and performance
                  records.
                </p>
              </div>
              <br />
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  justifyContent: "space-between",
                  padding: "10px",
                }}
              >
                {/* {filteredAndSearchedMenuItems.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleNavigate(routes[item.name])}
                  >
                    <a href="#">
                      <Button
                        type="submit"
                        className="button11"
                        endIcon={<SendIcon />}
                        style={{
                          backgroundColor: "transparent",
                          color: "white",
                          margin: "0",
                          padding: "4px 8px",
                          borderRadius: "0 8px",
                        }}
                        loading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        {item.name}
                      </Button>{" "}
                    </a>
                  </div>
                ))} */}
              </div>

              <aside id="menu" class="open dark" ref={menuRef}>
                <span class="shine shine-top"></span>
                <span class="shine shine-bottom"></span>
                <span class="glow glow-top"></span>
                <span class="glow glow-bottom"></span>
                <span class="glow glow-bright glow-top "></span>
                <span class="glow glow-bright glow-bottom "></span>
                <div class="inner">
                  {filteredAndSearchedMenuItems.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleNavigate(routes[item.name])}
                    >
                      <a href="#">
                        <Button
                          type="submit"
                          endIcon={<SendIcon />}
                          style={{
                            backgroundColor: "transparent",
                            color: "white",
                            margin: "0",
                            padding: "4px 8px",
                            borderRadius: "0 8px",
                            fontSize: "2rem", // Using rem instead of px to match the font style
                            fontFamily: '"Open Sans",sansserif',
                            fontWeight: 10, // Adding the font weight
                            lineHeight: 1, // Adding the line height
                          }}
                          loading={isSubmitting}
                          disabled={isSubmitting}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "#6C63FF")
                          } // Change to your preferred hover color
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "white")
                          } // Revert to original color
                        >
                          <span
                            style={{
                              // fontFamily: '"Asap", cursive',
                              fontFamily: '"Open Sans",sansserif',
                              fontWeight: 10,
                              fontSize: "2rem",
                              lineHeight: 1,
                            }}
                          >
                            {item.name}
                          </span>
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              </aside>
              <footer className="dark">
                <div style={{ fontSize: "18px", marginLeft: "750px" }}>
                  {/* Pick your own colors! */}
                </div>{" "}
                <div className="color-controls">
                  <div className="color-slider">
                    <br />
                    <label htmlFor="h1">Primary Color:</label>
                    <input
                      type="range"
                      id="h1"
                      min="0"
                      max="360"
                      value={hue1}
                      onChange={(e) => setHue1(parseInt(e.target.value))}
                      style={{
                        background: `linear-gradient(to right,
                hsl(0, 80%, 50%),
                hsl(60, 80%, 50%),
                hsl(120, 80%, 50%),
                hsl(180, 80%, 50%),
                hsl(240, 80%, 50%),
                hsl(300, 80%, 50%),
                hsl(360, 80%, 50%))`,
                      }}
                    />
                    <span>{hue1}°</span>
                  </div>
                  <div className="color-slider">
                    <label htmlFor="h2">Secondary Color:</label>
                    <input
                      type="range"
                      id="h2"
                      min="0"
                      max="360"
                      value={hue2}
                      onChange={(e) => setHue2(parseInt(e.target.value))}
                      style={{
                        background: `linear-gradient(to right,
                hsl(0, 80%, 50%),
                hsl(60, 80%, 50%),
                hsl(120, 80%, 50%),
                hsl(180, 80%, 50%),
                hsl(240, 80%, 50%),
                hsl(300, 80%, 50%),
                hsl(360, 80%, 50%))`,
                      }}
                    />
                    <span>{hue2}°</span>
                  </div>
                </div>
              </footer>
              <div
                style={{
                  content: '""',
                  display: "block",
                  position: "absolute",
                  bottom: "-10px",
                  left: "0",
                  width: "100%",
                  height: "10px",
                  background:
                    "linear-gradient(45deg, transparent 33.333%, #FFF 33.333%, #FFF 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, #FFF 33.333%, #FFF 66.667%, transparent 66.667%)",
                  backgroundSize: "20px 40px",
                  transform: "rotate(180deg)",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default PS;
