import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Table,
  Button,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Modal,
  Upload,
  Switch,
  notification,
  Spin,
  ConfigProvider,
  Divider,
  Form,
} from "antd";
import {
  ApartmentOutlined,
  UserOutlined,
  IdcardOutlined,
  CalendarOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  SearchOutlined,
  DownloadOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { debounce } from "lodash";
import confetti from "canvas-confetti";
import { getUserBranch } from "../services/api";

const { Option } = Select;
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8091";

const PurchaseOrder = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("form");
  const [searchText, setSearchText] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const [preGoalsData, setPreGoalsData] = useState([]);
  const [deletedRowIds, setDeletedRowIds] = useState([]);
  const [preGoalsList, setPreGoalsList] = useState([]);
  const [editingData, setEditingData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [appraiseeDetailsData, setAppraiseeDetailsData] = useState([]);
  const [appraiseeDetailsErrors, setAppraiseeDetailsErrors] = useState([]);

  const [activeInput, setActiveInput] = useState(null);
  const [showControls, setShowControls] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  const scrollRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const [hoverDirection, setHoverDirection] = useState(null);
  const [performanceGoalMainData, setPerformanceGoalMainData] = useState(null);
  const [performanceGoalsData, setPerformanceGoalsData] = useState([]);
  const tableContainerRef = useRef(null);
  const [editId, setEditId] = useState("");
  const [performanceGoalId, setPerformanceGoalId] = useState(null);
  const [branchNames, setBranchNames] = useState([]); // Initialize as empty array

  const [validationErrors, setValidationErrors] = useState({
    branch: false,
  });

  useEffect(() => {
    getUserBranch()
      .then((response) => {
        setBranchNames(response); // Assuming the API returns a list of branch objects
      })
      .catch((error) => {
        notification.error({
          message: "Failed to fetch Branches",
          description: "Error occurred while fetching branch names.",
        });
      });
  }, []);

  // Sample data for dropdowns
  const branches = ["Mumbai", "Delhi", "Bangalore", "Chennai"];
  const vendors = ["Vendor A", "Vendor B", "Vendor C", "Vendor D"];
  const itemsList = ["Item 1", "Item 2", "Item 3", "Item 4"];
  const currencies = ["INR", "USD", "EUR", "GBP"];

  const [rows, setRows] = useState([
    {
      id: 1,
      perspective: "",
      objectivedesc: "",
      perassigned: "",
      measurement: "",
      qtrtarget: "",
      performance: "",
      comments: "",
      selfrating: "",
      appraiserrating: "",
    },
  ]);

  const handleCelebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const addRow = () => {
    const newRow = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      perspective: "",
      objective: "",
      assignedPercentage: "",
      measurement: "",
      quarterlyTarget: "",
      performance: "",
      comments: "",
      performanceself: "",
      selfrating: "",
      appraiserrating: "",
      apprjustification: "",
    };

    setRows((prevRows) => [...prevRows, newRow]);

    setTimeout(() => {
      const container = document.querySelector(".table-container");
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 0);
  };

  const debouncedSubmit = useCallback(
    debounce((e) => handleSubmit(e), 1000, { leading: true, trailing: false }),
    [rows, performanceGoalId]
  );

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    if (isSubmitting) return;

    // Then check if all rows have required fields
    const isValid = rows.every(
      (row) => !row._markedForDeletion && row.perspective && row.objectivedesc
    );

    if (!isValid) {
      notification.error({
        message: "Validation Error",
        description:
          "Please fill all required fields (Perspective and Objective).",
        duration: 3,
      });
      setIsSubmitting(false);
      return;
    }

    // Rest of your submit logic...
    const isUpdate = performanceGoalId !== null;

    const payload = {
      apprisalYear:
        performanceGoalMainData?.appraisalYear ||
        new Date().getFullYear().toString(),
      empCode:
        performanceGoalMainData?.empcode || localStorage.getItem("userName"),
      empName:
        performanceGoalMainData?.empname || localStorage.getItem("nickName"),
      createdBy: localStorage.getItem("userName"),
      pmonth: performanceGoalMainData?.pmonth || currentMonthYear(),
      performanceGoalsDtlDTO: rows
        .filter((row) => !row._markedForDeletion)
        .map((row) => ({
          id: row.id || 0,
          perspective: row.perspective,
          objectivedesc: row.objectivedesc,
          perassigned: row.perassigned,
          measurement: row.measurement,
          qtrtarget: row.qtrtarget,
          performance: row.performance,
          comments: row.comments,
          performanceself: row.performanceself,
          selfrating: row.selfrating,
        })),
      ...(isUpdate && { id: performanceGoalId }),
    };

    try {
      const response = await axios.put(
        `${API_URL}/api/performancegoals/createPerformanceGoal`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        notification.success({
          message: "Success",
          description: `Goals ${isUpdate ? "updated" : "saved"} successfully!`,
          duration: 3,
        });

        handleCelebrate();

        setRows([
          {
            id: Date.now(),
            perspective: "",
            objectivedesc: "",
            perassigned: "",
            measurement: "",
            qtrtarget: "",
            performance: "",
            comments: "",
            performanceself: "",
            selfrating: "",
            appraiserrating: "",
            apprjustification: "",
          },
        ]);

        // setPerformanceGoalId(null);
        setEditId("");
        // fetchPerformanceGoals();
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleButtonClick = (e) => {
    debouncedSubmit(e);
  };

  const currentMonthYear = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    return `${month}/${year}`;
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "form" ? "list" : "form");
  };
  // Form state
  const [formData, setFormData] = useState({
    branch: "",
    vendorname: "",
    vendoraddress: "",
    partygstin: "",
    shippingplace: "",
    addresstype: "",
    shippingaddress: "",
    poid: "",
    podate: moment(),
    quoterefno: "",
    billcurr: "INR",
    billingstate: "",
    gstin: "",
    remarks: "",
    status: "pending",
    approvedby: "",
    terms: "",
  });

  const handleDeleteRow = (rowId) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== rowId));
    if (rowId > 0) {
      setDeletedRowIds((prev) => [...prev, rowId]);
    }
  };

  const handleRowClick = async (id) => {
    try {
      // First find the main record from performanceGoalsData
      const mainRecord = performanceGoalsData.find(
        (goal) => goal.gst_performancegoalsid === id
      );

      if (mainRecord) {
        setPerformanceGoalMainData(mainRecord);
        setPerformanceGoalId(id);
        setEditId(id);
      }

      // Then fetch the details
      const response = await axios.get(
        `${API_URL}/api/performancegoals/getPerformanceGoalsDetails?id=${id}`
      );

      if (response.data?.paramObjectsMap?.getPerformanceGoalsDetails) {
        const goalsData =
          response.data.paramObjectsMap.getPerformanceGoalsDetails;

        const formattedRows = goalsData.map((goal) => ({
          id:
            goal.gst_performancegoalsid ||
            Date.now() + Math.floor(Math.random() * 1000),
          perspective: goal.perspective,
          objectivedesc: goal.objectivedesc,
          perassigned: goal.perassigned,
          measurement: goal.measurement,
          qtrtarget: goal.qtrtarget,
          performance: goal.performance,
          comments: goal.comments,
          performanceself: goal.performanceself,
          selfrating: goal.selfrating,
          appraiserrating: goal.appraiserrating,
          apprjustification: goal.apprjustification,
          pmonth: mainRecord ? mainRecord.pmonth : currentMonthYear(),
        }));

        setRows(formattedRows);
        setViewMode("form");
      }
    } catch (error) {
      console.error("Error fetching goal details:", error);
      notification.error({
        message: "Error",
        description: "Failed to load goal details",
      });
    }
  };

  // Items state
  const [items, setItems] = useState([
    {
      id: 1,
      item: "",
      description: "",
      qty: 1,
      basecurr: "INR",
      exrate: 1,
      unitprice: 0,
      total: 0,
      lcamount: 0,
    },
  ]);

  const themeConfig = {
    token: {
      colorPrimary: theme === "dark" ? "#6C63FF" : "#1890ff",
    },
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

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        item: "",
        description: "",
        qty: 1,
        basecurr: "INR",
        exrate: 1,
        unitprice: 0,
        total: 0,
        lcamount: 0,
      },
    ]);
  };

  const deleteItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const calculateTotals = () => {
    return items.reduce(
      (acc, item) => {
        acc.total += item.total || 0;
        acc.lcamount += item.lcamount || 0;
        return acc;
      },
      { total: 0, lcamount: 0 }
    );
  };

  const totals = calculateTotals();

  const itemColumns = [
    {
      title: "Item",
      dataIndex: "item",
      key: "item",
      render: (text, record) => (
        <Select
          style={{ width: "100%" }}
          value={text}
          onChange={(value) => handleItemChange(record.id, "item", value)}
        >
          {itemsList.map((item) => (
            <Option key={item} value={item}>
              {item}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) =>
            handleItemChange(record.id, "description", e.target.value)
          }
        />
      ),
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      render: (text, record) => (
        <Input
          type="number"
          value={text}
          onChange={(e) =>
            handleItemChange(record.id, "qty", parseFloat(e.target.value) || 0)
          }
        />
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "unitprice",
      key: "unitprice",
      render: (text, record) => (
        <Input
          type="number"
          value={text}
          onChange={(e) =>
            handleItemChange(
              record.id,
              "unitprice",
              parseFloat(e.target.value) || 0
            )
          }
        />
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text) => text.toFixed(2),
    },
    {
      title: "LC Amount",
      dataIndex: "lcamount",
      key: "lcamount",
      render: (text) => text.toFixed(2),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          icon={<DeleteOutlined />}
          onClick={() => deleteItem(record.id)}
          danger
        />
      ),
    },
  ];

  const handleItemChange = (id, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Recalculate total if qty or unitprice is changed
          if (field === "qty" || field === "unitprice") {
            const qty = Number(updatedItem.qty) || 0;
            const unitprice = Number(updatedItem.unitprice) || 0;
            updatedItem.total = qty * unitprice;
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

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
                height: "80vh",
                minHeight: "350px",
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
                  marginTop: "1px",
                }}
              >
                <h3 className="performance-heading">Purchase Order</h3>
                <p style={{ opacity: 0.9, fontWeight: 500, fontSize: "16px" }}>
                  Create and manage purchase orders
                </p>
              </div>

              <div
                style={{
                  padding: "20px",
                  // height: "calc(100% - 100px)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <div
                  style={{
                    padding: "40px",
                    // height: "calc(100% - 100px)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  {viewMode === "form" ? (
                    <form onSubmit={handleSubmit}>
                      <div
                        style={{
                          display: "flex",
                          // flexWrap: "wrap",
                          gap: "16px 24px",
                          maxWidth: "600px",
                          fontSize: "12px",
                        }}
                      >
                        {/* ===== Row 1 - First 6 Fields ===== */}
                        <div style={{ flex: "0 0 180px" }}>
                          <label style={{ color: "#fff" }}>Branch *</label>
                          <Select
                            style={{
                              width: "100%",
                              height: "24px",
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              border: "1px solid #ADB5BD",
                            }}
                          />
                        </div>

                        <div style={{ flex: "0 0 180px" }}>
                          <label style={{ color: "#fff" }}>PO ID</label>
                          <Input
                            style={{
                              width: "100%",
                              height: "24px",
                              padding: "0 8px",
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              border: "1px solid #ADB5BD",
                            }}
                          />
                        </div>

                        <div style={{ flex: "0 0 180px" }}>
                          <label style={{ color: "#fff" }}>PO Date</label>
                          <DatePicker
                            style={{
                              width: "100%",
                              height: "24px",
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              border: "1px solid #ADB5BD",
                            }}
                          />
                        </div>

                        <div style={{ flex: "0 0 180px" }}>
                          <label style={{ color: "#fff" }}>Quote Ref No</label>
                          <Input
                            style={{
                              width: "100%",
                              height: "24px",
                              padding: "0 8px",
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              border: "1px solid #ADB5BD",
                            }}
                          />
                        </div>

                        <div style={{ flex: "0 0 180px" }}>
                          <label style={{ color: "#fff" }}>Vendor Name</label>
                          <Input
                            style={{
                              width: "100%",
                              height: "24px",
                              padding: "0 8px",
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              border: "1px solid #ADB5BD",
                            }}
                          />
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          // flexWrap: "wrap",
                          gap: "16px 24px",
                          maxWidth: "600px",
                          fontSize: "12px",
                        }}
                      >
                        {/* ===== Row 1 - First 6 Fields ===== */}

                        <div style={{ flex: "0 0 180px" }}>
                          <label style={{ color: "#fff" }}>Address</label>
                          <Input.TextArea
                            style={{
                              width: "100%",
                              minHeight: "50px",
                              padding: "4px 8px",
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              border: "1px solid #ADB5BD",
                            }}
                          />
                        </div>

                        {/* ===== Row 2 - Your Posted Fields ===== */}
                        <div style={{ flex: "0 0 180px" }}>
                          <label style={{ color: "#fff" }}>Party GSTIN</label>
                          <Input
                            style={{
                              width: "100%",
                              height: "24px",
                              padding: "0 8px",
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              border: "1px solid #ADB5BD",
                            }}
                          />
                        </div>

                        <div style={{ flex: "0 0 180px" }}>
                          <label style={{ color: "#fff" }}>Bill Curr</label>
                          <Select
                            style={{
                              width: "100%",
                              height: "24px",
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              border: "1px solid #ADB5BD",
                            }}
                          />
                        </div>

                        <div style={{ flex: "0 0 180px" }}>
                          <label style={{ color: "#fff" }}>Billing State</label>
                          <Input
                            style={{
                              width: "100%",
                              height: "24px",
                              padding: "0 8px",
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              border: "1px solid #ADB5BD",
                            }}
                          />
                        </div>

                        <div style={{ flex: "0 0 180px" }}>
                          <label style={{ color: "#fff" }}>GSTIN</label>
                          <Input
                            style={{
                              width: "100%",
                              height: "24px",
                              padding: "0 8px",
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              border: "1px solid #ADB5BD",
                            }}
                          />
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          // flexWrap: "wrap",
                          gap: "16px 24px",
                          maxWidth: "600px",
                          fontSize: "12px",
                        }}
                      >
                        {/* ===== Row 1 - First 6 Fields ===== */}

                        <div style={{ flex: "0 0 180px" }}>
                          <label style={{ color: "#fff" }}>
                            Shipping Place
                          </label>
                          <Input
                            style={{
                              width: "100%",
                              height: "24px",
                              padding: "0 8px",
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              border: "1px solid #ADB5BD",
                            }}
                          />
                        </div>

                        <div style={{ flex: "0 0 180px" }}>
                          <label style={{ color: "#fff" }}>Address Type</label>
                          <Input
                            style={{
                              width: "100%",
                              height: "24px",
                              padding: "0 8px",
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              border: "1px solid #ADB5BD",
                            }}
                          />
                        </div>

                        <div style={{ flex: "0 0 180px" }}>
                          <label style={{ color: "#fff" }}>
                            Shipping Address
                          </label>
                          <Input.TextArea
                            style={{
                              width: "100%",
                              minHeight: "50px",
                              padding: "4px 8px",
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              border: "1px solid #ADB5BD",
                            }}
                          />
                        </div>
                      </div>

                      {/* Items Table */}
                      <div
                        style={{
                          marginTop: "-20px",

                          width: "calc(100% - 540px)",
                        }}
                      >
                        <Divider orientation="left" style={{ color: "white" }}>
                          Items
                        </Divider>

                        <div
                          className="table-container"
                          style={{
                            position: "relative",
                            width: "100%",
                            overflowX: "auto",
                            backgroundColor: "transparent",
                            maxHeight: "400px",
                            overflowY: "auto",
                            marginTop: "10px",
                          }}
                        >
                          <table
                            style={{
                              width: "max-content",
                              minWidth: "100%",
                              borderCollapse: "collapse",
                              backgroundColor: "transparent",
                            }}
                          >
                            <colgroup>
                              <col
                                style={{
                                  width: "40px",
                                  height: "24px",
                                }}
                              />
                              <col style={{ width: "150px" }} />
                              <col style={{ width: "250px" }} />
                              <col style={{ width: "80px" }} />
                              <col style={{ width: "100px" }} />
                              <col style={{ width: "100px" }} />
                              <col style={{ width: "100px" }} />
                              <col style={{ width: "100px" }} />
                              <col style={{ width: "60px" }} />
                            </colgroup>
                            <thead>
                              <tr style={{ borderBottom: "1px dashed white" }}>
                                <th
                                  style={{
                                    padding: "8px",
                                    textAlign: "center",
                                    color: "white",
                                  }}
                                >
                                  #
                                </th>
                                <th
                                  style={{
                                    padding: "8px",
                                    textAlign: "left",
                                    color: "white",
                                  }}
                                >
                                  Item
                                </th>
                                <th
                                  style={{
                                    padding: "8px",
                                    textAlign: "left",
                                    color: "white",
                                  }}
                                >
                                  Description
                                </th>
                                <th
                                  style={{
                                    padding: "8px",
                                    textAlign: "left",
                                    color: "white",
                                  }}
                                >
                                  Qty
                                </th>
                                <th
                                  style={{
                                    padding: "8px",
                                    textAlign: "left",
                                    color: "white",
                                  }}
                                >
                                  Currency
                                </th>
                                <th
                                  style={{
                                    padding: "8px",
                                    textAlign: "left",
                                    color: "white",
                                  }}
                                >
                                  ExRate
                                </th>
                                <th
                                  style={{
                                    padding: "8px",
                                    textAlign: "left",
                                    color: "white",
                                  }}
                                >
                                  Unit Price
                                </th>
                                <th
                                  style={{
                                    padding: "8px",
                                    textAlign: "left",
                                    color: "white",
                                  }}
                                >
                                  Total
                                </th>
                                {/* <th
                                  style={{
                                    padding: "8px",
                                    textAlign: "left",
                                    color: "white",
                                  }}
                                >
                                  LC Amount
                                </th> */}
                                <th
                                  style={{
                                    padding: "8px",
                                    textAlign: "center",
                                    color: "white",
                                  }}
                                >
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {items.map((item, index) => (
                                <tr
                                  key={item.id}
                                  style={{
                                    borderBottom: "1px dashed white",
                                    color: "white",
                                  }}
                                >
                                  <td
                                    style={{
                                      padding: "8px",
                                      textAlign: "center",
                                    }}
                                  >
                                    {index + 1}
                                  </td>
                                  <td style={{ padding: "8px" }}>
                                    <Input
                                      value={item.item}
                                      onChange={(e) =>
                                        handleItemChange(
                                          item.id,
                                          "item",
                                          e.target.value
                                        )
                                      }
                                      style={{
                                        backgroundColor: "transparent",
                                        color: "white",
                                        border: "1px solid white",
                                      }}
                                    />
                                  </td>
                                  <td style={{ padding: "8px" }}>
                                    <Input
                                      value={item.description}
                                      onChange={(e) =>
                                        handleItemChange(
                                          item.id,
                                          "description",
                                          e.target.value
                                        )
                                      }
                                      style={{
                                        backgroundColor: "transparent",
                                        color: "white",
                                        border: "1px solid white",
                                      }}
                                    />
                                  </td>
                                  <td
                                    className="white-input"
                                    style={{ padding: "8px" }}
                                  >
                                    <InputNumber
                                      value={item.qty}
                                      onChange={(value) =>
                                        handleItemChange(item.id, "qty", value)
                                      }
                                      style={{
                                        width: "100%",
                                        backgroundColor: "transparent",
                                        color: "white",
                                        border: "1px solid white",
                                      }}
                                    />
                                  </td>
                                  <td style={{ padding: "8px" }}>
                                    <Select
                                      value={item.basecurr}
                                      onChange={(value) =>
                                        handleItemChange(
                                          item.id,
                                          "basecurr",
                                          value
                                        )
                                      }
                                      style={{
                                        width: "100%",
                                        backgroundColor: "transparent",
                                        color: "white",
                                        border: "1px solid white",
                                      }}
                                      dropdownStyle={{
                                        backgroundColor: "#333",
                                        color: "white",
                                      }}
                                    >
                                      <Option value="INR">INR</Option>
                                      {/* Add other currency options if needed */}
                                    </Select>
                                  </td>
                                  <td
                                    className="white-input"
                                    style={{ padding: "8px" }}
                                  >
                                    <InputNumber
                                      value={item.exrate}
                                      onChange={(value) =>
                                        handleItemChange(
                                          item.id,
                                          "exrate",
                                          value
                                        )
                                      }
                                      style={{
                                        width: "100%",
                                        backgroundColor: "transparent",
                                        color: "white",
                                        border: "1px solid white",
                                      }}
                                    />
                                  </td>
                                  <td
                                    className="white-input"
                                    style={{ padding: "8px" }}
                                  >
                                    <InputNumber
                                      value={item.unitprice}
                                      onChange={(value) =>
                                        handleItemChange(
                                          item.id,
                                          "unitprice",
                                          value
                                        )
                                      }
                                      style={{
                                        width: "100%",
                                        backgroundColor: "transparent",
                                        color: "white",
                                        border: "1px solid white",
                                      }}
                                    />
                                  </td>
                                  <td
                                    style={{
                                      padding: "8px",
                                      textAlign: "right",
                                    }}
                                  >
                                    {(item.qty * item.unitprice).toFixed(2)}
                                  </td>
                                  {/* <td style={{ padding: "8px" }}>
                                    <InputNumber
                                      disabled={readOnly}
                                      value={item.lcamount}
                                      onChange={(value) =>
                                        handleItemChange(
                                          item.id,
                                          "lcamount",
                                          value
                                        )
                                      }
                                      style={{
                                        width: "100%",
                                        backgroundColor: readOnly
                                          ? "rgba(255,255,255,0.1)"
                                          : "transparent",
                                        color: "white",
                                        border: "1px solid white",
                                        cursor: readOnly
                                          ? "not-allowed"
                                          : "text",
                                      }}
                                    />
                                  </td> */}
                                  <td
                                    style={{
                                      padding: "8px",
                                      textAlign: "center",
                                    }}
                                  >
                                    <Button
                                      type="text"
                                      icon={<DeleteOutlined />}
                                      onClick={() => handleDeleteRow(item.id)}
                                      style={{ color: "white" }}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={addItem}
                          style={{ marginTop: "16px" }}
                        >
                          Add Item
                        </Button>
                      </div>

                      {/* Submit Button */}
                      <div style={{ textAlign: "right", marginTop: "20px" }}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          style={{ marginRight: "10px" }}
                        >
                          Save Purchase Order
                        </Button>
                        <Button onClick={() => navigate("/PS")}>Back</Button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      {/* List View */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          marginBottom: "20px",
                        }}
                      >
                        <Button
                          //   icon={<FormOutlined />}
                          onClick={toggleViewMode}
                          style={{
                            backgroundColor: "transparent",
                            color: "white",
                          }}
                        >
                          Switch to Form View
                        </Button>
                      </div>

                      <div
                        className="table-container"
                        style={{ width: "100%", overflowX: "auto" }}
                      >
                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            color: "white",
                          }}
                        >
                          <thead>
                            <tr style={{ borderBottom: "1px dashed white" }}>
                              <th
                                style={{ padding: "12px", textAlign: "center" }}
                              >
                                #
                              </th>
                              <th
                                style={{ padding: "12px", textAlign: "left" }}
                              >
                                Branch
                              </th>
                              <th
                                style={{ padding: "12px", textAlign: "left" }}
                              >
                                Vendor Name
                              </th>
                              <th
                                style={{ padding: "12px", textAlign: "left" }}
                              >
                                PO ID
                              </th>
                              <th
                                style={{ padding: "12px", textAlign: "left" }}
                              >
                                PO Date
                              </th>
                              <th
                                style={{ padding: "12px", textAlign: "left" }}
                              >
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Replace with your actual data mapping */}
                            {/* {sampleData.map((po, index) => (
                              <tr
                                key={po.id}
                                style={{
                                  borderBottom: "1px dashed white",
                                  cursor: "pointer",
                                  ":hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                  },
                                }}
                                // onClick={() => handlePOSelect(po.id)}
                              >
                                <td
                                  style={{
                                    padding: "12px",
                                    textAlign: "center",
                                  }}
                                >
                                  {index + 1}
                                </td>
                                <td style={{ padding: "12px" }}>{po.branch}</td>
                                <td style={{ padding: "12px" }}>
                                  {po.vendorname}
                                </td>
                                <td style={{ padding: "12px" }}>{po.poid}</td>
                                <td style={{ padding: "12px" }}>{po.podate}</td>
                                <td style={{ padding: "12px" }}>{po.status}</td>
                              </tr>
                            ))} */}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default PurchaseOrder;
