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
import { getInvDetailsApprove1 } from "../services/api"; // mock API call
import NoDataFallback from "../utils/fallBack";
import "./style.css";
import ButtonTrans from "./ButtonTrans";

const { Text } = Typography;

const ApprovedList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    name: "",
    amount: null,
    currency: "",
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
    getInvDetailsApprove1()
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

  const filteredData = data.filter(
    (item) =>
      (filter.name === "" ||
        item.name.toLowerCase().includes(filter.name.toLowerCase())) &&
      (filter.amount === null || item.amount.includes(filter.amount)) &&
      (filter.currency === "" ||
        item.currency.toLowerCase().includes(filter.currency.toLowerCase())) &&
      (!filter.startDate ||
        new Date(item.docDate) >= new Date(filter.startDate)) &&
      (!filter.endDate || new Date(item.docDate) <= new Date(filter.endDate))
  );

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
    navigate("/Listing"); // Navigate to the approved list page
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
        name="name"
        value={filter.name}
        onChange={handleFilterChange}
        placeholder="Filter by Name"
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
                  <p>Approved Lists</p>

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
                      style={{ marginRight: "0px" }}
                    >
                      <Button
                        className="button1"
                        type="text"
                        icon={<LogoutOutlined />}
                        size="small"
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
                    <Col xs={24} sm={12} md={8} key={item.expenceId}>
                      <div
                        class="note-container"
                        // style={{ backgroundColor: "#5D576B" }}
                      >
                        <div
                          class="sticky-note sticky-note-two"
                          contenteditable="false"
                          style={{ color: "black" }}
                        >
                          {/* Improved alignment */}

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
                              {/* <Text strong style={{ flex: 1, color: "black" }}>
                                Invoice No:
                              </Text> */}
                              <Text strong style={{ color: "black" }}>
                                {item.expenceId} |{" "}
                                {new Date(item.docDate).toLocaleDateString(
                                  "en-GB"
                                )}{" "}
                                |{" "}
                                {new Intl.NumberFormat("en-IN").format(
                                  item.amount
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
                                {/* Doc Date: }
                              </Text>
                              <Text strong style={{ color: "black" }}>
                                {new Date(item.docDate).toLocaleDateString(
                                  "en-GB"
                                )}{" "} |  {new Intl.NumberFormat("en-IN").format(
                                  item.amount
                                )}
                              </Text>
                            </div> */}

                            {/* <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text strong style={{ flex: 1, color: "black" }}>
                                {/* Amount: }
                              </Text>
                              <Text strong style={{ color: "black" }}>
                                {new Intl.NumberFormat("en-IN").format(
                                  item.amount
                                )}
                              </Text>
                            </div> */}

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text strong style={{ flex: 1, color: "black" }}>
                                1st Approved On:
                              </Text>
                              <Text strong style={{ color: "black" }}>
                                {new Date(item.approved1on).toLocaleDateString(
                                  "en-GB"
                                )}{" "}
                              </Text>
                            </div>

                            {/* <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text strong style={{ flex: 1, color: "black" }}>
                                2nd Approved On:
                              </Text>
                              {item.approved2on && (
                                <Text strong style={{ color: "black" }}>
                                  {new Date(
                                    item.approved2on
                                  ).toLocaleDateString("en-GB")}{" "}
                                </Text>
                              )}
                            </div> */}

                            {item.approved2on && (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{ flex: 1, color: "black" }}
                                >
                                  2nd Approved On:
                                </Text>
                                <Text strong style={{ color: "black" }}>
                                  {new Date(
                                    item.approved2on
                                  ).toLocaleDateString("en-GB")}
                                </Text>
                              </div>
                            )}

                            {item.approved3on && (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{ flex: 1, color: "black" }}
                                >
                                  2nd Approved On:
                                </Text>
                                <Text strong style={{ color: "black" }}>
                                  {new Date(
                                    item.approved3on
                                  ).toLocaleDateString("en-GB")}
                                </Text>
                              </div>
                            )}
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

export default ApprovedList;
