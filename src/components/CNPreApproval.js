import React, { useEffect, useState, useRef } from "react";
import {
  getAllCreditParties,
  getInvoices,
  getUserBranch,
  getCRReasons,
} from "../services/api";
import { notification, Select, Spin, Breadcrumb } from "antd"; // Import Select and Spin from Ant Design
import axios from "axios";
import confetti from "canvas-confetti";
import gsap from "gsap";
import "./PartyMasterUpdate.css";
import { Space, DatePicker, Col, Button, Switch, ConfigProvider } from "antd";
import {
  LogoutOutlined,
  MoonOutlined,
  RightCircleOutlined,
  SunOutlined,
  FolderOpenOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import ButtonTrans from "./ButtonTrans";

const { Option } = Select;
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8091";

const CNPreApproval = () => {
  const [data, setData] = useState([]);
  const [reasonData, setReasonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [partyNames, setPartyNames] = useState([]);
  const [selectedPartyName, setSelectedPartyName] = useState("");
  const createdBy = localStorage.getItem("userName");
  const [ptype, setPtype] = useState("");

  const buttonRef = useRef(null);

  const [branchName, setBranchName] = useState("");
  const [status, setStatus] = useState("idle");
  const textRef = useRef(null);
  const iconRef = useRef(null);
  const [branchNames, setBranchNames] = useState([]);
  const [proforma, setProforma] = useState([]);
  const [docid, setDocid] = useState([]);
  const [selectedProfoma, setSelectedProfoma] = useState("");
  const [profoms, setProfoms] = useState([]);
  const [crRemarks, setCrRemarks] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // Convert FileList to an array
    setFiles(selectedFiles);
  };

  const themeConfig =
    theme === "dark"
      ? {
          token: {
            // colorPrimary: '#1890ff', // Adjust as needed for dark mode
            colorPrimary: "#5D576B",
            // colorBgBase: '#1c1c1c', // Dark background
            // colorBgBase: "#353746",
            colorTextBase: "black", // White text for dark mode
            // colorTextBase: 'black',
            colorLink: "#40a9ff", // Link color for dark mode
          },
        }
      : {};

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    if (theme === "dark") {
      document.body.style.backgroundColor = "#5D576B";
      document.body.style.color = "#fff"; // White text for dark mode
      // Update styles for inputs and date fields
      const inputs = document.querySelectorAll("input");
      inputs.forEach((input) => {
        // input.style.backgroundColor = "#353746";
        input.style.color = "#000";
      });
    } else {
      document.body.style.backgroundColor = "#fff"; // Light background for the body
      document.body.style.color = "#000"; // Black text for light mode
      // Update styles for inputs and date fields
      const inputs = document.querySelectorAll("input");
      inputs.forEach((input) => {
        input.style.backgroundColor = "#fff";
        input.style.color = "#000";
      });
    }
  }, [theme]);

  // Fire confetti when action is done
  const fireConfetti = (particleRatio, opts) => {
    confetti(
      Object.assign({}, opts, {
        particleCount: Math.floor(100 * particleRatio),
      })
    );
  };

  const startConfetti = () => {
    setStatus("loading");
    if (textRef.current) {
      textRef.current.textContent = "";
      textRef.current.className = "text hidden";
    }

    if (iconRef.current) {
      iconRef.current.className = "fa-solid fa-spinner animate-spin";
    }

    if (buttonRef.current) {
      buttonRef.current.className = "loading";
    }

    // After 3 seconds, trigger confetti
    setTimeout(() => {
      if (iconRef.current) {
        iconRef.current.className = "";
      }

      if (buttonRef.current) {
        buttonRef.current.className = "success";
      }

      fireConfetti(0.25, {
        spread: 26,
        startVelocity: 10,
        colors: ["#757AE9", "#28224B", "#EBF4FF"],
      });

      fireConfetti(0.2, {
        spread: 60,
        startVelocity: 20,
        colors: ["#757AE9", "#28224B", "#EBF4FF"],
      });

      fireConfetti(0.35, {
        spread: 100,
        startVelocity: 15,
        decay: 0.91,
        colors: ["#757AE9", "#28224B", "#EBF4FF"],
      });

      fireConfetti(0.1, {
        spread: 120,
        startVelocity: 10,
        decay: 0.92,
        colors: ["#757AE9", "#28224B", "#EBF4FF"],
      });

      fireConfetti(0.1, {
        spread: 120,
        startVelocity: 20,
        colors: ["#757AE9", "#28224B", "#EBF4FF"],
      });
    }, 300);

    // Update text after 3.5 seconds
    setTimeout(() => {
      if (textRef.current) {
        textRef.current.textContent = "";
        textRef.current.className = "text";
      }

      if (iconRef.current) {
        iconRef.current.className = "fa-solid fa-check";
      }
    }, 2000);

    // Reset everything after 6 seconds
    setTimeout(() => {
      if (textRef.current) {
        textRef.current.textContent = "";
      }

      if (iconRef.current) {
        iconRef.current.className = "fa-solid fa-play";
      }

      if (buttonRef.current) {
        buttonRef.current.className = "";
      }

      setStatus("idle");
    }, 2000);
  };

  const [formData, setFormData] = useState({
    branchName: "",
    partyName: "",
    partyCode: "",
    profoma: "",
    vchNo: "",
    vchDt: "",
    invAmt: "",
    ptype: "",
    reason: "",
    createdBy,
    crRemarks: "",
    totChargeAmtLc: "",
    totTaxAmtLc: "",
  });

  // Handle input change
  // const handleChange = (e) => {
  //   if (!e.target) {
  //     console.error("Event target is undefined:", e);
  //     return;
  //   }

  //   const { name, value } = e.target;

  //   setFormData((prevData) => {
  //     let updatedData = { ...prevData, [name]: value };

  //     if (name === "ptype" && value === "Full") {
  //       updatedData.crAmt = prevData.invAmt || "";
  //     }

  //     return updatedData;
  //   });
  // };

  const handleChange = (e) => {
    if (!e.target) {
      console.error("Event target is undefined:", e);
      return;
    }

    const { name, value } = e.target;

    // Initialize error state
    let errorMessage = "";

    // Handle validation for crAmt to ensure it's greater than 0
    if (name === "crAmt") {
      const numericValue = parseFloat(value);
      if (value && (isNaN(numericValue) || numericValue <= 0)) {
        errorMessage = "Amount must be greater than 0.";
      }
    }

    // Update formData based on the input change
    setFormData((prevData) => {
      let updatedData = { ...prevData, [name]: value };

      // If ptype is "Full", set crAmt to invAmt value
      if (name === "ptype" && value === "Full") {
        const numericValue = parseFloat(value);
        if (name === "crAmt") {
          updatedData.crAmt = prevData.totChargeAmtLc || "";
          if (value && (isNaN(numericValue) || numericValue <= 0)) {
            errorMessage = "Amount must be greater than 0.";
          }
        }
      }

      // Include the error message in the form data if validation fails
      return { ...updatedData, errorMessage };
    });
  };

  const handleBranchChange = (value) => {
    setBranchName(value); // Update branch name state
  };

  const handlePtypeChange = (value) => {
    setPtype(value); // Update the ptype state

    setFormData((prevData) => {
      let updatedData = { ...prevData };

      if (value === "Full") {
        updatedData.crAmt = prevData.totChargeAmtLc || ""; // Set crAmt to invAmt if Full is selected
      }

      return updatedData;
    });
  };

  const handleCrRemarksChange = (value) => {
    setCrRemarks(value);
    // Find the selected crReason from the reasonData
    const selectedReason = reasonData.find(
      (reason) => reason.crReason === value
    );

    if (selectedReason) {
      // Set the formData with the selected reason's details
      setFormData({
        ...formData,
        description: selectedReason.description || "",
        plImpact: selectedReason.plImpact || "",
        documentsRequired: selectedReason.documentsRequired || "",
      });
    }
  };

  // Fetch branch names
  useEffect(() => {
    getUserBranch()
      .then((response) => {
        setBranchNames(response);
      })
      .catch((error) => {
        notification.error({
          message: "Failed to fetch Branches",
          description: "Error occurred while fetching branch names.",
        });
      });
  }, []);

  // Fetch data when branch name changes
  const fetchData = () => {
    setLoading(true);
    console.log("branchName", branchName, createdBy);
    getInvoices(createdBy, branchName)
      .then((response) => {
        console.log(response); // Log to verify data structure
        setProfoms(response);
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

  useEffect(() => {
    setLoading(true);
    getCRReasons()
      .then((response) => {
        console.log(response); // Log to verify data structure
        setReasonData(response);
      })
      .catch(() => {
        notification.error({
          message: "Data Fetch Error",
          description: "Failed to fetch updated data for the listing.",
        });
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (branchName) {
      fetchData();

      // console.log("branchname",branchname,createdBy);
    }
  }, [createdBy, branchName]);

  // Handle Profoma selection change
  const handleProfomaChange = (value) => {
    setSelectedProfoma(value);
    const selectedProfoma = profoms.find((inv) => inv.profoma === value);
    console.log("selectedProfoma", selectedProfoma);

    if (selectedProfoma) {
      setFormData({
        ...formData,
        partyCode: selectedProfoma.partyCode || "",
        partyName: selectedProfoma.partyName || "",
        profoma: selectedProfoma.profoma || "",
        vchNo: selectedProfoma.vchNo || "",
        vchDt: selectedProfoma.vchDt || "",
        invAmt: selectedProfoma.invAmt || "",
        crAmt: selectedProfoma.totChargeAmtLc || "",
        totChargeAmtLc: selectedProfoma.totChargeAmtLc || "",
        totTaxAmtLc: selectedProfoma.totTaxAmtLc || "",
      });
    }
  };

  const formatDate = (date) => {
    // Split the date in DD/MM/YYYY format
    const dateParts = date.split("/");

    // Check if the date is valid (i.e., has 3 parts)
    if (dateParts.length !== 3) {
      console.error("Invalid date format:", date); // Log if the format is invalid
      return ""; // Return an empty string if the format is invalid
    }

    const day = dateParts[0];
    const month = dateParts[1];
    const year = dateParts[2];

    // Ensure day and month are two digits, add leading zero if necessary
    const formattedDay = day.padStart(2, "0");
    const formattedMonth = month.padStart(2, "0");

    // Return the date in YYYY-MM-DD format
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  const uploadFiles = async (crPreAppVOid, files) => {
    if (!crPreAppVOid || !files || files.length === 0) {
      console.error("No files or ID provided for upload.");
      return;
    }

    const formDataPayload = new FormData();

    // Append the ID to the FormData
    formDataPayload.append("id", crPreAppVOid);

    // Append each file to the FormData
    files.forEach((file, index) => {
      formDataPayload.append(`files`, file);
    });

    try {
      // Send the file upload request
      const uploadResponse = await axios.put(
        `${API_URL}/api/crpreapp/uploadfile`, // File upload endpoint
        formDataPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Required for file upload
          },
        }
      );

      if (uploadResponse.status === 200) {
        console.log("Files uploaded successfully.");
      } else {
        console.error("Failed to upload files.");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.partyCode ||
      !formData.profoma ||
      !formData.reason ||
      !ptype ||
      !crRemarks
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (formData.crAmt <= 0) {
      alert("Credit Note Amt should be Greater Than Zero");
      return;
    }

    if (Number(formData.crAmt) > Number(formData.totChargeAmtLc)) {
      alert("Credit Note Amt should be Equal or Lesser than ChargeAmt Amt");
      return;
    }

    if (!files || files.length === 0) {
      alert("Attachment Upload is Mandatory");
      return;
    }

    const formattedVchDt = formatDate(formData.vchDt);

    if (!formattedVchDt) {
      alert("Please enter a valid date.");
      return;
    }

    const payload = {
      branchName: branchName,
      partyCode: formData.partyCode,
      partyName: formData.partyName,
      profoma: formData.profoma,
      vchNo: formData.vchNo,
      vchDt: formattedVchDt,
      ptype: ptype,
      invAmt: formData.invAmt,
      crAmt: formData.crAmt,
      reason: formData.reason,
      createdBy: localStorage.getItem("userName"),
      crRemarks: crRemarks,
      description: formData.description,
      plImpact: formData.plImpact,
      documentsRequired: formData.documentsRequired,
      totChargeAmtLc: formData.totChargeAmtLc,
      totTaxAmtLc: formData.totTaxAmtLc,
    };

    try {
      // First API call to create/update the record
      const response = await axios.put(
        `${API_URL}/api/crpreapp/updateCRPreApp`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        const crPreAppVOid = response.data.paramObjectsMap.crPreAppVO.id;

        // Call the file upload function
        await uploadFiles(crPreAppVOid, files);

        notification.success({
          message: "Success",
          description:
            "The party information and files have been successfully updated.",
          duration: 3,
        });

        startConfetti();
        handleClear();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        notification.error({
          message: "Error",
          description: "Failed to update the party information.",
          duration: 3,
        });
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving.");
    }
  };

  const handleButtonClick = (e) => {
    handleSubmit(e);
  };

  const handleClear = () => {
    setFormData({
      branchName: "",
      partyCode: "",
      partyName: "",
      profoma: "",
      vchNo: "",
      vchDt: "",
      invAmt: "",
      crAmt: "",
      reason: "",
      crRemarks: "",
      Description: "",
      plImpact: "",
      documentsRequired: "",
      totChargeAmtLc: "",
      totTaxAmtLc: "",
    });
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <br />
      <br />
      <div
        className="card w-full p-6 bg-base-100 shadow-xl "
        style={{ padding: "20px", borderRadius: "10px", height: "100%" }}
      >
        {/* Filter Section */}
        <div className="row d-flex ml" style={{ marginTop: "-80px" }}>
          <div
            className="d-flex flex-wrap justify-content-start mb-4"
            style={{ marginBottom: "20px" }}
          >
            {" "}
          </div>

          <div className="container">
            <ButtonTrans />
            {/* Breadcrumb Navigation */}
            <div
              className="label-customer"
              style={{
                textAlign: "center",
                width: "100%",
                marginTop: "-40px",
                // color: theme === "dark" ? "3498db" : "#3498db",
                fontSize: "24px",

                marginLeft: "-20px",
                // boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              Pre Credit Note
            </div>

            <br />

            <Button
              className="button1"
              type="text"
              icon={theme === "light" ? <MoonOutlined /> : <SunOutlined />}
              onClick={toggleTheme}
              size="small"
              style={{ marginLeft: "250px", marginTop: "-30px" }}
            >
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </Button>

            {/* <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Transactions</Breadcrumb.Item>
        <Breadcrumb.Item>Pre Credit Note Approval</Breadcrumb.Item>
      </Breadcrumb> */}
            <br />
            <button className="button1" onClick={handleSubmit}>
              {" "}
              Save
            </button>

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row", // Changed to 'row' to display items side by side
                  justifyContent: "space-between", // Add some space between the two
                  width: "80%", // Ensure the width is full for both elements
                }}
              >
                {/* Branch Name Select */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "45%",
                  }}
                >
                  <label
                    htmlFor="branch-select"
                    style={{
                      marginBottom: "8px",
                      marginLeft: "-92px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                    className="label-customer"
                  >
                    Branch Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    id="branch-select"
                    value={branchName}
                    // onChange={handleBranchChange}  // Correct handler
                    onChange={(value) => setBranchName(value)}
                    style={{
                      marginBottom: "8px",
                      marginLeft: "32px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                    placeholder="Select Branch"
                  >
                    <Option value="">Select Branch</Option>
                    {branchNames && branchNames.length > 0 ? (
                      branchNames.map((branch) => (
                        <Option
                          key={branch.branchCode}
                          value={branch.branchName}
                        >
                          {branch.branchName}
                        </Option>
                      ))
                    ) : (
                      <Option value="">No branches available</Option>
                    )}
                  </Select>
                </div>

                {/* Profoma Select */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "45%",
                  }}
                >
                  <label
                    htmlFor="profoma-select"
                    style={{
                      marginBottom: "8px",
                      marginLeft: "-230px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                    className="label-customer"
                  >
                    OriginBill<span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    id="profoma-select"
                    value={selectedProfoma}
                    onChange={handleProfomaChange}
                    style={{
                      marginBottom: "16px",
                      marginLeft: "-20px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    placeholder="Search Profoma"
                    notFoundContent={
                      loading ? <Spin size="small" /> : "No results found"
                    }
                  >
                    <Option value="">Select OriginBill</Option>
                    {profoms && profoms.length > 0 ? (
                      profoms.map((inv) => (
                        <Option key={inv.profoma} value={inv.profoma}>
                          {inv.profoma}
                        </Option>
                      ))
                    ) : (
                      <Option value="">No OriginBill available</Option>
                    )}
                  </Select>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row", // Changed to 'row' to display items side by side
                  justifyContent: "space-between", // Add some space between the two
                  width: "80%", // Ensure the width is full for both elements
                  // color: theme === "dark" ? "white" : "#3498db",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "200px",
                    // color: theme === "dark" ? "white" : "#3498db",
                  }}
                >
                  <label
                    htmlFor="type-select"
                    style={{
                      marginBottom: "8px",
                      marginLeft: "-70px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                    className="label-customer"
                  >
                    Reversal <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    id="type-select"
                    value={ptype}
                    onChange={handlePtypeChange}
                    placeholder="Select Type"
                    style={{
                      marginBottom: "8px",
                      marginLeft: "30px",
                      width: "230px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                  >
                    <Option value="">Select Type</Option>
                    <Option value="Full">Full</Option>
                    <Option value="Partial">Partial</Option>
                  </Select>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "200px",
                    // color: theme === "dark" ? "white" : "#3498db",
                  }}
                >
                  <label
                    htmlFor="crremarks-select"
                    style={{
                      marginBottom: "8px",
                      marginLeft: "-240px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                    className="label-customer"
                  >
                    Credit Remarks <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    value={crRemarks}
                    onChange={handleCrRemarksChange}
                    placeholder="Select Remarks"
                    style={{
                      marginBottom: "8px",
                      marginLeft: "-80px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                  >
                    <Option value="">Select Remarks</Option>
                    {reasonData.map((item) => (
                      <Option key={item.crReason} value={item.crReason}>
                        {item.crReason}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="form-row">
                <div className="input-data">
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    readOnly
                    style={{
                      width: "500px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                  />
                  <label
                    style={{
                      width: "200px",
                      marginBottom: "8px",
                      marginLeft: "2px",
                      // color: theme === "dark" ? "white" : "#3498db",
                      fontWeight: "bold",
                    }}
                  >
                    Description
                  </label>
                </div>
              </div>

              <div className="form-row">
                <div className="input-data">
                  <input
                    type="text"
                    name="plImpact"
                    value={formData.plImpact}
                    onChange={handleChange}
                    required
                    readOnly
                    style={{
                      width: "100px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                  />
                  <label
                    style={{
                      width: "100px",
                      marginBottom: "8px",
                      marginLeft: "2px",
                      // color: theme === "dark" ? "white" : "#3498db",
                      fontWeight: "bold",
                    }}
                  >
                    P & L Impact
                  </label>
                </div>

                <div className="input-data">
                  <input
                    type="text"
                    name="documentsRequired"
                    value={formData.documentsRequired}
                    onChange={handleChange}
                    required
                    readOnly
                    style={{
                      width: "400px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                  />
                  <label
                    style={{
                      width: "200px",
                      marginBottom: "8px",
                      marginLeft: "2px",
                      // color: theme === "dark" ? "white" : "#3498db",
                      fontWeight: "bold",
                    }}
                  >
                    Documents Required
                  </label>
                </div>
              </div>

              <div className="form-row">
                <div className="input-data">
                  <input
                    type="text"
                    name="partyCode"
                    value={formData.partyName}
                    onChange={handleChange}
                    required
                    readOnly
                    style={{
                      width: "500px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                  />
                  <label
                    style={{
                      width: "200px",
                      marginBottom: "8px",
                      marginLeft: "2px",
                      // color: theme === "dark" ? "white" : "#3498db",
                      fontWeight: "bold",
                    }}
                  >
                    Party
                  </label>
                </div>

                <div className="input-data">
                  <input
                    type="text"
                    name="partyCode"
                    value={formData.partyCode}
                    onChange={handleChange}
                    required
                    readOnly
                    style={{
                      width: "120px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                  />
                  <label
                    style={{
                      width: "200px",
                      marginBottom: "8px",
                      marginLeft: "2px",
                      // color: theme === "dark" ? "white" : "#3498db",
                      fontWeight: "bold",
                    }}
                  >
                    Code
                  </label>
                </div>
              </div>

              <div className="form-row">
                <div className="input-data">
                  <input
                    type="text"
                    name="vchNo"
                    value={formData.vchNo}
                    onChange={handleChange}
                    required
                    readOnly
                    style={{
                      width: "200px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                  />
                  <label
                    style={{
                      width: "200px",
                      marginBottom: "8px",
                      marginLeft: "2px",
                      // color: theme === "dark" ? "white" : "#3498db",
                      fontWeight: "bold",
                    }}
                  >
                    Invoice No
                  </label>
                </div>

                <div className="input-data">
                  <input
                    type="text"
                    name="vchDt"
                    value={formData.vchDt}
                    onChange={handleChange}
                    required
                    readOnly
                    style={{
                      marginBottom: "8px",
                      marginLeft: "-32px",
                      width: "170px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                  />
                  <label
                    style={{
                      marginBottom: "8px",
                      marginLeft: "-32px",
                      // color: theme === "dark" ? "white" : "#3498db",
                      fontWeight: "bold",
                    }}
                  >
                    Invoice Date
                  </label>
                </div>

                <div className="input-data">
                  <input
                    type="number"
                    name="invAmt"
                    value={formData.invAmt}
                    onChange={handleChange}
                    required
                    readOnly
                    style={{
                      width: "200px",
                      marginBottom: "8px",
                      marginLeft: "-72px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                  />
                  <label
                    style={{
                      width: "200px",
                      marginBottom: "8px",
                      marginLeft: "-72px",
                      // color: theme === "dark" ? "white" : "#3498db",
                      fontWeight: "bold",
                    }}
                  >
                    Invoice Amt (INR)
                  </label>
                </div>
              </div>

              <div className="form-row">
                <div className="input-data">
                  <input
                    type="number"
                    name="invAmt"
                    value={formData.totChargeAmtLc}
                    onChange={handleChange}
                    required
                    readOnly
                    style={{
                      width: "200px",
                      marginBottom: "8px",
                      marginLeft: "-2px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                  />
                  <label
                    style={{
                      width: "200px",
                      marginBottom: "8px",
                      marginLeft: "-2px",
                      // color: theme === "dark" ? "white" : "#3498db",
                      fontWeight: "bold",
                    }}
                  >
                    Charge Amt (INR)
                  </label>
                </div>
                <div className="input-data">
                  <input
                    type="number"
                    name="invAmt"
                    value={formData.totTaxAmtLc}
                    onChange={handleChange}
                    required
                    readOnly
                    style={{
                      width: "200px",
                      marginBottom: "8px",
                      marginLeft: "-2px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                  />
                  <label
                    style={{
                      width: "200px",
                      marginBottom: "8px",
                      marginLeft: "-2px",
                      // color: theme === "dark" ? "white" : "#3498db",
                      fontWeight: "bold",
                    }}
                  >
                    Tax Amt (INR)
                  </label>
                </div>
                <div className="input-data">
                  <input
                    type="number"
                    name="crAmt"
                    value={formData.crAmt}
                    onChange={handleChange}
                    readOnly={ptype === "Full"}
                    required
                    style={{
                      width: "200px",
                      marginBottom: "8px",
                      marginLeft: "2px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                  />
                  <label
                    style={{
                      width: "200px",
                      marginBottom: "8px",
                      marginLeft: "2px",
                      // color: theme === "dark" ? "white" : "#3498db",
                      fontWeight: "bold",
                    }}
                  >
                    Credit Note Amt (INR)<span style={{ color: "red" }}>*</span>{" "}
                  </label>
                </div>
              </div>

              <div className="form-row">
                <div className="input-data">
                  <input
                    type="text"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                    style={{
                      width: "700px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                  />
                  <label
                    style={{
                      width: "200px",
                      marginBottom: "8px",
                      marginLeft: "2px",
                      // color: theme === "dark" ? "white" : "#3498db",
                      fontWeight: "bold",
                    }}
                  >
                    Reason <span style={{ color: "red" }}>*</span>{" "}
                  </label>
                </div>
              </div>

              <div className="form-row">
                <div className="input-data">
                  <input
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                    multiple // Allow multiple files
                    style={{
                      width: "500px",
                      marginBottom: "8px",
                      marginLeft: "2px",
                    }}
                  />
                  <label
                    style={{
                      width: "200px",
                      marginBottom: "8px",
                      marginLeft: "2px",
                      fontWeight: "bold",
                    }}
                  >
                    Attach Files <span style={{ color: "red" }}>*</span>
                  </label>
                </div>
              </div>

              {/* <div className="form-row submit-btn">
                <div className="input-data">
                  <div className="inner"></div>
                  <input
                    type="submit"
                    value="Submit"
                    onClick={handleButtonClick}
                    ref={buttonRef}
                  ></input>
                </div>
              </div> */}
            </form>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default CNPreApproval;
