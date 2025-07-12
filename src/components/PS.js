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

              <aside id="menu" class="open dark">
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
                          // className="button11"
                          endIcon={<SendIcon />}
                          style={{
                            backgroundColor: "transparent",
                            color: "white",
                            margin: "0",
                            padding: "4px 8px",
                            borderRadius: "0 8px",
                            fontSize: "24px",
                          }}
                          loading={isSubmitting}
                          disabled={isSubmitting}
                        >
                          <span>{item.name}</span>
                        </Button>{" "}
                      </a>
                    </div>
                  ))}
                </div>
              </aside>

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
