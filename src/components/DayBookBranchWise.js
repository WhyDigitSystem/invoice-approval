import React, { useState, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { notification } from "antd";
import { Button, Select, DatePicker, Space, Col } from "antd";
import { getDayBookBranchWise } from "../services/api";
import { getUserBranch } from "../services/api"; // Import getUserBranch function
import CommonTable from "./CommonTable";
import rewindbutton from ".././rewindbutton.png";
import Spinner3 from ".././Spinner3.gif";
import NoDataAvailable from "../utils/NoDataAvailable";
import "./Button.css";
import { useNavigate } from "react-router-dom";
import ButtonNew from "./ButtonNew";

const { Option } = Select;

export const DayBookBranchWise = () => {
  // States for filter values
  const [branchName, setBranchName] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [branchNames, setBranchNames] = useState([]); // Initialize as empty array
  const { RangePicker } = DatePicker; // Destructure RangePicker

  const navigate = useNavigate();
  const handleImageClick = () => {
    // window.history.back(); // Takes the user to the previous page
    navigate("/Reports");
  };

  // Handle date range change
  const handleDateRangeChange = (dates) => {
    if (dates && dates.length > 0) {
      setFromDate(dates[0]); // First date is the fromDate
      setToDate(dates[1]); // Second date is the toDate
    } else {
      setFromDate(null);
      setToDate(null);
    }
  };
  // Table columns definition
  const reportColumns = [
    { accessorKey: "branchCode", header: "Branch", size: 80 },
    {
      accessorKey: "vchNo",
      header: "VchNo",
      size: 180,
      cell: (info) => info.getValue(),
      className: "align-right",
    },
    {
      accessorKey: "vchDate",
      header: "VchDate",
      size: 140,
      cell: (info) => info.getValue(),
      className: "align-right",
    },
    { accessorKey: "docId", header: "Docid", size: 140 },
    { accessorKey: "docDt", header: "DocDt", size: 140 },
    { accessorKey: "accountCode", header: "AccountCode", size: 140 },
    { accessorKey: "ledger", header: "Ledger", size: 280 },
    { accessorKey: "subledgerCode", header: "Code", size: 140 },
    { accessorKey: "subledgerName", header: "Party", size: 450 },
    { accessorKey: "curr", header: "Curr", size: 140 },
    { accessorKey: "exRate", header: "ExRate", size: 140 },
    { accessorKey: "bdbAmount", header: "BdbAmount", size: 140 },
    { accessorKey: "bcrAmount", header: "BCrAmount", size: 140 },
    { accessorKey: "remarks", header: "Remarks", size: 840 },
  ];

  // Fetch branch names on component mount
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

  // Fetch data based on the selected filters
  const fetchData = () => {
    setLoading(true);

    // Format the date before passing to API
    const formattedFromDate = fromDate ? fromDate.format("DD-MM-YYYY") : null;
    const formattedToDate = toDate ? toDate.format("DD-MM-YYYY") : null;

    // Call API with filters
    getDayBookBranchWise(branchName, formattedFromDate, formattedToDate)
      .then((response) => {
        // Set data state with the updated data (result + grand total)
        setData(response);
        console.log("data", data);
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
    <div
      className="card w-full p-6 bg-base-100 shadow-xl"
      style={{ padding: "20px", borderRadius: "10px", height: "100%" }}
    >
      {/* Filter Section */}
      <div className="row d-flex ml" style={{ marginTop: "40px" }}>
        <div
          className="d-flex flex-wrap justify-content-start mb-4"
          style={{ marginBottom: "20px" }}
        >
          <b>
            <p style={{ align: "center", marginBottom: "-50px" }}>
              DayBook Branch Wise{" "}
              {/* <img
                src={rewindbutton}
                alt="Go back"
                style={{ width: "30px", marginLeft: "60px", cursor: "pointer" }}
                onClick={handleImageClick}
              />{" "} */}
              <ButtonNew />
            </p>
          </b>{" "}
          <br />
          <br />
          <br />
          <Space style={{ marginBottom: "-50px" }}>
            {/* Branch Name Dropdown */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              {/* Branch Name Label and Dropdown */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "200px",
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
                  value={branchName}
                  onChange={(value) => setBranchName(value)}
                  placeholder="Select Branch"
                >
                  <Option value="">Select Branch</Option>
                  {branchNames && branchNames.length > 0 ? (
                    branchNames.map((branch) => (
                      <Option key={branch.branchCode} value={branch.branchName}>
                        {branch.branchName}
                      </Option>
                    ))
                  ) : (
                    <Option value="">No branches available</Option>
                  )}
                </Select>
              </div>

              {/* Date Range Label and Picker */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "300px",
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
                  value={[fromDate, toDate]}
                  onChange={handleDateRangeChange}
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY"
                  placeholder={["Start Date", "End Date"]}
                />
              </div>
            </div>

            {/* <div style={{ display: 'flex', gap: '1px', marginTop: '30px'  }}>
      <Button
        type="primary"
        icon={<SearchIcon />}
        onClick={fetchData}
      >
        Search
      </Button>
      </div> */}
            {/* <div style={{ display: 'flex', gap: '1px', marginTop: '30px'  }}>
      
      <Button
        icon={<ClearIcon />}
        onClick={() => {
          setBranchName('');
          setStatus('');
          setFromDate(null);
          setToDate(null);
          fetchData(); // Re-fetch data without filters
        }}
      >
        Clear
      </Button>
    </div> */}

            <div className="border w-full h-40 flex items-center justify-center">
              {/* <a href="#_" className="relative inline-block px-4 py-2 font-medium group" style={{marginTop:"30px"}}>
        <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
        <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black"></span>
        <span className="relative text-black group-hover:text-white" onClick={fetchData}>Search</span>
      </a>
    </div>



    <div className="border w-full h-40 flex items-center justify-center" style={{marginTop:"40px"}}>
      <a href="#_" className="relative inline-block px-4 py-2 font-medium group">
        <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
        <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black"></span>
        <span className="relative text-black group-hover:text-white" onClick={() => {
      setBranchName('');
      setStatus('');
      setFromDate(null);
      setToDate(null);
    }}>Clear</span>
      </a>*/}

              <button class="Btn" style={{ marginTop: "30px" }}>
                <span class="leftContainer">
                  <span class="like" onClick={fetchData}>
                    Search
                  </span>
                </span>
                <span
                  class="likeCount"
                  onClick={() => {
                    setBranchName("");
                    setStatus("");
                    setFromDate(null);
                    setToDate(null);
                  }}
                >
                  Clear
                </span>
              </button>
            </div>
          </Space>
        </div>
        <br />
        <br />
      </div>

      {loading ? (
        <Col style={{ display: "flex", justifyContent: "center" }}>
          {/* <img src={Spinner3} alt="Loading" style={{marginLeft:"550px"}}/> */}
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
  );
};

export default DayBookBranchWise;
