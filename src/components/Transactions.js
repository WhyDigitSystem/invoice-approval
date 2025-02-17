import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Trans.css";

const clientReportData = [
  { name: "Listing" },
  { name: "Approved List" },
  { name: "Approved2 List" },
  { name: "CN PreApproval" },
  { name: "CN Listing" },
  { name: "CN Approved List" },
  { name: "Add Expense" },
  { name: "Expense List" },
];

const routes = {
  "Listing": "/listing",
  "Approved List": "/ApprovedList",
  "Approved2 List": "/Approved2List",
  "CN PreApproval": "/CNPreApproval",
  "CN Listing": "/CRListing",
  "CN Approved List": "/CRApprovedList",
  "Add Expense": "/AddExpense",
  "Expense List": "/ExpenseList",
};

const Transactions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

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
    border: "1px solid #979695",
    borderRadius: "5px",
    textAlign: "center",
    fontSize: "16px",
    color: "black",
    textDecoration: "none",
    transition: "all 0.35s",
    boxSizing: "border-box",
    boxShadow: "0.3em 0.3em 0 #181617",
    backgroundColor: "transparent",
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

  return (
    <div className="container" style={{ padding: "20px", marginTop: "100px", boxShadow: "0 5px 10px rgba(0, 0, 0, 0.3)", background: "white" }}>
      {/* Search Input */}

      {/* <div class="input-container">
  <input placeholder="Search..." type="text"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  />
</div> */}

      <div class="InputContainer">
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
      <br/>

      {/* Buttons Wrapper */}
      <div className="buttons-wrapper" style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        {filteredAndSearchedMenuItems.map((item, index) => (
          <div className="btn cube" key={index} style={buttonStyles} onClick={() => handleNavigate(routes[item.name])}>
            <a href="#">
              <span className="fold"></span>
              {item.name}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transactions;
