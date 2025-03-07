import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { getAllExpense } from "../services/api";
import "./ExpenseList.css"; // Add the ticket styling here
// import "./PartyMasterUpdate.css";
// import "./style.css";
import rewindbutton from ".././rewindbutton.png";
import NoDataAvailable from "../utils/NoDataAvailable";
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

const ExpenseList = () => {
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [createdDate, setCreatedDate] = useState([]);
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    getAllExpense()
      .then((response) => {
        const sortedData = response.sort((a, b) => b.expenseId - a.expenseId);
        setData(sortedData); // Assuming the API returns an array of expense objects// ); // Assuming the API returns an array of expense objects
        setLoading(false);
        console.log("Response", sortedData);
      })
      .catch(() => {
        notification.error({
          message: "Data Fetch Error",
          description: "Failed to fetch updated data for the listing.",
        });
        setLoading(false);
      });
  };

  const handleRowClick = (expenseId) => {
    navigate("/ViewExpense", { state: { expenseId } });
  };
  const handleImageClick = () => {
    // window.history.back(); // Takes the user to the previous page
    navigate("/Transactions");
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
          <div className="container" style={{ width: "2200px" }}>
            <div className="expenseListContainer">
              <ButtonTrans />
              {/* <br/> */}
              {/* <p >Expense Claim List</p> */}
              <div
                className="label-customer"
                style={{
                  textAlign: "center",
                  width: "100%",
                  marginTop: "-60px",
                  // color: theme === "dark" ? "white" : "#3498db",
                  fontSize: "24px",

                  // marginLeft: "-20px",
                }}
              >
                Expense Claim List
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
                style={{ marginLeft: "20px", marginTop: "-70px" }}
              >
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </Button>

              <br />
              <div className="ticketList">
                {loading ? (
                  <div style={{ textAlign: "center", fontSize: "18px" }}>
                    Loading...
                  </div>
                ) : data.length === 0 ? (
                  <NoDataAvailable message="No records to display" />
                ) : (
                  data.map((expense) => (
                    <div
                      className="ticketContainer"
                      key={expense.id}
                      onClick={() => handleRowClick(expense.id)}
                    >
                      <div class="card">
                        <div class="face face1">
                          <div class="content">
                            <i class="fab fa-android"></i>
                            <h3>{expense.empName}</h3>
                          </div>
                        </div>
                        <div class="face face2">
                          <div class="content">
                            <p> Code:&nbsp; {expense.empCode}</p>
                            <p>
                              Amount: R
                              <span style={{ fontSize: "0.8em" }}>s</span>{" "}
                              {expense.totamt}
                            </p>
                            <p>Claim ID: {expense.id}</p>
                            <p>
                              Claimed On: <br />{" "}
                              {expense.createdUpdatedDate.createdon}
                            </p>
                            <a
                              href="#"
                              className="view-more-btn"
                              style={{
                                background: "transparent",
                                color: "black",
                                padding: "10px 20px",
                                border: "2px solid white",
                                textDecoration: "none",
                                display: "inline-block",
                              }}
                            >
                              View More
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default ExpenseList;
