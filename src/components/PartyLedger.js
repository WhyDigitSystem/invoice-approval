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
import {
  LogoutOutlined,
  MoonOutlined,
  RightCircleOutlined,
  SunOutlined,
  FolderOpenOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import { getPartyLedger, getPartyLedgerPartyName } from "../services/api";
import { getUserBranch } from "../services/api"; // Import getUserBranch function
import CommonTable from "./CommonTable";
// import dayjs from 'dayjs';
import { useNavigate } from "react-router-dom";
import { MenuItem, CircularProgress } from "@mui/material";
import "./ApAgeing.css";
import NoDataAvailable from "../utils/NoDataAvailable";
import { AiFillBackward } from "react-icons/ai";
import rewindbutton from ".././rewindbutton.png";

import Spinner3 from ".././Spinner3.gif";
import moment from "moment";
import { format } from "date-fns";
import ButtonNew from "./ButtonNew";

const { Option } = Select;

export const PartyLedger = () => {
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

  // Fetch parties based on selected Type
  const fetchPartyByType = (selectedType) => {
    setLoading(true); // Set loading to true when fetching data
    getPartyLedgerPartyName(selectedType)
      .then((response) => {
        setParty(response); // Update party state with fetched data
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch(() => {
        notification.error({
          message: "Data Fetch Error",
          description: "Failed to fetch Party Names based on selected Type.",
        });
        setLoading(false);
      });
  };

  // Handle Type selection change
  const handleTypeChange = (value) => {
    setPtype(value); // Update the Type state
    fetchPartyByType(value); // Fetch Party Names based on selected Type
  };

  const reportColumns = [
    {
      accessorKey: "sno",
      header: "SNo",
      size: 140,
    },
    { accessorKey: "docid", header: "Docid", size: 180 },
    { accessorKey: "docDate", header: "Date", size: 140 },
    { accessorKey: "refNo", header: "Ref No", size: 140 },
    { accessorKey: "refDate", header: "Ref Date", size: 140 },
    { accessorKey: "particulars", header: "Particulars", size: 400 },
    {
      accessorKey: "dbAmount",
      header: "Db Amt",
      size: 140,
      cell: (info) => info.getValue(),
      className: "align-right",
    },
    { accessorKey: "crAmount", header: "Cr Amt", size: 140 },
    {
      accessorKey: "billDbAmount",
      header: "Bill Db Amt",
      size: 140,
      cell: (info) => info.getValue(),
      className: "align-right",
    },
    {
      accessorKey: "billCrAmount",
      header: "Bill Cr Amt",
      size: 140,
      cell: (info) => info.getValue(),
      className: "align-right",
    },
    { accessorKey: "suppRefNo", header: "Supp Ref No", size: 140 },
    { accessorKey: "suppRefDate", header: "Supp Ref Date", size: 140 },
  ];

  const handleInputChange = (e) => {
    setSlab1(e.target.value); // Update the state when user types
  };

  const handleImageClick = () => {
    // window.history.back(); // Takes the user to the previous page
    navigate("/Reports");
  };

  // Fetch data when branch name changes
  const fetchPartyData = (ptype) => {
    setLoading(true);
    getPartyLedgerPartyName(ptype)
      .then((response) => {
        console.log(response); // Log to verify data structure
        setParty(response);
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
    getPartyLedger(
      pbranchname,
      selectedParty,
      formattedFromDate,
      formattedToDate,
      ptype,
      div
    )
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
                Party Ledger{" "}
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "150px",
                  }}
                >
                  <label
                    htmlFor="type-select"
                    style={{ marginBottom: "8px", fontWeight: "bold" }}
                  >
                    Type
                  </label>
                  <Select
                    id="type-select"
                    value={ptype}
                    onChange={handleTypeChange}
                    placeholder="Select Type"
                  >
                    <Option value="">Select Type</Option>
                    <Option value="CUSTOMER">Customer</Option>
                    <Option value="INTERCOMPANY">InterCompany</Option>
                    <Option value="AIR CARRIER">Air Carrier</Option>
                    <Option value="SEA CARRIER">Sea Carrier</Option>
                    <Option value="PARTNER">Partner</Option>
                    <Option value="VENDOR">Vendor</Option>
                    <Option value="FX">FX</Option>
                  </Select>
                </div>

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
                            key={partyItem.subledgerName}
                            value={partyItem.subledgerName}
                          >
                            {partyItem.subledgerName}
                          </MenuItem>
                        ))
                      ) : (
                        <Select.Option disabled>
                          No party names available
                        </Select.Option>
                      )}
                    </Select>
                  </div>
                </div>

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
                          value={branch.branchName}
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "140px",
                  }}
                >
                  <label
                    htmlFor="division-select"
                    style={{ marginBottom: "8px", fontWeight: "bold" }}
                  >
                    With Details
                  </label>
                  <Select
                    id="division-select"
                    value={div}
                    onChange={(value) => setDiv(value)}
                    placeholder="With Details"
                  >
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                  </Select>
                </div>

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
                      setPtype(null);
                      setDiv(null);
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
                filters={{
                  branchname: pbranchname,
                  ptype: ptype,
                  customer: selectedParty,
                  fromdt: fromdt,
                  todt: todt,
                }}
                div
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

export default PartyLedger;
