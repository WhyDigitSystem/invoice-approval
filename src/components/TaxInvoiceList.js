import React, { useState, useEffect } from "react";
import { notification } from "antd";
import {
  Button,
  Select,
  Space,
  ConfigProvider,
  Typography,
  Col,
  Spin,
} from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { getIRNDetailsList } from "../services/api";
import { getUserBranch } from "../services/api"; // Import getUserBranch function
import { useNavigate } from "react-router-dom";
import ButtonNew from "./ButtonNew";
import NoDataAvailable from "../utils/NoDataAvailable";
import Modal from "react-modal";

const { Option } = Select;

export const TaxInvoiceList = () => {
  // States for filter values
  const [branchName, setBranchName] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [branchNames, setBranchNames] = useState([]); // Initialize as empty array
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Function to handle opening the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const themeConfig =
    theme === "dark"
      ? {
          token: {
            colorPrimary: "#5D576B",
            colorBgBase: "#5D576B",
            colorTextBase: "#fff", // White text for dark mode
            colorLink: "#40a9ff", // Link color for dark mode
          },
        }
      : {};

  useEffect(() => {
    if (theme === "dark") {
      document.body.style.backgroundColor = "#5D576B";
      document.body.style.color = "#fff";
    } else {
      document.body.style.backgroundColor = "#fff";
      document.body.style.color = "#000";
    }
  }, [theme]);

  // Handle image click for navigation
  const handleImageClick = () => {
    navigate("/Reports");
  };

  const downloadPDF = (documentNumber) => {
    const link = document.createElement("a");
    link.href = `/TaxInvoicePdf/${documentNumber}`; // URL to the PDF file
    link.download = `${documentNumber}.pdf`; // Name of the downloaded file
    document.body.appendChild(link); // Append the link to the DOM
    link.click(); // Trigger the download
    document.body.removeChild(link); // Remove the link from the DOM
  };

  // Fetch branch names on component mount
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

  // Fetch data based on the selected filters
  const fetchData = () => {
    setLoading(true);
    getIRNDetailsList(branchName)
      .then((response) => {
        setData(response);
      })
      .catch((error) => {
        notification.error({
          message: "Failed to fetch data",
          description: "Error occurred while fetching invoice details.",
        });
      });
    setLoading(false);
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <div
        className="card w-full p-6 bg-base-100 shadow-xl"
        style={{ padding: "20px", borderRadius: "10px", height: "100%" }}
      >
        {/* Filter Section */}
        <div className="row d-flex ml" style={{ marginTop: "40px" }}>
          <div
            className="d-flex flex-wrap justify-content-start mb-4"
            style={{ marginBottom: "20px" }}
          >
            <b>
              <p style={{ align: "center", marginBottom: "-50px" }}>
                Tax Invoice List <ButtonNew />
                <Button
                  className="button1"
                  type="text"
                  icon={theme === "light" ? <MoonOutlined /> : <SunOutlined />}
                  onClick={toggleTheme}
                  size="small"
                  style={{ marginLeft: "10px" }}
                >
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </Button>
              </p>
            </b>{" "}
            <br />
            <br />
            <br />
            <Space style={{ marginBottom: "-50px" }}>
              {/* Branch Name Dropdown */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "200px",
                  }}
                >
                  <label
                    htmlFor="branch-select"
                    style={{ marginBottom: "8px", fontWeight: "bold" }}
                  >
                    Branch Name
                  </label>
                  <Select
                    id="branch-select"
                    value={branchName}
                    onChange={(value) => setBranchName(value)}
                    placeholder="Select Branch"
                  >
                    <Option value="">Select Branch</Option>
                    {branchNames && branchNames.length > 0 ? (
                      branchNames.map((branch) => (
                        <Option
                          key={branch.branchCode}
                          value={branch.branchCode}
                        >
                          {branch.branchName}
                        </Option>
                      ))
                    ) : (
                      <Option value="">No branches available</Option>
                    )}
                  </Select>
                </div>
              </div>

              <div className="border w-full h-40 flex items-center justify-center">
                <button class="Btn" style={{ marginTop: "30px" }}>
                  <span class="leftContainer">
                    <span class="like" onClick={fetchData}>
                      Search
                    </span>
                  </span>
                  <span
                    class="likeCount"
                    onClick={() => {
                      setBranchName("");
                    }}
                  >
                    Clear
                  </span>
                </button>
              </div>
            </Space>
          </div>
          <br />
          <br />
        </div>

        {loading ? (
          <Col style={{ display: "flex", justifyContent: "center" }}>
            <div
              class="loader"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </Col>
        ) : (
          <div className="mt-4" style={{ marginTop: "30px", color: "blue" }}>
            {data.length > 0 ? (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "20px",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        borderBottom: "1px solid #ddd",
                        padding: "10px",
                      }}
                    >
                      Invoice No
                    </th>
                    <th
                      style={{
                        borderBottom: "1px solid #ddd",
                        padding: "10px",
                      }}
                    >
                      Date
                    </th>
                    <th>Pdf</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.documentNumber}>
                      <td
                        style={{
                          borderBottom: "1px solid #ddd",
                          padding: "10px",
                        }}
                      >
                        <a
                          href={`/TaxInvoicePdf/${item.documentNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.documentNumber}
                        </a>
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid #ddd",
                          padding: "10px",
                        }}
                      >
                        {item.documentDate}
                      </td>
                      <td>
                        <button
                          onClick={() => downloadPDF(item.documentNumber)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#007bff",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <NoDataAvailable message="No records to display" />
            )}
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default TaxInvoiceList;
