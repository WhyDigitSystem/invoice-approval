import React, { useState, useEffect } from "react";
import { notification } from "antd";
import {
  Select,
  Space,
  DatePicker,
  Col,
  Button,
  Switch,
  ConfigProvider,
} from "antd";
import { getProfitAndLoss, getUserBranch } from "../services/api";
import NoDataAvailable from "../utils/NoDataAvailable";
import { AiFillBackward } from "react-icons/ai";
import rewindbutton from ".././rewindbutton.png";
import Spinner3 from ".././Spinner3.gif";
import moment from "moment";
import { format } from "date-fns";
import "./ProfitAndLoss.css";
import CommonTable from "./CommonTable";
import { jsPDF } from "jspdf";
import ButtonNew from "./ButtonNew";
import ButtonNewDark from "./ButtonNewDark";
import {
  LogoutOutlined,
  MoonOutlined,
  RightCircleOutlined,
  SunOutlined,
  FolderOpenOutlined,
  FolderOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { RangePicker } = DatePicker;

const ProfitAndLoss = () => {
  const [pbranchname, setPbranchName] = useState("");
  const [fromdt, setFromdt] = useState(null);
  const [todt, setTodt] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [branchNames, setBranchNames] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [viewMode, setViewMode] = useState("treeview");
  const [isExpanded, setIsExpanded] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

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

  const reportColumns = [
    { accessorKey: "pTitle", header: "Group", size: 140 },
    {
      accessorKey: "sTitle",
      header: "Sub Group",
      size: 140,
      cell: (info) => info.getValue(),
      className: "align-right",
    },
    {
      accessorKey: "groupName",
      header: "Group Name",
      size: 140,
      cell: (info) => info.getValue(),
      className: "align-right",
    },
    { accessorKey: "accountName", header: "Account Name", size: 140 },
    {
      accessorKey: "amount",
      header: "Amount",
      size: 140,
      // cell: (info) => {
      //   const amt = parseFloat(info.getValue());
      //   return amt ? new Intl.NumberFormat("en-IN").format(amt) : "0";
      // },
    },
  ];
  // Handle branch selection change
  const handleBranchChange = (value) => {
    setPbranchName(value);
  };

  // Handle image click (Go Back Button)
  const handleImageClick = () => {
    window.history.back(); // Takes the user to the previous page
  };

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length > 0) {
      setFromdt(dates[0]);
      setTodt(dates[1]);
    } else {
      setFromdt(null);
      setTodt(null);
    }
  };

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
  // Define styles bas

  const fetchData = () => {
    setLoading(true);
    const formattedFromDate = fromdt ? fromdt.format("DD/MM/YYYY") : null;
    const formattedToDate = todt ? todt.format("DD/MM/YYYY") : null;
    getProfitAndLoss(pbranchname, formattedFromDate, formattedToDate)
      .then((response) => {
        setData(response);
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

  const organizeData = (data) => {
    const groupedData = {};
    data.forEach((item) => {
      if (!groupedData[item.pTitle]) {
        groupedData[item.pTitle] = {
          total: 0, // Initialize total for pTitle
          subGroups: {}, // Store subGroups (sTitle) under pTitle
        };
      }
      if (!groupedData[item.pTitle].subGroups[item.sTitle]) {
        groupedData[item.pTitle].subGroups[item.sTitle] = {
          total: 0, // Initialize total for sTitle
          groups: {}, // Store groups under sTitle
        };
      }
      if (
        !groupedData[item.pTitle].subGroups[item.sTitle].groups[item.groupName]
      ) {
        groupedData[item.pTitle].subGroups[item.sTitle].groups[item.groupName] =
          {
            items: [], // Items inside group
            total: 0, // Group total
          };
      }

      // Push items to the respective group
      groupedData[item.pTitle].subGroups[item.sTitle].groups[
        item.groupName
      ].items.push({
        accountName: item.accountName,
        amt: parseFloat(item.amt),
      });

      // Add amount to group total
      groupedData[item.pTitle].subGroups[item.sTitle].groups[
        item.groupName
      ].total += parseFloat(item.amt);

      // Add amount to sTitle total
      groupedData[item.pTitle].subGroups[item.sTitle].total += parseFloat(
        item.amt
      );

      // Add amount to pTitle total
      groupedData[item.pTitle].total += parseFloat(item.amt); // Total for the pTitle
    });
    return groupedData;
  };

  const groupedData = organizeData(data);

  const renderTree = (groupedData) => {
    return Object.keys(groupedData).map((pTitle) => (
      <div
        key={pTitle}
        className="tree-node"
        style={{
          border: "3px dashed #ccc",
        }}
      >
        <div
          className="tree-leaf"
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: theme === "dark" ? "#f0f0f0" : "red",
            fontWeight: "bold",
          }}
        >
          <div className="tree-leaf-text">Particulars</div>
          <div
            className="tree-leaf-text"
            style={{
              textAlign: "right",
              marginLeft: "-320px",
              color: theme === "dark" ? "#f0f0f0" : "red",
              fontWeight: "bold",
            }}
          >
            Amount
          </div>
        </div>

        <div className="tree-leaf">
          <div className="tree-leaf-content" onClick={() => toggleNode(pTitle)}>
            <div
              className="tree-expando"
              style={{ marginTop: "-20px", marginRight: "5px" }}
            >
              {expandedNodes[pTitle] ? (
                <FolderOpenOutlined />
              ) : (
                <FolderOutlined />
              )}
            </div>
            <div
              className="tree-leaf-text"
              style={{
                color: theme === "dark" ? "#e0e0e0" : "#00b33c",
                fontWeight: "bold",
              }}
            >
              {pTitle}
            </div>
            <div
              className="tree-leaf-text"
              style={{
                textAlign: "right",
                marginLeft: "-330px",
                color: theme === "dark" ? "#e0e0e0" : "#00b33c",
                fontWeight: "bold",
              }}
            >
              {groupedData[pTitle].total
                ? new Intl.NumberFormat("en-IN").format(
                    groupedData[pTitle].total
                  )
                : "0"}
            </div>
          </div>

          {expandedNodes[pTitle] && (
            <div className="tree-child-leaves">
              {/* Render total for pTitle */}
              <div
                className="tree-node"
                style={{
                  color: theme === "dark" ? "#e0e0e0" : "green",
                  fontWeight: "bold",
                }}
              >
                <div
                  className="tree-leaf"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {/* <div className="tree-leaf-text">Total for {pTitle}</div>
                  <div
                    className="tree-leaf-text"
                    style={{
                      textAlign: "right",
                      marginLeft: "-350px",
                    }}
                  >
                    {groupedData[pTitle].total
                      ? new Intl.NumberFormat("en-IN").format(
                          groupedData[pTitle].total
                        )
                      : "0"}
                  </div> */}
                </div>
              </div>

              {/* Render sTitle and group-level data */}
              {Object.keys(groupedData[pTitle].subGroups).map((sTitle) => (
                <div key={sTitle} className="tree-node">
                  <div className="tree-leaf">
                    <div
                      className="tree-leaf-content"
                      onClick={() => toggleNode(`${pTitle}-${sTitle}`)}
                    >
                      <div
                        className="tree-expando"
                        style={{ marginTop: "-20px", marginRight: "5px" }}
                      >
                        {expandedNodes[`${pTitle}-${sTitle}`] ? (
                          <FolderOpenOutlined />
                        ) : (
                          <FolderOutlined />
                        )}
                      </div>
                      <div
                        className="tree-leaf-text"
                        style={{
                          color: theme === "dark" ? "#e0e0e0" : "#008ae3",
                        }}
                      >
                        {sTitle}
                      </div>
                      <div
                        className="tree-leaf-text"
                        style={{
                          textAlign: "right",
                          marginLeft: "-340px",
                          color: theme === "dark" ? "#e0e0e0" : "#008ae3",
                        }}
                      >
                        {groupedData[pTitle].subGroups[sTitle].total
                          ? new Intl.NumberFormat("en-IN").format(
                              groupedData[pTitle].subGroups[sTitle].total
                            )
                          : "0"}
                      </div>
                    </div>

                    {expandedNodes[`${pTitle}-${sTitle}`] && (
                      <div className="tree-child-leaves">
                        {Object.keys(
                          groupedData[pTitle].subGroups[sTitle].groups
                        ).map((groupName) => {
                          const group =
                            groupedData[pTitle].subGroups[sTitle].groups[
                              groupName
                            ];
                          const items = group.items;

                          return (
                            <div key={groupName} className="tree-node">
                              <div className="tree-leaf">
                                <div
                                  className="tree-leaf-content"
                                  onClick={() =>
                                    toggleNode(
                                      `${pTitle}-${sTitle}-${groupName}`
                                    )
                                  }
                                >
                                  <div
                                    className="tree-expando"
                                    style={{
                                      marginTop: "-20px",
                                      marginRight: "5px",
                                    }}
                                  >
                                    {expandedNodes[
                                      `${pTitle}-${sTitle}-${groupName}`
                                    ] ? (
                                      <FolderOpenOutlined />
                                    ) : (
                                      <FolderOutlined />
                                    )}
                                  </div>
                                  <div
                                    className="tree-leaf-text"
                                    style={{
                                      color:
                                        theme === "dark" ? "#e0e0e0" : "blue",
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    {groupName}
                                  </div>

                                  <div
                                    className="tree-leaf-text"
                                    style={{
                                      textAlign: "right",
                                      color:
                                        theme === "dark" ? "#e0e0e0" : "blue",
                                      display: "flex",
                                      justifyContent: "space-between",
                                      marginLeft: "-350px",
                                    }}
                                  >
                                    {group.total
                                      ? new Intl.NumberFormat("en-IN").format(
                                          group.total
                                        )
                                      : "0"}
                                  </div>
                                </div>

                                {expandedNodes[
                                  `${pTitle}-${sTitle}-${groupName}`
                                ] && (
                                  <div className="tree-child-leaves">
                                    {items.map((item, index) => (
                                      <div
                                        key={index}
                                        className="tree-leaf"
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div className="tree-leaf-text">
                                          {item.accountName}
                                        </div>
                                        <div
                                          className="tree-leaf-text"
                                          style={{
                                            textAlign: "right",
                                            marginLeft: "-350px",
                                          }}
                                        >
                                          {item.amt
                                            ? new Intl.NumberFormat(
                                                "en-IN"
                                              ).format(item.amt)
                                            : "0"}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ));
  };

  const toggleNode = (name) => {
    setExpandedNodes((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  const expandAll = () => {
    const allExpandedNodes = {};

    // Loop through each pTitle
    Object.keys(groupedData).forEach((pTitle) => {
      allExpandedNodes[pTitle] = true; // Expand pTitle node

      // Loop through each sTitle within pTitle
      Object.keys(groupedData[pTitle].subGroups).forEach((sTitle) => {
        allExpandedNodes[`${pTitle}-${sTitle}`] = true; // Expand sTitle node

        // Loop through each group within sTitle
        Object.keys(groupedData[pTitle].subGroups[sTitle].groups).forEach(
          (groupName) => {
            allExpandedNodes[`${pTitle}-${sTitle}-${groupName}`] = true; // Expand group node
          }
        );
      });
    });

    // Update expanded nodes state
    setExpandedNodes(allExpandedNodes);
  };

  // Collapse all nodes
  const collapseAll = () => {
    setExpandedNodes({});
  };

  const toggleViewMode = () => {
    setViewMode((prevMode) =>
      prevMode === "treeview" ? "tableview" : "treeview"
    );
  };

  const handleToggleChange = (checked) => {
    setIsExpanded(checked);
    if (checked) {
      expandAll(); // Call expandAll if checked
    } else {
      collapseAll(); // Call collapseAll if unchecked
    }
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <div
        className="card w-full p-6 bg-base-100 shadow-xl"
        style={{
          padding: "20px",
          borderRadius: "10px",
          height: "100%",
        }}
      >
        <div className="row d-flex ml" style={{ marginTop: "40px" }}>
          <div
            className="d-flex flex-wrap justify-content-start mb-4"
            style={{ marginBottom: "20px" }}
          >
            <b>
              <p
                style={{
                  align: "centre",

                  marginBottom: "20px",
                }}
              >
                Profit And Loss
                {/* <img
                src={rewindbutton}
                alt="Go back"
                style={{ width: "30px", marginLeft: "60px", cursor: "pointer" }}
                onClick={handleImageClick}
              /> */}
                <ButtonNew />
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
            </b>

            <Space style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "180px",
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
                  value={pbranchname}
                  onChange={handleBranchChange}
                  placeholder="Select Branch"
                >
                  <Option value="">Select Branch</Option>
                  {branchNames.length > 0 ? (
                    branchNames.map((branch) => (
                      <Option key={branch.branchCode} value={branch.branchCode}>
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
                  width: "240px",
                }}
              >
                <label
                  htmlFor="date-range-picker"
                  style={{ marginBottom: "8px", fontWeight: "bold" }}
                >
                  Date Range
                </label>
                <RangePicker
                  id="date-range-picker"
                  value={[fromdt, todt]}
                  onChange={handleDateRangeChange}
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY"
                  placeholder={["Start Date", "End Date"]}
                />
              </div>

              <button
                className="Btn"
                style={{ marginTop: "30px" }}
                onClick={fetchData}
              >
                <span className="leftContainer">
                  <span className="like">Search</span>
                </span>
                <span
                  className="likeCount"
                  onClick={() => {
                    setPbranchName("");
                    setFromdt(null);
                    setTodt(null);
                  }}
                >
                  Clear
                </span>
              </button>

              {data.length > 0 && (
                <div // <div
                  className="switch-holder"
                  style={{ marginTop: "-80px", marginLeft: "350px" }}
                >
                  <div className="switch-label">
                    <i className="fa fa-sun"></i>{" "}
                    <span>
                      {viewMode === "treeview" ? "TreeView" : "TreeView"}
                    </span>
                  </div>
                  <div className="switch-toggle">
                    <input
                      type="checkbox"
                      id="view-toggle"
                      checked={viewMode === "treeview"}
                      onChange={toggleViewMode}
                    />
                    <label htmlFor="view-toggle"></label>
                  </div>
                </div>
              )}
            </Space>

            {data.length > 0 && viewMode === "treeview" && (
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  // justifyContent: "center", // Center the switch
                }}
              >
                <label
                  style={{
                    marginRight: "600px",
                    fontWeight: "bold",
                  }}
                >
                  {/* Expand/Collapse All */}
                </label>
                <Switch
                  checked={isExpanded}
                  onChange={handleToggleChange}
                  checkedChildren="Collapse All"
                  unCheckedChildren="Expand All"
                  style={{ marginTop: "4px", marginTop: "-70px" }}
                />
              </div>
            )}
          </div>

          {loading ? (
            <Col style={{ display: "flex", justifyContent: "center" }}>
              <div
                className="loader"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </Col>
          ) : data.length > 0 ? (
            <div>
              {viewMode === "treeview" ? (
                renderTree(groupedData)
              ) : (
                <CommonTable
                  data={data}
                  columns={reportColumns}
                  loading={loading}
                />
              )}
            </div>
          ) : (
            <NoDataAvailable />
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default ProfitAndLoss;
