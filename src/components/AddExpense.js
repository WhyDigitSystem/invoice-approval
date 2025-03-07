import React, { useEffect, useState, useRef } from "react";
import {
  getAllCreditParties,
  getInvoices,
  getUserBranch,
} from "../services/api";
import { notification, Select, Spin } from "antd"; // Impor
import {
  DeleteOutlined,
  PlusOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Space, DatePicker, Col, Button, Switch, ConfigProvider } from "antd";
import {
  LogoutOutlined,
  MoonOutlined,
  RightCircleOutlined,
  SunOutlined,
  FolderOpenOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import axios from "axios";
import confetti from "canvas-confetti";
import gsap from "gsap";
import "./PartyMasterUpdate.css";
import "./AddExpense.css";
import Nobills from "../Nobills.jpg";
import rewindbutton from ".././rewindbutton.png";
import { useNavigate } from "react-router-dom";
import ButtonTrans from "./ButtonTrans";

const { Option } = Select;
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8091";

const AddExpense = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [partyNames, setPartyNames] = useState([]);
  const [selectedPartyName, setSelectedPartyName] = useState("");
  const createdBy = localStorage.getItem("userName");
  const [ptype, setPtype] = useState("");

  const buttonRef = useRef(null);
  const navigate = useNavigate();

  const [branchName, setBranchName] = useState("");
  const [fbranchName, setFBranchName] = useState("");
  const [tbranchName, setTBranchName] = useState("");
  const [status, setStatus] = useState("idle");
  const textRef = useRef(null);
  const iconRef = useRef(null);
  const [branchNames, setBranchNames] = useState([]);
  const [proforma, setProforma] = useState([]);
  const [docid, setDocid] = useState([]);
  const [selectedProfoma, setSelectedProfoma] = useState("");
  const [profoms, setProfoms] = useState([]);
  const [crRemarks, setCrRemarks] = useState([]);

  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const [empName, setEmpName] = localStorage.getItem("nickName");

  const [userName, setUserName] = localStorage.getItem("userName");
  const [attachments, setAttachments] = useState({});
  const [previews, setPreviews] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const defaultImagePath = "src/Nobills.jpg";
  const [filePreviews, setFilePreviews] = useState({});
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const themeConfig =
    theme === "dark"
      ? {
          token: {
            // colorPrimary: '#1890ff', // Adjust as needed for dark mode
            colorPrimary: "#5D576B",
            // colorBgBase: '#1c1c1c', // Dark background
            // colorBgBase: "#5D576B",
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
    const table = document.querySelector(".expense-table table");
    const tableHeaders = document.querySelectorAll(".expense-table th");
    const tableRows = document.querySelectorAll(".expense-table tr");

    if (theme === "dark") {
      document.body.style.backgroundColor = "#333"; // Dark background
      document.body.style.color = "#000"; // White text

      // Dark theme for table
      // table.style.backgroundColor = "#444"; // Dark background for table
      table.style.color = "#000"; // White text for table

      tableHeaders.forEach((header) => {
        header.style.backgroundColor = "#FFED86"; // Dark header background
      });

      tableRows.forEach((row) => {
        row.style.backgroundColor = "#444"; // Dark row background
      });
    } else {
      document.body.style.backgroundColor = "#fff"; // Light background
      document.body.style.color = "#000"; // Black text

      // Light theme for table
      table.style.backgroundColor = "#fff"; // Light background for table
      table.style.color = "#000"; // Black text for table

      tableHeaders.forEach((header) => {
        header.style.backgroundColor = "#FFED86"; // Light header background
      });

      tableRows.forEach((row) => {
        row.style.backgroundColor = "#fff"; // Light row background
      });
    }
  }, [theme]);

  useEffect(() => {
    if (theme === "dark") {
      document.body.style.backgroundColor = "#5D576B";
      document.body.style.color = "#fff"; // White text for dark mode
      // Update styles for inputs and date fields
      const inputs = document.querySelectorAll("input");
      inputs.forEach((input) => {
        input.style.backgroundColor = "white";
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

  const handleAddExpense = (e) => {
    e.preventDefault();

    if (!fbranchName || !tbranchName) {
      alert("Please fill all fields");
      return;
    }

    // Ensure files is initialized as an empty array
    const newExpense = {
      id: Date.now(),
      name: expenseName,
      amount: parseFloat(expenseAmount),
      category: expenseCategory,
      date: expenseDate,
      files: [], // Initialize files as an empty array
    };

    // Set the default image for the new expense row
    const defaultImage = new File([defaultImagePath], "Nobills.jpg", {
      type: "image/jpeg",
    });

    // Now you can safely push the default image to the files array
    newExpense.files.push(defaultImage);

    // Update state
    setExpenses((prev) => [...prev, newExpense]);
    setFilePreviews((prev) => ({
      ...prev,
      [newExpense.id]: [defaultImage], // Set the default image as file object
    }));

    // Reset form fields
    setExpenseName("");
    setExpenseAmount("");
    setExpenseCategory("");
    setExpenseDate("");
  };

  // Handle deleting an expense
  const handleDeleteExpense = (id) => {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== id)
    );
  };

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

  const handleFileChange = (e, expenseId) => {
    const files = e.target.files; // Get the selected files
    console.log("Files selected for expenseId:", expenseId, files);

    if (files.length > 0) {
      // Convert the file list to an array of files
      const updatedFiles = Array.from(files);

      console.log("Updated files for expenseId:", expenseId, updatedFiles);

      setFilePreviews((prevState) => ({
        ...prevState,
        [expenseId]: updatedFiles, // Store files for the given expenseId
      }));
    }
  };

  // When preparing the payload
  const prepareImagePayload = () => {
    return expenses.map((expense) => {
      // Get uploaded files for the given expenseId
      const uploadedFiles = filePreviews[expense.id];

      console.log(
        "Checking uploaded files for expenseId",
        expense.id,
        uploadedFiles
      );

      // Check if uploaded files are available
      const files =
        uploadedFiles && uploadedFiles.length > 0
          ? uploadedFiles // Use the uploaded files if available
          : [
              new File([defaultImagePath], "Nobills.jpg", {
                type: "image/jpeg",
              }),
            ]; // Use default image if no files are uploaded

      return {
        expenseId: expense.id,
        files,
      };
    });
  };

  useEffect(() => {
    // This will run whenever uploadedFiles changes
    console.log("Updated uploaded files state:", uploadedFiles);
  }, [uploadedFiles]);

  // Filter expenses based on category
  const filteredExpenses =
    filterCategory === "All"
      ? expenses
      : expenses.filter((expense) => expense.category === filterCategory);

  // Calculate total amount
  const totalAmount = expenses
    .reduce((sum, expense) => sum + expense.amount, 0)
    .toFixed(2);

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
    expenses: "",
    attachments: "",
    expenseName: "",
    expenseAmount: "",
    expenseCategory: "",
    expenseDate: "",
    empCode: "",
    empName: "",
    createdBy: "",
    files: "",
    expenseId: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }

    if (totalAmount <= 0) {
      notification.error({
        message: "Validation Error",
        description: "Total amount should be greater than zero.",
      });
      // Optionally stop further execution
      return;
    } else {
      try {
        // Prepare master data and payload
        const masterData = {
          visitFrom: fbranchName,
          visitTo: tbranchName,
          createdBy: localStorage.getItem("userName"),
          empCode: localStorage.getItem("userName"),
          empName: localStorage.getItem("nickName"),
        };

        const employeeExpensesAttachmentDTO = expenses.map((expense) => ({
          category: expense.category,
          expense: expense.name,
          amount: expense.amount,
          expDate: expense.date,
        }));

        const fullPayload = {
          ...masterData,
          employeeExpensesAttachmentDTO,
        };

        // Submit the expenses to create them
        const response = await axios.put(
          `${API_URL}/api/expense/createEmpExpense`,
          fullPayload
        );

        if (
          response.status === 200 ||
          (response.status === 201 && response.data.statusFlag === "Ok")
        ) {
          console.log("Expenses created successfully!");

          const expenseVOid = response.data.paramObjectsMap.expenseVO.id;

          const expenseAttachments =
            response.data.paramObjectsMap.expenseVO
              .employeeExpensesAttachmentVO;

          const formData = new FormData();

          const imagePayload = prepareImagePayload();
          console.log("imagePayload", imagePayload);

          imagePayload.forEach(({ expenseId, files }) => {
            // Append files for each expenseId to the FormData
            files.forEach((file) => {
              formData.append("files", file); // Add each file to the formData
            });
            formData.append("expenseId", expenseVOid); // Append the corresponding expenseId
          });

          console.log("formData", formData);

          // If there are files to upload, proceed with the API call

          console.log("Uploading multiple images for the expenses...");

          try {
            // Send the image upload request with multiple files in a single API call
            const uploadResponse = await axios.put(
              `${API_URL}/api/expense/uploadimage`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data", // Required for file upload
                },
              }
            );

            if (uploadResponse.status === 200) {
              console.log(
                "Images uploaded successfully for the respective expense IDs."
              );
              handleCelebrate();
              handleClear();
            } else {
              console.log("Failed to upload images.");
            }
          } catch (error) {
            console.error("Error uploading images for the expenses:", error);
          }
        } else {
          console.log("Failed to create expenses.");
        }
      } catch (error) {
        console.error("Error submitting expenses:", error);
      }
    }
  };

  const handleButtonClick = (e) => {
    handleSubmit(e);
  };

  const handleImageClick = () => {
    // window.history.back(); // Takes the user to the previous page
    navigate("/Transactions");
  };

  const handleCategoryChange = (value) => {
    setExpenseCategory(value);
  };

  // Clear all form fields
  const handleClear = () => {
    setExpenses([]);
    setAttachments({});
    setExpenseName("");
    setExpenseAmount("");
    setExpenseCategory("");
    setExpenseDate("");
    setFBranchName("");
    setTBranchName("");
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <div
        className="card w-full p-6 bg-base-100 shadow-xl "
        style={{ padding: "20px", borderRadius: "10px", height: "100%" }}
      >
        {/* Filter Section */}
        <div className="row d-flex ml" style={{ marginTop: "-80px" }}>
          <div
            className="d-flex flex-wrap justify-content-start mb-4"
            style={{ marginBottom: "20px" }}
          ></div>
          <div className="container">
            <ButtonTrans />
            <div
              className="label-customer"
              style={{
                textAlign: "center",
                width: "100%",
                marginTop: "-40px",
                // color: theme === "dark" ? "white" : "#3498db",
                fontSize: "24px",

                marginLeft: "-20px",
              }}
            >
              Expense Claim Form
              {/* <img
          src={rewindbutton}
          alt="Go back"
          style={{ width: "30px", marginLeft: "30px", cursor: "pointer" }}
          onClick={handleImageClick}
        /> */}
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
            <br />
            <button
              className="button1"
              onClick={handleButtonClick}
              ref={buttonRef}
            >
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
              ></div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row", // Changed to 'row' to display items side by side
                  justifyContent: "space-between", // Add some space between the two
                  width: "80%", // Ensure the width is full for both elements
                }}
              ></div>

              <div className="form-row">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "200px",
                  }}
                >
                  <label
                    htmlFor="type-select"
                    style={{
                      marginBottom: "8px",
                      marginLeft: "-30px",
                      marginTop: "-20px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                    className="label-customer"
                  >
                    Category <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    value={expenseCategory}
                    onChange={handleCategoryChange}
                    style={{
                      marginBottom: "8px",
                      marginLeft: "30px",
                      width: "160px",
                    }}
                  >
                    <Select.Option value="" disabled>
                      Select Category
                    </Select.Option>
                    <Select.Option value="Food">Food</Select.Option>
                    <Select.Option value="Transport">Transport</Select.Option>
                    <Select.Option value="Entertainment">
                      Entertainment
                    </Select.Option>
                    <Select.Option value="Other">Other</Select.Option>
                  </Select>
                </div>

                <div className="input-data">
                  <input
                    type="text"
                    value={expenseName}
                    onChange={(e) => setExpenseName(e.target.value)}
                    // required
                    style={{
                      width: "150px",
                      background: "white", // Always white background
                      color: "black",
                    }}
                  />
                  <label
                    style={{
                      marginBottom: "8px",
                      marginLeft: "-10px",
                      marginTop: "-20px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                    className="label-customer"
                  >
                    Particulars <span style={{ color: "red" }}>*</span>
                  </label>
                </div>

                <div className="input-data">
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    // required
                    style={{
                      marginBottom: "8px",
                      marginLeft: "-12px",
                      width: "170px",
                      width: "150px",
                    }}
                  />
                  <label
                    style={{
                      marginBottom: "8px",
                      marginLeft: "-12px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                    className="label-customer"
                  >
                    Date
                  </label>
                </div>

                <div className="input-data">
                  <input
                    type="number"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    // required
                    style={{
                      width: "120px",
                      marginBottom: "8px",
                      marginLeft: "2px",
                    }}
                  />
                  <label
                    style={{
                      width: "200px",
                      marginBottom: "8px",
                      marginLeft: "-50px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                    className="label-customer"
                  >
                    Expense Amt<span style={{ color: "red" }}>*</span>{" "}
                  </label>
                </div>

                <button
                  type="submit"
                  onClick={handleAddExpense}
                  ref={buttonRef}
                  style={{
                    background: "none",
                    border: "none",
                    color: "black",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-22px",
                    marginLeft: "-22px",
                  }}
                >
                  {/* <PlusOutlined style={{ fontSize: '24px', marginRight: '12px' }} /> */}

                  <PlusCircleOutlined
                    style={{ fontSize: "24px", marginRight: "12px" }}
                  />
                </button>
              </div>

              <div className="form-row">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "200px",
                  }}
                >
                  <label
                    className="label-customer"
                    htmlFor="branch-select"
                    style={{
                      marginBottom: "8px",
                      marginLeft: "-22px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                  >
                    From Place <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    id="branch-select"
                    value={fbranchName}
                    onChange={(value) => setFBranchName(value)}
                    placeholder="Select Branch"
                    required
                    style={{
                      width: "200px",
                      marginBottom: "8px",
                      marginLeft: "32px",
                    }}
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

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "200px",
                  }}
                >
                  <label
                    className="label-customer"
                    htmlFor="branch-select"
                    style={{
                      marginBottom: "8px",
                      // color: theme === "dark" ? "white" : "#3498db",
                    }}
                  >
                    To Place <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    id="branch-select"
                    value={tbranchName}
                    onChange={(value) => setTBranchName(value)}
                    placeholder="Select Branch"
                    required
                    style={{
                      width: "200px",
                      marginBottom: "8px",
                      marginLeft: "58px",
                    }}
                  >
                    <Option value="">Select Branch</Option>
                    {branchNames && branchNames.length > 0 ? (
                      branchNames
                        .filter((branch) => branch.branchName !== fbranchName) // Exclude the selected From Place
                        .map((branch) => (
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

                <div
                  className="form-row submit-btn"
                  style={{ width: "800px", marginLeft: "60px", height: "8px" }}
                >
                  {/* <div className="input-data">
                    <div className="inner"></div>
                    <input
                      type="submit"
                      value="Submit"
                      style={{
                        padding: "8px 15px",
                        height: "20px",
                        fontSize: "12px",
                      }}
                      onClick={handleButtonClick}
                      ref={buttonRef}
                    ></input>
                  </div> */}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "60%",
                }}
              >
                {/* Expense Table */}
                <div className="expense-table">
                  <table style={{ width: "100%", tableLayout: "fixed" }}>
                    <thead>
                      <tr>
                        <th style={{ width: "100px" }}>Action</th>{" "}
                        {/* Fixed width for Action */}
                        <th>Category</th>
                        <th>Particulars</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Upload file</th>
                        <th>File Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExpenses.length > 0 ? (
                        filteredExpenses.map((expense) => (
                          <tr key={expense.id}>
                            <td>
                              <button
                                onClick={() => handleDeleteExpense(expense.id)}
                                className="delete-btn"
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "#ff4d4f",
                                  cursor: "pointer",
                                  height: "50px",
                                }}
                              >
                                <DeleteOutlined style={{ fontSize: "24px" }} />{" "}
                                {/* Delete icon */}
                              </button>
                            </td>
                            <td
                              style={{
                                color: "black",
                              }}
                            >
                              {expense.category}
                            </td>
                            <td
                              style={{
                                color: "black",
                              }}
                            >
                              {expense.name}
                            </td>
                            <td
                              style={{ whiteSpace: "nowrap", color: "black" }}
                            >
                              {expense.date}
                            </td>{" "}
                            {/* Prevent date folding */}
                            <td
                              style={{
                                color: "black",
                              }}
                            >
                              {expense.amount.toFixed(2)}
                            </td>
                            <td
                              style={{
                                background: theme === "dark" ? "white" : "#fff", // White background in dark mode
                                color: theme === "dark" ? "white" : "white", // Text color stays black
                              }}
                            >
                              <input
                                type="file"
                                id="fileInput"
                                name="files"
                                style={{
                                  background:
                                    theme === "dark" ? "white" : "#fff", // White background in dark mode
                                  color: theme === "dark" ? "white" : "white", // Text color stays black
                                }}
                                multiple
                                onChange={(e) =>
                                  handleFileChange(e, expense.id)
                                }
                              />
                            </td>
                            <td
                              style={{
                                background: theme === "dark" ? "white" : "#fff",
                              }}
                            >
                              {" "}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" style={{ textAlign: "center" }}>
                            No expenses found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Total Amount */}
                  <div className="total-amount">
                    <strong>Total:</strong> {totalAmount}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default AddExpense;
