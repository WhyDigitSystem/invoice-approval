import React, { useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  Input,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { mkConfig, generateCsv, download } from "export-to-csv";

const CommonTable = ({ columns, data }) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [tableData, setTableData] = useState(data); // Track the table data state

  // Initialize the CSV configuration
  const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  // Function to calculate the grand total for numeric columns

  // Function to handle page changes
  const handlePageChange = (newPageIndex) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      pageIndex: newPageIndex,
    }));
  };

  // Function to handle page size changes
  const handlePageSizeChange = (newPageSize) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      pageSize: newPageSize,
    }));
  };

  // Function to handle exporting rows
  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  // Function to handle exporting all data
  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(tableData); // Export the full tableData including grand total
    download(csvConfig)(csv);
  };

  // Helper function to check if value is numeric
  const isNumeric = (value) => !isNaN(value) && value !== null;

  // Dynamically add right alignment to numeric columns
  const dynamicColumns = columns.map((column) => ({
    ...column,
    cell: (info) => (
      <span
        style={{
          textAlign: isNumeric(info.getValue()) ? "right" : "left",
          display: "inline-block",
          width: "100%",
        }}
      >
        {info.getValue()}
      </span>
    ),
  }));

  return (
    <Box
      sx={{
        // boxShadow: "0 4px 5px rgba(0, 0, 0, 0.5)",
        boxShadow: "0 0 15px rgba(0, 0, 0, 0.3)",
        borderRadius: "18px",
        padding: "16px",
        backgroundColor: "white",
        overflow: "hidden",
      }}
    >
      <MaterialReactTable
        columns={dynamicColumns}
        data={tableData} // Use the tableData including the grand total row
        enableRowSelection={true}
        columnFilterDisplayMode="popover"
        paginationDisplayMode="pages"
        positionToolbarAlertBanner="bottom"
        muiTableContainerProps={
          {
            // sx: {
            //   maxHeight: '400px',
            //   overflowY: 'auto',
            // },
          }
        }
        // muiTableBodyCellProps={{
        //   sx: {
        //     color: '#333',
        //     fontWeight: 'bold',
        //     fontFamily: "'Roboto', sans-serif",
        //   },
        // }}
        // muiTableBodyCellProps={({ row }) => ({
        //   sx: {
        //     color: ['0', '3', '4'].includes(row.original.sno) ? 'maroon' : '#333', // Apply maroon for sno 1, 3, 4
        //     fontWeight: 'bold',
        //     fontFamily: "'Roboto', sans-serif",

        //   },
        // })}
        // muiTableHeadCellProps={{
        //   sx: {
        //     position: 'sticky',
        //     top: 0,
        //     zIndex: 2,
        //     backgroundColor: '#FFED86',
        //     color: 'black',
        //     fontWeight: 'bold',
        //     fontFamily: "'Roboto', sans-serif",

        //   },
        // }}
        muiTableBodyCellProps={({ row, column }) => ({
          sx:
            column.id === "sno"
              ? { display: "none" }
              : {
                  color: ["0", "3", "4"].includes(row.original.sno)
                    ? "maroon"
                    : "#333",
                  fontWeight: "bold",
                  fontFamily: "'Roboto', sans-serif",
                  lineHeight: "0.4",
                },
        })}
        muiTableHeadCellProps={({ column }) => ({
          sx:
            column.id === "sno"
              ? { display: "none" }
              : {
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                  // backgroundColor: '#FFED86',
                  backgroundColor: "#FFED86",
                  color: "black",
                  fontWeight: "bold",
                  fontFamily: "'Roboto', sans-serif",
                  lineHeight: "0.8",
                },
        })}
        state={{
          pagination,
        }}
        onPaginationChange={(newPagination) => setPagination(newPagination)}
        renderTopToolbarCustomActions={({ table }) => (
          <Box
            sx={{
              display: "flex",
              gap: "16px",
              padding: "8px",
              flexWrap: "wrap",
              // boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
              boxShadow: "0 0 15px rgba(0, 0, 0, 0.3)",
              borderRadius: "18px",
              padding: "16px",
              backgroundColor: "white",
              marginBottom: "10px",
            }}
          >
            <Button onClick={handleExportData} startIcon={<FileDownloadIcon />}>
              Export All Data
            </Button>
            <Button
              disabled={table.getPrePaginationRowModel().rows.length === 0}
              onClick={() =>
                handleExportRows(table.getPrePaginationRowModel().rows)
              }
              startIcon={<FileDownloadIcon />}
            >
              Export All Rows
            </Button>
            <Button
              disabled={table.getRowModel().rows.length === 0}
              onClick={() => handleExportRows(table.getRowModel().rows)}
              startIcon={<FileDownloadIcon />}
            >
              Export Page Rows
            </Button>
            <Button
              disabled={
                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
              }
              onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
              startIcon={<FileDownloadIcon />}
            >
              Export Selected Rows
            </Button>
          </Box>
        )}
        renderPagination={({ table }) => (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                onClick={() => handlePageChange(0)} // Jump to the first page
                disabled={pagination.pageIndex === 0}
                sx={{ marginRight: 8 }}
              >
                First
              </Button>
              <Button
                onClick={() => handlePageChange(pagination.pageIndex - 1)}
                disabled={pagination.pageIndex === 0}
                sx={{ marginRight: 2 }}
              >
                Previous
              </Button>

              <Typography variant="body1" sx={{ marginRight: 2 }}>
                Page {pagination.pageIndex + 1} of {table.getPageCount()}
              </Typography>

              <Button
                onClick={() => handlePageChange(pagination.pageIndex + 1)}
                disabled={pagination.pageIndex === table.getPageCount() - 1}
                sx={{ marginLeft: 2 }}
              >
                Next
              </Button>
              <Button
                onClick={() => handlePageChange(table.getPageCount() - 1)} // Jump to the last page
                disabled={pagination.pageIndex === table.getPageCount() - 1}
                sx={{ marginLeft: 2 }}
              >
                Last
              </Button>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body1">Go to page:</Typography>
              <Input
                type="number"
                value={pagination.pageIndex + 1}
                onChange={(e) => {
                  const pageIndex = Math.max(
                    0,
                    Math.min(
                      table.getPageCount() - 1,
                      Number(e.target.value) - 1
                    )
                  );
                  handlePageChange(pageIndex);
                }}
                sx={{
                  width: "60px",
                  textAlign: "center",
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography variant="body1">Rows per page:</Typography>
              <FormControl
                variant="outlined"
                size="small"
                sx={{ minWidth: 120 }}
              >
                <Select
                  value={pagination.pageSize}
                  onChange={(e) => handlePageSizeChange(e.target.value)}
                  label="Rows per page"
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        )}
      />
    </Box>
  );
};

export default CommonTable;
