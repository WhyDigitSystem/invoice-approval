import React, { useEffect, useState, useRef } from "react";
import {
  getUserBranch,
  getGoalsByUserName,
  getGoalsById,
} from "../services/api";
import { notification, Select, Spin, Table, Modal } from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  PlusCircleOutlined,
  UnorderedListOutlined,
  CheckCircleOutlined,
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
// import "./PartyMasterUpdate.css";
// import "./AddExpense.css";
import Nobills from "../Nobills.jpg";
import rewindbutton from ".././rewindbutton.png";
import { useNavigate } from "react-router-dom";
import ButtonTrans from "./ButtonTrans";
import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SaveIcon from "@mui/icons-material/Save";
// import "./Ticket.css";
import "./PerformanceGoals.css";

const { Option } = Select;
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8091";

const PerformanceGoals = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [partyNames, setPartyNames] = useState([]);
  const [selectedPartyName, setSelectedPartyName] = useState("");
  const createdBy = localStorage.getItem("userName");
  const [ptype, setPtype] = useState("");

  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const [preGoalId, setPreGoalId] = useState(null);

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

  const [rows, setRows] = useState([
    {
      id: 1,
      perspective: "",
      objective: "",
      assignedPercentage: "",
      measurement: "",
      quarterlyTarget: "",
      performance: "",
    },
  ]);

  const [viewMode, setViewMode] = useState("form");
  const [preGoalsData, setPreGoalsData] = useState([]);
  const [deletedRowIds, setDeletedRowIds] = useState([]);
  const [preGoalsList, setPreGoalsList] = useState([]);
  const [editingData, setEditingData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [appraiseeDetailsData, setAppraiseeDetailsData] = useState([]);
  const [appraiseeDetailsErrors, setAppraiseeDetailsErrors] = useState([]);
  const [goalsData, setGoalsData] = useState([]);

  const [activeInput, setActiveInput] = useState(null);

  // Add these to your component
  const handleFocus = (columnName) => {
    setActiveInput(columnName);
  };

  const handleBlur = () => {
    setActiveInput(null);
  };

  // Update addRow to include all fields
  const addRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        id: Date.now() + Math.floor(Math.random() * 1000),
        perspective: "",
        objective: "",
        assignedPercentage: "",
        measurement: "",
        quarterlyTarget: "",
        performance: "",
      },
    ]);
  };

  const deleteRow = (idToDelete) => {
    setRows((prevRows) => {
      if (preGoalId) {
        return prevRows.map((row) =>
          row.id === idToDelete ? { ...row, _markedForDeletion: true } : row
        );
      } else {
        if (prevRows.length <= 1) {
          return [{ id: prevRows[0].id, area: "", goal: "" }];
        }
        return prevRows.filter((row) => row.id !== idToDelete);
      }
    });
  };

  const handleDeleteRow = (rowId) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== rowId));
    if (rowId > 0) {
      setDeletedRowIds((prev) => [...prev, rowId]);
    }
  };

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();

    const isValid = rows.every(
      (row) => !row._markedForDeletion && row.perspective && row.objective
    );
    if (!isValid) {
      notification.error({
        message: "Validation Error",
        description: "Please fill all required fields (Area and Goals).",
        duration: 3,
      });
      return;
    }

    const isUpdate = preGoalId !== null;

    const payload = {
      apprisalYear: new Date().getFullYear().toString(),
      empCode: localStorage.getItem("userName"),
      empName: localStorage.getItem("nickName"),
      createdBy: localStorage.getItem("userName"),
      preGoalsDtlDTO: rows
        .filter((row) => !row._markedForDeletion)
        .map((row) => ({
          id: row.id || 0,
          perspective: row.perspective,
          objective: row.objective,
          assignedPercentage: row.assignedPercentage,
          measurement: row.measurement,
          quarterlyTarget: row.quarterlyTarget,
          performance: row.performance,
        })),
      ...(isUpdate && { id: preGoalId }),
    };

    try {
      const response = await axios.put(
        `${API_URL}/api/pregoals/createPreGoal`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        notification.success({
          message: "Success",
          description: `Goals ${isUpdate ? "updated" : "saved"} successfully!`,
          duration: 3,
        });

        handleCelebrate();
        setRows([{ id: 0, area: "", goal: "" }]);
        setPreGoalId(null);
        setEditId("");
        fetchPreGoals();
        setIsModalVisible(true);
      } else {
        notification.error({
          message: "Save Failed",
          description: "Failed to save goals.",
          duration: 3,
        });
      }
    } catch (error) {
      console.error("Error saving goals:", error);
      notification.error({
        message: "Error",
        description: "An error occurred while saving the goals.",
        duration: 3,
      });
    }
  };

  const handleInputChange = (id, key, value) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [key]: value } : row))
    );
  };

  const handleEdit = (goal) => {
    setPreGoalId(goal.gst_pregoalsid);
    setRows(goal.rows);
  };

  const themeConfig =
    theme === "dark"
      ? {
          token: {
            colorPrimary: "#6C63FF",
            colorTextBase: "#FFFFFF",
            colorLink: "#40a9ff",
          },
        }
      : {
          token: {
            colorPrimary: "#6C63FF",
            colorTextBase: "#32325D",
            colorLink: "#6C63FF",
          },
        };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    if (theme === "dark") {
      document.body.style.backgroundColor = "#1A1A2E";
      document.body.style.color = "#FFFFFF";
    } else {
      document.body.style.backgroundColor = "#F9FAFE";
      document.body.style.color = "#32325D";
    }
  }, [theme]);

  const fetchPreGoals = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/pregoals/getPreGoals?userName=${localStorage.getItem(
          "userName"
        )}`
      );
      if (
        response.data &&
        response.data.paramObjectsMap &&
        response.data.paramObjectsMap.getPreGoals
      ) {
        setPreGoalsData(response.data.paramObjectsMap.getPreGoals);
      }
    } catch (error) {
      console.error("Error fetching pre-goals:", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch pre-goals data",
      });
    }
  };

  useEffect(() => {
    getUserBranch()
      .then((response) => {
        setBranchNames(response);
      })
      .catch((error) => {
        notification.error({
          message: "Failed to fetch Branches",
          description: "Error occurred while fetching branch names.",
        });
      });

    fetchPreGoals();
  }, []);

  const fireConfetti = (particleRatio, opts) => {
    confetti(
      Object.assign({}, opts, {
        particleCount: Math.floor(100 * particleRatio),
      })
    );
  };

  const startConfetti = () => {
    setStatus("loading");
    if (textRef.current) {
      textRef.current.textContent = "";
      textRef.current.className = "text hidden";
    }

    if (iconRef.current) {
      iconRef.current.className = "fa-solid fa-spinner animate-spin";
    }

    if (buttonRef.current) {
      buttonRef.current.className = "loading";
    }

    setTimeout(() => {
      if (iconRef.current) {
        iconRef.current.className = "";
      }

      if (buttonRef.current) {
        buttonRef.current.className = "success";
      }

      fireConfetti(0.25, {
        spread: 26,
        startVelocity: 10,
        colors: ["#6C63FF", "#42EADD", "#FF6584"],
      });

      fireConfetti(0.2, {
        spread: 60,
        startVelocity: 20,
        colors: ["#6C63FF", "#42EADD", "#FF6584"],
      });

      fireConfetti(0.35, {
        spread: 100,
        startVelocity: 15,
        decay: 0.91,
        colors: ["#6C63FF", "#42EADD", "#FF6584"],
      });

      fireConfetti(0.1, {
        spread: 120,
        startVelocity: 10,
        decay: 0.92,
        colors: ["#6C63FF", "#42EADD", "#FF6584"],
      });

      fireConfetti(0.1, {
        spread: 120,
        startVelocity: 20,
        colors: ["#6C63FF", "#42EADD", "#FF6584"],
      });
    }, 300);

    setTimeout(() => {
      if (textRef.current) {
        textRef.current.textContent = "";
        textRef.current.className = "text";
      }

      if (iconRef.current) {
        iconRef.current.className = "fa-solid fa-check";
      }
    }, 2000);

    setTimeout(() => {
      if (textRef.current) {
        textRef.current.textContent = "";
      }

      if (iconRef.current) {
        iconRef.current.className = "fa-solid fa-play";
      }

      if (buttonRef.current) {
        buttonRef.current.className = "";
      }

      setStatus("idle");
    }, 2000);
  };

  const handleCelebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleButtonClick = (e) => {
    handleSubmit(e);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "form" ? "list" : "form");
  };

  const handleRowClick = async (id) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/pregoals/getPreGoalsDetails?id=${id}`
      );

      if (response.data?.paramObjectsMap?.getPreGoalsDetails) {
        const goalsData = response.data.paramObjectsMap.getPreGoalsDetails;

        setPreGoalId(id);
        setEditId(id);

        const formattedRows = goalsData.map((goal) => ({
          id:
            goal.gst_pregoalsdtlid ||
            Date.now() + Math.floor(Math.random() * 1000),
          area: goal.area,
          goal: goal.goal,
        }));

        setRows(formattedRows);
        setViewMode("form");
        setEditId(id);
      }
    } catch (error) {
      console.error("Error fetching goal details:", error);
      notification.error({
        message: "Error",
        description: "Failed to load goal details",
      });
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "gst_pregoalsid",
      key: "gst_pregoalsid",
      onCell: (record) => ({
        onClick: () => handleRowClick(record.gst_pregoalsid),
      }),
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Employee Name",
      dataIndex: "empname",
      key: "empname",
      onCell: (record) => ({
        onClick: () => handleRowClick(record.gst_pregoalsid),
      }),
    },
    {
      title: "Employee Code",
      dataIndex: "empcode",
      key: "empcode",
      onCell: (record) => ({
        onClick: () => handleRowClick(record.gst_pregoalsid),
      }),
    },
    {
      title: "Appraisal Year",
      dataIndex: "appraisalYear",
      key: "appraisalYear",
      onCell: (record) => ({
        onClick: () => handleRowClick(record.gst_pregoalsid),
      }),
    },
  ];

  return (
    <ConfigProvider theme={themeConfig}>
      <div
        className="containerSG"
        style={{ padding: "20px", marginTop: "25px" }}
      >
        <div
          className="form-containerSG"
          style={{
            background:
              theme === "dark"
                ? "rgba(26, 26, 46, 0.7)"
                : "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(10px)",
            borderRadius: "24px",
            boxShadow: "0 15px 35px rgba(108, 99, 255, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            className="form-headerSG"
            style={{
              background: "linear-gradient(135deg, #6C63FF 0%, #42EADD 100%)",
              // background: "linear-gradient(135deg, #4A148C, #6200EA)",
              padding: "1px",
              color: "white",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                fontWeight: 300,
                marginBottom: "10px",
                fontSize: "28px",
                color: "white",
              }}
            >
              Performance Goals
            </h3>
            <p style={{ opacity: 0.9, fontWeight: 300, fontSize: "16px" }}>
              Set your performance goals for the upcoming appraisal period.
            </p>
          </div>

          <div style={{ padding: "40px" }}>
            {viewMode === "form" ? (
              <form onSubmit={handleSubmit}>
                <div
                  className="form-group"
                  style={{ marginBottom: "25px", display: "flex", gap: "20px" }}
                >
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: 500,
                      }}
                    >
                      Employee
                    </label>
                    <Input
                      value={localStorage.getItem("nickName")}
                      readOnly
                      style={{
                        width: "50%",
                        padding: "8px 8px",
                        borderRadius: "12px",
                        border: "1px solid #ADB5BD",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: 500,
                        marginLeft: "-220px",
                      }}
                    >
                      Code
                    </label>
                    <Input
                      value={localStorage.getItem("userName")}
                      readOnly
                      style={{
                        width: "50%",
                        // padding: "12px 15px",
                        padding: "8px 8px",
                        borderRadius: "12px",
                        border: "1px solid #ADB5BD",
                        marginLeft: "-220px",
                      }}
                    />
                  </div>
                </div>

                {/* <div
                  className="form-groupSG"
                  style={{
                    marginTop: "20px",
                    fontSize: "14px",
                    color: "#d32f2f",
                    backgroundColor: "#fff3f3",
                    padding: "10px",
                    borderRadius: "6px",
                  }}
                >
                  <strong>Area:</strong> BO - Business Operation, VC - Value
                  Creation, PE - People Engagement
                </div> */}

                <div
                  className="form-groupSG"
                  style={{
                    marginTop: "30px",
                    background:
                      theme === "dark"
                        ? "rgba(108, 99, 255, 0.1)"
                        : "rgba(108, 99, 255, 0.05)",
                    borderRadius: "15px",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <h3
                      style={{
                        color: theme === "dark" ? "#FFFFFF" : "#32325D",
                        fontSize: "24px",
                      }}
                    >
                      Goals
                    </h3>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={addRow}
                      style={{
                        background:
                          "linear-gradient(135deg, #6C63FF 0%, #42EADD 100%)",
                        border: "none",
                      }}
                    >
                      Add
                    </Button>
                  </div>

                  <div
                    style={{
                      width: "110%",
                      overflowX: "auto",
                      fontSize: "10px",
                      marginLeft: "-50px",
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                      }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              padding: "12px",
                              textAlign: "left",
                              backgroundColor: "#6C63FF",
                              color: "white",
                              borderRadius: "8px 0 0 0",
                            }}
                          >
                            #
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              textAlign: "left",
                              backgroundColor: "#6C63FF",
                              color: "white",
                              borderRadius: "0 8px 0 0",
                            }}
                          >
                            Prespective
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              textAlign: "left",
                              backgroundColor: "#6C63FF",
                              color: "white",
                              borderRadius: "0 8px 0 0",
                            }}
                          >
                            Objective Description
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              textAlign: "left",
                              backgroundColor: "#6C63FF",
                              color: "white",
                              borderRadius: "0 8px 0 0",
                              whiteSpace: "normal",
                            }}
                          >
                            % Assigned
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              textAlign: "left",
                              backgroundColor: "#6C63FF",
                              color: "white",
                              borderRadius: "0 8px 0 0",
                            }}
                          >
                            Measurement
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              textAlign: "left",
                              backgroundColor: "#6C63FF",
                              color: "white",
                              borderRadius: "0 8px 0 0",
                            }}
                          >
                            Quarterly Target
                          </th>

                          <th
                            style={{
                              padding: "12px",
                              textAlign: "left",
                              backgroundColor: "#6C63FF",
                              color: "white",
                              borderRadius: "0 8px 0 0",
                            }}
                          >
                            Perfomance
                          </th>
                          <th
                            style={{
                              padding: "12px",
                              textAlign: "center",
                              backgroundColor: "#6C63FF",
                              color: "white",
                              borderRadius: "0 8px 0 0",
                            }}
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, index) => (
                          <tr
                            key={`row-${index}-${row.id}`}
                            style={{
                              borderBottom: `1px solid ${
                                theme === "dark"
                                  ? "rgba(85, 85, 85, 0.3)"
                                  : "rgba(238, 238, 238, 0.3)"
                              }`,
                              backgroundColor:
                                theme === "dark"
                                  ? "rgba(26, 26, 46, 0.5)"
                                  : "rgba(255, 255, 255, 0.5)",
                              backdropFilter: "blur(5px)",
                            }}
                          >
                            <td
                              style={{ padding: "12px", textAlign: "center" }}
                            >
                              {index + 1}
                            </td>
                            <td style={{ padding: "12px", width: "200px" }}>
                              {" "}
                              {/* Fixed width for the cell */}
                              <Select
                                style={{ width: "100%" }}
                                value={row.area}
                                onChange={(value) =>
                                  handleInputChange(row.id, "area", value)
                                }
                                dropdownStyle={{ minWidth: "850px" }} // Wider dropdown
                                optionLabelProp="label" // Show short value in select box
                              >
                                <Option
                                  value="Financial"
                                  label="Financial"
                                  title="Focuses on profitability, cost management, and financial growth"
                                >
                                  Focuses on profitability, cost management, and
                                  financial growth
                                </Option>
                                <Option
                                  value="customer"
                                  label="Customer"
                                  title="Measures customer satisfaction, retention, and service quality"
                                >
                                  Measures customer satisfaction, retention, and
                                  service quality
                                </Option>
                                <Option
                                  value="Internal Processes"
                                  label="Internal Processes"
                                  title="Looks at internal operations and processes that drive business performance, areas of improvement to increase efficiency"
                                >
                                  Looks at internal operations and processes
                                  that drive business performance, areas of
                                  improvement to increase efficiency
                                </Option>
                                <Option
                                  value="Learning & Growth"
                                  label="Learning & Growth"
                                  title="Assesses personal / team training and growth, and capacity for innovation"
                                >
                                  Assesses personal / team training and growth,
                                  and capacity for innovation
                                </Option>
                              </Select>
                            </td>
                            <td style={{ padding: "12px", minWidth: "350px" }}>
                              <Input
                                placeholder="Enter objective"
                                value={row.objective}
                                onChange={(e) =>
                                  handleInputChange(
                                    row.id,
                                    "objective",
                                    e.target.value
                                  )
                                }
                                style={{
                                  border: `1px solid ${
                                    theme === "dark" ? "#555" : "#d9d9d9"
                                  }`,
                                  borderRadius: "8px",
                                }}
                              />
                            </td>
                            <td style={{ padding: "12px" }}>
                              <Input
                                placeholder="%"
                                value={row.assignedPercentage}
                                onChange={(e) =>
                                  handleInputChange(
                                    row.id,
                                    "assignedPercentage",
                                    e.target.value
                                  )
                                }
                                style={{
                                  border: `1px solid ${
                                    theme === "dark" ? "#555" : "#d9d9d9"
                                  }`,
                                  borderRadius: "8px",
                                }}
                              />
                            </td>
                            <td style={{ padding: "12px" }}>
                              <Input
                                placeholder="Measurement"
                                value={row.measurement}
                                onChange={(e) =>
                                  handleInputChange(
                                    row.id,
                                    "measurement",
                                    e.target.value
                                  )
                                }
                                style={{
                                  border: `1px solid ${
                                    theme === "dark" ? "#555" : "#d9d9d9"
                                  }`,
                                  borderRadius: "8px",
                                }}
                              />
                            </td>
                            <td style={{ padding: "12px" }}>
                              <Input
                                placeholder="Target"
                                value={row.quarterlyTarget}
                                onChange={(e) =>
                                  handleInputChange(
                                    row.id,
                                    "quarterlyTarget",
                                    e.target.value
                                  )
                                }
                                style={{
                                  border: `1px solid ${
                                    theme === "dark" ? "#555" : "#d9d9d9"
                                  }`,
                                  borderRadius: "8px",
                                }}
                              />
                            </td>
                            <td style={{ padding: "12px" }}>
                              <Input
                                placeholder="Performance"
                                value={row.performance}
                                onChange={(e) =>
                                  handleInputChange(
                                    row.id,
                                    "performance",
                                    e.target.value
                                  )
                                }
                                style={{
                                  border: `1px solid ${
                                    theme === "dark" ? "#555" : "#d9d9d9"
                                  }`,
                                  borderRadius: "8px",
                                }}
                              />
                            </td>
                            <td
                              style={{ padding: "12px", textAlign: "center" }}
                            >
                              <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleDeleteRow(row.id)}
                                size="small"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div
                  className="form-buttons"
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "15px",
                    marginTop: "30px",
                  }}
                >
                  <Button
                    onClick={() => {
                      setRows([{ id: Date.now(), area: "", goal: "" }]);
                      setPreGoalId(null);
                    }}
                    style={{
                      padding: "12px 25px",
                      borderRadius: "12px",
                      border: "1px solid #ADB5BD",
                      background: "transparent",
                      color: theme === "dark" ? "#FFFFFF" : "#32325D",
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    type="primary"
                    onClick={handleButtonClick}
                    style={{
                      padding: "12px 25px",
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, #6C63FF 0%, #42EADD 100%)",
                      border: "none",
                      color: "white",
                    }}
                  >
                    {rows.some((row) => row.id && typeof row.id > 0)
                      ? "Update"
                      : "Submit"}
                  </Button>
                </div>
              </form>
            ) : (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <h2
                    style={{ color: theme === "dark" ? "#FFFFFF" : "#32325D" }}
                  >
                    Your Performance Goals
                  </h2>
                  <Button
                    type="primary"
                    onClick={toggleViewMode}
                    style={{
                      background:
                        "linear-gradient(135deg, #6C63FF 0%, #42EADD 100%)",
                      border: "none",
                    }}
                  >
                    Create New Goal
                  </Button>
                </div>
                <Table
                  columns={columns}
                  dataSource={preGoalsData}
                  rowKey="gst_pregoalsid"
                  pagination={{ pageSize: 10 }}
                  style={{
                    width: "100%",
                    overflow: "hidden",
                  }}
                  onRow={(record) => ({
                    onClick: () => handleRowClick(record.gst_pregoalsid),
                    style: { cursor: "pointer" },
                  })}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        width={400}
        bodyStyle={{
          textAlign: "center",
          padding: "30px",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.25)", // Semi-transparent white
          backdropFilter: "blur(10px)", // Blur effect
          border: "1px solid rgba(255, 255, 255, 0.18)", // Light border
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", // Soft shadow
        }}
      >
        <CheckCircleOutlined
          style={{
            fontSize: "60px",
            color: "#2ED573",
            marginBottom: "20px",
          }}
        />
        <h2 style={{ marginBottom: "15px", color: "#32325D" }}>Thank You!</h2>
        <p style={{ marginBottom: "20px", color: "#ADB5BD" }}>
          Your goals have been submitted successfully.
        </p>
        <Button
          type="primary"
          onClick={() => setIsModalVisible(false)}
          style={{
            padding: "12px 25px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #6C63FF 0%, #42EADD 100%)",
            border: "none",
            color: "white",
          }}
        >
          Close
        </Button>
      </Modal>
    </ConfigProvider>
  );
};

export default PerformanceGoals;
