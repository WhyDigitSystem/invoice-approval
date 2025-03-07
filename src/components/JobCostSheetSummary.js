import React, { useState, useEffect } from "react";
import { notification, Spin, ConfigProvider } from "antd";
import { getJobCostSummary } from "../services/api";
import CommonTable from "./CommonTable";
import NoDataAvailable from "../utils/NoDataAvailable";

const JobCostSheetSummary = ({ branchName, jobNo }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(branchName, jobNo);
  }, []);

  const fetchData = (branchName, jobNo) => {
    setLoading(true);
    getJobCostSummary(branchName, jobNo)
      .then((response) => {
        // Filter out rows that are completely empty or have null values
        const filteredData = response.filter((item) => {
          return Object.values(item).some(
            (value) => value !== null && item.chargeCode !== ""
          );
        });
        // const filteredData = data.filter(row => row && Object.keys(row).length > 0 && row.name !== null);
        // Update data with the filtered results
        if (filteredData.length > 0) {
          setData(filteredData);
        } else {
          setData([]); // Explicitly set to empty if no valid data
        }
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

  const reportColumns = [
    { accessorKey: "title", header: "Title", size: 140 },
    { accessorKey: "jobNo", header: "Job No", size: 140 },
    { accessorKey: "chargeType", header: "Charge Type", size: 140 },
    { accessorKey: "chargeCode", header: "Charge Code", size: 140 },
    {
      accessorKey: "chargeDescription",
      header: "Charge Description",
      size: 400,
    },
    { accessorKey: "curr", header: "Currency", size: 140 },
    { accessorKey: "exRate", header: "Exchange Rate", size: 140 },
    { accessorKey: "fcAppAmount", header: "FC Amount", size: 140 },
    { accessorKey: "income", header: "Income", size: 140 },
    { accessorKey: "expense", header: "Expense", size: 140 },
    { accessorKey: "profit", header: "Profit", size: 140 },
  ];

  return (
    <ConfigProvider>
      <div
        className="card w-full p-6 bg-base-100 shadow-xl"
        style={{ padding: "20px", borderRadius: "10px", height: "100%" }}
      >
        <div className="row d-flex ml" style={{ marginTop: "40px" }}>
          <div
            className="d-flex flex-wrap justify-content-start mb-4"
            style={{ marginBottom: "20px" }}
          >
            <b>
              <p style={{ align: "center" }}>Job Cost Sheet Summary</p>
            </b>
            <br />
          </div>
        </div>

        {loading ? (
          <Spin size="large" />
        ) : (
          <div className="mt-4" style={{ marginTop: "30px", color: "blue" }}>
            {data.length > 0 ? (
              <CommonTable data={data} columns={reportColumns} />
            ) : (
              <NoDataAvailable message="No records to display" />
            )}
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default JobCostSheetSummary;
