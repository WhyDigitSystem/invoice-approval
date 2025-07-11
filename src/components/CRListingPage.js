import {
  LogoutOutlined,
  MoonOutlined,
  RightCircleOutlined,
  SunOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  DatePicker,
  Input,
  notification,
  Popover,
  Row,
  Select,
  Space,
  Spin,
  Typography,
  Modal,
  Popconfirm,
  message,
} from "antd";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getCRListingData, findByGSTPreCreditrId } from "../services/api"; // mock API call
import EmailConfig from "../utils/emailConfig";
import NoDataFallback from "../utils/fallBack";
import "./date.css";
import "./style.css";
import ButtonTrans from "./ButtonTrans";

import { Download } from "@mui/icons-material";

import confetti from "canvas-confetti";

const { Option } = Select;
const { Text } = Typography;
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8091";

const CRListingPage = () => {
  const [data, setData] = useState([]);
  const [attachData, setAttachData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailFlag, setEmailFlag] = useState(false);
  const [emailFlag2, setEmailFlag2] = useState(false);
  const [emailData, setEmailData] = useState([]);
  const [rejectRemarks, setRejectRemarks] = useState("");
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [itemToReject, setItemToReject] = useState(null);
  const [userType, setUserType] = useState(localStorage.getItem("userType"));
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [filter, setFilter] = useState({
    partyName: "",
    branchName: "",
    invAmt: "",
    startDate: null,
    endDate: null,
  });
  const [selectedItem, setSelectedItem] = useState(null); // Modal data
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const { RangePicker } = DatePicker; // Destructure RangePicker

  const loginemail = localStorage.getItem("email");

  const currentHour = new Date().getHours();
  const hasFetchedRef = useRef(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getGreeting = () => {
    if (currentHour < 12) {
      return "Good Morning";
    } else if (currentHour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  // Determine the greeting based on the time of day

  useEffect(() => {
    getCRListingData()
      .then((response) => {
        setData(response);
        setLoading(false);
      })
      .catch((error) => {
        notification.error({
          message: "Data Fetch Error",
          description: "Failed to fetch data for the listing.",
        });
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    //   fetchData();
    const intervalId = setInterval(fetchData, 180000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Step 1: Fetch the CR listing data
      const response = await getCRListingData();

      console.log("first", response);

      // Step 2: Fetch all attachments concurrently using Promise.all
      const updatedData = await Promise.all(
        response.map(async (item) => {
          try {
            // Fetch the attachment data for each item
            const attachmentResponse = await findByGSTPreCreditrId(item.id);

            // Log the response to check if attachment is present
            console.log(
              "Attachment Response for item ID",
              item.id,
              attachmentResponse
            );

            const filesResponse = await findByGSTPreCreditrId(item.id);
            const profoma =
              filesResponse?.data?.paramObjectsMap?.crPreAppVO?.profoma ||
              "File";

            item.files =
              attachmentResponse?.data?.paramObjectsMap?.crPreAppVO?.crPreAppAttachmentVO?.map(
                (att, index) => ({
                  fileData: att.attachment, // Assuming attachment is Base64 or Blob
                  fileName: `${profoma}_${String(index + 1).padStart(2, "0")}`, // Format: CBE24OSRN00001_01, CBE24OSRN00001_02, ...
                })
              ) || [];

            // Log the attachment data to verify
            console.log("Attachment for item", item.id, item.files);
          } catch (error) {
            console.error(
              `Error fetching attachment for item with id ${item.id}:`,
              error
            );
            item.files = null; // If there is an error, no file is attached
          }

          return item;
        })
      );

      // Step 4: Update the state with the data and attachment information
      setData(updatedData);

      console.log("Updated Data:", updatedData);
    } catch (error) {
      notification.error({
        message: "Data Fetch Error",
        description: "Failed to fetch data.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (hasFetchedRef.current) return; // Prevent unnecessary re-fetching

    const fetchFilesForEachItem = async () => {
      if (data.length === 0) return; // No data, do nothing

      const updatedData = data.map((item) => ({ ...item })); // Create a copy to avoid state mutation

      for (let item of updatedData) {
        if (item.filesFetched) continue; // Skip if already fetched

        console.log("Fetching files for id:", item.id);
        if (!item.id) {
          console.error(`Invalid id for item: ${JSON.stringify(item)}`);
          continue;
        }

        try {
          // Call API to get attachments for the item
          const filesResponse = await findByGSTPreCreditrId(item.id);

          // Extract attachment array and profoma value safely
          const attachments =
            filesResponse?.data?.paramObjectsMap?.crPreAppVO
              ?.crPreAppAttachmentVO || [];
          const profoma =
            filesResponse?.data?.paramObjectsMap?.crPreAppVO?.profoma || "File";

          console.log("profomefilename", profoma);
          // Generate filenames based on profoma and index
          const formattedAttachments = attachments.map((file, index) => ({
            id: file.id,
            attachment: file.attachment, // Base64 or Blob
            fileName: `${profoma}_${String(index + 1).padStart(2, "0")}`, // Format: CBE24OSRN00001_01, CBE24OSRN00001_02, ...
          }));

          console.log("formattedAttachments", formattedAttachments);

          item.files = formattedAttachments;
          item.filesFetched = true;

          // Append files to state if there are any attachments
          if (formattedAttachments.length > 0) {
            setAttachData((prev) => [...prev, ...formattedAttachments]);
          }
        } catch (error) {
          console.error(`Failed to fetch files for id ${item.id}:`, error);
          item.files = [];
          item.filesFetched = false;
        }
      }

      // Update state once at the end
      setData(updatedData);
      console.log("Updated Attachments Data:", updatedData);

      hasFetchedRef.current = true; // Mark as fetched
    };

    fetchFilesForEachItem();
  }, [data]); // Dependency on `data` to re-run when data changes

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    if (theme === "dark") {
      // document.body.style.backgroundColor = "#1c1c1c"; // Dark background for the entire page
      document.body.style.backgroundColor = "#5D576B";
      document.body.style.color = "#fff"; // White text for dark mode
    } else {
      document.body.style.backgroundColor = "#fff"; // Light background for the body
      document.body.style.color = "#000"; // Black text for light mode
    }
  }, [theme]);

  const handleApprove = async (item, remarks) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/crpreapp/approval1?approval=${"1"}&createdby=${localStorage.getItem(
          "userName"
        )}&id=${parseInt(item.id)}&userType=${localStorage.getItem(
          "userType"
        )}&remarks=${remarks || ""}`
      );

      if (response.data.status === true) {
        const audio = new Audio("/success.wav"); // Replace with your sound file path
        audio.play();

        notification.success({
          message: `Invoice ${item.id} Approved`,
          description: `You have successfully approved the Invoice ${item.id}.`,
        });

        fetchData();

        // setIsModalOpen(false); // Uncomment if necessary
      } else {
        notification.error({
          message: `Item ${item.id} failed`,
        });
      }
    } catch (error) {
      console.log("Error Response:", error.response?.data);
      const errorMessage =
        error.response?.data?.paramObjectsMap?.errorMessage ||
        error.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
      notification.error({
        message: "Error",
        description: errorMessage,
      });
    }
  };

  const handleReject = async (item, remarks) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/crpreapp/approval1?approval=${"0"}&createdby=${localStorage.getItem(
          "userName"
        )}&id=${parseInt(item.id)}&userType=${localStorage.getItem(
          "userType"
        )}&remarks=${remarks || ""}`
      );

      if (response.data.status === true) {
        const audio = new Audio("/success.wav");
        audio.play();

        message.error({
          content: `Item ${item.id} Rejected`,
          duration: 2,
        });
        setIsRejectModalVisible(false);
        fetchData();
        // setIsRejectModalVisible(false);
        setRejectRemarks("");
      } else {
        message.error(`Item ${item.id} failed`);
      }
    } catch (error) {
      console.log("Error Response:", error.response?.data);
      const errorMessage =
        error.response?.data?.paramObjectsMap?.errorMessage ||
        error.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
      message.error(errorMessage);
    }
  };
  const handleLogout = () => {
    navigate("/"); // Navigate to login or home page
  };

  const approvedList = () => {
    navigate("/CRApprovedList"); // Navigate to the approved list page
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
    // setIsModalOpen(true);
  };

  const handleDateRangeChange = (dates, dateStrings) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      startDate: dates ? dates[0] : null,
      endDate: dates ? dates[1] : null,
    }));
  };

  // Filter the data by date range, name, amount, and currency
  const filteredData = data.filter((item) => {
    const nameMatch =
      filter.partyName === "" ||
      (item.partyName &&
        item.partyName
          .toLowerCase()
          .includes(filter.partyName?.toLowerCase() || ""));

    const branchMatch =
      filter.branchName === "" ||
      (item.branchName &&
        item.branchName
          .toLowerCase()
          .includes(filter.branchName?.toLowerCase() || ""));

    const amountMatch =
      filter.invAmt === null ||
      (item.invAmt && item.invAmt.includes(filter.invAmt));

    const startDateMatch =
      !filter.startDate || new Date(item.vchDt) >= new Date(filter.vchDt);

    const endDateMatch =
      !filter.endDate || new Date(item.vchDt) <= new Date(filter.vchDt);

    return (
      nameMatch && branchMatch && amountMatch && startDateMatch && endDateMatch
    );
  });

  // const filteredData = data;

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
  // Define styles based on dark mode
  const boxShadowStyle =
    theme === "dark"
      ? "0 2px 8px rgba(0, 0, 0, 0.15)"
      : "0 2px 8px rgba(0, 0, 0, 0.1)";
  // const cardBorderColor = theme === "dark" ? "white" : "#d9d9d9"; // White border in dark mode

  // Dynamic border color based on theme
  const cardBorderColor = theme === "dark" ? "#444" : "#d9d9d9";
  const inputBorderColor = theme === "dark" ? "#666" : "#d9d9d9";

  const toInitCap = (str) => {
    return str
      .split(".")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(".");
  };

  const handleCelebrate = () => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Button animation
    const button = document.getElementById("celebrateBtn");
    if (button) {
      button.style.transform = "scale(0.95)";
      setTimeout(() => {
        button.style.transform = "scale(1)";
      }, 100);
    }
  };

  const [time, setTime] = useState("");
  const [date, setDate] = useState({
    day: "",
    dayNum: "",
    month: "",
    year: "",
  });

  // // Function to show time
  const showTime = () => {
    let time = new Date();
    setTime(time.toLocaleTimeString("en-US", { hour12: false }));
  };

  const updateDate = () => {
    let today = new Date();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const dayWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    setDate({
      day: dayWeek[today.getDay()],
      dayNum: today.getDate(),
      month: months[today.getMonth()],
      year: today.getFullYear(),
    });
  };

  // Use useEffect to update time and date on mount and every second
  useEffect(() => {
    showTime(); // Set initial time
    updateDate(); // Set initial date

    // Set interval to update time every second
    const timeInterval = setInterval(showTime, 1000);

    // Clean up interval when the component unmounts
    return () => clearInterval(timeInterval);
  }, []);

  const handleDownload = (files) => {
    try {
      if (!Array.isArray(files) || files.length === 0) {
        console.error("No attachments found!");
        return;
      }

      files.forEach(({ fileData, fileName }, index) => {
        setTimeout(() => {
          if (!fileData) {
            console.error(`No data for file: ${fileName}`);
            return;
          }

          let blob;
          let fileType;

          if (fileData instanceof Blob) {
            fileType = fileData.type || "application/octet-stream";
            blob = fileData;
          } else if (typeof fileData === "string") {
            const byteCharacters = atob(fileData);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            if (fileData.startsWith("JVBER")) {
              blob = new Blob([byteArray], { type: "application/pdf" });
              fileType = "application/pdf";
              fileName = fileName.endsWith(".pdf")
                ? fileName
                : `${fileName}.pdf`;
            } else if (fileData.startsWith("UEsDB")) {
              blob = new Blob([byteArray], {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              });
              fileType =
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
              fileName = fileName.endsWith(".docx")
                ? fileName
                : `${fileName}.docx`;
            } else {
              blob = new Blob([byteArray], { type: "text/plain" });
              fileType = "text/plain";
              fileName = fileName.endsWith(".txt")
                ? fileName
                : `${fileName}.txt`;
            }
          } else if (fileData instanceof ArrayBuffer) {
            blob = new Blob([fileData], { type: "application/pdf" });
            fileType = "application/pdf";
            fileName = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
          } else {
            console.error("Unsupported file format:", fileData);
            return;
          }

          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, index * 500); // Adding a delay of 500ms between downloads
      });
    } catch (error) {
      console.error("Error downloading files:", error);
    }
  };

  const popoverContent = (
    <Space
      direction="vertical"
      size="middle"
      style={{
        width: "100%",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      <Input
        name="partyName"
        value={filter.partyName}
        onChange={handleFilterChange}
        placeholder="Filter by Name"
        style={{ width: "200px" }}
      />
      <Input
        name="branchName"
        value={filter.branchCode}
        onChange={handleFilterChange}
        placeholder="Filter by BranchCode"
        style={{ width: "200px" }}
      />
      <Input
        name="invAmt"
        value={filter.invAmt}
        onChange={handleFilterChange}
        placeholder="Filter by Amount"
        type="number"
        style={{ width: "200px" }}
      />
      <RangePicker
        value={[filter.startDate, filter.endDate]}
        onChange={handleDateRangeChange}
        format="YYYY-MM-DD"
        placeholder={["Start Date", "End Date"]}
        style={{ width: "200px" }}
      />
    </Space>
  );

  return (
    <ConfigProvider theme={themeConfig}>
      {" "}
      {/* Wrap entire component with ConfigProvider */}
      <div style={{ padding: "20px", marginTop: "40px" }}>
        {/* Toggle Dark/Light Mode */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={16} md={22} lg={22}>
            <Card
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "15px",
                  }}
                >
                  <ButtonTrans />
                  <p>Pre Credit Note Requests</p>

                  <div>
                    <Button
                      className="button1"
                      type="text"
                      icon={
                        theme === "light" ? <MoonOutlined /> : <SunOutlined />
                      }
                      onClick={toggleTheme}
                      size="small"
                      style={{ marginLeft: "60px" }}
                    >
                      {theme === "light" ? "Dark Mode" : "Light Mode"}
                    </Button>

                    <Popover
                      content={popoverContent}
                      title="Filter"
                      trigger="click"
                      placement="bottomLeft"
                      style={{ marginLeft: "10px", gap: "10px" }}
                    >
                      <Button
                        className="button1"
                        type="text"
                        icon={<LogoutOutlined />}
                        size="small"
                        style={{ marginRight: "0px" }}
                      >
                        Filter
                      </Button>
                      <Button
                        className="button1"
                        type="text"
                        icon={<RightCircleOutlined />}
                        onClick={approvedList}
                        size="small"
                        style={{ alignSelf: "center", marginLeft: "0px" }}
                      >
                        Approved List
                      </Button>
                    </Popover>
                  </div>
                </div>
              }
              bordered={false}
              size="small"
              style={{
                borderRadius: "8px",
                boxShadow: boxShadowStyle, // Apply custom box shadow
                border: `1px solid ${cardBorderColor}`, // Apply conditional border color
              }}
            >
              {loading ? (
                <Spin tip="Loading..." />
              ) : (
                <Row gutter={[12, 12]}>
                  {filteredData.map((item) => (
                    <Col
                      xs={12}
                      sm={6}
                      lg={8}
                      md={6}
                      key={item.gst_precreditId}
                    >
                      <section>
                        <div class="glass">
                          <div class="img"></div>

                          <div class="des">
                            <div class="maincontent">
                              <div
                                style={{
                                  lineheight: "3.3%",
                                }}
                              >
                                <div style={{}}>
                                  <Text
                                    strong
                                    style={{
                                      color:
                                        theme === "dark" ? "black" : "maroon",
                                      textAlign: "center",
                                      display: "block", // Make sure it behaves like a block-level element
                                      width: "100%", // Ensures it spans the available width
                                      marginLeft: "8px",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {item.partyName}
                                  </Text>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Text
                                    strong
                                    style={{
                                      color:
                                        theme === "dark" ? "black" : "maroon",
                                      textAlign: "center",
                                      display: "block", // Make sure it behaves like a block-level element
                                      width: "100%", // Ensures it spans the available width
                                      marginLeft: "8px",
                                    }}
                                  >
                                    {item.partyCode}
                                  </Text>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Text
                                    strong
                                    style={{
                                      color:
                                        theme === "dark" ? "black" : "maroon",
                                      textAlign: "center",
                                      display: "block", // Make sure it behaves like a block-level element
                                      width: "100%", // Ensures it spans the available width
                                      marginLeft: "8px",
                                    }}
                                  >
                                    {item.category}
                                  </Text>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Text
                                    strong
                                    style={{
                                      color:
                                        theme === "dark" ? "black" : "maroon",
                                      textAlign: "center",
                                      display: "block", // Make sure it behaves like a block-level element
                                      width: "100%", // Ensures it spans the available width
                                      marginLeft: "8px",
                                    }}
                                  >
                                    {item.salesPersonName}
                                  </Text>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Text strong style={{ color: "black" }}>
                                    {/* {item.salespersonName} */}
                                  </Text>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Text
                                    strong
                                    style={{
                                      flex: 1,
                                      color:
                                        theme === "dark" ? "white" : "black",
                                    }}
                                  >
                                    Profoma:
                                  </Text>

                                  <Text
                                    strong
                                    style={{
                                      color:
                                        theme === "dark" ? "black" : "blue",
                                    }}
                                  >
                                    {item.profoma}
                                  </Text>
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    flex: 1,
                                    color: theme === "dark" ? "white" : "black",
                                  }}
                                >
                                  Invoice No:
                                </Text>
                                <Text
                                  strong
                                  style={{
                                    color: theme === "dark" ? "black" : "blue",
                                  }}
                                >
                                  {item.vchNo}
                                </Text>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    flex: 1,
                                    color: theme === "dark" ? "white" : "black",
                                  }}
                                >
                                  Date:
                                </Text>
                                <Text
                                  strong
                                  style={{
                                    color: theme === "dark" ? "black" : "blue",
                                  }}
                                >
                                  {item.vchDt}
                                </Text>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    flex: 1,
                                    color: theme === "dark" ? "white" : "black",
                                  }}
                                >
                                  Inv Charge Amt:
                                </Text>
                                <Text
                                  strong
                                  style={{
                                    color: theme === "dark" ? "black" : "blue",
                                  }}
                                >
                                  {new Intl.NumberFormat("en-IN").format(
                                    item.totchargeamtlc
                                  )}
                                </Text>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    flex: 1,
                                    color: theme === "dark" ? "white" : "black",
                                  }}
                                >
                                  CN Charge Amt:
                                </Text>
                                <Text
                                  strong
                                  style={{
                                    color: theme === "dark" ? "black" : "blue",
                                  }}
                                >
                                  {new Intl.NumberFormat("en-IN").format(
                                    item.crAmt
                                  )}
                                </Text>
                              </div>

                              {/* <div
                                                            style={{
                                                              display: "flex",
                                                              justifyContent: "space-between",
                                                            }}
                                                          >
                                                            <Text strong style={{ flex: 1, color: "black" }}>
                                                              Total Due
                                                            </Text>
                                                            <Text strong style={{ color: "blue" }}>
                                                              {new Intl.NumberFormat("en-IN").format(
                                                                item.totDue
                                                              )}
                                                            </Text>
                                                          </div> */}

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    flex: 1,
                                    color: theme === "dark" ? "white" : "black",
                                  }}
                                >
                                  Type:
                                </Text>
                                <Text
                                  strong
                                  style={{
                                    color: theme === "dark" ? "black" : "blue",
                                  }}
                                >
                                  {item.pType}
                                </Text>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    flex: 1,
                                    color: theme === "dark" ? "white" : "black",
                                  }}
                                >
                                  P & L Impact:
                                </Text>

                                <Text
                                  strong
                                  style={{
                                    color: theme === "dark" ? "black" : "blue",
                                  }}
                                >
                                  {item.plImpact}
                                </Text>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    flex: 1,
                                    color: theme === "dark" ? "white" : "black",
                                  }}
                                >
                                  Cr Remarks:
                                </Text>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    color: theme === "dark" ? "black" : "blue",
                                  }}
                                >
                                  {item.crRemarks}
                                </Text>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    flex: 1,
                                    color: theme === "dark" ? "white" : "black",
                                  }}
                                >
                                  Description:
                                </Text>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    color: theme === "dark" ? "black" : "blue",
                                  }}
                                >
                                  {item.description}
                                </Text>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    flex: 1,
                                    color: theme === "dark" ? "white" : "black",
                                  }}
                                >
                                  Documents Required:
                                </Text>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    color: theme === "dark" ? "black" : "blue",
                                  }}
                                >
                                  {item.documentsRequired}
                                </Text>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    flex: 1,
                                    color: theme === "dark" ? "white" : "black",
                                  }}
                                >
                                  Reason:
                                </Text>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    color: theme === "dark" ? "black" : "blue",
                                  }}
                                >
                                  {item.reason}
                                </Text>
                              </div>
                              <div
                                style={{
                                  position: "relative",
                                  maxWidth: "90vw",
                                  maxHeight: "90vh",
                                  padding: "10px",
                                  textAlign: "center",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    color: theme === "dark" ? "black" : "blue",
                                  }}
                                >
                                  {/* Attachments: */}
                                </Text>

                                <div
                                  style={{
                                    marginTop: "10px",
                                    color: theme === "dark" ? "black" : "blue",
                                  }}
                                >
                                  {/* {item.files && item.files.length > 0 && ( */}
                                  <a
                                    href="#"
                                    className="btn-shine"
                                    onClick={() =>
                                      handleDownload(item.files, item.vchNo)
                                    }
                                  >
                                    Attachment Download
                                  </a>
                                  {/* )} */}
                                </div>
                              </div>

                              <Space
                                style={{
                                  marginTop: "5px",
                                  marginLeft: "50px",
                                }}
                              >
                                {/* <Button
                                                                                                                                        id="celebrateBtn"
                                                                                                                                        type="default"
                                                                                                                                        onClick={(e) => {
                                                                                                                                          e.stopPropagation();
                                                                                                                                          handleApprove(item);
                                                                                                                                          handleCelebrate();
                                                                                                                                        }}
                                                                                                                                        size="small"
                                                                                                                                        style={{
                                                                                                                                          borderColor: "green",
                                                                                                                                          color: "green",
                                                                                                                                          backgroundColor: "transparent",
                                                                                                        
                                                                                                                                          cursor: "pointer",
                                                                                                                                          transition: "transform 0.1s ease",
                                                                                                                                        }}
                                                                                                                                      >
                                                                                                                                        Approve
                                                                                                                                      </Button>
                                                                                                        
                                                                                                                                      <Button
                                                                                                                                        type="default"
                                                                                                                                        danger
                                                                                                                                        onClick={(e) => {
                                                                                                                                          e.stopPropagation();
                                                                                                                                          handleReject(item);
                                                                                                                                        }}
                                                                                                                                        size="small"
                                                                                                                                        style={{
                                                                                                                                          backgroundColor: "transparent",
                                                                                                                                        }}
                                                                                                                                      >
                                                                                                                                        Reject
                                                                                                                                      </Button> */}

                                <button class="Btn1">
                                  <span
                                    class="leftContainer1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleApprove(item);
                                      handleCelebrate();
                                    }}
                                  >
                                    <span class="like1">Approve</span>
                                  </span>
                                  <span
                                    class="likeCount1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // handleReject(item);
                                      setItemToReject(item);
                                      setIsRejectModalVisible(true);
                                    }}
                                  >
                                    Reject
                                  </span>
                                </button>
                                <Modal
                                  title="Rejection Remarks"
                                  visible={isRejectModalVisible}
                                  onOk={() => {
                                    if (rejectRemarks.trim() === "") {
                                      message.warning(
                                        "Please enter rejection remarks"
                                      );
                                      return; // Prevent closing the modal
                                    }
                                    handleReject(itemToReject, rejectRemarks);
                                    setIsRejectModalVisible(false); // Close modal on successful reject
                                    setRejectRemarks(""); // Clear remarks after submit
                                  }}
                                  onCancel={() => {
                                    setIsRejectModalVisible(false);
                                    setRejectRemarks("");
                                  }}
                                  okText="Confirm Reject"
                                  cancelText="Cancel"
                                >
                                  <Input.TextArea
                                    rows={4}
                                    placeholder="Enter rejection remarks..."
                                    value={rejectRemarks}
                                    onChange={(e) =>
                                      setRejectRemarks(e.target.value)
                                    }
                                  />
                                </Modal>
                              </Space>
                            </div>
                          </div>
                        </div>
                      </section>
                    </Col>
                  ))}
                </Row>
              )}

              {filteredData.length === 0 && (
                <NoDataFallback onRetry={fetchData} />
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  );
};

export default CRListingPage;
