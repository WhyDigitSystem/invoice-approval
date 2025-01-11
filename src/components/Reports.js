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

const reportDetails = {
  "EL-1 (OB)": {
    revenue: 100000,
    orders: 500,
    newClients: 30,
    data: [
      { month: "Jan", value: 20000 },
      { month: "Feb", value: 25000 },
      { month: "Mar", value: 30000 },
    ],
    chartData: [20, 25, 30, 35, 40, 45],
    expenses: 50000,
  },
  "EL-2 (SL)": {
    revenue: 120000,
    orders: 800,
    newClients: 50,
    data: [
      { month: "Jan", value: 25000 },
      { month: "Feb", value: 30000 },
      { month: "Mar", value: 35000 },
    ],
    chartData: [15, 25, 35, 45, 50, 55],
    expenses: 60000,
  },
  // Add similar mock data for all 23 reports
};

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

  return (
    <div style={{ backgroundColor: isDarkMode ? "#ffffff" : "#ffffff" }}>
      {/* Welcome Popup */}
      {/* <Dialog
        open={isPopupOpen}
        onClose={handlePopupClose}
        maxWidth="xs"
        PaperProps={{
          style: {
            borderRadius: "12px",
            padding: "15px",
            textAlign: "center",
            background: "linear-gradient(to right, #00c6ff, #0072ff)",
            color: "#fff",
          },
        }}
      >
        <DialogContent>
          <Typography variant="h3" gutterBottom style={{ fontWeight: "bold" }}>
            Welcome Ramesh!
          </Typography>
          <Typography
            variant="h5"
            style={{ fontSize: "14px", marginTop: "10px" }}
          >
            Your monthly report is prepared and ready for download. Click below
            to review the details and stay updated.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={handlePopupClose}
            variant="contained"
            style={{
              backgroundColor: "#00796b",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "50px",
              padding: "8px 30px",
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog> */}

      {/* Report Dialog */}
      {/* <Dialog
        open={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedReport?.name}</DialogTitle>
        <DialogContent>
          <Typography>Code: {selectedReport?.code}</Typography>
          <Divider style={{ margin: "10px 0" }} />
          <Typography variant="h6">Financial Overview</Typography>
          <Box display="flex" justifyContent="space-between" marginBottom={2}>
            <Typography>
              Total Revenue: ₹{reportDetails[selectedReport?.code]?.revenue}
            </Typography>
            <Typography>
              Total Expenses: ₹{reportDetails[selectedReport?.code]?.expenses}
            </Typography>
          </Box>
          <Typography variant="h6">
            Orders: {reportDetails[selectedReport?.code]?.orders}
          </Typography>
          <Typography variant="h6">
            New Clients: {reportDetails[selectedReport?.code]?.newClients}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedReport(null)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog> */}

      {/* Header */}

      {/* Cards */}
      <br/><br/>
      <div className="ag-format-container">
        <div className="ag-courses_box">
          {clientReportData.map((item, index) => (
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
