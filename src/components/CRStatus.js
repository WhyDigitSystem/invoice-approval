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
import { getCRDetailsApprove1, getCRDetailsApprove2 } from "../services/api"; // mock API call
import NoDataFallback from "../utils/fallBack";
import "./style.css";
import ButtonTrans from "./ButtonTrans";

import crossbutton from "../cross-button.png";
import { OtherHouses } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const { Text } = Typography;

const CRStatus = () => {
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
  const userType = localStorage.getItem("userType");

  const navigate = useNavigate();
  const { RangePicker } = DatePicker; // Destructure RangePicker

  const loginemail = localStorage.getItem("email");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);

    const userType = localStorage.getItem("userType"); // assuming it's a string like "approve1" or "approve2"

    let apiCall;

    if (userType === "approve1") {
      apiCall = getCRDetailsApprove1();
    } else if (userType === "approve2") {
      apiCall = getCRDetailsApprove2();
    } else {
      notification.warning({
        message: "Unknown User Type",
        description: `No data source mapped for user type: ${userType}`,
      });
      setLoading(false);
      return;
    }

    apiCall
      .then((response) => {
        if (response) {
          setData(response);
        } else {
          notification.warning({
            message: "No Data Found",
            description: "The server returned no data.",
          });
        }
        setLoading(false);
      })
      .catch(() => {
        notification.error({
          message: "Data Fetch Error",
          description: "Failed to fetch data from the server.",
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

  const handleExcelDownload = () => {
    if (!data || data.length === 0) {
      notification.warning({
        message: "No Data",
        description: "There is no data to export.",
      });
      return;
    }

    const toInitCap = (str) =>
      str
        ? str
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        : "";

    const getStatusColumn = (item) => {
      if (item.approve1 === "F" && item.approve1name == null) {
        return "Approver 1 Yet to Approve";
      } else if (item.approve1 === "F" && item.approve1name != null) {
        return "Rejected by Approver 1";
      } else if (
        item.approve1 === "T" &&
        item.approve1name != null &&
        item.approve2 === "F" &&
        item.approve2name == null
      ) {
        return "Approver 2 Yet to Approve";
      } else if (item.approve2 === "F" && item.approve2name != null) {
        return "Rejected by Approver 2";
      } else if (item.approve2 === "T") {
        return "Approved";
      } else {
        return "Status Unknown";
      }
    };

    // Format data with comma separators for amounts and custom status
    const exportData = data.map((item) => ({
      PartyName: item.partyName,
      PartyCode: item.partyCode,
      Category: item.category,
      SalesPerson: item.salesPersonName,
      Originbill: item.profoma,
      VchNo: item.vchNo,
      VchDate: item.vchDt,
      InvoiceAmount: item.invAmt
        ? parseFloat(item.invAmt.replace(/,/g, ""))
        : null,
      CRAmount: item.crAmt ? parseFloat(item.crAmt.replace(/,/g, "")) : null,
      CRRemarks: item.crRemarks,
      Approver1: toInitCap(item.approve1name || ""),
      Approver2: toInitCap(item.approve2name || ""),
      Status: getStatusColumn(item),
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Format header with background color
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } }, // White font
      fill: { fgColor: { rgb: "4F81BD" } }, // Blue background
      alignment: { horizontal: "center", vertical: "center" },
    };
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cell_address]) continue;
      worksheet[cell_address].s = headerStyle;
    }

    // Format InvoiceAmount and CRAmount columns (column 7 and 8 — zero-based)
    for (let R = 1; R <= range.e.r; ++R) {
      ["G", "H"].forEach((col) => {
        const cellRef = col + (R + 1);
        const cell = worksheet[cellRef];
        if (cell && typeof cell.v === "number") {
          cell.t = "n";
          cell.z = "#,##0.00";
        }
      });
    }

    // Set column widths
    worksheet["!cols"] = [
      { wch: 50 }, // PartyName
      { wch: 12 }, // PartyCode
      { wch: 12 }, // Category
      { wch: 18 }, // SalesPerson
      { wch: 15 }, // Profoma
      { wch: 15 }, // VchNo
      { wch: 12 }, // VchDate
      { wch: 15 }, // InvoiceAmount
      { wch: 15 }, // CRAmount
      { wch: 25 }, // CRRemarks
      { wch: 15 }, // Approver1
      { wch: 15 }, // Approver2
      { wch: 30 }, // Status
    ];

    // Create workbook and export
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CR_Status");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, "CRStatus.xlsx");
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
                  <p>Pre Credit Note Status</p>

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
                      <Button
                        className="button1"
                        type="text"
                        onClick={handleExcelDownload}
                        size="small"
                        style={{ alignSelf: "center", marginLeft: "0px" }}
                      >
                        Export to Excel
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

                          {/* <div
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
                          </div> */}

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
                              Approve1:
                            </Text>

                            <Text strong style={{ color: "black" }}>
                              {item.approve1name}{" "}
                              {item.approve1on && ` | ${item.approve1on}`}
                            </Text>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text strong style={{ flex: 1, color: "black" }}>
                              Approve2:
                            </Text>

                            <Text strong style={{ color: "black" }}>
                              {item.approve2name}{" "}
                              {item.approve2on && ` | ${item.approve2on}`}
                            </Text>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text strong style={{ flex: 1, color: "black" }}>
                              Reject Remarks:
                            </Text>
                          </div>
                          <br />
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text strong style={{ color: "black" }}>
                              {item.rejectremarks}
                            </Text>
                          </div>

                          <Space style={{ float: "right", marginTop: "10px" }}>
                            {item.approve1 === "F" &&
                            item.approve1name == null ? (
                              <Typography style={{ color: "#f0ad4e" }}>
                                Awaiting Approver 1
                              </Typography>
                            ) : item.approve1 === "F" &&
                              item.approve1name != null ? (
                              <Typography style={{ color: "red" }}>
                                Rejected by Approver 1
                              </Typography>
                            ) : item.approve1 === "T" &&
                              item.approve1name != null &&
                              item.approve2 === "F" &&
                              item.approve2name == null ? (
                              <Typography style={{ color: "#f0ad4e" }}>
                                Awaiting Approver 2
                              </Typography>
                            ) : item.approve2 === "F" &&
                              item.approve2name != null ? (
                              <Typography style={{ color: "red" }}>
                                Rejected by Approver 2
                              </Typography>
                            ) : item.approve2 === "T" ? (
                              <Typography style={{ color: "green" }}>
                                Approved by Approver 2
                              </Typography>
                            ) : (
                              <Typography style={{ color: "#999" }}>
                                Status Unknown
                              </Typography>
                            )}
                          </Space>

                          <Space style={{ float: "right", marginTop: "10px" }}>
                            {item.approve1 === "F" &&
                            item.approve1name == null ? (
                              <Typography style={{ color: "#f0ad4e" }}>
                                Approver 1 Yet to Approve
                              </Typography>
                            ) : item.approve1 === "F" &&
                              item.approve1name != null ? (
                              <img
                                src={crossbutton}
                                style={{ width: "30px" }}
                                alt="Rejected by Approver 1"
                              />
                            ) : item.approve1 === "T" &&
                              item.approve1name != null &&
                              item.approve2 === "F" &&
                              item.approve2name == null ? (
                              <Typography style={{ color: "#f0ad4e" }}>
                                Approver 2 Yet to Approve
                              </Typography>
                            ) : item.approve2 === "F" &&
                              item.approve2name != null ? (
                              <img
                                src={crossbutton}
                                style={{ width: "30px" }}
                                alt="Rejected by Approver 2"
                              />
                            ) : item.approve2 === "T" ? (
                              <img
                                src={checkcircle}
                                style={{ width: "30px" }}
                                alt="Approved"
                              />
                            ) : null}
                          </Space>
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

export default CRStatus;
