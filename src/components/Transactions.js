import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Trans.css";
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
  Row,
  Space,
  Spin,
  Typography,
} from "antd";

const clientReportData = [
  { name: "Tax Inv Approval" },
  { name: "Tax Inv Approved" },
  // { name: "Approved2 List" },
  { name: "CN Request" },
  { name: "CN - Branch Approval" },
  { name: "CN - Corp. Approval" },
  // { name: "CN Approved List" },
  // { name: "CN Approved List2" },
  // { name: "Add Expense" },
  // { name: "Expense List" },
  // { name: "Policy Amendment" },
  { name: "TT Listing" },
  { name: "TT Approved List" },
  { name: "WH Listing" },
  { name: "WH Approved List" },
];

const routes = {
  "Tax Inv Approval": "/listing",
  "Tax Inv Approved": "/ApprovedList",
  // "Approved2 List": "/Approved2List",
  "CN Request": "/CNPreApproval",
  "CN - Branch Approval": "/CRListing",
  "CN - Corp. Approval": "/CRPendingList",
  "CN - Branch Approved": "/CRApprovedList",
  "CN - Corp. Approved": "/CRApprovedList2",
  // "Add Expense": "/AddExpense",
  // "Expense List": "/ExpenseList",
  // "Policy Amendment": "/PartyMasterUpdate",
  "TT Listing": "/TTlisting",
  "TT Approved List": "/TTApprovedList",

  "WH Listing": "/WHlisting",
  "WH Approved List": "/WHApprovedList",
};

const Transactions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Filter menu items based on allowedScreens
  const responseScreens = localStorage.getItem("responseScreens");
  let parsedScreens = [];

  try {
    if (responseScreens) {
      parsedScreens = JSON.parse(responseScreens);
    }
  } catch (error) {
    console.error("Error parsing responseScreens:", error);
  }

  // Filtered client report data based on screens
  const filteredMenuItems = clientReportData.filter((menu) =>
    parsedScreens.includes(menu.name.toUpperCase())
  );

  // Filter further based on the search term
  const filteredAndSearchedMenuItems = filteredMenuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Button styles
  const buttonStyles = {
    display: "flex",
    width: "200px",
    height: "40px",
    justifyContent: "center",
    alignItems: "center",
    margin: "0.5rem",
    marginTop: "35px",
    // border: "1px solid #979695",
    borderRadius: "5px",
    textAlign: "center",
    fontSize: "16px",
    color: "black",
    textDecoration: "none",
    transition: "all 0.35s",
    boxSizing: "border-box",
    // boxShadow: "0.3em 0.3em 0 #181617",
    // backgroundColor: "transparent",
    cursor: "pointer",
  };

  const hoverStyles = {
    boxShadow: "-0.3em -0.3em 0 white",
    backgroundColor: "black",
    borderColor: "black",
    color: "white",
  };

  const handleNavigate = (route) => {
    navigate(route);
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

  return (
    <div
      className="sticky-note sticky-note-one1"
      // className="container"
      style={{
        padding: "20px",
        marginTop: "70px",
        // boxShadow: "0 5px 10px rgba(0, 0, 0, 0.3)",
        // background: "white",
        // position: "relative",
        backgroundColor: "#fff",
        width: "800px",
        minHeight: "10px",
        padding: "20px",
        margin: "70px auto 0",
        filter: "drop-shadow(0px 1px 10px rgba(0, 0, 0, 0.3))",
      }}
    >
      {/* Search Input */}

      {/* <div class="input-container">
      <input placeholder="Search..." type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div> */}

      <div className="InputContainer">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #979695",
          }}
        />
      </div>

      <Button
        className="button1"
        type="text"
        icon={theme === "light" ? <MoonOutlined /> : <SunOutlined />}
        onClick={toggleTheme}
        size="small"
        style={{ marginLeft: "550px", marginTop: "-90px" }}
      >
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </Button>

      {/* Buttons Wrapper */}
      <div
        // className="buttons-wrapper"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px", // Adjust gap between buttons
          justifyContent: "space-between", // Align buttons evenly
          padding: "10px", // Optional: Add padding for spacing
        }}
      >
        {filteredAndSearchedMenuItems.map((item, index) => (
          <div
            // className="btn cube"
            key={index}
            style={buttonStyles}
            onClick={() => handleNavigate(routes[item.name])}
          >
            <a href="#">
              {/* <span className="fold"></span> */}
              <Button className="button11" style={{ fontSize: "14px" }}>
                {item.name}
              </Button>
            </a>
          </div>
        ))}
      </div>

      <div
        style={{
          content: '""',
          display: "block",
          position: "absolute",
          bottom: "-10px",
          left: "0",
          width: "100%",
          height: "10px",
          background:
            "linear-gradient(45deg, transparent 33.333%, #FFF 33.333%, #FFF 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, #FFF 33.333%, #FFF 66.667%, transparent 66.667%)",
          backgroundSize: "20px 40px",
          transform: "rotate(180deg)",
        }}
      ></div>
    </div>
    // <div
    //   style={{
    //     position: "relative",
    //     backgroundColor: "#fff",
    //     width: "300px",
    //     minHeight: "10px",
    //     padding: "20px",
    //     margin: "20px auto 0",
    //     filter: "drop-shadow(0px 1px 10px rgba(0, 0, 0, 0.8))",
    //   }}
    // >

    // </div>
  );
};

export default Transactions;
