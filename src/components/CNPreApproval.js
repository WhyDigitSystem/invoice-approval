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

  const [pbranchname, setPbranchName] = useState('');
  const [status, setStatus] = useState('idle');  
  const textRef = useRef(null);
  const iconRef = useRef(null);
  const [branchNames, setBranchNames] = useState([]); 
  const [proforma, setProforma] = useState([]); 
  const [docid, setDocid] = useState([]); 
  const [selectedProfoma, setSelectedProfoma] = useState('');
  const [profoms, setProfoms] = useState([]);

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
    partyName: '',
    partyCode: '',
    docid: '',
    docdt: '',
    vchno: '',
    vchdt: '',
    totinvamtLc: '',
    ptype: '',
    remarks: '',
    createdBy,
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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
    getInvoices(createdBy, pbranchname)
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
    if (pbranchname) {
      fetchData();
    }
  }, [createdBy, pbranchname]);

  // Handle Profoma selection change
  const handleProfomaChange = (value) => {
    setSelectedProfoma(value);
    const selectedProfoma = profoms.find((inv) => inv.docid === value);

    if (selectedProfoma) {
      setFormData({
        ...formData,
        partyCode: selectedProfoma.partyCode || '',
        partyName: selectedProfoma.partyName || '',
        docdt: selectedProfoma.docdt || '',
        vchno: selectedProfoma.vchno || '',
        vchdt: selectedProfoma.vchdt||'',
        ptype: selectedProfoma.ptype||'',
        totinvamtLc: selectedProfoma.totinvamtLc||'',
        remarks: selectedProfoma.remarks || '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.partyCode || !formData.docid || !formData.ptype || !formData.remarks) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      partyCode: formData.partyCode,
      partyName: formData.partyName,
      docid: formData.docid,
      docdt: formData.docdt,
      vchno: formData.vchno,
      vchdt: formData.vchdt,
      ptype: formData.ptype,
      totinvamtLc : formData.totinvamtLc,
      remarks: formData.remarks,
      createdBy: localStorage.getItem("userName"),
    };

    try {
      const response = await axios.put(`${API_URL}/api/party/updateCreateParty`, payload);

      if (response.status === 200 || response.status === 201) {
        notification.success({
          message: 'Success',
          description: 'The party information has been successfully updated.',
          duration: 3,
        });
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
    startConfetti();
    handleSubmit(e);
    handleClear(); 
  };

  const handleClear = () => {
    setFormData({
      partyCode: "",
      partyName: "",
      docid: "",
      docdt: "",
      vchno: "",
      vchdt: "",
      totinvamtLc: "",
      remarks: "",
    });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
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
        style={{ marginBottom: '8px',marginLeft: '-32px'  }}
        className="label-customer"
      >
        Branch Name
      </label>
      <Select
        id="branch-select"
        value={pbranchname}
        onChange={(value) => setPbranchName(value)}
        style={{ marginBottom: '8px',marginLeft: '32px'  }}
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

    {/* Profoma Select */}
    <div style={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
      <label
        htmlFor="profoma-select"
        style={{ marginBottom: '8px', marginLeft: '-40px' }}
        className="label-customer"
      >
        Profoma
      </label>
      <Select
        id="profoma-select"
        value={selectedProfoma}
        onChange={handleProfomaChange}
        style={{ marginBottom: '8px', marginLeft: '40px' }}
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
            <Option key={inv.docid} value={inv.docid}>
              {inv.docid}
            </Option>
          ))
        ) : (
          <Option value="">No Profoma available</Option>
        )}
      </Select>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                <label htmlFor="type-select" style={{ marginBottom: '8px', marginLeft: '-30px' }}
        className="label-customer">
                  Reversal
                </label>
                <Select
                  id="type-select"
                  value={ptype}
                  onChange={(value) => setPtype(value)}
                  placeholder="Select Type"
                  style={{ marginBottom: '8px', marginLeft: '40px' }}
        
                >
                  <Option value="">Select Type</Option>
                  <Option value="Full Reversal">Full</Option>
                  <Option value="Pan India">Partial</Option>
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
              name="vchno"
              value={formData.vchno}
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
              name="vchdt"
              value={formData.vchdt}
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
              type="text"
              name="totinvamtLc"
              value={formData.totinvamtLc}
              onChange={handleChange}
              required
              readOnly
              style={{ width: "200px",marginBottom: '8px', marginLeft: '-72px' }}
            />
            <label
            style={{ width: "200px",marginBottom: '8px', marginLeft: '-72px' }}
            >Invoice Amt (INR)</label>
          </div>

          
          <div className="input-data">
            <input
              type="text"
              name="totinvamtLc"
              value={formData.totinvamtLc}
              onChange={handleChange}
              required
              readOnly
              style={{ width: "200px",marginBottom: '8px', marginLeft: '-72px' }}
            />
            <label
            style={{ width: "200px",marginBottom: '8px', marginLeft: '-72px' }}
            >Reversal Amt (INR)</label>
          </div>
        </div>

        
        

        <div className="form-row">
          <div className="input-data">
            <input
              type="text"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              required
              style={{ width: "700px" }}
            />
            <label>Remarks</label>
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
