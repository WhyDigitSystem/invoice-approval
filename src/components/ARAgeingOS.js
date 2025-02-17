import React, { useState, useEffect } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { notification } from 'antd';
import { Button, Select, DatePicker, Space, Spin,Progress, Slider, Typography, Row, Col } from 'antd';
import { getAROS,getAllARParties } from '../services/api';
import { getUserBranch } from '../services/api'; // Import getUserBranch function
import CommonTable from './CommonTable';
import dayjs from 'dayjs'; 
import { MenuItem, CircularProgress } from '@mui/material';
import "./ApAgeing.css";
import NoDataAvailable from '../utils/NoDataAvailable';
import { AiFillBackward } from "react-icons/ai";
import rewindbutton from '.././rewindbutton.png';

import Spinner3 from '.././Spinner3.gif';
import moment from 'moment';
import { format } from 'date-fns';


const { Option } = Select;

export const ARAgeingOS = () => {
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
  const [loading, setLoading] = useState(false);
  const [branchName, setBranchName] = useState([]); // Initialize as empty array
  const [branchNames, setBranchNames] = useState([]); // Initialize as empty array
  const { RangePicker } = DatePicker; // Destructure RangePicker

  const [stepsCount, setStepsCount] = useState(5);  // Dynamic steps count
  const [stepsGap, setStepsGap] = useState(7);  // Dynamic gap between progress bars
  const [percent, setPercent] = useState(0); 
  const [dataLoaded, setDataLoaded] = useState(false); 

  
  // Simulate data loading
  useEffect(() => {
    if (loading && percent < 100) {
      const interval = setInterval(() => {
        setPercent((prevPercent) => {
          const nextPercent = prevPercent + 5;  // Increment the progress by 5%
          if (nextPercent >= 100) {
            clearInterval(interval);  // Stop the interval when progress reaches 100%
            setLoading(false);  // Data is fully loaded
            
          }
          return nextPercent;
        });
      }, 500); // Update progress every 500ms
      return () => clearInterval(interval); // Cleanup the interval on component unmount
    }
  }, [percent, loading]);
  
  // Fetch branch names on component mount
  useEffect(() => {
    getAllARParties()
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
  
  const getSlabHeader = (slabStart, slabEnd) => {
    if (slabStart && slabEnd && slabStart < slabEnd) {
      return `Days ${slabStart} - ${slabEnd}`;
    }
    if (slabStart ==0 && slabStart  < slabEnd) {
      return `Below ${slabEnd} Days`;
    }
    if (slabStart !=0 && slabEnd == 0)  {
      return `Days ${slabStart}+ `;
    }
    return ''; // Return empty string for invalid range
  };

  // Handle date range change
  const handleDateRangeChange = (dates) => {
    // Set the selected date range into asondt
    setAsondt(dates ? dates[0] : null); // Use the first date as the only value
  };
  // Table columns definition
  const reportColumns = [
    
    { accessorKey: 'subledgerCode', header: 'Party Code', size: 140 },
    { accessorKey: 'subledgerName', header: 'Party', size: 400 },
    // { accessorKey: 'cbranch', header: 'Ctrl Branch', size: 140 },
    // { accessorKey: 'salesPersonName', header: 'SalesPerson', size: 140 },
    // { accessorKey: 'jobBranch', header: 'Job Branch', size: 140 },
    // { accessorKey: 'currency', header: 'Currency', size: 140 },
    // { accessorKey: 'creditDays', header: 'Credit Days', size: 140 },
    // { accessorKey: 'creditLimit', header: 'Credit Limit', size: 140 },
    
    // { accessorKey: 'amount', header: 'Inv Amt', size: 140, cell: (info) => info.getValue(),
    //     className: 'align-right'},
    { accessorKey: 'outStanding', header: 'Out Standing', size: 140, cell: (info) => info.getValue(),
      className: 'align-right'},
      { accessorKey: 'unAdjusted', header: 'Un Adjusted', size: 140 },
    { accessorKey: 'totalDue', header: 'Total Due', size: 140 ,cell: (info) => info.getValue(),
      className: 'align-right'},
    
      // Conditionally add slab columns only if the range is valid
    ...(slab1 !== 0 ? [{ accessorKey: 'mslab1', header: getSlabHeader(0, slab1), size: 140 }] : []),
    ...(slab2 !== 0  ? [{ accessorKey: 'mslab2', header: getSlabHeader(slab1, slab2), size: 140 }] : []),
    ...(slab3 !== 0  ? [{ accessorKey: 'mslab3', header: getSlabHeader(slab2, slab3), size: 140 }] : []),
    ...(slab4 !== 0  ? [{ accessorKey: 'mslab4', header: getSlabHeader(slab3, slab4), size: 140 }] : []),
    ...(slab5 !== 0 ? [{ accessorKey: 'mslab5', header: getSlabHeader(slab4, 0), size: 140 }] : []),
    
  
  ];

  const handleInputChange = (e) => {
    setSlab1(e.target.value);  // Update the state when user types
  };

  const handleImageClick = () => {
    window.history.back(); // Takes the user to the previous page
  };

  const handleDateChange = (event) => {
    const newDate = event.target.value; 

    const formattedAsondt = newDate ? dayjs(newDate).format('DD-MM-YYYY') : null;

    setAsondt(formattedAsondt); // Update the state with the selected date
  };

  const handleSlabChange = (slab, value) => {
    let parsedValue = value === "" ? 0 : parseInt(value);  // If input is empty, reset to 0

    switch (slab) {
      case 'slab1':
        setSlab1(parsedValue);
        break;
      case 'slab2':
        setSlab2(parsedValue);
        break;
      case 'slab3':
        setSlab3(parsedValue);
        break;
      case 'slab4':
        setSlab4(parsedValue);
        break;
      case 'slab5':
        setSlab5(parsedValue);
        break;
        case 'slab6':
        setSlab6(parsedValue);
        break;
      default:
        break;
    }
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
    getAROS(formattedAsondt,div,pbranchname, ptype, subledgerName,slab1,slab2,slab3,slab4,slab5,slab6,slab7)
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
    <div className="card w-full p-6 bg-base-100 shadow-xl " style={{ padding: '20px', borderRadius: '10px',height: '100%', }}>
      {/* Filter Section */}
      <div className="row d-flex ml" style={{ marginTop: '40px' }}>
        <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
        <b><p style={{align:'left', marginLeft:'-900px'}}>AR OutStanding <img src={rewindbutton} alt="Go back" style={{width:"30px", marginLeft:"60px",cursor: 'pointer'  }} onClick={handleImageClick}/> </p></b>   <br/> 
        
          <Space style={{ marginBottom: '20px' }}>
            
            {/* Branch Name Dropdown */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      
            <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
        <label htmlFor="party-select" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
          Party Name
        </label>
 
        
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
              <Option key={branch.branchCode} value={branch.branchName}>
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
          <Option value="Control">Control</Option>
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

      <div style={{ display: 'flex', flexDirection: 'column', width: '120px' }}>
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
      
    {/* <div style={{ display: 'flex', flexDirection: 'column', width: 'auto' }}>
  <label htmlFor="slab-input" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
    Slab1
  </label>
  <input
    id="slab1"
    type="text"
    value={slab1} // Dynamically bound to the state
    onChange={(e) => handleSlabChange(e, 1)}  // Pass slab number to the handler
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
    value={slab2} // Dynamically bound to the state
    onChange={(e) => handleSlabChange(e, 2)}  // Pass slab number to the handler
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
    value={slab3} // Dynamically bound to the state
    onChange={(e) => handleSlabChange(e, 3)}  // Pass slab number to the handler
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
    value={slab4} // Dynamically bound to the state
    onChange={(e) => handleSlabChange(e, 4)}  // Pass slab number to the handler
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
    value={slab5} // Dynamically bound to the state
    onChange={(e) => handleSlabChange(e, 5)}  // Pass slab number to the handler
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
    value={slab6} // Dynamically bound to the state
    onChange={(e) => handleSlabChange(e, 6)}  // Pass slab number to the handler
    style={{ width: '80px', padding: '3px', fontSize: '12px' }} // Reduced size
  /> 
</div> */}
 
      <button class="Btn" style={{marginTop:"30px"}}>
  <span class="leftContainer">
    <span class="like" onClick={fetchData}
        loading={loading} >Search</span>
  </span>
  <span class="likeCount" onClick={() => {
          setPbranchName('');
          setAsondt('');
          setPtype(null);
          setDiv(null);
        //   fetchData(); // Re-fetch data without filters
        }}>
    Clear
  </span>
</button>


    
    </div>
          </Space>
        </div>
      </div>

    {/* Loading Spinner */}
    {loading ? (
      //    <div className="loading-spinner" style={{ textAlign: 'center', width: '100%' }}>
      //    <Progress size="large" />
      //  </div>
    <Col style={{display:"flex",justifyContent:"center"}}>
          {/* <Progress
            type="circle"
            percent={percent}
            trailColor="rgba(0, 0, 0, 0.06)"
            strokeWidth={20}
            steps={stepsCount} // Dynamic steps count
            format={(percent) => `${percent}%`} // Optional: custom format
            style={{ marginTop: stepsGap }} // Adjusting gap with dynamic margin
          /> */}
          {/* <SquareSpinner /> */}
          {/* <img src={Spinner3} alt="Loading" style={{marginLeft:"550px"}}/> */}
          <div class="loader" style={{display:"flex",justifyContent:"center"}}>
  <div></div> 
  <div></div>
  <div></div>
  <div></div>
</div>


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

export default ARAgeingOS;
