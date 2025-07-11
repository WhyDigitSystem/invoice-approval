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
  Space,
  Spin,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import checkcircle from "../checkcircle.png";
import { getCRDetailsApprove1 } from "../services/api"; // mock API call
import NoDataFallback from "../utils/fallBack";
import "./style.css";
import ButtonTrans from "./ButtonTrans";

const { Text } = Typography;

const CRApprovedList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    partyName: "",
    branchName: "",
    invAmt: "",
    startDate: null,
    endDate: null,
  });
  const [selectedItem, setSelectedItem] = useState(null); // Modal data
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const navigate = useNavigate();
  const { RangePicker } = DatePicker; // Destructure RangePicker

  const loginemail = localStorage.getItem("email");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    getCRDetailsApprove1()
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

  const handleLogout = () => {
    navigate("/");
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleDateRangeChange = (dates, dateStrings) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      startDate: dates ? dates[0] : null,
      endDate: dates ? dates[1] : null,
    }));
  };

  useEffect(() => {
    if (theme === "dark") {
      // document.body.style.backgroundColor = "#1c1c1c"; // Dark background for the entire page
      document.body.style.backgroundColor = "#5D576B"; // Dark background for the entire page

      document.body.style.color = "#fff"; // White text for dark mode
    } else {
      document.body.style.backgroundColor = "#fff"; // Light background for the body
      document.body.style.color = "#000"; // Black text for light mode
    }
  }, [theme]);

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

  const themeConfig =
    theme === "dark"
      ? {
          token: {
            // colorPrimary: '#1890ff',
            colorPrimary: "#5D576B",
            // colorBgBase: '#1c1c1c',
            colorBgBase: "#5D576B",
            colorTextBase: "#fff",
            // colorTextBase: 'black',
            colorLink: "#40a9ff",
          },
        }
      : {};

  const boxShadowStyle =
    theme === "dark"
      ? "0 2px 8px rgba(0, 0, 0, 0.15)"
      : "0 2px 8px rgba(0, 0, 0, 0.1)";
  // const cardBorderColor = theme === "dark" ? "white" : "#d9d9d9";
  const cardBorderColor = theme === "dark" ? "#444" : "#d9d9d9";

  const [time, setTime] = useState("");
  const [date, setDate] = useState({
    day: "",
    dayNum: "",
    month: "",
    year: "",
  });

  const Listing = () => {
    navigate("/CRListing"); // Navigate to the approved list page
  };

  // Function to show time
  const showTime = () => {
    let time = new Date();
    setTime(time.toLocaleTimeString("en-US", { hour12: false }));
  };

  const updateDate = () => {
    let today = new Date();
    const months = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
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
      <div style={{ padding: "20px", marginTop: "40px" }}>
        <Row gutter={[16, 16]}>
          {/* Filter Section */}
          {/* <Col xs={24} sm={8} md={6} lg={5}>
              <Card
                title="Filters"
                bordered={false}
                size="large"
                style={{
                  borderRadius: "8px",
                  boxShadow: boxShadowStyle,
                  border: `1px solid ${cardBorderColor}`,
                }}
              >
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Input
                    name="name"
                    value={filter.name}
                    onChange={handleFilterChange}
                    placeholder="Filter by Name"
                    className={
                      theme === "dark"
                        ? "custom-placeholder-dark"
                        : "custom-placeholder-light"
                    } // Apply class based on theme
                  />
                  <Input
                    name="amount"
                    value={filter.amount}
                    onChange={handleFilterChange}
                    placeholder="Filter by Amount"
                    type="number"
                    className={
                      theme === "dark"
                        ? "custom-placeholder-dark"
                        : "custom-placeholder-light"
                    } // Apply class based on theme
                  />
                  <RangePicker
                    value={[filter.startDate, filter.endDate]}
                    onChange={handleDateRangeChange}
                    format="YYYY-MM-DD"
                    placeholder={["Start Date", "End Date"]}
                    className={
                      theme === "dark"
                        ? "custom-placeholder-dark"
                        : "custom-placeholder-light"
                    } // Apply class based on theme
                  />
                  <br />
                  <Button
                    type="text"
                    icon={<RightCircleOutlined />}
                    onClick={() => navigate("/listing")}
                    size="small"
                    style={{ fontSize: "20px", fontWeight: "bold" }}
                  >
                    Listing Page
                  </Button>
                </Space>
              </Card>
            </Col> */}

          {/* Listing Section */}
          <Col xs={24} sm={16} md={24} lg={21}>
            <Card
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "15px",
                  }}
                >
                  {/* <Text strong style={{ fontSize: '20px' }}>Approved Lists</Text> */}
                  <ButtonTrans />
                  <p>Pre Credit Note Approved Lists</p>

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
                        onClick={Listing}
                        size="small"
                        style={{ alignSelf: "center", marginLeft: "0px" }}
                      >
                        Listing
                      </Button>
                    </Popover>
                  </div>
                </div>
              }
              bordered={false}
              size="small"
              style={{
                borderRadius: "8px",
                boxShadow: boxShadowStyle,
                border: `1px solid ${cardBorderColor}`,
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
                      <div class="note-container">
                        <div
                          class="sticky-note sticky-note-two"
                          contenteditable="false"
                          style={{ color: "black", colorTextBase: "black" }}
                          // onClick={() => handleCardClick(item)}
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
                                {item.partyName}
                              </Text>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text strong style={{ color: "black" }}>
                                {item.partyCode}
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
                              <Text strong style={{ color: "black" }}>
                                {item.salesPersonName}
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
                                {/* {item.salespersonName} */}
                              </Text>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text strong style={{ flex: 1, color: "black" }}>
                                Limit | Days :
                              </Text>
                              <Text strong style={{ color: "black" }}>
                                {item.creditLimit} | {item.creditDays}
                              </Text>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text strong style={{ flex: 1, color: "black" }}>
                                Profoma:
                              </Text>
                              <Text strong style={{ color: "black" }}>
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
                            <Text strong style={{ flex: 1, color: "black" }}>
                              Invoice No :
                            </Text>
                            <Text strong style={{ color: "black" }}>
                              {item.vchNo}
                            </Text>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text strong style={{ flex: 1, color: "black" }}>
                              Date:
                            </Text>
                            <Text strong style={{ color: "black" }}>
                              {item.vchDt}
                            </Text>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text strong style={{ flex: 1, color: "black" }}>
                              Invoice Amt:
                            </Text>
                            <Text strong style={{ color: "black" }}>
                              {new Intl.NumberFormat("en-IN").format(
                                item.invAmt
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
                              Cr Note Amt:
                            </Text>
                            <Text strong style={{ color: "black" }}>
                              {new Intl.NumberFormat("en-IN").format(
                                item.crAmt
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
                              Total Due
                            </Text>
                            <Text strong style={{ color: "black" }}>
                              {new Intl.NumberFormat("en-IN").format(
                                item.totDue
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
                              Type:
                            </Text>
                            <Text strong style={{ color: "black" }}>
                              {item.pType}
                            </Text>
                          </div>
                          <br />

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text strong style={{ flex: 1, color: "black" }}>
                              Cr Remarks:
                            </Text>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text strong style={{ color: "black" }}>
                              {item.crRemarks}
                            </Text>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text strong style={{ flex: 1, color: "black" }}>
                              Reason:
                            </Text>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text strong style={{ color: "black" }}>
                              {item.reason}
                            </Text>

                            <Space
                              style={{ float: "right", marginTop: "10px" }}
                            >
                              {theme === "light" ? (
                                <img
                                  src={checkcircle}
                                  style={{ width: "30px" }}
                                  alt="approved"
                                />
                              ) : (
                                <img
                                  src={checkcircle}
                                  style={{ width: "30px" }}
                                  alt="approved"
                                />
                              )}
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
      </div>
    </ConfigProvider>
  );
};

export default CRApprovedList;
