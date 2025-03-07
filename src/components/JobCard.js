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
  Modal,
  Table,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  getAllOpenJobs,
  getUserBranch,
  getJobUnApproveDetails,
  getJobIncome,
  getJobExpense,
  getJobCloseddt,
  getJobCostDetails,
  getJobCostSummary,
} from "../services/api"; // mock API call
import EmailConfig from "../utils/emailConfig";
import NoDataFallback from "../utils/fallBack";
import CommonTable from "./CommonTable";
import JobCostSheetDetails from "./JobCostSheetDetails";
//   import "./date.css";
import "./JobCard.css";

import confetti from "canvas-confetti";
import ButtonTrans from "./ButtonTrans";
import JobCostSheetSummary from "./JobCostSheetSummary";
import NoDataAvailable from "../utils/NoDataAvailable";

const { Option } = Select;
const { Text } = Typography;
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8091";

const JobCard = () => {
  const [data, setData] = useState([]);
  const [dataIncome, setDataIncome] = useState([]);
  const [dataExpense, setDataExpense] = useState([]);
  const [dataUnApp, setDataUnApp] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailFlag, setEmailFlag] = useState(false);
  const [emailFlag2, setEmailFlag2] = useState(false);
  const [closeddt, setCloseddt] = useState([]);
  const [emailData, setEmailData] = useState([]);
  const [userType, setUserType] = useState(localStorage.getItem("userType"));
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [response, setResponse] = useState([]);
  const [selectedJobDetails, setSelectedJobDetails] = useState([]);
  const [selectedJobSummary, setSelectedJobSummary] = useState([]);

  const [unappbills, setUnAppBills] = useState([]);
  const [filter, setFilter] = useState({
    name: "",
    branchCode: "",
    amount: "",
    startDate: null,
    endDate: null,
  });
  const [selectedItem, setSelectedItem] = useState(null); // Modal data
  const [pbranchname, setPbranchName] = useState("");
  const [jobClosures, setJobClosures] = useState(false);
  const [branchNames, setBranchNames] = useState([]); // Initialize as empty array
  const [pjobNo, setpJobNo] = useState("");
  const [closed, setClosed] = useState(false);
  const [detailsData, setDetailsData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  // State for modal visibility and data
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isSummaryModalVisible, setIsSummaryModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null); // Store the selected job details
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
    // fetchData();
    const intervalId = setInterval(fetchData, 180000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Handle date change for each job
  const handleDateChange = (jobNo, date) => {
    setJobClosures((prevState) => {
      return {
        ...prevState,
        [jobNo]: {
          ...prevState[jobNo],
          closeddt: date, // Update date only
        },
      };
    });
  };

  const handleClosedChange = (jobNo) => {
    setJobClosures((prevState) => {
      const currentChecked = prevState[jobNo]?.checked;
      const updatedJobClosures = {
        ...prevState,
        [jobNo]: {
          ...prevState[jobNo],
          checked: !currentChecked, // Toggle checkbox state
        },
      };

      // If checkbox is checked, fetch the closeddt from the API
      if (!currentChecked) {
        const pclosed = "T"; // Assuming this is the value you want to send in the API call
        getJobCloseddt(jobNo, pclosed)
          .then((response) => {
            console.log("API Response:", response); // Debugging: Log the API response
            if (response?.paramObjectsMap?.jobcloseddtdetails) {
              const closeddtValue =
                response.paramObjectsMap.jobcloseddtdetails[0]?.closeddt;
              console.log("Closeddt Value:", closeddtValue); // Debugging: Log the closeddt value
              const formattedCloseddt = closeddtValue
                ? dayjs(closeddtValue).format("YYYY-MM-DD") // Format for date input
                : "";
              console.log("Formatted Closeddt:", formattedCloseddt); // Debugging: Log the formatted date

              // Update the closeddt value for the specific jobNo
              setCloseddt((prevCloseddt) => {
                const updatedCloseddt = {
                  ...prevCloseddt,
                  [jobNo]: formattedCloseddt, // Update specific jobNo closeddt
                };
                console.log("Updated closeddt state:", updatedCloseddt); // Log the updated state
                return updatedCloseddt;
              });
            } else {
              console.log("No closeddt found in response"); // Debugging: Log if no closeddt is found
              // If no closeddt, clear the date for that specific jobNo
              setCloseddt((prevCloseddt) => ({
                ...prevCloseddt,
                [jobNo]: "",
              }));
            }
          })
          .catch((error) => {
            console.error("Error fetching closeddt:", error); // Debugging: Log any errors
            notification.error({
              message: "Failed to fetch closeddt",
              description: "Error occurred while fetching closeddt data.",
            });
          });
      } else {
        // If checkbox is unchecked, clear the closeddt for that jobNo
        setCloseddt((prevCloseddt) => ({
          ...prevCloseddt,
          [jobNo]: "",
        }));
      }

      return updatedJobClosures;
    });
  };
  const fetchData = () => {
    setLoading(true);
    const pclosed = "T";
    // Fetch all open jobs
    getAllOpenJobs(pbranchname)
      .then((response) => {
        setData(response);
        console.log("Open jobs data fetched:", response);

        const jobRequests = response.map((item) => {
          const jobNo = item.jobNo;
          console.log("Fetching data for jobNo:", jobNo);

          // Fetch income data
          const incomePromise = getJobIncome(jobNo)
            .then((incomeResponse) => {
              console.log("Income Response for Job No:", jobNo, incomeResponse);
              return { jobNo, income: incomeResponse || null }; // Return null if no unapproved data
            })
            .catch((error) => {
              console.error("Error fetching job income for", jobNo, error);
              return { jobNo, income: 0 }; // Default to 0 on error
            });

          // Fetch expense data
          const expensePromise = getJobExpense(jobNo)
            .then((expenseResponse) => {
              console.log(
                "Expense Response for Job No:",
                jobNo,
                expenseResponse
              );
              return { jobNo, expense: expenseResponse || null }; // Return null if no unapproved data
            })
            .catch((error) => {
              console.error("Error fetching job expense for", jobNo, error);
              return { jobNo, expense: 0 }; // Default to 0 on error
            });

          // Fetch unapproved bills data
          const unapprovePromise = getJobUnApproveDetails(jobNo)
            .then((unapproveResponse) => {
              console.log(
                "Unapproved Response for Job No:",
                jobNo,
                unapproveResponse
              );
              return { jobNo, unapprove: unapproveResponse || null }; // Return null if no unapproved data
            })
            .catch((error) => {
              console.error(
                "Error fetching unapproved bills for",
                jobNo,
                error
              );
              return { jobNo, unapprove: null }; // Return null on error
            });

          return Promise.all([incomePromise, expensePromise, unapprovePromise]);
        });

        // Wait for all job data promises to resolve
        Promise.all(jobRequests)
          .then((results) => {
            const incomeData = {};
            const expenseData = {};
            const unapprovedData = {};

            // Populate state with the resolved data
            results.forEach(([income, expense, unapprove]) => {
              incomeData[income.jobNo] = income.income;
              expenseData[expense.jobNo] = expense.expense;
              unapprovedData[unapprove.jobNo] = unapprove.unapprove;
            });

            // Update state with the fetched data
            setDataIncome(incomeData);
            setDataExpense(expenseData);
            setDataUnApp(unapprovedData);

            console.log("Income Data:", incomeData);
            console.log("Expense Data:", expenseData);
            console.log("Unapproved Data:", unapprovedData);
            setLoading(false); // Set loading to false once data has been fetched
          })
          .catch((error) => {
            console.error("Error fetching job details:", error);
            setLoading(false); // Handle loading state on error
          });
      })
      .catch((error) => {
        console.error("Error fetching open jobs:", error);
        notification.error({
          message: "Data Fetch Error",
          description: "Failed to fetch updated data for the listing.",
        });
        setLoading(false); // Set loading to false when there’s an error
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

  

  const handleApprove = async (item) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/InvoiceApproval/approval1?approval=${"1"}&createdby=${localStorage.getItem(
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

        setEmailData([item]);
        console.log("Email Data", emailData);

        // Handle first email flag logic
        if (
          response.data.paramObjectsMap.gstInvoiceHdrVO.approveEmail === "T" &&
          response.data.paramObjectsMap.gstInvoiceHdrVO.approve1 === "T" &&
          response.data.paramObjectsMap.gstInvoiceHdrVO.eligiSlab === 2
        ) {
          setEmailFlag(true);
        } else {
          setEmailFlag(false);
        }

        // Handle second email flag logic
        if (
          response.data.paramObjectsMap.gstInvoiceHdrVO.approveEmail === "T" &&
          response.data.paramObjectsMap.gstInvoiceHdrVO.approve1 === "T" &&
          response.data.paramObjectsMap.gstInvoiceHdrVO.eligiSlab === 3
        ) {
          setEmailFlag2(true);
        } else {
          setEmailFlag2(false);
        }

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
        `${API_URL}/api/InvoiceApproval/approval1?approval=${"0"}&createdby=${localStorage.getItem(
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
    navigate("/ApprovedList"); // Navigate to the approved list page
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

  const openDetailsData = (branchname, jobNo) => {
    console.log("openDetailsData", branchname, jobNo);
    navigate("/JobCostSheetDetails", { state: { branchname, jobNo } });
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

  const handleModalClose = () => {
    setIsModalVisible(false); // Close the modal
    setSelectedJob(null); // Clear the selected job details
  };

  const handleDetailsClick = (branchName, jobNo) => {
    setSelectedJobDetails({ branchName, jobNo }); // Set the selected job for Details
    setIsDetailsModalVisible(true); // Open the Details modal
  };

  const handleSummaryClick = (branchName, jobNo) => {
    setSelectedJobSummary({ branchName, jobNo }); // Set the selected job for Summary
    setIsSummaryModalVisible(true); // Open the Summary modal
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalVisible(false); // Close the Details modal
    setSelectedJobDetails(null); // Clear the selected job for Details
  };

  const handleSummaryModalClose = () => {
    setIsSummaryModalVisible(false); // Close the Summary modal
    setSelectedJobSummary(null); // Clear the selected job for Summary
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
    <div className="container">
      {/* First Row: Branch Name */}
      <div
        className="label-customer"
        style={{
          textAlign: "center",
          width: "100%",
          marginTop: "-60px",
          // color: theme === "dark" ? "white" : "#3498db",
          fontSize: "24px",

          // marginLeft: "-20px",
        }}
      >
        Job Cards
        {/* <img
                      src={rewindbutton}
                      alt="Go back"
                      style={{ width: "30px", marginLeft: "30px", cursor: "pointer" }}
                      onClick={handleImageClick}
                    /> */}
      </div>
      <div className="branch-name">
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
              <Option key={branch.branchCode} value={branch.branchName}>
                {branch.branchName}
              </Option>
            ))
          ) : (
            <Option value="">No branches available</Option>
          )}
        </Select>
        <button
          className="Btn"
          style={{ marginLeft: "300px", marginTop: "-30px" }}
        >
          <span className="leftContainer">
            <span className="like" onClick={fetchData} loading={loading}>
              Search
            </span>
          </span>
          <span
            className="likeCount"
            onClick={() => {
              setPbranchName("");
              //   fetchData(); // Re-fetch data without filters
            }}
          >
            Clear
          </span>
        </button>
      </div>
      <br />
      {/* Search Button */}

      {/* Second Row: Cards */}
      {loading ? (
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
        <div className="cards-container">
          {data.length > 0 ? (
            <div className="cards-container">
              {data.map((item, index) => {
                const jobNo = item.jobNo;
                const income = dataIncome[jobNo];
                const expense = dataExpense[jobNo];
                const unapprove = dataUnApp[jobNo];

                return (
                  <div className="receipt" key={jobNo}>
                    <div className="card">
                      <p className="shop-name">{jobNo}</p>
                      <button
                        class="cta"
                        style={{
                          color: "red",
                          fontSize: "14px",
                          width: "bold",
                        }}
                      >
                        <span
                          onClick={() => handleDetailsClick(pbranchname, jobNo)}
                        >
                          Details
                        </span>

                        <span
                          onClick={() => handleSummaryClick(pbranchname, jobNo)}
                        >
                          Summary
                        </span>
                      </button>
                      <p className="info">
                        Customer
                        <br /> {item.customer}
                        <br />
                        Party: <br />
                        {item.party}
                        <br />
                        Category
                        <br /> {item.category}
                        <br />
                        Salesperson
                        <br /> {item.salesperson}
                        <br />
                        Operational Closed <br />{" "}
                        {item.opsClosed === "T" ? "Closed" : "Open"}
                        <br />
                        Mpol {item.mpolCountry} | Hpod {item.hpodCountry}
                      </p>
                      <table>
                        <thead>
                          <tr>
                            <th>Income</th>
                            <th>Expense</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              {income && income[0] ? income[0].income : "N/A"}
                            </td>
                            <td>
                              {expense && expense[0]
                                ? expense[0].expense
                                : "N/A"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div
                        className="total"
                        style={{ marginTop: "-10px", color: "blue" }}
                      >
                        <p style={{ fontSize: "14px" }}>Un Approved Bills:</p>{" "}
                        <p style={{ fontSize: "14px" }}>
                          {unapprove && unapprove[0]
                            ? unapprove[0].unapprove
                            : "N/A"}{" "}
                        </p>
                      </div>
                      <div
                        className="total"
                        style={{ marginTop: "-10px", color: "blue" }}
                      >
                        <p style={{ fontSize: "18px" }}>Profit:</p>
                        <p style={{ fontSize: "18px" }}>
                          {
                            (
                              (income && income[0]
                                ? parseFloat(income[0].income.replace(/,/g, ""))
                                : 0) -
                              (expense && expense[0]
                                ? parseFloat(
                                    expense[0].expense.replace(/,/g, "")
                                  )
                                : 0)
                            )
                              .toFixed(2) // Format to 2 decimal places
                              .replace(/\d(?=(\d{3})+\.)/g, "$&,") // Add commas to the number
                          }{" "}
                        </p>
                      </div>
                      {unapprove &&
                      unapprove[0] &&
                      unapprove[0].unapprove !== "T" &&
                      item.opsClosed === "T" ? (
                        <div>
                          <label className="custom-checkbox">
                            <input
                              type="checkbox"
                              checked={
                                jobClosures[item.jobNo]?.checked || false
                              }
                              onChange={() => handleClosedChange(item.jobNo)} // Handle checkbox change
                            />
                            <span className="checkmark"></span>

                            {/* Show closedDt only if checkbox is checked */}
                            {jobClosures[item.jobNo]?.checked &&
                              item.nclosedDt && <span>{item.nclosedDt}</span>}
                          </label>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <NoDataAvailable message="No records to display" />
          )}
          <Modal
            title="Job Cost Sheet Details"
            visible={isDetailsModalVisible}
            onCancel={handleDetailsModalClose}
            footer={null}
            width="80%"
            destroyOnClose // Ensure the modal content is destroyed when closed
          >
            {selectedJobDetails && (
              <JobCostSheetDetails
                branchName={selectedJobDetails.branchName}
                jobNo={selectedJobDetails.jobNo}
              />
            )}
          </Modal>

          <Modal
            // title="Job Cost Sheet Summary"
            visible={isSummaryModalVisible}
            onCancel={handleSummaryModalClose}
            // footer={null}
            width="80%"
            destroyOnClose // Ensure the modal content is destroyed when closed
          >
            {selectedJobSummary && (
              <JobCostSheetSummary
                branchName={selectedJobSummary.branchName}
                jobNo={selectedJobSummary.jobNo}
              />
            )}
          </Modal>
        </div>
      )}
    </div>
  );
};

export default JobCard;
