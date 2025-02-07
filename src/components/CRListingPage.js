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
  import { getCRListingData } from "../services/api"; // mock API call
  import EmailConfig from "../utils/emailConfig";
  import NoDataFallback from "../utils/fallBack";
  import "./date.css";
  import "./style.css";
  
  import confetti from "canvas-confetti";
  
  const { Option } = Select;
  const { Text } = Typography;
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8091";
  
  const CRListingPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [emailFlag, setEmailFlag] = useState(false);
    const [emailFlag2, setEmailFlag2] = useState(false);
    const [emailData, setEmailData] = useState([]);
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
  
    const fetchData = () => {
      setLoading(true);
      getCRListingData()
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
  

    const handleApprove = async (item) => {
      try {
        const response = await axios.put(
          `${API_URL}/api/crpreapp/approval1?approval=${"1"}&createdby=${localStorage.getItem(
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
          `${API_URL}/api/crpreapp/approval1?approval=${"0"}&createdby=${localStorage.getItem(
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
          item.partyName.toLowerCase().includes(filter.partyName?.toLowerCase() || ""));
  
          const branchMatch =
          filter.branchName === "" ||
          (item.branchName &&
            item.branchName.toLowerCase().includes(filter.branchName?.toLowerCase() || ""));
  
      const amountMatch =
        filter.invAmt === null ||
        (item.invAmt && item.invAmt.includes(filter.invAmt));
  

  
      const startDateMatch =
        !filter.startDate || new Date(item.vchDt) >= new Date(filter.vchDt);
  
      const endDateMatch =
        !filter.endDate || new Date(item.vchDt) <= new Date(filter.vchDt);
  
      return (
        nameMatch &&
        branchMatch &&
        amountMatch &&
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
                    <p> Pre Credit Note Requests</p>
                    <div>
                      <Button
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
                          type="text"
                          icon={<LogoutOutlined />}
                          size="small"
                        >
                          Filter
                        </Button>
                        <Button
                          type="text"
                          icon={<RightCircleOutlined />}
                          onClick={approvedList}
                          size="small"
                          style={{ alignSelf: "center" }}
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
                                     <Col xs={24} sm={12} md={8} key={item.gst_precreditId}>
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
                                               Invoice No:
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
                                              <br/>
                                             
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
                                             </div>

                                                <Space style={{ marginTop: "10px",marginLeft: "50px" }}>
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



                                                                         
<button class="Btn1" >
  <span class="leftContainer1" onClick={(e) => {
                                                                               e.stopPropagation();
                                                                               handleApprove(item);
                                                                               handleCelebrate();
                                                                             }}>
    <span class="like1" >Approve</span>
  </span>
  <span class="likeCount1" onClick={(e) => {
                                                                               e.stopPropagation();
                                                                               handleReject(item);
                                                                             }}>
    Reject
  </span>
</button>

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
  
  export default CRListingPage;
  