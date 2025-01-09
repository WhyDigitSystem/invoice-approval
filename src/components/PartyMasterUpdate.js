import React, { useEffect, useState , useRef  } from 'react';
import "./PartyMasterUpdate.css";
import { getAllCreditParties } from '../services/api';
import { notification, Select, Spin } from 'antd'; // Import Select and Spin from Ant Design
import { MenuItem, CircularProgress } from '@mui/material';
import axios from "axios";
import confetti from 'canvas-confetti'; 
import gsap from 'gsap';





const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8091";

const PartyMasterUpdate = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [partyNames, setPartyNames] = useState([]);
  const [selectedPartyName, setSelectedPartyName] = useState(''); // Default value is empty string
  const createdBy=localStorage.getItem("userName");


  const buttonRef = useRef(null); 

  
  const [status, setStatus] = useState('idle');  // 'idle', 'loading', 'success'
  const textRef = useRef(null);
  const iconRef = useRef(null);
  

  const origin = useRef({
    x: 0.5,
    y: 0.5,
  });

  useEffect(() => {
    // Capture the initial button center coordinates once the component is mounted
    const rect = buttonRef.current.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    origin.current = {
      x: center.x / window.innerWidth,
      y: center.y / window.innerHeight,
    };
  }, []);

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
        origin: origin.current,
        colors: ['#757AE9', '#28224B', '#EBF4FF'],
      });

      fireConfetti(0.2, {
        spread: 60,
        startVelocity: 20,
        origin: origin.current,
        colors: ['#757AE9', '#28224B', '#EBF4FF'],
      });

      fireConfetti(0.35, {
        spread: 100,
        startVelocity: 15,
        decay: 0.91,
        origin: origin.current,
        colors: ['#757AE9', '#28224B', '#EBF4FF'],
      });

      fireConfetti(0.1, {
        spread: 120,
        startVelocity: 10,
        decay: 0.92,
        origin: origin.current,
        colors: ['#757AE9', '#28224B', '#EBF4FF'],
      });

      fireConfetti(0.1, {
        spread: 120,
        startVelocity: 20,
        origin: origin.current,
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
    creditLimit: '',
    creditDays: '',
    ncreditLimit: '',
    ncreditDays: '',
    category: '',
    salesPersonName:'',
    controllingOffice:'',
    createdBy
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Fetch party names from the API
  useEffect(() => {
    getAllCreditParties()
      .then((response) => {
        setData(response);
        setPartyNames(response); // Assuming the response structure
        setLoading(false);
      })
      .catch((error) => {
        notification.error({
          message: 'Data Fetch Error',
          description: 'Failed to fetch data for the listing.',
        });
        setLoading(false);
      });
  }, []);

  // Handle party name change in the dropdown
  const handlePartyNameChange = (value) => {
    setSelectedPartyName(value); // Set the selected party name

    // Find the party details based on the selected party name
    const selectedParty = partyNames.find((party) => party.partyName === value);

    // If the selected party is found, update the form fields automatically
    if (selectedParty) {
      setFormData({
        ...formData,
        partyCode: selectedParty.partyCode || '',
        creditLimit: selectedParty.creditLimit || '',
        creditDays: selectedParty.creditDays || '',
        category: selectedParty.category || '',
        salesPersonName: selectedParty.salesPersonName || '',
        controllingOffice: selectedParty.controllingOffice,
        partyName: selectedParty.partyName,
        createdBy: localStorage.getItem("userName")
      });
    }
  };

  const handleClear = () => {
    setFormData({
      partyName: "",
      partyCode: "",
      category: "",
      controllingOffice: "",
      salesPersonName: "",
      creditDays: "",
      creditLimit: "",
      ncreditDays: "",
      ncreditLimit: ""
    });

    setTimeout(() => {
      window.location.reload(); // Reload the page
    }, 2000); //
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Check if required fields are filled in
    if (
        !formData.partyCode ||
        !formData.category 
    ) {
        alert("Please fill in all required fields.");
        return;
    }

    // Prepare the payload for the POST request
    const payload = {
        partyCode: formData.partyCode,
        partyName: formData.partyName,
        category: formData.category,
        creditLimit: formData.creditLimit,
        creditDays: formData.creditDays,
        ncreditLimit: formData.ncreditLimit,
        ncreditDays: formData.ncreditDays,
        createdBy: localStorage.getItem("userName"),
        salesPerson: formData.salesPersonName
    };

    try {
        // Make the POST request using axios
        const response = await axios.put(`${API_URL}/api/party/updateCreateParty`, payload);

        // Check if the response is successful
        if (response.status === 200 || response.status === 201) {
            

            // Show success toast message
        notification.success({
            message: 'Success',
            description: 'The party information has been successfully updated.',
            duration: 3, // Time in seconds for the toast to stay visible
          });
            
        } else {
            alert("Failed to save user.");
            notification.error({
                message: 'Error',
                description: 'Failed to update the party information.',
                duration: 3, // Time in seconds for the toast to stay visible
              });
        }
    } catch (error) {
        // Handle error during the request
        console.error("Error saving user:", error);
        alert("An error occurred while saving.");
    }
};

const handleButtonClick = (e) => {
  // Call both functions when the button is clicked
  startConfetti();
  handleSubmit(e);
  handleClear(); // Clear fo
  // window.location.reload()// Delay 1 second between emails

};


  return (
    <div className="container">
      <div className="text">Policy Amendment</div>
      <br />
      <form onSubmit={handleSubmit}>
        
        <div className="form-row">
          {/* <div className="underline"></div> */}
          <label className="label-customer" style={{ marginLeft: '22px', marginBottom: '-70px'
           }}>
    Customer
  </label>
          </div>
          
          <div className="form-row">
        
        <div className="input-data">
        
          <Select
            showSearch // Enable search functionality
            value={selectedPartyName || ''} // Set fallback value if selectedPartyName is null or undefined
            onChange={handlePartyNameChange}
            placeholder="Select a Party"
            style={{ width: '110%' }} // Ensure the dropdown is wide enough
            loading={loading}
            notFoundContent={loading ? <Spin size="small" /> : 'No data available'}
          > 
            {partyNames.length > 0 ? (
              partyNames.map((party) => (
                <MenuItem key={party.mg_partyhdrid} value={party.partyName}>
                  {party.partyName}
                </MenuItem>
              ))
            ) : (
              <Select.Option disabled>No party names available</Select.Option>
            )}
          </Select>
          
          
           
          </div>

    
          
          
          <div className="input-data">
          <input
              type="text"
              name="partyCode"
              value={formData.partyCode}
              onChange={handleChange}
              required
              readOnly
              style={{width:"100px"}}
            />
            {/* <div className="underline"></div> */}
            <label>Code</label> 
          </div>
          
          </div>

        
        {/* Other form fields */}

        
          
          <div className="form-row">
          <div className="input-data">
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              readOnly
              style={{width:"350px"}}
            />
            {/* <div className="underline"></div> */}
            <label>Category</label>
          </div>
          </div>

          <div className="form-row">
          <div className="input-data">
            <input
              type="text"
              name="category"
              value={formData.salesPersonName}
              onChange={handleChange}
              required
              readOnly
              style={{width:"350px"}}
            />
            {/* <div className="underline"></div> */}
            <label>SalesPerson</label>
          </div> 
        </div>

        <div className="form-row">
        <div className="input-data">
            <input
              type="text"
              name="controllingOffice"
              value={formData.controllingOffice}
              onChange={handleChange}
              required
              readOnly
              style={{width:"100px"}}
            />
            {/* <div className="underline"></div> */}
            <label>Control Office</label>
          </div>
        </div>  
        
        {/* <br/> */}
        

        <div className="form-row">
          <div className="input-data">
            <input
              type="number"
              name="creditLimit"
              value={formData.creditLimit}
              onChange={handleChange}
              onInput={(e) => e.target.value = e.target.value.replace(/[^\d]/g, '')}
              required
              readOnly
              style={{width:"125px"}}
            />
            {/* <div className="underline"></div> */}
            <label>Credit Limit</label>
          </div>

          <div className="input-data">
            <input
              type="number"
              name="creditDays"
              value={formData.creditDays}
              onChange={handleChange}
              onInput={(e) => e.target.value = e.target.value.replace(/[^\d]/g, '')}
              required
              readOnly // This makes the field read-only
              style={{width:"100px"}}
              
            />
            {/* <div className="underline"></div> */}
            <label>Credit Days</label>
          </div>
      

        
        
        
          <div className="input-data">
            <input
              type="number"
              name="ncreditLimit"
              value={formData.ncreditLimit}
              onChange={handleChange}
              required
              style={{width:"100px"}}
              
            />
            {/* <div className="underline"></div> */}
            <label>Credit Limit</label>
          </div>
          <div className="input-data">
            <input
              type="number"
              name="ncreditDays"
              value={formData.ncreditDays}
              onChange={handleChange}
              required
              style={{width:"100px"}}
              
              
            />
            {/* <div className="underline"></div> */}
            <label>Credit Days</label>
          </div>
        </div>
        

{/* 
        <button 
        ref={buttonRef}
        onClick={startConfetti}
        className={status} 
        // id="button-conf"
      >
        <div id="icon" ref={iconRef} className="fa-solid fa-play"></div>
        <span id="text" ref={textRef}></span>
      </button> */}

        <div className="form-row submit-btn">
          <div className="input-data">
            <div className="inner"></div>
            <input type="submit" value="Submit" onClick={handleButtonClick} ref={buttonRef}></input> 
          </div>
        </div> 

      
        {/* <button data-confetti="10" class="button" onClick={handleSubmit}>Confirm</button> */}

        


        {/* <button class="button">
    <div class="icon">
        <div class="cannon"></div>
        <div class="confetti">
            <svg viewBox="0 0 18 16">
                <polyline points="1 10 4 7 4 5 6 1" />
                <path d="M4,13 C5.33333333,9 7,7 9,7 C11,7 12.3340042,6 13.0020125,4" />
                <path d="M6,15 C7.83362334,13.6666667 9.83362334,12.6666667 12,12 C14.1663767,11.3333333 15.8330433,9.66666667 17,7" />
            </svg>
            <i></i><i></i><i></i><i></i><i></i><i></i>
            <div class="emitter"></div>
            <button data-confetti="10">big</button>
        </div>
    </div>
    <span>Confirm</span>
</button> */}


 


      </form>
    </div>
  );
};

export default PartyMasterUpdate;
