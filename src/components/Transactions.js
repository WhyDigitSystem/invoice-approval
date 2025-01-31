import { Box, List, ListItem, ListItemText, Grid } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Mock Data for Reports
const clientReportData = [
  { name: "Listing", code: '' },
  { name: "Approved List", code: '' },
  { name: "Approved2 List", code: '' },
  { name: "CN PreApproval", code: '' },
  { name: "CN Listing", code: '' },
  { name: "CN Approved List", code: '' },
  { name: "Add Expense", code: '' },
  { name: "Expense List", code: '' },
];

// Define different background colors for each report
// const backgroundColors = [
//   "#dfe6e9",  // Light Gray
//   "#ffcccc",  // Light Red
//   "#c8e6c9",  // Light Green
//   "#fff59d",  // Light Yellow
//   "#f0f4c3",  // Light Lime
//   "#bbdefb",  // Light Blue
//   "#f3e5f5",  // Light Purple
//   "#ffeb3b",  // Yellow
// ];


const backgroundColors = [
  "#1abc9c",  // Light Gray
  "#2ecc71;",  // Light Red
  "#3498db",  // Light Green
  "#9b59b6",  // Light Yellow
  "#f0f4c3",  // Light Lime
  "#bbdefb",  // Light Blue
  "#f3e5f5",  // Light Purple
  // "#ffeb3b",  // Yellow
];

const Transactions = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const navigate = useNavigate();

  const handleCardClick = (item) => {
    const routes = {
      "Overview": "/overview",
      "Listing": "/listing",
      "Approved List": "/ApprovedList",
      "Approved2 List": "/Approved2List",
      "CN PreApproval": "/CNPreApproval",
      "CN Listing": "/CRListing",
      "CN Approved List": "/CRApprovedList",
      "Add Expense": "/AddExpense",
      "Expense List": "/ExpenseList",
    };
    if (routes[item.name]) {
      navigate(routes[item.name]);
    }
  };

  const responseScreens = localStorage.getItem("responseScreens");
  let parsedScreens = [];

  try {
    if (responseScreens) {
      parsedScreens = JSON.parse(responseScreens);
    }
  } catch (error) {
    console.error("Error parsing responseScreens:", error);
  }

  // Filter menu items based on allowedScreens
  const filteredMenuItems = clientReportData.filter((menu) =>
    parsedScreens.includes(menu.name.toUpperCase())
  );

  return (

    <div>
      <br/>
      <br/>
    <div className="container" style={{boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",borderRadius: "40px" }}>
    <Box sx={{ padding: "5px"   }}>
      
      
    
      <Grid container spacing={5}>
        {filteredMenuItems.map((item, index) => (
          <Grid item xs={12} sm={4} md={4} key={index}>
            <div
              style={{
                cursor: "pointer",
                marginBottom: "10px",
                borderRadius: "20px",
                backgroundColor: backgroundColors[index % backgroundColors.length],
                transition: "background-color 0.3s ease",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)", // Card-like shadow
                maxWidth: "200px", // Limit the width of the card
                margin: "0 auto",  // Center the card
                spacing:"1px",
                
              }}
              onClick={() => handleCardClick(item)}
            >
              <ListItem
                button
                sx={{
                  padding: "10px",
                  "&:hover": {
                    backgroundColor: "#74b9ff",
                    
                  },
                }}
                style={{
                  borderRadius: "20px",
                  fontWeight: "bold",
                  spacing:"1px",
                }}
              >
                <ListItemText
                 primaryTypographyProps={{
                  fontWeight: "bold", // Apply bold to primary text (name)
                  justifyContent:"center"
                }}
                secondaryTypographyProps={{
                  fontWeight: "bold", // Apply bold to secondary text (code)
                  justifyContent:"center"
                }}
                  primary={item.name}
                  secondary={item.code}
                  sx={{
                    fontSize: "14px",
                    // fontWeight: "500",
                    borderRadius: "20px",
                    fontWeight: "bold",
                    
                  }}
                  style={{
                    borderRadius: "20px",
                    fontWeight: "bold",
                  }}
                />
              </ListItem>
            </div>
          </Grid>
        ))}
      </Grid>
    </Box>
    </div>
    </div>
  );
};

export default Transactions;
