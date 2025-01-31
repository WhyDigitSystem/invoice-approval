import React, { useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box, Button, Typography, MenuItem, Select, FormControl, Input } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';

const CommonTable = ({ columns, data }) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0, // The current page index
    pageSize: 10, // Number of rows per page
  });

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });

  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const handlePageChange = (newPageIndex) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      pageIndex: newPageIndex,
    }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      pageSize: newPageSize,
    }));
  };

  // Dynamically add right alignment to numeric columns
  const dynamicColumns = columns.map((column) => {
    return {
      ...column,
      cell: (info) => (
        <span
          style={{
            textAlign: typeof info.getValue() === 'number' ? 'right' : 'left',
            display: 'inline-block',
            width: '100%',
          }}
        >
          {info.getValue()}
        </span>
      ),
    };
  });

  return (
    <Box
      sx={{
        boxShadow: '0 8px 30px  rgba(0, 0, 0, 0.3)', // Apply shadow to table wrapper
        borderRadius: '8px', // Rounded corners
        padding: '16px', // Padding around the table container
        backgroundColor: 'white', // White background to ensure contrast
        overflow: 'hidden', // Ensure content doesn't overflow the card shape
      }}
    >
      <MaterialReactTable
        columns={dynamicColumns}
        data={data}
        enableRowSelection={true}
        columnFilterDisplayMode="popover"
        paginationDisplayMode="pages"
        positionToolbarAlertBanner="bottom"
        muiTableContainerProps={{
          // sx: {
          //   maxHeight: '400px', // Set a fixed height for the table container
          //   overflowY: 'auto', // Enables vertical scrolling inside the table
          // },
        }}
        muiTableBodyCellProps={{
          sx: {
            color: '#333', // Dark text color
            fontWeight: 'bold',
            fontFamily: "'Roboto', sans-serif",
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            position: 'sticky', // Make header sticky
            top: 0, // Fix header at the top
            zIndex: 2, // Ensure header stays above the rows
            backgroundColor: '#FFED86', // Prevent transparency issue
            color: 'black',
            fontWeight: 'bold',
            fontFamily: "'Roboto', sans-serif",
          },
        }}
        state={{
          pagination,
        }}
        onPaginationChange={(newPagination) => setPagination(newPagination)}
        renderTopToolbarCustomActions={({ table }) => (
          <Box
            sx={{
              display: 'flex',
              gap: '16px' ,
              padding: '8px',
              flexWrap: 'wrap',
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)", // Card-like shadow
              borderRadius: "18px", // Rounded corners
              padding: "16px", // Padding around the table
              backgroundColor: "white", // White background to ensure contrast
              marginBottom: '10px',
            }}
          >
            <Button onClick={handleExportData} startIcon={<FileDownloadIcon />}>
              Export All Data
            </Button>
            <Button
              disabled={table.getPrePaginationRowModel().rows.length === 0}
              onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
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
              disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
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
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              gap: 2 ,
              flexWrap: 'wrap',
            }}
          >
            {/* Pagination Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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

            {/* Go to Page */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1">Go to page:</Typography>
              <Input
                type="number"
                value={pagination.pageIndex + 1}
                onChange={(e) => {
                  const pageIndex = Math.max(
                    0,
                    Math.min(table.getPageCount() - 1, Number(e.target.value) - 1)
                  );
                  handlePageChange(pageIndex);
                }}
                sx={{
                  width: '60px',
                  textAlign: 'center',
                }}
              />
            </Box>

            {/* Rows per page */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1">Rows per page:</Typography>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
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
