import React, { useState, useEffect } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { notification } from 'antd';
import { Button, Select, DatePicker, Space,Col } from 'antd';
import { getMIS } from '../services/api';
import { getUserBranch } from '../services/api'; // Import getUserBranch function
import CommonTable from './CommonTable';
import rewindbutton from '.././rewindbutton.png';
import Spinner3 from '.././Spinner3.gif';
import NoDataAvailable from '../utils/NoDataAvailable';




const { Option } = Select;

export const MIS = () => {
  // States for filter values
  const [branchName, setBranchName] = useState('');
  const [status, setStatus] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [branchNames, setBranchNames] = useState([]); // Initialize as empty array
  const { RangePicker } = DatePicker; // Destructure RangePicker


  const handleImageClick = () => {
    window.history.back(); // Takes the user to the previous page
  };

  // Handle date range change
  const handleDateRangeChange = (dates) => {
    if (dates && dates.length > 0) {
      setFromDate(dates[0]); // First date is the fromDate
      setToDate(dates[1]);   // Second date is the toDate
    } else {
      setFromDate(null);
      setToDate(null);
    }
  };
  // Table columns definition
  const reportColumns = [
    { accessorKey: 'jobBranch', header: 'Job Branch', size: 140 },
    { accessorKey: 'income', header: 'Income', size: 140, cell: (info) => info.getValue(),
      className: 'align-right'},
    { accessorKey: 'expense', header: 'Expense', size: 140 ,cell: (info) => info.getValue(),
      className: 'align-right'},
    { accessorKey: 'gp', header: 'GP', size: 140 },
    { accessorKey: 'branchGP', header: 'Branch GP', size: 140 },
    { accessorKey: 'retainGP', header: 'Retain GP', size: 140 },
    { accessorKey: 'issuedGP', header: 'Issued GP', size: 140 },
    { accessorKey: 'receivedGP', header: 'Received GP', size: 140 },
  ];

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

    // Format the date before passing to API
    const formattedFromDate = fromDate ? fromDate.format('DD-MM-YYYY') : null;
    const formattedToDate = toDate ? toDate.format('DD-MM-YYYY') : null;

    // Call API with filters
    getMIS(branchName, status, formattedFromDate, formattedToDate)
      .then((response) => {
        // Set data state with the updated data (result + grand total)
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

  return (
    
    <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px', borderRadius: '10px' }}>
      {/* Filter Section */}
      <div className="row d-flex ml" style={{ marginTop: '40px' }}>
      
        <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
        <b><p style={{align:'left', marginLeft:'-1000px'}}>MIS <img src={rewindbutton} alt="Go back" style={{width:"30px", marginLeft:"60px",cursor: 'pointer'  }} onClick={handleImageClick}/> </p></b>   <br/> 
          <Space style={{ marginBottom: '20px' }}>
            
            {/* Branch Name Dropdown */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      {/* Branch Name Label and Dropdown */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
        <label htmlFor="branch-select" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
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
              <Option key={branch.branchCode} value={branch.branchCode}>
                {branch.branchName}
              </Option>
            ))
          ) : (
            <Option value="">No branches available</Option>
          )}
        </Select>
      </div>

      {/* Status Label and Dropdown */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
        <label htmlFor="status-select" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
          Status
        </label>
        <Select
          id="status-select"
          value={status}
          onChange={(value) => setStatus(value)}
          placeholder="Select Status"
        >
          <Option value="">Select Status</Option>
          <Option value="Closed">Closed</Option>
          <Option value="Pending">Pending</Option>
        </Select>
      </div>

      {/* Date Range Label and Picker */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <label htmlFor="date-range-picker" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
          Date Range
        </label>
        <RangePicker
          id="date-range-picker"
          value={[fromDate, toDate]}
          onChange={handleDateRangeChange}
          style={{ width: "100%" }}
          format="YYYY-MM-DD"
          placeholder={["Start Date", "End Date"]}
        />
      </div>
    </div>
            

    <div style={{ display: 'flex', gap: '1px', marginTop: '30px'  }}>
      {/* Search Button */}
      <Button
        type="primary"
        icon={<SearchIcon />}
        onClick={fetchData}
      >
        Search
      </Button>
      </div>
      <div style={{ display: 'flex', gap: '1px', marginTop: '30px'  }}>
      {/* Clear Button */}
      <Button
        icon={<ClearIcon />}
        onClick={() => {
          setBranchName('');
          setStatus('');
          setFromDate(null);
          setToDate(null);
          fetchData(); // Re-fetch data without filters
        }}
      >
        Clear
      </Button>
    </div>
          </Space>
        </div>
      </div>

     
    {loading ? (
      
    <Col>
         
          <img src={Spinner3} alt="Loading" style={{marginLeft:"550px"}}/>
        </Col>
      ) :(
        <div className="mt-4" style={{ marginTop: '30px', color: "blue" }}>
          {/* Conditionally Render the Table or the 'No Records Found' Message */}
          {data.length > 0 ? (
            <CommonTable data={data} columns={reportColumns} loading={loading} />
          ) : (
            <NoDataAvailable message="No records to display" />
          )}
        </div>
      )}
      
      {/* No Data Message */}
      
    </div>
    
    );
};

export default MIS;
