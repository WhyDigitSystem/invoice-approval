import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import { Box, IconButton, Popover, Tooltip } from "@mui/material";
import jsPDF from "jspdf";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useWindowSize from "react-use/lib/useWindowSize";
import * as XLSX from "xlsx";
import "./Reports.css";

// Mock Data for Reports
const clientReportData = [
  { name: "AP - Ageing", code: ""},
  { name: "MIS", code: ""},
];


const Reports = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [popoverReport, setPopoverReport] = useState(null);
  const { width } = useWindowSize();

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const handleLogout = () => {
    console.log("Logged out");
  };

  const toggleCallBack = () => {
    setIsDarkMode((prevMode) => !prevMode);
    console.log("Toggle", isDarkMode);
  };

  const navigate = useNavigate();

  const handleCardClick = (item) => {
    // Map card names to their respective routes
    const routes = {
      "AP - Ageing": "/APAgeing",
      MIS: "/MIS",
    };

    // Navigate to the route based on the card name
    if (routes[item.name]) {
      navigate(routes[item.name]);
    } else {
      console.error("No route found for the selected card.");
    }
  };

  const handleDownload = (format) => {
    if (!popoverReport) return;

    if (format === "pdf") {
      const doc = new jsPDF();
      doc.text(`Report: ${popoverReport.name}`, 10, 10);
      doc.text(`Code: ${popoverReport.code}`, 10, 20);
      doc.save(`${popoverReport.name}.pdf`);
    } else if (format === "excel") {
      const worksheet = XLSX.utils.json_to_sheet([popoverReport]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
      XLSX.writeFile(workbook, `${popoverReport.name}.xlsx`);
    }
    setPopoverAnchor(null); // Close the popover after downloading
  };

  const handleDownloadIconClick = (event, report) => {
    setPopoverAnchor(event.currentTarget);
    setPopoverReport(report);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
  };

  const isPopoverOpen = Boolean(popoverAnchor);

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
    


    <div style={{ backgroundColor: isDarkMode ? "#ffffff" : "#ffffff" }}>
    

      {/* Cards */}
      <br/><br/>
      <div className="ag-format-container">
        <div className="ag-courses_box">
          {filteredMenuItems.map((item, index) => (
            <div
              key={index}
              className="ag-courses_item"
              style={{ cursor: "pointer" , height:"80px" , width:"80px"}}
            >
              <div
                className="ag-courses-item_link"
                onClick={() => handleCardClick(item)}
              >
                <div className="ag-courses-item_bg"></div>
                <div className="ag-courses-item_title">{item.name}</div>
                <div className="ag-courses-item_date-box">
                  <span className="ag-courses-item_date">
                    {item.code}
                    &nbsp;
                  
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popover for Download */}
      <Popover
        open={isPopoverOpen}
        anchorEl={popoverAnchor}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box
          p={1}
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap={1}
        >
          <Tooltip title="Download PDF" arrow>
            <IconButton onClick={() => handleDownload("pdf")} color="primary">
              <PictureAsPdfIcon
                style={{ fontSize: "24px", color: "#E53935" }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download Excel" arrow>
            <IconButton onClick={() => handleDownload("excel")} color="primary">
              <TableChartIcon style={{ fontSize: "24px", color: "#4CAF50" }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Popover>
    </div>
    
  );
};

export default Reports;
