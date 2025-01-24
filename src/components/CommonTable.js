import React, { useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box, Button, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
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
    <MaterialReactTable
      columns={dynamicColumns}
      data={data}
      enableRowSelection={true}
      columnFilterDisplayMode="popover"
      paginationDisplayMode="pages"
      positionToolbarAlertBanner="bottom"
      state={{
        pagination,
      }}
      onPaginationChange={(newPagination) => setPagination(newPagination)}
      renderTopToolbarCustomActions={({ table }) => (
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            padding: '8px',
            flexWrap: 'wrap',
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
            gap: 2, // Added gap for more space between elements
            flexWrap: 'wrap', // Allow wrapping to prevent overflow
          }}
        >
          {/* Pagination Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              onClick={() => handlePageChange(0)} // Jump to the first page
              disabled={pagination.pageIndex === 0}
              sx={{ marginRight: 2 }}
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
  );
};

export default CommonTable;
