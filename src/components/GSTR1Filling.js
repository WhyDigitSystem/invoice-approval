import React, { useState, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { notification } from "antd";
import {
  Button,
  Select,
  DatePicker,
  Space,
  Spin,
  Progress,
  Slider,
  Typography,
  Row,
  Col,
  ConfigProvider,
} from "antd";
import { getGSTR1Parties, getGSTR1Filling } from "../services/api";
import { getUserBranch } from "../services/api"; // Import getUserBranch function
import CommonTable from "./CommonTable";
// import dayjs from 'dayjs';
import { MenuItem, CircularProgress } from "@mui/material";
import "./ApAgeing.css";
import NoDataAvailable from "../utils/NoDataAvailable";
import { AiFillBackward } from "react-icons/ai";
import rewindbutton from ".././rewindbutton.png";

import Spinner3 from ".././Spinner3.gif";
import moment from "moment";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import ButtonNew from "./ButtonNew";
import {
  LogoutOutlined,
  MoonOutlined,
  RightCircleOutlined,
  SunOutlined,
  FolderOpenOutlined,
  FolderOutlined,
} from "@ant-design/icons";

const { Option } = Select;

export const GSTR1Filling = () => {
  // States for filter values
  const [pbranchname, setPbranchName] = useState("");
  const [party, setParty] = useState("");
  const [div, setDiv] = useState("");
  const [ptype, setPtype] = useState("");
  const [sbcode, setSbCode] = useState("");
  const [slab1, setSlab1] = useState(30);
  const [slab2, setSlab2] = useState(60);
  const [slab3, setSlab3] = useState(90);
  const [slab4, setSlab4] = useState(120);
  const [slab5, setSlab5] = useState(150);
  const [slab6, setSlab6] = useState(180);
  const [slab7, setSlab7] = useState(180);
  const navigate = useNavigate();

  const [status, setStatus] = useState("");
  const [fromdt, setFromdt] = useState(null);
  const [todt, setTodt] = useState(null);
  const [subledgerName, setSubledgerName] = useState("");

  const [subledgerNames, setSubledgerNames] = useState("");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [branchName, setBranchName] = useState([]); // Initialize as empty array
  const [branchNames, setBranchNames] = useState([]); // Initialize as empty array
  const { RangePicker } = DatePicker; // Destructure RangePicker
  const [selectedParty, setSelectedParty] = useState("");

  const [stepsCount, setStepsCount] = useState(5); // Dynamic steps count
  const [stepsGap, setStepsGap] = useState(7); // Dynamic gap between progress bars
  const [percent, setPercent] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

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
  // Define styles b
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

  // Simulate data loading
  useEffect(() => {
    if (loading && percent < 100) {
      const interval = setInterval(() => {
        setPercent((prevPercent) => {
          const nextPercent = prevPercent + 5; // Increment the progress by 5%
          if (nextPercent >= 100) {
            clearInterval(interval); // Stop the interval when progress reaches 100%
            setLoading(false); // Data is fully loaded
          }
          return nextPercent;
        });
      }, 500); // Update progress every 500ms
      return () => clearInterval(interval); // Cleanup the interval on component unmount
    }
  }, [percent, loading]);

  // useEffect(() => {
  //   getGSTR1Parties()
  //         .then((response) => {
  //           console.log(response);  // Log to verify data structure
  //           setParty(response);
  //           setLoading(false);
  //         })
  //         .catch(() => {
  //           notification.error({
  //             message: "Data Fetch Error",
  //             description: "Failed to fetch updated data for the listing.",
  //           });
  //           setLoading(false);
  //         });
  //       }
  //     )

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

  // Handle date range change
  // const handleDateRangeChange = (dates) => {
  //   // Set the selected date range into asondt
  //   setAsondt(dates ? dates[0] : null); // Use the first date as the only value
  // };
  // Table columns definition
  // const reportColumns = [
  //   { accessorKey: 'SNo', header: 'sno', size: 140 },
  //   { accessorKey: 'docid', header: 'Invoice No', size: 140 },
  //   { accessorKey: 'docDate', header: 'Invoice Date', size: 140 },
  //   { accessorKey: 'refNo', header: 'Ref No', size: 140 },
  //   { accessorKey: 'refDate', header: 'Ref Date', size: 140 },
  //   { accessorKey: 'suppRefNo', header: 'Supp Ref No', size: 140 },
  //   { accessorKey: 'suppRefDate', header: 'Supp Ref Date', size: 140 },
  //   // { accessorKey: 'subledgerCode', header: 'Party Code', size: 140 },
  //   // { accessorKey: 'subledgerName', header: 'Party', size: 400 },
  //   // { accessorKey: 'currency', header: 'Currency', size: 140 },
  //   { accessorKey: 'particulars', header: 'Particulars', size: 400 },
  //   { accessorKey: 'opbal', header: 'Op Bal.', size: 140 },
  //   // { accessorKey: 'cbranch', header: 'Ctrl Branch', size: 140 },

  //   { accessorKey: 'dbAmount', header: 'Db Amt', size: 140, cell: (info) => info.getValue(),
  //     className: 'align-right'},
  //     { accessorKey: 'crAmount', header: 'Cr Amt', size: 140 },

  //     { accessorKey: 'billDbAmount', header: 'Bill Db Amt', size: 140, cell: (info) => info.getValue(),
  //       className: 'align-right'},

  //     { accessorKey: 'billCrAmount', header: 'Bill Cr Amt', size: 140 ,cell: (info) => info.getValue(),
  //       className: 'align-right'},

  // ];

  const reportColumns = [
    { accessorKey: "gstin", header: "GSTIN", size: 180 },
    { accessorKey: "branchCode", header: "Branch Code", size: 180 },
    { accessorKey: "caption", header: "Caption", size: 180 },
    { accessorKey: "bizType", header: "Business Type", size: 180 },
    { accessorKey: "irnServiceType", header: "IRN Service Type", size: 180 },
    { accessorKey: "vchNo", header: "Voucher No.", size: 180 },
    { accessorKey: "vchDt", header: "Voucher Date", size: 140 },
    { accessorKey: "docId", header: "Invoice No.", size: 180 },
    { accessorKey: "docDt", header: "Invoice Date", size: 140 },
    { accessorKey: "partyCode", header: "Party Code", size: 180 },
    { accessorKey: "partyType", header: "Party Type", size: 180 },
    { accessorKey: "partyName", header: "Party Name", size: 480 },
    { accessorKey: "pgstin", header: "Party GSTIN", size: 180 },
    { accessorKey: "pSupply", header: "Supply", size: 180 },
    {
      accessorKey: "chargeCode",
      header: "Charge Code",
      size: 140,
    },
    {
      accessorKey: "gchargeCode",
      header: "G Charge Code",
      size: 140,
    },
    {
      accessorKey: "chargeName",
      header: "Charge Name",
      size: 380,
    },
    {
      accessorKey: "lCamT",
      header: "LCA Amt",
      size: 140,
      cell: (info) => info.getValue(),
      className: "align-right",
    },
    {
      accessorKey: "totInvAmtLC",
      header: "Total Invoice Amt (LC)",
      size: 180,
      cell: (info) => info.getValue(),
      className: "align-right",
    },
    { accessorKey: "gstP", header: "GST Percentage", size: 140 },
    { accessorKey: "gstType", header: "GST Type", size: 140 },
    {
      accessorKey: "gst",
      header: "GST Amount",
      size: 140,
      cell: (info) => info.getValue(),
      className: "align-right",
    },
    {
      accessorKey: "igst",
      header: "IGST",
      size: 140,
      cell: (info) => info.getValue(),
      className: "align-right",
    },
    {
      accessorKey: "cgst",
      header: "CGST",
      size: 140,
      cell: (info) => info.getValue(),
      className: "align-right",
    },
    {
      accessorKey: "sgst",
      header: "SGST",
      size: 140,
      cell: (info) => info.getValue(),
      className: "align-right",
    },
    { accessorKey: "maker", header: "Maker", size: 380 },
    { accessorKey: "approver", header: "Approver", size: 380 },
    { accessorKey: "ackDt", header: "Ack Date", size: 140 },
    { accessorKey: "ackNo", header: "Ack No.", size: 180 },
    { accessorKey: "irnId", header: "IRN ID", size: 180 },
    { accessorKey: "type", header: "Type", size: 80 },
    { accessorKey: "fType", header: "F Type", size: 80 },
    { accessorKey: "product", header: "Product", size: 40 },
    { accessorKey: "territory", header: "Territory", size: 180 }, // Added territory column
  ];

  const handleInputChange = (e) => {
    setSlab1(e.target.value); // Update the state when user types
  };

  const handleImageClick = () => {
    // window.history.back(); // Takes the user to the previous page
    navigate("/Reports");
  };

  // const FromhandleDateChange = (event) => {
  //   const newDate = event.target.value;

  //   const formattedFromdt = newDate ? dayjs(newDate).format('DD-MM-YYYY') : null;

  //   setFromdt(formattedFromdt); // Update the state with the selected date
  // };

  // const TohandleDateChange = (event) => {
  //   const newDate = event.target.value;

  //   const formattedTodt = newDate ? dayjs(newDate).format('DD-MM-YYYY') : null;

  //   setTodt(formattedTodt); // Update the state with the selected date
  // };

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length > 0) {
      setFromdt(dates[0]); // First date is the fromDate
      setTodt(dates[1]); // Second date is the toDate
    } else {
      setFromdt(null);
      setTodt(null);
    }
  };
  // Fetch data based on the selected filters
  const fetchData = () => {
    setLoading(true);

    // Format the date before passing to API
    // const formattedFromDate = fromDate ? fromDate.format('DD-MM-YYYY') : null;
    // const formattedToDate = toDate ? toDate.format('DD-MM-YYYY') : null;

    // const formattedAsonDate = asondt ? asondt.format('DD-MM-YYYY') : null;
    // const formattedfromdt = fromdt ? dayjs(fromdt, 'DD/MM/YYYY').format('DD/MM/YYYY') : null;

    // const formattedtodt = todt ? dayjs(todt, 'DD/MM/YYYY').format('DD/MM/YYYY') : null;
    // Call API with filters
    const formattedFromDate = fromdt ? fromdt.format("DD/MM/YYYY") : null;
    const formattedToDate = todt ? todt.format("DD/MM/YYYY") : null;
    const tparty = "ALL";
    getGSTR1Filling(pbranchname, tparty, formattedFromDate, formattedToDate)
      .then((response) => {
        // Set data state with the updated data (result + grand total)
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

  return (
    <ConfigProvider theme={themeConfig}>
      <div
        className="card w-full p-6 bg-base-100 shadow-xl "
        style={{ padding: "20px", borderRadius: "10px", height: "100%" }}
      >
        {/* Filter Section */}
        <div className="row d-flex ml" style={{ marginTop: "40px" }}>
          <div
            className="d-flex flex-wrap justify-content-start mb-4"
            style={{ marginBottom: "20px" }}
          >
            <b>
              <p style={{ align: "center" }}>
                GSTR1 Filling{" "}
                {/* <img
                src={rewindbutton}
                alt="Go back"
                style={{ width: "30px", marginLeft: "60px", cursor: "pointer" }}
                onClick={handleImageClick}
              />{" "} */}
                <ButtonNew />
                <Button
                  className="button1"
                  type="text"
                  icon={theme === "light" ? <MoonOutlined /> : <SunOutlined />}
                  onClick={toggleTheme}
                  size="small"
                  style={{ marginLeft: "10px" }}
                >
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </Button>
              </p>
            </b>{" "}
            <br />
            <Space style={{ marginBottom: "20px" }}>
              {/* Branch Name Dropdown */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {/* Status Label and Dropdown */}
                {/* 
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "200px",
                }}
              >
                <label
                  htmlFor="party-select"
                  style={{ marginBottom: "8px", fontWeight: "bold" }}
                >
                  Party Name
                </label>

                <div className="input-data">
                  <Select
                    showSearch // Enable search functionality
                    value={selectedParty}
                    onChange={setSelectedParty}
                    // onChange={(value) => setSubledgerName(value)}
                    placeholder="Select a Party"
                    style={{ width: "100%" }} // Ensure the dropdown is wide enough
                    loading={loading}
                  >
                    {party.length > 0 ? (
                      party.map((partyItem) => (
                        <MenuItem
                          key={partyItem.party_name}
                          value={partyItem.party_name}
                        >
                          {partyItem.party_name}
                        </MenuItem>
                      ))
                    ) : (
                      <Select.Option disabled>
                        No party names available
                      </Select.Option>
                    )}
                  </Select>
                </div>
              </div> */}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "180px",
                  }}
                >
                  <label
                    htmlFor="branch-select"
                    style={{ marginBottom: "8px", fontWeight: "bold" }}
                  >
                    Branch Name
                  </label>
                  <Select
                    id="branch-select"
                    value={pbranchname}
                    onChange={(value) => setPbranchName(value)}
                    placeholder="Select Branch"
                  >
                    <Option value="">Select Branch</Option>
                    {branchNames && branchNames.length > 0 ? (
                      branchNames.map((branch) => (
                        <Option
                          key={branch.branchCode}
                          value={branch.branchCode}
                        >
                          {branch.branchName}
                        </Option>
                      ))
                    ) : (
                      <Option value="">No branches available</Option>
                    )}
                  </Select>
                </div>

                {/* Status Label and Dropdown */}

                {/* <div style={{ display: 'flex', flexDirection: 'column', width: '140px' }}>
        <label htmlFor="division-select" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
          FromDate
        </label>
      <input
        type="date"
        id="fromdt"
        value={fromdt ? dayjs(fromdt, 'DD-MM-YYYY').format('YYYY-MM-DD') : ''}
        onChange={FromhandleDateChange}
        placeholder="DD/MM/YYYY"
      />
    </div>

      
    <div style={{ display: 'flex', flexDirection: 'column', width: '140px' }}>
        <label htmlFor="division-select" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
          ToDate
        </label>
      <input
        type="date"
        id="todt"
        value={todt ? dayjs(todt, 'DD-MM-YYYY').format('YYYY-MM-DD') : ''}
        onChange={TohandleDateChange}
        placeholder="DD/MM/YYYY"
      />
    </div> */}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "240px",
                  }}
                >
                  <label
                    htmlFor="date-range-picker"
                    style={{ marginBottom: "8px", fontWeight: "bold" }}
                  >
                    Date Range
                  </label>
                  <RangePicker
                    id="date-range-picker"
                    value={[fromdt, todt]}
                    onChange={handleDateRangeChange}
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                    placeholder={["Start Date", "End Date"]}
                  />
                </div>

                <button class="Btn" style={{ marginTop: "30px" }}>
                  <span class="leftContainer">
                    <span class="like" onClick={fetchData} loading={loading}>
                      Search
                    </span>
                  </span>
                  <span
                    class="likeCount"
                    onClick={() => {
                      setPbranchName("");
                      setFromdt("");
                      setTodt("");
                      setSelectedParty(null);
                      //   fetchData(); // Re-fetch data without filters
                    }}
                  >
                    Clear
                  </span>
                </button>
              </div>
            </Space>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          //    <div className="loading-spinner" style={{ textAlign: 'center', width: '100%' }}>
          //    <Progress size="large" />
          //  </div>
          <Col style={{ display: "flex", justifyContent: "center" }}>
            <div
              class="loader"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </Col>
        ) : (
          <div className="mt-4" style={{ marginTop: "30px", color: "blue" }}>
            {/* Conditionally Render the Table or the 'No Records Found' Message */}
            {data.length > 0 ? (
              <CommonTable
                data={data}
                columns={reportColumns}
                loading={loading}
              />
            ) : (
              <NoDataAvailable message="No records to display" />
            )}
          </div>
        )}

        {/* No Data Message */}
      </div>
    </ConfigProvider>
  );
};

export default GSTR1Filling;
