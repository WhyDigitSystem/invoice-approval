import React, { useEffect, useState, useRef } from 'react';
import { getAllCreditParties, getInvoices, getUserBranch } from '../services/api';
import { notification, Select, Spin } from 'antd'; // Import Select and Spin from Ant Design
import axios from "axios";
import confetti from 'canvas-confetti'; 
import gsap from 'gsap';
import "./PartyMasterUpdate.css";

const { Option } = Select;
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8091";

const CNPreApproval = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [partyNames, setPartyNames] = useState([]);
  const [selectedPartyName, setSelectedPartyName] = useState('');
  const createdBy = localStorage.getItem("userName");
  const [ptype,setPtype] = useState('');

  const buttonRef = useRef(null); 

  const [branchName, setBranchName] = useState('');
  const [status, setStatus] = useState('idle');  
  const textRef = useRef(null);
  const iconRef = useRef(null);
  const [branchNames, setBranchNames] = useState([]); 
  const [proforma, setProforma] = useState([]); 
  const [docid, setDocid] = useState([]); 
  const [selectedProfoma, setSelectedProfoma] = useState('');
  const [profoms, setProfoms] = useState([]);
  const [crRemarks,setCrRemarks] = useState([]);
  // Fire confetti when action is done
  const fireConfetti = (particleRatio, opts) => {
    confetti(
      Object.assign({}, opts, {
        particleCount: Math.floor(100 * particleRatio),
      })
    );
  };

  const startConfetti = () => {
    setStatus('loading');
    if (textRef.current) {
      textRef.current.textContent = "";
      textRef.current.className = "text hidden";
    }

    if (iconRef.current) {
      iconRef.current.className = "fa-solid fa-spinner animate-spin";
    }

    if (buttonRef.current) {
      buttonRef.current.className = "loading";
    }

    // After 3 seconds, trigger confetti
    setTimeout(() => {
      if (iconRef.current) {
        iconRef.current.className = "";
      }

      if (buttonRef.current) {
        buttonRef.current.className = "success";
      }

      fireConfetti(0.25, {
        spread: 26,
        startVelocity: 10,
        colors: ['#757AE9', '#28224B', '#EBF4FF'],
      });

      fireConfetti(0.2, {
        spread: 60,
        startVelocity: 20,
        colors: ['#757AE9', '#28224B', '#EBF4FF'],
      });

      fireConfetti(0.35, {
        spread: 100,
        startVelocity: 15,
        decay: 0.91,
        colors: ['#757AE9', '#28224B', '#EBF4FF'],
      });

      fireConfetti(0.1, {
        spread: 120,
        startVelocity: 10,
        decay: 0.92,
        colors: ['#757AE9', '#28224B', '#EBF4FF'],
      });

      fireConfetti(0.1, {
        spread: 120,
        startVelocity: 20,
        colors: ['#757AE9', '#28224B', '#EBF4FF'],
      });

    }, 300);

    // Update text after 3.5 seconds
    setTimeout(() => {
      if (textRef.current) {
        textRef.current.textContent = "";
        textRef.current.className = "text";
      }

      if (iconRef.current) {
        iconRef.current.className = "fa-solid fa-check";
      }
    }, 2000);

    // Reset everything after 6 seconds
    setTimeout(() => {
      if (textRef.current) {
        textRef.current.textContent = "";
      }

      if (iconRef.current) {
        iconRef.current.className = "fa-solid fa-play";
      }

      if (buttonRef.current) {
        buttonRef.current.className = "";
      }
      
      setStatus('idle');
    }, 2000);
  };

  const [formData, setFormData] = useState({
    branchName:'',
    partyName: '',
    partyCode: '',
    profoma: '',
    vchNo: '',
    vchDt: '',
    invAmt: '',
    ptype: '',
    reason: '',
    createdBy,
    crRemarks :'',
  });

  // Handle input change
  const handleChange = (e) => {
    if (!e.target) {
      console.error("Event target is undefined:", e);
      return;
    }
  
    const { name, value } = e.target;
  
    setFormData((prevData) => {
      let updatedData = { ...prevData, [name]: value };
  
      if (name === "ptype" && value === "Full") {
        updatedData.crAmt = prevData.invAmt || "";
      }
  
      return updatedData;
    });
  };
  
    

  const handleBranchChange = (value) => {
    setBranchName(value);  // Update branch name state
  };
  
  const handlePtypeChange = (value) => {
    setPtype(value); // Update the ptype state
  
    setFormData((prevData) => {
      let updatedData = { ...prevData };
  
      if (value === "Full") {
        updatedData.crAmt = prevData.invAmt || ""; // Set crAmt to invAmt if Full is selected
      }
  
      return updatedData;
    });
  };
  
  
  const handleCrRemarksChange = (value) => {
    setCrRemarks(value);  // Update crRemarks state
  };

  // Fetch branch names
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

  // Fetch data when branch name changes
  const fetchData = () => {
    setLoading(true);
    console.log("branchName",branchName,createdBy);
    getInvoices(createdBy, branchName)
      .then((response) => {
        console.log(response);  // Log to verify data structure
        setProfoms(response);
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

  useEffect(() => {
    if (branchName) {
      fetchData();
      // console.log("branchname",branchname,createdBy);
    }
  }, [createdBy, branchName]);

  // Handle Profoma selection change
  const handleProfomaChange = (value) => {
    setSelectedProfoma(value);
    const selectedProfoma = profoms.find((inv) => inv.profoma === value);

    if (selectedProfoma) {
      setFormData({
        ...formData, 
        partyCode: selectedProfoma.partyCode || '',
        partyName: selectedProfoma.partyName || '',
        profoma: selectedProfoma.profoma || '',
        vchNo: selectedProfoma.vchNo || '',
        vchDt: selectedProfoma.vchDt||'',
        invAmt: selectedProfoma.invAmt||'',
        crAmt: selectedProfoma.invAmt||'',
      });
    }
  };

  const formatDate = (date) => {
    // Split the date in DD/MM/YYYY format
    const dateParts = date.split("/");
  
    // Check if the date is valid (i.e., has 3 parts)
    if (dateParts.length !== 3) {
      console.error("Invalid date format:", date); // Log if the format is invalid
      return ''; // Return an empty string if the format is invalid
    }
  
    const day = dateParts[0];
    const month = dateParts[1];
    const year = dateParts[2];
  
    // Ensure day and month are two digits, add leading zero if necessary
    const formattedDay = day.padStart(2, "0");
    const formattedMonth = month.padStart(2, "0");
  
    // Return the date in YYYY-MM-DD format
    return `${year}-${formattedMonth}-${formattedDay}`;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.partyCode  ||!formData.profoma || !formData.reason || !formData.crAmt || !ptype|| !crRemarks) {
      alert("Please fill in all required fields.");
      return;
    }

     // Format the vchDt field
     
     const formattedVchDt = formatDate(formData.vchDt);
     

  if (!formattedVchDt) {
    alert("Please enter a valid date.");
    return;
  }

    const payload = {
     branchName: branchName,
      partyCode: formData.partyCode,
      partyName: formData.partyName,
      profoma: formData.profoma,
      vchNo: formData.vchNo,
      vchDt: formattedVchDt,
      ptype: ptype,
      invAmt : formData.invAmt,
      crAmt : formData.crAmt,
      reason: formData.reason,
      createdBy: localStorage.getItem("userName"),
      crRemarks: crRemarks,
    };

    try {
      const response = await axios.put(`${API_URL}/api/crpreapp/updateCRPreApp`, payload);

      if (response.status === 200 || response.status === 201) {
        notification.success({
          message: 'Success',
          description: 'The party information has been successfully updated.',
          duration: 3,
        });
        startConfetti();
    handleClear(); 
        setTimeout(() => {
            window.location.reload();
          }, 2000);

      } else {
        notification.error({
          message: 'Error',
          description: 'Failed to update the party information.',
          duration: 3,
        });
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving.");
    }
  };


  const handleButtonClick = (e) => {
    
    handleSubmit(e);
    
  };

  const handleClear = () => {
    setFormData({
      branchName: "",
      partyCode: "",
      partyName: "",
      profoma: "",
      vchNo: "",
      vchDt: "",
      invAmt: "",
      crAmt: "",
      reason: "",
      crRemarks:""
    });
  
  };

  return (
    <div className="container">
      <div className="text">Pre Credit Note Approval</div>
      <br />
      <form onSubmit={handleSubmit}>
      
    

      <div
    style={{
      display: 'flex',
      flexDirection: 'row', // Changed to 'row' to display items side by side
      justifyContent: 'space-between', // Add some space between the two
      width: '80%' // Ensure the width is full for both elements
    }}
  >
    
    {/* Branch Name Select */}
    <div style={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
      <label
        htmlFor="branch-select"
        style={{ marginBottom: '8px',marginLeft: '-92px'  }}
        className="label-customer"
      >
        Branch Name <span style={{ color: 'red' }}>*</span> 
      </label>
      <Select
        id="branch-select"
        value={branchName}
        // onChange={handleBranchChange}  // Correct handler
        onChange={(value) => setBranchName(value)}
        style={{ marginBottom: '8px',marginLeft: '32px'  }}
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
    
    

    {/* Profoma Select */}
    <div style={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
      <label
        htmlFor="profoma-select"
        style={{ marginBottom: '8px', marginLeft: '-230px' }}
        className="label-customer"
      >
        Profoma <span style={{ color: 'red' }}>*</span> 
      </label>
      <Select
        id="profoma-select"
        value={selectedProfoma}
        onChange={handleProfomaChange}
        style={{ marginBottom: '8px', marginLeft: '-20px' }}
        showSearch
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
        placeholder="Search Profoma"
        notFoundContent={loading ? <Spin size="small" /> : 'No results found'}
      >
        <Option value="">Select Profoma</Option>
        {profoms && profoms.length > 0 ? (
          profoms.map((inv) => (
            <Option key={inv.profoma} value={inv.profoma}>
              {inv.profoma}
            </Option>
          ))
        ) : (
          <Option value="">No Profoma available</Option>
        )}
      </Select>
    </div>

    </div>
    <div
    style={{
      display: 'flex',
      flexDirection: 'row', // Changed to 'row' to display items side by side
      justifyContent: 'space-between', // Add some space between the two
      width: '80%' // Ensure the width is full for both elements
    }}
  >

<div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                <label htmlFor="type-select" style={{ marginBottom: '8px', marginLeft: '-70px' }}
        className="label-customer">
                  Reversal <span style={{ color: 'red' }}>*</span> 
                </label>
                <Select
                  id="type-select"
                  value={ptype}
                  onChange={handlePtypeChange}
                  placeholder="Select Type"
                  style={{ marginBottom: '8px', marginLeft: '30px' ,width:"230px"}}
        
                >
                  <Option value="">Select Type</Option>
                  <Option value="Full">Full</Option>
                  <Option value="Partial">Partial</Option>
                </Select>
              </div>


              
          <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                <label htmlFor="crremarks-select" style={{ marginBottom: '8px', marginLeft: '-240px' }}
        className="label-customer">
                 Credit Remarks <span style={{ color: 'red' }}>*</span> 
                </label>
                <Select
                  id="crremarks-select"
                  value={crRemarks}
                  onChange={handleCrRemarksChange}  // Correct handler
                  style={{ marginBottom: '8px', marginLeft: '-80px' }}
                  placeholder="Select Remarks"
                >
                  <Option value="Rate Mismatch - AIR">Rate Mismatch - AIR</Option>
                  <Option value="Rate Mismatch - SEA">Rate Mismatch - SEA</Option>
                  <Option value="THC - AIR">THC - AIR</Option>
                  <Option value="THC - SEA">THC - SEA</Option>
                  <Option value="Short Payment - AIR">Short Payment - AIR</Option>
                  <Option value="Short Payment - SEA">Short Payment - SEA</Option>
                  <Option value="Exchange Rate Issue">Exchange Rate Issue</Option>
                  <Option value="Loading & Unloading">Loading & Unloading</Option>
                  <Option value="Miscellaneous">Miscellaneous</Option>
                  <Option value="Purchase Order">Purchase Order</Option>
                </Select>
              </div>
  </div>

          <div className="form-row">

          <div className="input-data">
            <input
              type="text"
              name="partyCode"
              value={formData.partyName}
              onChange={handleChange}
              required
              readOnly
              style={{ width: "500px" }}
            />
            <label>Party</label>
          </div>

          <div className="input-data">
            <input
              type="text"
              name="partyCode"
              value={formData.partyCode}
              onChange={handleChange}
              required
              readOnly
              style={{ width: "120px" }}
            />
            <label>Code</label>
          </div>
        </div>

        <div className="form-row">
          <div className="input-data">
            <input
              type="text"
              name="vchNo"
              value={formData.vchNo}
              onChange={handleChange}
              required
              readOnly
              style={{ width: "200px" }}
            />
            <label>Invoice No</label>
          </div>
        

        
          <div className="input-data">
            <input
              type="text"
              name="vchDt"
              value={formData.vchDt}
              onChange={handleChange}
              required
              readOnly
              style={{ marginBottom: '8px', marginLeft: '-32px',width:"170px" }}
            />
            <label
            style={{ marginBottom: '8px', marginLeft: '-32px' }}
            >Invoice Date</label>
          </div>
    
          <div className="input-data">
            <input
              type="number"
              name="invAmt"
              value={formData.invAmt}
              onChange={handleChange}
              required
              readOnly
              style={{ width: "200px",marginBottom: '8px', marginLeft: '-72px' }}
            />
            <label
            style={{ width: "200px",marginBottom: '8px', marginLeft: '-72px' }}
            >Invoice Amt (INR)</label>
          </div>
          </div>

        <div className="form-row">  
          <div className="input-data">
            <input
              type="number"
              name="crAmt"
              value={formData.crAmt}
              onChange={handleChange}
              readOnly={ptype === "Full"}
              required
              style={{ width: "200px",marginBottom: '8px', marginLeft: '2px' }}
            />
            <label
            style={{ width: "200px",marginBottom: '8px', marginLeft: '2px' }}
            >Credit Note Amt (INR)<span style={{ color: 'red' }}>*</span> </label> 
          </div>

          
        </div>

        
        

        <div className="form-row">
          <div className="input-data">
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              style={{ width: "700px" }}
            />
            <label>Reason <span style={{ color: 'red' }}>*</span> </label>
          </div>
        </div>

        <div className="form-row submit-btn">
          <div className="input-data">
            <div className="inner"></div>
            <input type="submit" value="Submit" onClick={handleButtonClick} ref={buttonRef}></input> 
          </div>
        </div>
      </form>
    </div>
  );
};

export default CNPreApproval;
