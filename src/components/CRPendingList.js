import {
  LogoutOutlined,
  MoonOutlined,
  RightCircleOutlined,
  SunOutlined,
  DownloadOutlined,
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
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getCRListing2Data, findByGSTPreCreditrId } from "../services/api"; // mock API call
import EmailConfig from "../utils/emailConfig";
import NoDataFallback from "../utils/fallBack";
import "./date.css";
import "./style.css";
import ButtonTrans from "./ButtonTrans";

import { Download } from "@mui/icons-material";

import confetti from "canvas-confetti";

const { Option } = Select;
const { Text } = Typography;
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8091";

const CRPendingList = () => {
  const [data, setData] = useState([]);
  const [attachData, setAttachData] = useState([]);
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
  const hasFetchedRef = useRef(false);

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
    getCRListing2Data()
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

  // const fetchData = () => {
  //   setLoading(true);
  //   getCRListingData()
  //     .then((response) => {
  //       setData(response);
  //       setLoading(false);
  //     })
  //     .catch(() => {
  //       notification.error({
  //         message: "Data Fetch Error",
  //         description: "Failed to fetch updated data for the listing.",
  //       });
  //       setLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   if (data.length > 0) {
  //     // Fetch files for each item in filteredData
  //     data.forEach((item) => {
  //       findByGSTPreCreditrId(item.gst_precreditId)
  //         .then((response) => {
  //           // Update the item with the fetched files
  //           setData((prevData) =>
  //             prevData.map((dataItem) =>
  //               dataItem.gst_precreditId === item.gst_precreditId
  //                 ? { ...dataItem, files: response }
  //                 : dataItem
  //             )
  //           );
  //         })
  //         .catch((error) => {
  //           console.error(
  //             `Failed to fetch files for gst_precreditId ${item.gst_precreditId}:`,
  //             error
  //           );
  //         });
  //     });
  //   }
  // }, [data]);

  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await getCRListingData();
  //     const attachmentResponse = await findByGSTPreCreditrId(
  //       response.paramObjectsMap.pendingApprovalDetails[0].id
  //     );

  //     setData(response.paramObjectsMap.pendingApprovalDetails);
  //     setAttachData(attachmentResponse.paramObjectsMap.crPreAppVO.attachment); // Store the attachment
  //     console.log("AttachData", attachmentResponse);
  //     setLoading(false);
  //   } catch (error) {
  //     notification.error({
  //       message: "Data Fetch Error",
  //       description: "Failed to fetch data.",
  //     });
  //     setLoading(false);
  //   }
  // };
  const fetchData = async () => {
    setLoading(true);
    try {
      // Step 1: Fetch the CR listing data
      const response = await getCRListing2Data();

      console.log("first", response);

      // Step 2: Fetch all attachments concurrently using Promise.all
      const updatedData = await Promise.all(
        response.map(async (item) => {
          try {
            // Fetch the attachment data for each item
            const attachmentResponse = await findByGSTPreCreditrId(item.id);

            // Log the response to check if attachment is present
            console.log(
              "Attachment Response for item ID",
              item.id,
              attachmentResponse
            );

            // Step 3: Extract the required attachment data
            // item.files =
            //   attachmentResponse?.data?.paramObjectsMap?.crPreAppVO
            //     ?.attachment || null;
            const filesResponse = await findByGSTPreCreditrId(item.id);
            const profoma =
              filesResponse?.data?.paramObjectsMap?.crPreAppVO?.profoma ||
              "File";

            // Generate filenames based on profoma and index
            // const formattedAttachments = attachments.map((file, index) => ({
            //   id: file.id,
            //   attachment: file.attachment, // Base64 or Blob
            //   fileName: `${profoma}_${String(index + 1).padStart(2, "0")}`, // Format: CBE24OSRN00001_01, CBE24OSRN00001_02, ...
            // }));

            item.files =
              attachmentResponse?.data?.paramObjectsMap?.crPreAppVO?.crPreAppAttachmentVO?.map(
                (att, index) => ({
                  fileData: att.attachment, // Assuming attachment is Base64 or Blob
                  fileName: `${profoma}_${String(index + 1).padStart(2, "0")}`, // Format: CBE24OSRN00001_01, CBE24OSRN00001_02, ...
                })
              ) || [];

            // Log the attachment data to verify
            console.log("Attachment for item", item.id, item.files);
          } catch (error) {
            console.error(
              `Error fetching attachment for item with id ${item.id}:`,
              error
            );
            item.files = null; // If there is an error, no file is attached
          }

          return item;
        })
      );

      // Step 4: Update the state with the data and attachment information
      setData(updatedData);

      console.log("Updated Data:", updatedData);
    } catch (error) {
      notification.error({
        message: "Data Fetch Error",
        description: "Failed to fetch data.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (hasFetchedRef.current) return; // Prevent unnecessary re-fetching

    const fetchFilesForEachItem = async () => {
      if (data.length === 0) return; // No data, do nothing

      const updatedData = data.map((item) => ({ ...item })); // Create a copy to avoid state mutation

      for (let item of updatedData) {
        if (item.filesFetched) continue; // Skip if already fetched

        console.log("Fetching files for id:", item.id);
        if (!item.id) {
          console.error(`Invalid id for item: ${JSON.stringify(item)}`);
          continue;
        }

        try {
          // Call API to get attachments for the item
          const filesResponse = await findByGSTPreCreditrId(item.id);

          // Extract attachment array and profoma value safely
          const attachments =
            filesResponse?.data?.paramObjectsMap?.crPreAppVO
              ?.crPreAppAttachmentVO || [];
          const profoma =
            filesResponse?.data?.paramObjectsMap?.crPreAppVO?.profoma || "File";

          console.log("profomefilename", profoma);
          // Generate filenames based on profoma and index
          const formattedAttachments = attachments.map((file, index) => ({
            id: file.id,
            attachment: file.attachment, // Base64 or Blob
            fileName: `${profoma}_${String(index + 1).padStart(2, "0")}`, // Format: CBE24OSRN00001_01, CBE24OSRN00001_02, ...
          }));

          console.log("formattedAttachments", formattedAttachments);

          item.files = formattedAttachments;
          item.filesFetched = true;

          // Append files to state if there are any attachments
          if (formattedAttachments.length > 0) {
            setAttachData((prev) => [...prev, ...formattedAttachments]);
          }
        } catch (error) {
          console.error(`Failed to fetch files for id ${item.id}:`, error);
          item.files = [];
          item.filesFetched = false;
        }
      }

      // Update state once at the end
      setData(updatedData);
      console.log("Updated Attachments Data:", updatedData);

      hasFetchedRef.current = true; // Mark as fetched
    };

    fetchFilesForEachItem();
  }, [data]); // Dependency on `data` to re-run when data changes

  // const renderAttachment = (attachment) => {
  //   if (!attachment) return <Text strong>No attachment available</Text>;

  //   // Determine the file type (e.g., PDF, image, etc.)
  //   const fileType = attachment.split(";")[0].split(":")[1]; // Extract MIME type

  //   // Decode the Base64 string
  //   const byteCharacters = atob(attachment.split(",")[1]);
  //   const byteNumbers = new Array(byteCharacters.length);
  //   for (let i = 0; i < byteCharacters.length; i++) {
  //     byteNumbers[i] = byteCharacters.charCodeAt(i);
  //   }
  //   const byteArray = new Uint8Array(byteNumbers);
  //   const blob = new Blob([byteArray], { type: fileType });

  //   // Create a URL for the Blob
  //   const fileUrl = URL.createObjectURL(blob);

  //   // Render based on file type
  //   if (fileType.startsWith("image/")) {
  //     return (
  //       <img
  //         src={fileUrl}
  //         alt="Attachment"
  //         style={{ maxWidth: "100%", height: "auto" }}
  //       />
  //     );
  //   } else if (fileType === "application/pdf") {
  //     return (
  //       <iframe src={fileUrl} width="100%" height="500px" title="Attachment" />
  //     );
  //   } else {
  //     return (
  //       <a href={fileUrl} download="attachment">
  //         <Button icon={<Download />}>Download Attachment</Button>
  //       </a>
  //     );
  //   }
  // };
  // const fetchData = () => {
  //   setLoading(true);
  //   getCRListingData()
  //     .then((response) => {
  //       setData(response.paramObjectsMap.pendingApprovalDetails); // Set data from the API response
  //       setLoading(false);
  //     })
  //     .catch(() => {
  //       notification.error({
  //         message: "Data Fetch Error",
  //         description: "Failed to fetch updated data for the listing.",
  //       });
  //       setLoading(false);
  //     });
  // };
  // useEffect(() => {
  //   // If files have already been fetched, skip the effect
  //   if (hasFetchedRef.current) return;

  //   const fetchFilesForEachItem = async () => {
  //     if (data.length === 0) return; // If no data, do nothing

  //     const updatedData = [...data]; // Create a copy to avoid mutation

  //     for (let item of updatedData) {
  //       // Check if files are already fetched, if yes, skip fetching
  //       if (item.filesFetched) continue;

  //       console.log("Fetching files for id:", item.id); // Assuming id is the correct field

  //       if (!item.id) {
  //         console.error(`Invalid id for item: ${JSON.stringify(item)}`);
  //         continue; // Skip if id is invalid
  //       }

  //       try {
  //         // Call the API to get the files using id instead of gst_precreditId
  //         const filesResponse = await findByGSTPreCreditrId(item.id); // Use item.id instead of gst_precreditId
  //         setAttachData(filesResponse.paramObjectsMap.crPreAppVO.attachment);
  //         item.files = filesResponse || [];
  //         item.filesFetched = true; // Mark as fetched
  //       } catch (error) {
  //         console.error(`Failed to fetch files for id ${item.id}:`, error);
  //         item.files = [];
  //         item.filesFetched = false; // Mark as not fetched in case of error
  //       }
  //     }

  //     // Update the state with the modified data
  //     setData(updatedData);
  //     console.log("setAttachData", data);
  //     hasFetchedRef.current = true; // Set the flag to true after files are fetched
  //   };

  //   fetchFilesForEachItem();
  // }, [data]); // Dependency on `data`, will run when data changes/ Dependency on data to fetch files only when data is updated or on page load

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
        `${API_URL}/api/crpreapp/approval2?approval=${"2"}&createdby=${localStorage.getItem(
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
        item.partyName
          .toLowerCase()
          .includes(filter.partyName?.toLowerCase() || ""));

    const branchMatch =
      filter.branchName === "" ||
      (item.branchName &&
        item.branchName
          .toLowerCase()
          .includes(filter.branchName?.toLowerCase() || ""));

    const amountMatch =
      filter.invAmt === null ||
      (item.invAmt && item.invAmt.includes(filter.invAmt));

    const startDateMatch =
      !filter.startDate || new Date(item.vchDt) >= new Date(filter.vchDt);

    const endDateMatch =
      !filter.endDate || new Date(item.vchDt) <= new Date(filter.vchDt);

    return (
      nameMatch && branchMatch && amountMatch && startDateMatch && endDateMatch
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

  // const handleDownload = (base64String, fileName) => {
  //   try {
  //     if (!base64String || typeof base64String !== "string") {
  //       console.error("Invalid attachment data");
  //       return;
  //     }

  //     // Check if it's a valid Base64 string
  //     const validBase64 = /^[A-Za-z0-9+/=]+$/.test(base64String.trim());
  //     if (!validBase64) {
  //       console.error("Received malformed Base64 data");
  //       return;
  //     }

  //     // Decode Base64 into binary data
  //     const byteCharacters = atob(base64String);
  //     const byteNumbers = new Array(byteCharacters.length);
  //     for (let i = 0; i < byteCharacters.length; i++) {
  //       byteNumbers[i] = byteCharacters.charCodeAt(i);
  //     }
  //     const byteArray = new Uint8Array(byteNumbers);

  //     // Create a Blob (Assuming it's a text file, modify MIME type if needed)
  //     const blob = new Blob([byteArray], { type: "application/octet-stream" });

  //     // Create a temporary download link
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = fileName || "download.txt"; // Adjust filename if needed
  //     document.body.appendChild(a);
  //     a.click();

  //     // Cleanup
  //     document.body.removeChild(a);
  //     URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error("Error downloading file:", error);
  //   }
  // };
  // // Function to show time
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

  // const handleDownload = (fileData, fileName = "attachment.pdf") => {
  //   try {
  //     if (!fileData) {
  //       console.error("No attachment found!");
  //       return;
  //     }

  //     let blob;

  //     // Case 1: If fileData is already a Blob
  //     if (fileData instanceof Blob) {
  //       blob = new Blob([fileData], { type: "application/pdf" }); // Ensure it's PDF
  //     }
  //     // Case 2: If fileData is a Base64 string (Ensure Base64 is valid)
  //     else if (typeof fileData === "string" && fileData.startsWith("JVBER")) {
  //       const byteCharacters = atob(fileData);
  //       const byteNumbers = new Array(byteCharacters.length);
  //       for (let i = 0; i < byteCharacters.length; i++) {
  //         byteNumbers[i] = byteCharacters.charCodeAt(i);
  //       }
  //       const byteArray = new Uint8Array(byteNumbers);
  //       blob = new Blob([byteArray], { type: "application/pdf" });
  //     }
  //     // Case 3: If fileData is an ArrayBuffer
  //     else if (fileData instanceof ArrayBuffer) {
  //       blob = new Blob([fileData], { type: "application/pdf" });
  //     } else {
  //       console.error("Unsupported file format:", fileData);
  //       return;
  //     }

  //     // Create a URL and download
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = fileName; // Ensure it downloads as a PDF
  //     document.body.appendChild(a);
  //     a.click();

  //     // Cleanup
  //     document.body.removeChild(a);
  //     URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error("Error downloading PDF file:", error);
  //   }
  // };

  // const handleDownload = (fileData, fileName) => {
  //   try {
  //     if (!fileData) {
  //       console.error("No attachment found!");
  //       return;
  //     }

  //     let blob;
  //     let fileType;

  //     // Case 1: If fileData is already a Blob
  //     if (fileData instanceof Blob) {
  //       // Check the MIME type of the Blob to determine file type
  //       fileType = fileData.type || "application/octet-stream"; // Default to binary stream
  //       blob = fileData;
  //     }
  //     // Case 2: If fileData is a Base64 string (ensure Base64 is valid)
  //     else if (typeof fileData === "string") {
  //       // PDF (starts with JVBER for PDF)
  //       if (fileData.startsWith("JVBER")) {
  //         const byteCharacters = atob(fileData);
  //         const byteNumbers = new Array(byteCharacters.length);
  //         for (let i = 0; i < byteCharacters.length; i++) {
  //           byteNumbers[i] = byteCharacters.charCodeAt(i);
  //         }
  //         const byteArray = new Uint8Array(byteNumbers);
  //         blob = new Blob([byteArray], { type: "application/pdf" });
  //         fileType = "application/pdf";
  //         fileName = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
  //       }
  //       // Word (starts with PK for DOCX)
  //       else if (fileData.startsWith("UEsDB")) {
  //         const byteCharacters = atob(fileData);
  //         const byteNumbers = new Array(byteCharacters.length);
  //         for (let i = 0; i < byteCharacters.length; i++) {
  //           byteNumbers[i] = byteCharacters.charCodeAt(i);
  //         }
  //         const byteArray = new Uint8Array(byteNumbers);
  //         blob = new Blob([byteArray], {
  //           type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //         });
  //         fileType =
  //           "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  //         fileName = fileName.endsWith(".docx") ? fileName : `${fileName}.docx`;
  //       }
  //       // Plain text (Notepad)
  //       else {
  //         const byteCharacters = atob(fileData);
  //         const byteNumbers = new Array(byteCharacters.length);
  //         for (let i = 0; i < byteCharacters.length; i++) {
  //           byteNumbers[i] = byteCharacters.charCodeAt(i);
  //         }
  //         const byteArray = new Uint8Array(byteNumbers);
  //         blob = new Blob([byteArray], { type: "text/plain" });
  //         fileType = "text/plain";
  //         fileName = fileName.endsWith(".txt") ? fileName : `${fileName}.txt`;
  //       }
  //     }
  //     // Case 3: If fileData is an ArrayBuffer
  //     else if (fileData instanceof ArrayBuffer) {
  //       blob = new Blob([fileData], { type: "application/pdf" }); // Default to PDF if ArrayBuffer is given
  //       fileType = "application/pdf";
  //       fileName = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
  //     } else {
  //       console.error("Unsupported file format:", fileData);
  //       return;
  //     }

  //     // Create a URL for the Blob and trigger download
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = fileName; // Ensure it downloads with the appropriate file name
  //     document.body.appendChild(a);
  //     a.click();

  //     // Cleanup
  //     document.body.removeChild(a);
  //     URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error("Error downloading file:", error);
  //   }
  // };

  const handleDownload = (files) => {
    try {
      if (!Array.isArray(files) || files.length === 0) {
        console.error("No attachments found!");
        return;
      }

      files.forEach(({ fileData, fileName }, index) => {
        setTimeout(() => {
          if (!fileData) {
            console.error(`No data for file: ${fileName}`);
            return;
          }

          let blob;
          let fileType;

          if (fileData instanceof Blob) {
            fileType = fileData.type || "application/octet-stream";
            blob = fileData;
          } else if (typeof fileData === "string") {
            const byteCharacters = atob(fileData);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            if (fileData.startsWith("JVBER")) {
              blob = new Blob([byteArray], { type: "application/pdf" });
              fileType = "application/pdf";
              fileName = fileName.endsWith(".pdf")
                ? fileName
                : `${fileName}.pdf`;
            } else if (fileData.startsWith("UEsDB")) {
              blob = new Blob([byteArray], {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              });
              fileType =
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
              fileName = fileName.endsWith(".docx")
                ? fileName
                : `${fileName}.docx`;
            } else {
              blob = new Blob([byteArray], { type: "text/plain" });
              fileType = "text/plain";
              fileName = fileName.endsWith(".txt")
                ? fileName
                : `${fileName}.txt`;
            }
          } else if (fileData instanceof ArrayBuffer) {
            blob = new Blob([fileData], { type: "application/pdf" });
            fileType = "application/pdf";
            fileName = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
          } else {
            console.error("Unsupported file format:", fileData);
            return;
          }

          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, index * 500); // Adding a delay of 500ms between downloads
      });
    } catch (error) {
      console.error("Error downloading files:", error);
    }
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
                  <ButtonTrans />
                  <p>Pre Credit Note Requests</p>

                  <div>
                    <Button
                      className="button1"
                      type="text"
                      icon={
                        theme === "light" ? <MoonOutlined /> : <SunOutlined />
                      }
                      onClick={toggleTheme}
                      size="small"
                      style={{ marginLeft: "60px" }}
                    >
                      {theme === "light" ? "Dark Mode" : "Light Mode"}
                    </Button>

                    <Popover
                      content={popoverContent}
                      title="Filter"
                      trigger="click"
                      placement="bottomLeft"
                      style={{ marginLeft: "10px", gap: "10px" }}
                    >
                      <Button
                        className="button1"
                        type="text"
                        icon={<LogoutOutlined />}
                        size="small"
                        style={{ marginRight: "0px" }}
                      >
                        Filter
                      </Button>
                      <Button
                        className="button1"
                        type="text"
                        icon={<RightCircleOutlined />}
                        onClick={approvedList}
                        size="small"
                        style={{ alignSelf: "center", marginLeft: "0px" }}
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
                // background: "lig",

                // background:
                //   "linear-gradient(45deg, rgba(0,212,255,1) 0%, rgba(11,3,45,1) 100%)",
              }}
            >
              {loading ? (
                <Spin tip="Loading..." />
              ) : (
                <Row gutter={[12, 12]}>
                  {data.map((item) => (
                    <Col xs={24} sm={12} md={8} key={item.gst_precreditId}>
                      <section>
                        <div class="glass">
                          <div class="img">
                            {/* <img src="https://i.imgur.com/GyxmAZO.jpg" alt="" /> */}
                          </div>

                          <div class="des">
                            <div class="maincontent">
                              <div
                                style={{
                                  lineheight: "3.3%",
                                }}
                              >
                                <div
                                  style={
                                    {
                                      // display: "flex",
                                      // justifyContent: "space-between",
                                    }
                                  }
                                >
                                  <Text
                                    strong
                                    style={{
                                      color:
                                        theme === "dark" ? "black" : "maroon",
                                      textAlign: "center",
                                      display: "block", // Make sure it behaves like a block-level element
                                      width: "100%", // Ensures it spans the available width
                                      marginLeft: "8px",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {item.partyName}
                                  </Text>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Text
                                    strong
                                    style={{
                                      color:
                                        theme === "dark" ? "black" : "maroon",
                                      textAlign: "center",
                                      display: "block", // Make sure it behaves like a block-level element
                                      width: "100%", // Ensures it spans the available width
                                      marginLeft: "8px",
                                    }}
                                  >
                                    {item.partyCode}
                                  </Text>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Text
                                    strong
                                    style={{
                                      color:
                                        theme === "dark" ? "black" : "maroon",
                                      textAlign: "center",
                                      display: "block", // Make sure it behaves like a block-level element
                                      width: "100%", // Ensures it spans the available width
                                      marginLeft: "8px",
                                    }}
                                  >
                                    {item.category}
                                  </Text>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Text
                                    strong
                                    style={{
                                      color:
                                        theme === "dark" ? "black" : "maroon",
                                      textAlign: "center",
                                      display: "block", // Make sure it behaves like a block-level element
                                      width: "100%", // Ensures it spans the available width
                                      marginLeft: "8px",
                                    }}
                                  >
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
                                {/* 
                                                            <div
                                                              style={{
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                              }}
                                                            >
                                                              <Text
                                                                strong
                                                                style={{ flex: 1, color: "black" }}
                                                              >
                                                                Limit | Days :
                                                              </Text>
                                                              <Text strong style={{ color: "black" }}>
                                                                {item.creditLimit} | {item.creditDays}
                                                              </Text>
                                                            </div> */}

                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Text
                                    strong
                                    style={{
                                      flex: 1,
                                      color:
                                        theme === "dark" ? "white" : "black",
                                    }}
                                  >
                                    Profoma:
                                  </Text>

                                  <Text
                                    strong
                                    style={{
                                      color:
                                        theme === "dark" ? "black" : "blue",
                                    }}
                                  >
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
                                <Text
                                  strong
                                  style={{
                                    flex: 1,
                                    color: theme === "dark" ? "white" : "black",
                                  }}
                                >
                                  Invoice No:
                                </Text>
                                <Text
                                  strong
                                  style={{
                                    color: theme === "dark" ? "black" : "blue",
                                  }}
                                >
                                  {item.vchNo}
                                </Text>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    flex: 1,
                                    color: theme === "dark" ? "white" : "black",
                                  }}
                                >
                                  Date:
                                </Text>
                                <Text
                                  strong
                                  style={{
                                    color: theme === "dark" ? "black" : "blue",
                                  }}
                                >
                                  {item.vchDt}
                                </Text>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    flex: 1,
                                    color: theme === "dark" ? "white" : "black",
                                  }}
                                >
                                  Invoice Amt:
                                </Text>
                                <Text
                                  strong
                                  style={{
                                    color: theme === "dark" ? "black" : "blue",
                                  }}
                                >
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
                                <Text
                                  strong
                                  style={{
                                    flex: 1,
                                    color: theme === "dark" ? "white" : "black",
                                  }}
                                >
                                  Cr Note Amt:
                                </Text>
                                <Text
                                  strong
                                  style={{
                                    color: theme === "dark" ? "black" : "blue",
                                  }}
                                >
                                  {new Intl.NumberFormat("en-IN").format(
                                    item.crAmt
                                  )}
                                </Text>
                              </div>

                              {/* <div
                                                            style={{
                                                              display: "flex",
                                                              justifyContent: "space-between",
                                                            }}
                                                          >
                                                            <Text strong style={{ flex: 1, color: "black" }}>
                                                              Total Due
                                                            </Text>
                                                            <Text strong style={{ color: "blue" }}>
                                                              {new Intl.NumberFormat("en-IN").format(
                                                                item.totDue
                                                              )}
                                                            </Text>
                                                          </div> */}

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    flex: 1,
                                    color: theme === "dark" ? "white" : "black",
                                  }}
                                >
                                  Type:
                                </Text>
                                <Text
                                  strong
                                  style={{
                                    color: theme === "dark" ? "black" : "blue",
                                  }}
                                >
                                  {item.pType}
                                </Text>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    flex: 1,
                                    color: theme === "dark" ? "white" : "black",
                                  }}
                                >
                                  P & L Impact:
                                </Text>

                                <Text
                                  strong
                                  style={{
                                    color: theme === "dark" ? "black" : "blue",
                                  }}
                                >
                                  {item.plImpact}
                                </Text>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    flex: 1,
                                    color: theme === "dark" ? "white" : "black",
                                  }}
                                >
                                  Cr Remarks:
                                </Text>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    color: theme === "dark" ? "black" : "blue",
                                  }}
                                >
                                  {item.crRemarks}
                                </Text>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    flex: 1,
                                    color: theme === "dark" ? "white" : "black",
                                  }}
                                >
                                  Description:
                                </Text>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    color: theme === "dark" ? "black" : "blue",
                                  }}
                                >
                                  {item.description}
                                </Text>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    flex: 1,
                                    color: theme === "dark" ? "white" : "black",
                                  }}
                                >
                                  Documents Required:
                                </Text>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    color: theme === "dark" ? "black" : "blue",
                                  }}
                                >
                                  {item.documentsRequired}
                                </Text>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    flex: 1,
                                    color: theme === "dark" ? "white" : "black",
                                  }}
                                >
                                  Reason:
                                </Text>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    color: theme === "dark" ? "black" : "blue",
                                  }}
                                >
                                  {item.reason}
                                </Text>
                              </div>
                              <div
                                style={{
                                  position: "relative",
                                  maxWidth: "90vw",
                                  maxHeight: "90vh",
                                  padding: "10px",
                                  textAlign: "center",
                                }}
                              >
                                <Text
                                  strong
                                  style={{
                                    color: theme === "dark" ? "black" : "blue",
                                  }}
                                >
                                  {/* Attachments: */}
                                </Text>

                                <div
                                  style={{
                                    marginTop: "10px",
                                    color: theme === "dark" ? "black" : "blue",
                                  }}
                                >
                                  {/* {item.files && item.files.length > 0 && ( */}
                                  <a
                                    href="#"
                                    className="btn-shine"
                                    onClick={() =>
                                      handleDownload(item.files, item.vchNo)
                                    }
                                  >
                                    Attachment Download
                                  </a>
                                  {/* )} */}
                                </div>
                              </div>

                              <Space
                                style={{
                                  marginTop: "5px",
                                  marginLeft: "50px",
                                }}
                              >
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

                                <button class="Btn1">
                                  <span
                                    class="leftContainer1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleApprove(item);
                                      handleCelebrate();
                                    }}
                                  >
                                    <span class="like1">Approve</span>
                                  </span>
                                  <span
                                    class="likeCount1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleReject(item);
                                    }}
                                  >
                                    Reject
                                  </span>
                                </button>
                              </Space>
                            </div>
                          </div>
                        </div>
                      </section>
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

export default CRPendingList;
