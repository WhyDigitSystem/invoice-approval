import React, { useState, useEffect } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { notification } from 'antd';
import { Button, Select, DatePicker, Space } from 'antd';
import { getAPAgeing,getAllAPParties } from '../services/api';
import { getUserBranch } from '../services/api'; // Import getUserBranch function
import CommonTable from './CommonTable';
import dayjs from 'dayjs'; 
import { MenuItem, CircularProgress } from '@mui/material';
import "./ApAgeing.css";
import NoDataAvailable from '../utils/NoDataAvailable';

import moment from 'moment';
import { format } from 'date-fns';


const { Option } = Select;

export const APAgeing = () => {
  // States for filter values
  const [pbranchname, setPbranchName] = useState('');
  const [div, setDiv] = useState('');
  const [ptype,setPtype] = useState('');
  const [sbcode,setSbCode] = useState('');
  const [slab1,setSlab1]= useState(30);
  const [slab2,setSlab2]= useState(60);
  const [slab3,setSlab3]= useState(90);
  const [slab4,setSlab4]= useState(120);
  const [slab5,setSlab5]= useState(150);
  const [slab6,setSlab6]= useState(180);
  const [slab7,setSlab7]= useState(180);

  const [status, setStatus] = useState('');
  const [asondt, setAsondt] = useState(dayjs().format('DD-MM-YYYY'));
  const [subledgerName,setSubledgerName] =  useState('');

  const [subledgerNames,setSubledgerNames] =  useState('');
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [branchName, setBranchName] = useState([]); // Initialize as empty array
  const [branchNames, setBranchNames] = useState([]); // Initialize as empty array
  const { RangePicker } = DatePicker; // Destructure RangePicker

  
  

  
  // Fetch branch names on component mount
  useEffect(() => {
    getAllAPParties()
      .then((response) => {
        setSubledgerNames(response); // Assuming the API returns a list of branch objects
        console.log("Subledgername",subledgerNames);
      })
      .catch((error) => {
        notification.error({
          message: "Failed to fetch Branches",
          description: "Error occurred while fetching branch names.",
        });
      });
  }, []);

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
  

  // Handle date range change
  const handleDateRangeChange = (dates) => {
    // Set the selected date range into asondt
    setAsondt(dates ? dates[0] : null); // Use the first date as the only value
  };
  // Table columns definition
  const reportColumns = [
    { accessorKey: 'branchName', header: 'Branch', size: 140 },
    { accessorKey: 'subledgerCode', header: 'Vendor Code', size: 140 },
    { accessorKey: 'subledgerName', header: 'Vendor', size: 200 },
    // { accessorKey: 'cbranch', header: 'Ctrl Branch', size: 140 },
    // { accessorKey: 'salesPersonName', header: 'SalesPerson', size: 140 },
    { accessorKey: 'currency', header: 'Currency', size: 140 },
    { accessorKey: 'docid', header: 'Cost Invoice No', size: 140 },
    { accessorKey: 'docdt', header: 'Cost Invoice Dt', size: 140 },
    { accessorKey: 'refNo', header: 'Ref No', size: 140 },
    { accessorKey: 'refDate', header: 'Ref Date', size: 140 },
    { accessorKey: 'dueDate', header: 'Due Date', size: 140 },
    { accessorKey: 'amount', header: 'Cost Inv Amt', size: 140, cell: (info) => info.getValue(),
        className: 'align-right'},
    { accessorKey: 'outStanding', header: 'Out Standing', size: 140, cell: (info) => info.getValue(),
      className: 'align-right'},
    { accessorKey: 'totalDue', header: 'Total Due', size: 140 ,cell: (info) => info.getValue(),
      className: 'align-right'},
    { accessorKey: 'unAdjusted', header: 'Un Adjusted', size: 140 },
    { accessorKey: 'mslab1', header: 'Below 30 Days', size: 140 },
    { accessorKey: 'mslab2', header: 'Days 30 - 60', size: 140 },
    { accessorKey: 'mslab3', header: 'Days 60 - 90', size: 140 },
    { accessorKey: 'mslab4', header: 'Days 90 - 120', size: 140 },
    { accessorKey: 'mslab5', header: 'Days 120 - 150', size: 140 },
    { accessorKey: 'mslab6', header: 'Days 150 - 180', size: 140 },
    { accessorKey: 'mslab7', header: 'More Than 180 Days', size: 140 },
    { accessorKey: 'suppRefNo', header: 'Supplier Ref No', size: 140 },
    { accessorKey: 'suppRefDate', header: 'Supplier Ref Date', size: 140 },
    { accessorKey: 'whRefNo', header: 'WH RefNO', size: 140 },
    { accessorKey: 'mno', header: 'MNO', size: 140 },
    { accessorKey: 'hno', header: 'HNO', size: 140 },
  
  ];

  const handleInputChange = (e) => {
    setSlab1(e.target.value);  // Update the state when user types
  };


  const handleDateChange = (event) => {
    const newDate = event.target.value; 

    const formattedAsondt = newDate ? dayjs(newDate).format('DD-MM-YYYY') : null;

    setAsondt(formattedAsondt); // Update the state with the selected date
  };

  // Fetch data based on the selected filters
  const fetchData = () => {
    setLoading(true);

    
    
    // Format the date before passing to API
    // const formattedFromDate = fromDate ? fromDate.format('DD-MM-YYYY') : null;
    // const formattedToDate = toDate ? toDate.format('DD-MM-YYYY') : null;

    // const formattedAsonDate = asondt ? asondt.format('DD-MM-YYYY') : null;
    const formattedAsondt = asondt ? dayjs(asondt, 'DD-MM-YYYY').format('DD-MM-YYYY') : null;
    // Call API with filters
    getAPAgeing(formattedAsondt,div,pbranchname, ptype, subledgerName,slab1,slab2,slab3,slab4,slab5,slab6,slab7)
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
        <b><p style={{align:'left', marginLeft:'-1000px'}}>AP Ageing</p></b> <br/>
          <Space style={{ marginBottom: '20px' }}>
            
            {/* Branch Name Dropdown */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      
            <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
        <label htmlFor="party-select" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
          Party Name
        </label>
        {/* <Select
          id="branch-select"
          value={subledgerName}
          onChange={(value) => setSubledgerName(value)}
          placeholder="Select Party"
        >
          <Option value="">Select Party</Option>
          {subledgerNames && subledgerNames.length > 0 ? (
            subledgerNames.map((subledger) => (
              <Option key={subledger.subledgerName} value={subledger.subledgerName}>
                {subledger.subledgerName}
              </Option>
            ))
          ) : (
            <Option value="">No Subledger available</Option>
          )}
        </Select> */}
        
        
      <div className="input-data">
        
        <Select
          showSearch // Enable search functionality
          value={subledgerName}
          onChange={(value) => setSubledgerName(value)}
          placeholder="Select a Party"
          style={{ width: '100%' }} // Ensure the dropdown is wide enough
          loading={loading}
          
        > 
          {subledgerNames.length > 0 ? (
            subledgerNames.map((party) => (
              <MenuItem key={party.subledgerName} value={party.subledgerName}>
                {party.subledgerName}
              </MenuItem>
            ))
          ) : (
            <Select.Option disabled>No party names available</Select.Option>
          )}
        </Select>
        
        
         
        </div>
      </div> 



      <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
        <label htmlFor="branch-select" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
          Branch Name
        </label>
        <Select
          id="branch-select"
          value={pbranchname}
          onChange={(value) => setPbranchName(value)}
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
        <label htmlFor="type-select" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
          Type
        </label>
        <Select
          id="type-select"
          value={ptype}
          onChange={(value) => setPtype(value)}
          placeholder="Select Type"
        >
          <Option value="">Select Type</Option>
          <Option value="Branch">Branch</Option>
          <Option value="Pan India">Pan India</Option>
        </Select>
      </div>
      {/* Status Label and Dropdown */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
        <label htmlFor="division-select" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
          Division
        </label>
        <Select
          id="division-select"
          value={div}
          onChange={(value) => setDiv(value)}
          placeholder="Select Division"
        >
          <Option value="">Select Division</Option>
          <Option value="ALL">ALL</Option>
          <Option value="FF">FF</Option>
          <Option value="WH">WH</Option>
        </Select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
        <label htmlFor="division-select" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
          AsOn Date
        </label>
      <input
        type="date"
        id="asondt"
        value={asondt ? dayjs(asondt, 'DD-MM-YYYY').format('YYYY-MM-DD') : ''}
        onChange={handleDateChange}
        placeholder="DD/MM/YYYY"
      />
    </div>

      
<br/>
      
    <div style={{ display: 'flex', flexDirection: 'column', width: 'auto' }}>
  <label htmlFor="slab-input" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
    Slab1
  </label>
  <input
    id="slab1"
    type="text"
    value="30"
    onChange={handleInputChange}  // Update state on input change
    style={{ width: '80px', padding: '3px', fontSize: '12px' }} // Reduced size
  /> 
</div>

<div style={{ display: 'flex', flexDirection: 'column', width: 'auto' }}>
  <label htmlFor="slab-input" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
    Slab2
  </label>
  <input
    id="slab2"
    type="text"
    value={60}
    // onChange={handleInputChange}  // Uncomment if needed
    style={{ width: '80px', padding: '3px', fontSize: '12px' }} // Reduced size
  /> 
</div>
      
<div style={{ display: 'flex', flexDirection: 'column', width: 'auto' }}>
  <label htmlFor="slab-input" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
    Slab3
  </label>
  <input
    id="slab3"
    type="text"
    value={90}
    // onChange={handleInputChange}  // Uncomment if needed
    style={{ width: '80px', padding: '3px', fontSize: '12px' }} // Reduced size
  /> 
</div>
<div style={{ display: 'flex', flexDirection: 'column', width: 'auto' }}>
  <label htmlFor="slab-input" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
    Slab4
  </label>
  <input
    id="slab4"
    type="text"
    value={120}
    // onChange={handleInputChange}  // Uncomment if needed
    style={{ width: '80px', padding: '3px', fontSize: '12px' }} // Reduced size
  /> 
</div>
<div style={{ display: 'flex', flexDirection: 'column', width: 'auto' }}>
  <label htmlFor="slab-input" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
    Slab5
  </label>
  <input
    id="slab5"
    type="text"
    value={150}
    // onChange={handleInputChange}  // Uncomment if needed
    style={{ width: '80px', padding: '3px', fontSize: '12px' }} // Reduced size
  /> 
</div>
<div style={{ display: 'flex', flexDirection: 'column', width: 'auto' }}>
  <label htmlFor="slab-input" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
    Slab6
  </label>
  <input
    id="slab6"
    type="text"
    value={180}
    // onChange={handleInputChange}  // Uncomment if needed
    style={{ width: '80px', padding: '3px', fontSize: '12px' }} // Reduced size
  /> 
</div>
  {/* <div style={{ display: 'flex', flexDirection: 'column', width: 'auto' }}>
    <label htmlFor="slab-input" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
      Slab7
    </label>
    <input
      id="slab7"
      type="text"
      value={180}
      // onChange={handleInputChange}  // Uncomment if needed
      style={{ width: '100px', padding: '5px', fontSize: '14px' }} // Smaller width
    /> 
  </div> */}

   
      {/* Date Range Label and Picker */}
    
    
            

            

    <div style={{ display: 'flex', gap: '1px', marginTop: '30px',marginLeft:'0px'  }}>
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
          setPbranchName('');
          setAsondt('');
          setPtype(null);
          setDiv(null);
        //   fetchData(); // Re-fetch data without filters
        }}
      >
        Clear
      </Button>
    </div>
    </div>
          </Space>
        </div>
      </div>

      {/* Display Table */}
      <div className="mt-4" style={{ marginTop: '30px', color: "blue" }}>
    {/* Conditionally Render the Table or the 'No Records Found' Message */}
    {data.length > 0 ? (
      <CommonTable data={data} columns={reportColumns} loading={loading} />
    ) : (
      <NoDataAvailable message="No records to display" />
    )}
  </div>
    </div>
  );
};

export default APAgeing;
