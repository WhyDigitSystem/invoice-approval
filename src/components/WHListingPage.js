import {
  LogoutOutlined,
  MoonOutlined,
  RightCircleOutlined,
  SunOutlined,
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
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWHListingData } from "../services/api"; // mock API call
import EmailConfig from "../utils/emailConfig";
import NoDataFallback from "../utils/fallBack";
import "./date.css";
import "./style.css";

import confetti from "canvas-confetti";
import ButtonTrans from "./ButtonTrans";

const { Option } = Select;
const { Text } = Typography;
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8091";

const WHListingPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailFlag, setEmailFlag] = useState(false);
  const [emailFlag2, setEmailFlag2] = useState(false);
  const [emailData, setEmailData] = useState([]);
  const [userType, setUserType] = useState(localStorage.getItem("userType"));
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [filter, setFilter] = useState({
    name: "",
    branchCode: "",
    amount: "",
    startDate: null,
    endDate: null,
  });
  const [selectedItem, setSelectedItem] = useState(null); // Modal data
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const { RangePicker } = DatePicker; // Destructure RangePicker

  const loginemail = localStorage.getItem("email");

  const currentHour = new Date().getHours();

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
    getWHListingData()
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
    fetchData();
    const intervalId = setInterval(fetchData, 180000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const fetchData = () => {
    setLoading(true);
    getWHListingData()
      .then((response) => {
        setData(response);
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

  // const themeConfig = theme === "dark" ? {
  //   token: {
  //     colorPrimary: '#1890ff', // Adjust as needed for dark mode
  //     colorBgBase: '#1c1c1c', // Dark background
  //     colorTextBase: '#fff', // White text for dark mode
  //     colorLink: '#40a9ff', // Link color for dark mode
  //   }
  // } : {};

  const handleApprove = async (item) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/WHInvoiceApproval/approval1?approval=${"1"}&createdby=${localStorage.getItem(
          "userName"
        )}&id=${parseInt(item.id)}&userType=${localStorage.getItem("userType")}`
      );

      if (response.data.status === true) {
        const audio = new Audio("/success.wav"); // Replace with your sound file path
        audio.play();

        notification.success({
          message: `Invoice ${item.id} Approved`,
          description: `You have successfully approved the Invoice ${item.id}.`,
        });

        // setEmailData([item]);
        // console.log("Email Data", emailData);

        // // Handle first email flag logic
        // if (
        //   response.data.paramObjectsMap.gstInvoiceHdrVO.approveEmail === "T" &&
        //   response.data.paramObjectsMap.gstInvoiceHdrVO.approve1 === "T" &&
        //   response.data.paramObjectsMap.gstInvoiceHdrVO.eligiSlab === 2
        // ) {
        //   setEmailFlag(true);
        // } else {
        //   setEmailFlag(false);
        // }

        // // Handle second email flag logic
        // if (
        //   response.data.paramObjectsMap.gstInvoiceHdrVO.approveEmail === "T" &&
        //   response.data.paramObjectsMap.gstInvoiceHdrVO.approve1 === "T" &&
        //   response.data.paramObjectsMap.gstInvoiceHdrVO.eligiSlab === 3
        // ) {
        //   setEmailFlag2(true);
        // } else {
        //   setEmailFlag2(false);
        // }

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

  const handleReject = async (item) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/WHInvoiceApproval/approval1?approval=${"0"}&createdby=${localStorage.getItem(
          "userName"
        )}&id=${parseInt(item.id)}&userType=${localStorage.getItem("userType")}`
      );

      if (response.data.status === true) {
        const audio = new Audio("/success.wav"); // Replace with your sound file path
        audio.play();

        notification.error({
          message: `Item ${item.id} Rejected`,
          description: `You have rejected item ${item.id}.`,
        });
        fetchData();
        // setIsModalOpen(false);
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
    }
  };

  const handleLogout = () => {
    navigate("/"); // Navigate to login or home page
  };

  const approvedList = () => {
    navigate("/WHApprovedList"); // Navigate to the approved list page
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
      filter.name === "" ||
      (item.name &&
        item.name.toLowerCase().includes(filter.name?.toLowerCase() || ""));

    const branchMatch =
      filter.branchCode === "" ||
      (item.branchCode &&
        item.branchCode
          .toLowerCase()
          .includes(filter.branchCode?.toLowerCase() || ""));

    const amountMatch =
      filter.amount === null ||
      (item.amount && item.amount.includes(filter.amount));

    const currencyMatch =
      filter.currency === "" ||
      (item.currency &&
        item.currency
          .toLowerCase()
          .includes(filter.currency?.toLowerCase() || ""));

    const startDateMatch =
      !filter.startDate || new Date(item.docDate) >= new Date(filter.startDate);

    const endDateMatch =
      !filter.endDate || new Date(item.docDate) <= new Date(filter.endDate);

    return (
      nameMatch &&
      branchMatch &&
      amountMatch &&
      currencyMatch &&
      startDateMatch &&
      endDateMatch
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

  // Function to show time
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
        name="name"
        value={filter.name}
        onChange={handleFilterChange}
        placeholder="Filter by Name"
        style={{ width: "200px" }}
      />
      <Input
        name="branchCode"
        value={filter.branchCode}
        onChange={handleFilterChange}
        placeholder="Filter by BranchCode"
        style={{ width: "200px" }}
      />
      <Input
        name="amount"
        value={filter.amount}
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
          {/* Listing Section */}
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
                  <p>WH - Additional Credit Requests</p>
                  <div>
                    <Button
                      className="button1"
                      type="text"
                      icon={
                        theme === "light" ? <MoonOutlined /> : <SunOutlined />
                      }
                      onClick={toggleTheme}
                      size="small"
                      style={{ marginLeft: "10px" }}
                    >
                      {theme === "light" ? "Dark Mode" : "Light Mode"}
                    </Button>

                    <Popover
                      content={popoverContent}
                      title="Filter"
                      trigger="click"
                      placement="bottomLeft"
                      style={{ marginLeft: "10px" }}
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
                    <Col xs={12} sm={6} lg={8} md={6} key={item.expenceId}>
                      <div class="note-container">
                        <div
                          class="sticky-note sticky-note-one"
                          contenteditable="false"
                          style={{ color: "black", colorTextBase: "black" }}
                          onClick={() => handleCardClick(item)}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "5px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text strong style={{ color: "black" }}>
                                {item.name}
                              </Text>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text strong style={{ color: "black" }}>
                                {item.category}
                              </Text>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              {/* <Text strong style={{ flex: 1, color: "black" }}>
                                SalesPerson:
                              </Text> */}
                              <Text strong style={{ color: "black" }}>
                                {item.salespersonName}
                              </Text>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text strong style={{ flex: 1, color: "black" }}>
                                Curr | Credit Days:
                              </Text>
                              <Text strong style={{ color: "black" }}>
                                {item.currency} | {item.creditDays}
                              </Text>
                            </div>

                            {/* <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text strong style={{ flex: 1, color: "black" }}>
                                Credit Days:
                              </Text>
                              <Text strong style={{ color: "black" }}>
                                {item.creditDays}
                              </Text>
                            </div> */}

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text strong style={{ flex: 1, color: "black" }}>
                                Controlling Branch:
                              </Text>
                              <Text strong style={{ color: "black" }}>
                                {item.controllingOffice}
                              </Text>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text strong style={{ flex: 1, color: "black" }}>
                                Credit Limit:
                              </Text>
                              <Text strong style={{ color: "black" }}>
                                {new Intl.NumberFormat("en-IN").format(
                                  item.creditLimit
                                )}
                              </Text>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text strong style={{ flex: 1, color: "black" }}>
                                Total Due:
                              </Text>
                              <Text strong style={{ color: "black" }}>
                                {new Intl.NumberFormat("en-IN").format(
                                  item.outStanding
                                )}
                              </Text>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text strong style={{ flex: 1, color: "black" }}>
                                Excess Credit:
                              </Text>
                              <Text strong style={{ color: "black" }}>
                                {new Intl.NumberFormat("en-IN").format(
                                  item.excessCredit
                                )}
                              </Text>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text strong style={{ flex: 1, color: "black" }}>
                                Due Beyond {item.creditDays}:
                              </Text>
                              <Text strong style={{ color: "black" }}>
                                {new Intl.NumberFormat("en-IN").format(
                                  item.osBeyond
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
                              Category:
                              </Text>
                              <Text strong style={{ color: "black" }}>
                                {item.category}
                              </Text>
                            </div> */}

                            {/*                             
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text strong style={{ flex: 1, color: "black" }}>
                              Controlling Office:
                              </Text>
                              <Text strong style={{ color: "black" }}>
                                {item.controllingoffice}
                              </Text>
                            </div> */}
                            {/*           
          
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text strong style={{ flex: 1, color: "black" }}>
                                Due Days:
                              </Text>
                              <Text strong style={{ color: "black" }}>
                                {item.exceedDays}
                              </Text>
                            </div> */}

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text strong style={{ flex: 1, color: "black" }}>
                                Policy :
                              </Text>

                              <Text strong style={{ color: "black" }}>
                                <b> {item.slabRemarks} Exceed </b>
                              </Text>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-evenly",
                                marginTop: "10px",
                              }}
                            >
                              <Text strong style={{ flex: 1, color: "black" }}>
                                Invoice No:
                              </Text>
                              <Text strong style={{ color: "black" }}>
                                {item.expenceId}
                              </Text>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text strong style={{ flex: 1, color: "black" }}>
                                {/* Doc Date: */}
                              </Text>
                              <Text strong style={{ color: "black" }}>
                                {new Date(item.docDate).toLocaleDateString(
                                  "en-GB"
                                )}{" "}
                              </Text>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text strong style={{ flex: 1, color: "black" }}>
                                {/* Amount: */}
                              </Text>
                              <Text strong style={{ color: "black" }}>
                                {new Intl.NumberFormat("en-IN").format(
                                  item.amount
                                )}
                              </Text>
                            </div>

                            {/* <br /> */}
                            {/* Approve/Reject Buttons on Card */}
                            <Space
                              style={{ marginTop: "10px", marginLeft: "50px" }}
                            >
                              <Button
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
                              </Button>
                            </Space>
                          </div>
                        </div>
                      </div>
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

        {/* Modal for Item Details */}
        {/* <Modal
          visible={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          {selectedItem && (
            <div>
              <Descriptions
                bordered
                column={1}
                size="small"
                layout="horizontal"
                labelStyle={{ fontWeight: "bold", padding: "4px 8px" }}
                contentStyle={{ padding: "4px 8px" }}
              >
                <Descriptions.Item label="Name">
                  {selectedItem.name}
                </Descriptions.Item>
                <Descriptions.Item label="Doc ID">
                  {selectedItem.expenceId}
                </Descriptions.Item>
                <Descriptions.Item label="Doc Date">
                  {selectedItem.docDate}
                </Descriptions.Item>
                <Descriptions.Item label="Amount">
                  {new Intl.NumberFormat("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(selectedItem.amount)}
                </Descriptions.Item>
                <Descriptions.Item label="Currency">
                  {selectedItem.currency}
                </Descriptions.Item>
                <Descriptions.Item label="Credit Days">
                  {selectedItem.creditDays}
                </Descriptions.Item>
                <Descriptions.Item label="Credit Limit">
                  {selectedItem.creditLimit}
                </Descriptions.Item>
                <Descriptions.Item label="Outstanding">
                  {selectedItem.outStanding}
                </Descriptions.Item>
              </Descriptions>

              <Space
                style={{
                  marginTop: "10px",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Button
                  type="default"
                  size="small"
                  style={{
                    borderColor: "green",
                    color: "green",
                    backgroundColor: "white",
                  }}
                  onClick={() => handleApprove(selectedItem)}
                >
                  Approve
                </Button>
                <Button
                  type="default"
                  danger
                  size="small"
                  style={{
                    backgroundColor: "white",
                  }}
                  onClick={() => handleReject(selectedItem)}
                >
                  Reject
                </Button>
              </Space>
            </div>
          )}
        </Modal> */}
        {emailFlag && (
          <EmailConfig
            updatedEmployee={"Admin"}
            // toEmail={"nitin.d@uniworld-logistics.com,ugs.supports@uniworld-logistics.com"}
            toEmail={"jayabalan.guru@uniworld-logistics.com"}
            data={emailData}
          />
        )}

        {emailFlag2 && (
          <EmailConfig
            updatedEmployee={"Admin"}
            // toEmail={"nitin.d@uniworld-logistics.com,ugs.supports@uniworld-logistics.com"}
            toEmail={"jayabalan.guru@uniworld-logistics.com"}
            data={emailData}
          />
        )}
      </div>
    </ConfigProvider>
  );
};

export default WHListingPage;
