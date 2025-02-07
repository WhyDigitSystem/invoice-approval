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
    // color: "#979695",
    color:"black",
    textDecoration: "none",
    transition: "all 0.35s",
    boxSizing: "border-box",
    boxShadow: "0.3em 0.3em 0 #181617",
    backgroundColor: "transparent",
    cursor: "pointer",
    
  
    
    

  };

  // const hoverStyles = {
  //   boxShadow: "-0.3em -0.3em 0 #181617",
  //   backgroundColor: "#dd6395",
  //   borderColor: "#dd6395",
  //   color: "#fff",
  // };

  const hoverStyles = {
    boxShadow: "-0.3em -0.3em 0 white",
    backgroundColor: "black",
    borderColor: "black",
    color: "white",
    
      left: 0,
      bordertopcolor: "#51c0ef",
      borderrightcolor: "#51c0ef",
      borderbottomcolor: "#5d576b",
      borderleftcolor: "#5d576b",
    
  };

  const handleNavigate = (route) => {
    navigate(route);
  };

  const responseScreens = localStorage.getItem("responseScreens");
  console.log("responseScreens",responseScreens);
  // let allowedScreens = [];
  let parsedScreens = [];

  try {
    if (responseScreens) {
      parsedScreens = JSON.parse(responseScreens);
      // allowedScreens = parsedScreens.map((screen) => screen.screenName);
    }
  } catch (error) {
    console.error("Error parsing responseScreens:", error);
  }

  // Filter menu items based on allowedScreens
  const filteredMenuItems = clientReportData.filter((menu) =>
    parsedScreens.includes(menu.name.toUpperCase())
  );

  console.log("menuItems", clientReportData);
  console.log("filteredMenuItems", filteredMenuItems);



  return (

    
    
    <div className="container" style={{ padding: "20px" ,marginTop:"100px",
      boxShadow:"0 5px 10px rgba(0, 0, 0, 0.3)",background:"white"
    }}>
      


      <div className="buttons-wrapper" style={{ display: "flex", flexWrap: "wrap",gap: "15px" ,bordercolor: "#51c0ef #51c0ef #5d576b #5d576b",
    left: 0}}>
        {filteredMenuItems.map((item, index) => (
          
          
          
          <div class="btn cube" key={index}
          style={buttonStyles}
            
            onClick={() => handleNavigate(routes[item.name])}
          > 
          <a href="#">
          <span class="fold"></span>
            {item.name}</a>
            
            


            </div>

            
        
        
        ))}
      </div>
      
    </div>
  );
};

export default Transactions;