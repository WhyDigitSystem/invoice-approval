import React, { useState, useEffect } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { notification } from 'antd';
import { Button, Select, DatePicker, Space, Spin,Progress, Slider, Typography, Row, Col } from 'antd';
import { getProfitAndLoss,getTrailBalance } from '../services/api';
import { getUserBranch } from '../services/api'; // Import getUserBranch function
import CommonTable from './CommonTable';
// import dayjs from 'dayjs'; 
import { MenuItem, CircularProgress } from '@mui/material';
import "./ApAgeing.css";
import NoDataAvailable from '../utils/NoDataAvailable';
import { AiFillBackward } from "react-icons/ai";
import rewindbutton from '.././rewindbutton.png';

import Spinner3 from '.././Spinner3.gif';
import moment from 'moment';
import { format } from 'date-fns';


const { Option } = Select;

export const TrailBalance = () => {
  // States for filter values
  const [pbranchname, setPbranchName] = useState('');
  const [party, setParty] = useState('');
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
  
  const [finyr, setFinyr] = useState('');
  const [status, setStatus] = useState('');
  const [fromdt, setFromdt] = useState(null);
  const [todt ,setTodt] = useState(null);
  const [subledgerName,setSubledgerName] =  useState('');

  const [subledgerNames,setSubledgerNames] =  useState('');
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [branchName, setBranchName] = useState([]); // Initialize as empty array
  const [branchNames, setBranchNames] = useState([]); // Initialize as empty array
  const { RangePicker } = DatePicker; // Destructure RangePicker
  const [selectedParty, setSelectedParty] = useState('');

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
  // const handleDateRangeChange = (dates) => {
  //   // Set the selected date range into asondt
  //   setAsondt(dates ? dates[0] : null); // Use the first date as the only value
  // };
  // Table columns definition
  // const reportColumns = [
  //   { accessorKey: 'SNo', header: 'sno', size: 140 },
  //   { accessorKey: 'docid', header: 'Invoice No', size: 140 },
  //   { accessorKey: 'docDate', header: 'Invoice Date', size: 140 },
  //   { accessorKey: 'refNo', header: 'Ref No', size: 140 },
  //   { accessorKey: 'refDate', header: 'Ref Date', size: 140 },
  //   { accessorKey: 'suppRefNo', header: 'Supp Ref No', size: 140 },
  //   { accessorKey: 'suppRefDate', header: 'Supp Ref Date', size: 140 },
  //   // { accessorKey: 'subledgerCode', header: 'Party Code', size: 140 },
  //   // { accessorKey: 'subledgerName', header: 'Party', size: 400 },
  //   // { accessorKey: 'currency', header: 'Currency', size: 140 },
  //   { accessorKey: 'particulars', header: 'Particulars', size: 400 },
  //   { accessorKey: 'opbal', header: 'Op Bal.', size: 140 },
  //   // { accessorKey: 'cbranch', header: 'Ctrl Branch', size: 140 },
  
  //   { accessorKey: 'dbAmount', header: 'Db Amt', size: 140, cell: (info) => info.getValue(),
  //     className: 'align-right'},
  //     { accessorKey: 'crAmount', header: 'Cr Amt', size: 140 },
    
      
  //     { accessorKey: 'billDbAmount', header: 'Bill Db Amt', size: 140, cell: (info) => info.getValue(),
  //       className: 'align-right'},
    
  //     { accessorKey: 'billCrAmount', header: 'Bill Cr Amt', size: 140 ,cell: (info) => info.getValue(),
  //       className: 'align-right'},

        
  
  // ];


  const reportColumns = [
    { accessorKey: 'groupName', header: 'Group Name', size: 180 },
    { accessorKey: 'accountCode', header: 'Account Code', size: 180 },
    { accessorKey: 'accountName', header: 'Account Name', size: 180 },
    { accessorKey: 'subledgerCode', header: 'Subledger Code', size: 180 },
    { accessorKey: 'subledgerName', header: 'Subledger Name', size: 180 },
    { accessorKey: 'odBalAmount', header: 'OD Balance Amount', size: 180 },
    { accessorKey: 'ocrAmount', header: 'OCR Amount', size: 180 },
    { accessorKey: 'tdBalAmount', header: 'TD Balance Amount', size: 180 },
    { accessorKey: 'tcrAmount', header: 'TCR Amount', size: 180 },
    { accessorKey: 'cdBalAmount', header: 'CD Balance Amount', size: 180 },
    { accessorKey: 'ccrAmount', header: 'CCR Amount', size: 180 }
  ];
  
  


  const handleInputChange = (e) => {
    setSlab1(e.target.value);  // Update the state when user types
  };

  const handleImageClick = () => {
    window.history.back(); // Takes the user to the previous page
  };

  // const FromhandleDateChange = (event) => {
  //   const newDate = event.target.value; 

  //   const formattedFromdt = newDate ? dayjs(newDate).format('DD-MM-YYYY') : null;

  //   setFromdt(formattedFromdt); // Update the state with the selected date
  // };

  // const TohandleDateChange = (event) => {
  //   const newDate = event.target.value; 

  //   const formattedTodt = newDate ? dayjs(newDate).format('DD-MM-YYYY') : null;

  //   setTodt(formattedTodt); // Update the state with the selected date
  // };

    const handleDateRangeChange = (dates) => {
      if (dates && dates.length > 0) {
        setFromdt(dates[0]); // First date is the fromDate
        setTodt(dates[1]);   // Second date is the toDate
      } else {
        setFromdt(null);
        setTodt(null);
      }
    };
  // Fetch data based on the selected filters
  const fetchData = () => {
    setLoading(true);

    
    
    // Format the date before passing to API
    // const formattedFromDate = fromDate ? fromDate.format('DD-MM-YYYY') : null;
    // const formattedToDate = toDate ? toDate.format('DD-MM-YYYY') : null;

    // const formattedAsonDate = asondt ? asondt.format('DD-MM-YYYY') : null;
    // const formattedfromdt = fromdt ? dayjs(fromdt, 'DD/MM/YYYY').format('DD/MM/YYYY') : null;

    // const formattedtodt = todt ? dayjs(todt, 'DD/MM/YYYY').format('DD/MM/YYYY') : null;
    // Call API with filters
    const formattedFromDate = fromdt ? fromdt.format('DD/MM/YYYY') : null;
    const formattedToDate = todt ? todt.format('DD/MM/YYYY') : null;
    getTrailBalance(pbranchname,  finyr,formattedFromDate,formattedToDate,div)
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
        <b><p style={{align:'left', marginLeft:'-900px'}}>Trail Balance <img src={rewindbutton} alt="Go back" style={{width:"30px", marginLeft:"60px",cursor: 'pointer'  }} onClick={handleImageClick}/> </p></b>   <br/> 
        
          <Space style={{ marginBottom: '20px' }}>
            
            {/* Branch Name Dropdown */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>

              {/* Status Label and Dropdown */}




      <div style={{ display: 'flex', flexDirection: 'column', width: '180px' }}>
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


      <div style={{ display: 'flex', flexDirection: 'column', width: '140px' }}>
            <label htmlFor="finyr-select" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
              Finyr
            </label>
            <Select
              id="finyr-select"
              value={finyr}
              onChange={(value) => setFinyr(value)}
              placeholder="Finyr"
            >
              <Option value="2024">2024</Option>
              <Option value="2023">2023</Option>
            </Select>
          </div>  


    {/* Status Label and Dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '140px' }}>
            <label htmlFor="division-select" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
              With Details
            </label>
            <Select
              id="division-select"
              value={div}
              onChange={(value) => setDiv(value)}
              placeholder="With Details"
            >
              <Option value="Yes">Yes</Option>
              <Option value="No">No</Option>
            </Select>
          </div>  
    

    <div style={{ display: 'flex', flexDirection: 'column', width: '240px' }}>
        <label htmlFor="date-range-picker" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
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

  
      <button class="Btn" style={{marginTop:"30px"}}>
  <span class="leftContainer">
    <span class="like" onClick={fetchData}
        loading={loading} >Search</span>
  </span>
  <span class="likeCount" onClick={() => {
          setPbranchName('');
          setFromdt('');
          setTodt('');
          setSelectedParty(null);
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

export default TrailBalance;
