import React, { useState, useEffect } from "react";
import { notification, Spin, ConfigProvider } from "antd";
import { getJobCostDetails } from "../services/api";
import CommonTable from "./CommonTable";
import dayjs from "dayjs";
import NoDataAvailable from "../utils/NoDataAvailable";

const JobCostSheetDetails = ({ branchName, jobNo }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(branchName, jobNo);
  }, [branchName, jobNo]);

  const fetchData = (branchName, jobNo) => {
    setLoading(true);
    getJobCostDetails(branchName, jobNo)
      .then((response) => {
        // Filter out empty rows from the data
        const filteredData = response.filter((item) =>
          Object.values(item).some((value) => value !== null && value !== "")
        );
        setData(filteredData);
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
    { accessorKey: "docId", header: "Doc ID", size: 140 },
    { accessorKey: "docDt", header: "Doc Date", size: 140 },
    { accessorKey: "vchNo", header: "Voucher No", size: 140 },
    { accessorKey: "vchDt", header: "Voucher Date", size: 140 },
    { accessorKey: "partyCode", header: "Party Code", size: 140 },
    { accessorKey: "partyName", header: "Party Name", size: 400 },
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
              <p style={{ align: "center" }}>Job Cost Sheet Details</p>
            </b>
            <br />
          </div>
        </div>

        {loading ? (
          <div className="loader">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : (
          <div className="mt-4" style={{ marginTop: "30px", color: "blue" }}>
            {data.length > 0 ? (
              <CommonTable
                data={data}
                columns={reportColumns}
                loading={loading}
              />
            ) : (
              <NoDataAvailable message="No records to display" />
            )}
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default JobCostSheetDetails;
