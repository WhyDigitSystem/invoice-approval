import React, { useEffect, useState, useRef } from 'react';
import { getAllCreditParties, getInvoices, getUserBranch } from '../services/api';
import { notification, Select, Spin  } from 'antd'; // Impor
import { DeleteOutlined,PlusOutlined,PlusCircleOutlined   } from '@ant-design/icons';
// t Select and Spin from Ant Design
import axios from "axios";
import confetti from 'canvas-confetti'; 
import gsap from 'gsap';
import "./PartyMasterUpdate.css";
import "./AddExpense.css";


const { Option } = Select;
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8091";

const AddExpense = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [partyNames, setPartyNames] = useState([]);
  const [selectedPartyName, setSelectedPartyName] = useState('');
  const createdBy = localStorage.getItem("userName");
  const [ptype,setPtype] = useState('');

  const buttonRef = useRef(null); 

  const [branchname, setBranchName] = useState('');
  const [status, setStatus] = useState('idle');  
  const textRef = useRef(null);
  const iconRef = useRef(null);
  const [branchNames, setBranchNames] = useState([]); 
  const [proforma, setProforma] = useState([]); 
  const [docid, setDocid] = useState([]); 
  const [selectedProfoma, setSelectedProfoma] = useState('');
  const [profoms, setProfoms] = useState([]);
  const [crRemarks,setCrRemarks] = useState([]);

  const [expenses, setExpenses] = useState([]);
    const [expenseName, setExpenseName] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseCategory, setExpenseCategory] = useState('');
    const [expenseDate, setExpenseDate] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    const [empName,setEmpName] = localStorage.getItem("nickName");

    const [userName,setUserName] = localStorage.getItem("userName");
    const [attachments, setAttachments] = useState({});
    const [previews, setPreviews] = useState({}); 
    const [uploadedFiles, setUploadedFiles] = useState({});
    
    // For Branch and Profoma select (as per your example)
    
  
    // Handle form submission to add expense
    const handleAddExpense = (e) => {
      e.preventDefault();
  
      if (!expenseName || !expenseAmount || !expenseCategory || !expenseDate) {
        alert('Please fill all fields');
        return;
      }
  
      const newExpense = {
        id: Date.now(),
        name: expenseName,
        amount: parseFloat(expenseAmount),
        category: expenseCategory,
        date: expenseDate,
      };
  
      setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  
      // Reset form fields
      setExpenseName('');
      setExpenseAmount('');
      setExpenseCategory('');
      setExpenseDate('');
    };
  
    // Handle deleting an expense
    const handleDeleteExpense = (id) => {
      setExpenses((prevExpenses) => prevExpenses.filter(expense => expense.id !== id));
    };
  
    // Handle category filter change
    // const handleFilterChange = (e) => {
    //   setFilterCategory(e.target.value);
    // };
  

    const handleFileChange = (e, expenseId) => {
      const file = e.target.files[0]; // Get the selected file
      if (file) {
        setUploadedFiles((prev) => ({
          ...prev,
          [expenseId]: file, // Save the file object for the expense ID
        }));
        console.log(`File selected for expense ${expenseId}:`, file);
      }
    };
    // Filter expenses based on category
    const filteredExpenses = filterCategory === 'All' 
      ? expenses 
      : expenses.filter(expense => expense.category === filterCategory);
  
    // Calculate total amount
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2);
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
    
    expenses:'',
    attachments:'',
    expenseName:'',
    expenseAmount:'',
    expenseCategory:'',
    expenseDate:'',
    empCode:'',
    empName:'',
    createdBy:''
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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
  
  // Handle file input change (attachment)
  // const handleFileChange = (e, expenseId) => {
  //   const file = e.target.files[0]; // Get the selected file
  //   console.log("Selected file:", file); // Log the file to check if it's selected
  //   console.log("Expense ID:", expenseId); // Log the expense ID to confirm the correct expense
  //   if (file) {
  //     setAttachments((prevState) => ({
  //       ...prevState,
  //       [expenseId]: file, // Save the file for this specific expense
  //     }));
  //   }
  // };
  

//   const handleFileChange = (e, expenseId) => {
//     const file = e.target.files[0]; // Get the file selected by the user
//     if (file) {
//       const fileBlob = new Blob([file], { type: file.type }); // Create Blob from the file
//       setAttachments((prevState) => ({
//         ...prevState,
//         [expenseId]: fileBlob, // Save the Blob for the specific expense ID
//       }));
//     }
// };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   // Create a new FormData object
  //   const formData = new FormData();
  
  //   // Add the JSON data (expenses) as a JSON string
  //   formData.append(
  //     'expenses',
  //     JSON.stringify(
  //       expenses.map((expense) => {
  //         const expensePayload = {
  //           category: expense.category,
  //           name: expense.name,
  //           amount: expense.amount,
  //           date: expense.date,
  //           empCode: localStorage.getItem("userName"),
  //           empName: localStorage.getItem("nickName"),
  //           createdBy:localStorage.getItem("userName")
  //         };
  
  //         // Add the attachment (file) if it exists
  //         // if (attachments[expense.id]) {
  //         //   formData.append(`attachment_${expense.id}`, attachments[expense.id]);
  //         // }
  //          // Add the attachment (Blob) if it exists
  //          if (attachments[expense.id]) {
  //           formData.append(`attachment_${expense.id}`, attachments[expense.id]);
  //         }
  
  //         return expensePayload;
  //       })
  //     )
  //   );
  
  //   // Manually log formData contents
  //   for (let [key, value] of formData.entries()) {
  //     console.log(key, value);
  //   }
  
  //   try {
  //     const response = await axios.put(`${API_URL}/api/expense/createEmpExpense`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  
  //     if (response.status === 200 || response.status === 201) {
  //       notification.success({
  //         message: 'Success',
  //         description: 'The party information has been successfully updated.',
  //         duration: 3,
  //       });
  //       startConfetti();
  //       handleClear();
  
  //       setTimeout(() => {
  //         window.location.reload();
  //       }, 2000);
  //     } else {
  //       notification.error({
  //         message: 'Error',
  //         description: 'Failed to update the party information.',
  //         duration: 3,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error saving data:", error);
  //     alert("An error occurred while saving.");
  //   }
  // };
  
  const handleSubmit = async () => {
    try {
      // Prepare master data and payload
      const masterData = {
        createdBy: localStorage.getItem("userName"),
        empCode: localStorage.getItem("userName"),
        empName: localStorage.getItem("nickName"),
      };

      const employeeExpensesAttachmentDTO = expenses.map((expense) => ({
        category: expense.category,
        expense: expense.name,
        amount: expense.amount,
        expDate: expense.date,
      }));

      const fullPayload = {
        ...masterData,
        employeeExpensesAttachmentDTO,
      };

      // Submit the expenses to create them
      const response = await axios.put(
        `${API_URL}/api/expense/createEmpExpense`,
        fullPayload
      );

      if (
        response.status === 200 ||
        response.status === 201 &&
        response.data.statusFlag === "Ok"
      ) {
        console.log("Expenses created successfully!");

        const expenseAttachments =
          response.data.paramObjectsMap.expenseVO.employeeExpensesAttachmentVO;

        // // Ensure imageFiles is defined before proceeding
        // if (!imageFiles) {
        //   console.error("imageFiles object is not provided or is empty.");
        //   return;
        // }

        // Iterate over the attachments and upload corresponding images
        
        for (const attachment of expenseAttachments) {
          const expenseId = attachment.id; // Extract the ID
          const imageFile = attachments[expenseId]; // Get the file for this expense ID
          const file = uploadedFiles; 
console.log("filelog",file);

          if (!uploadedFiles) {
            console.error("No file found for expense:", expenseId);
            alert("Please upload a file before submitting.");
            return;
          }
          

          if (uploadedFiles) {
            const formData = new FormData();
  formData.append("files", uploadedFiles); // Append the file object
  formData.append("expenseId", expenseId); // Append the expense ID
 


            try {
              const uploadResponse = await axios.put(
                `${API_URL}/api/expense/uploadimage`,
                formData
              );

              if (uploadResponse.status === 200) {
                console.log(`Image uploaded successfully for ID: ${expenseId}`);
              } else {
                console.log(`Failed to upload image for ID: ${expenseId}`);
              }
            } catch (error) {
              console.error(
                `Error uploading image for expense ID: ${expenseId}`,
                error
              );
            }
          } else {
            console.log(`No image found for expense ID: ${expenseId}`);
          }
        }
      } else {
        console.log("Failed to create expenses.");
      }
    } catch (error) {
      console.error("Error submitting expenses:", error);
    }
  };
  



  const handleButtonClick = (e) => {
    
    handleSubmit(e);
    
  };

  const handleCategoryChange = (value) => {
    setExpenseCategory(value);
  };

  // Clear all form fields
  const handleClear = () => {
    setExpenses([]);
    setAttachments({});
    setExpenseName('');
    setExpenseAmount('');
    setExpenseCategory('');
    setExpenseDate('');
  };
  

  return (
    <div className="container">
      <div className="text">Expense Claim Form</div>
      <br />
      <form onSubmit={handleAddExpense}>
      
    

      <div
    style={{
      display: 'flex',
      flexDirection: 'row', // Changed to 'row' to display items side by side
      justifyContent: 'space-between', // Add some space between the two
      width: '80%' // Ensure the width is full for both elements
    }}
  >
 

 
    </div>
    <div
    style={{
      display: 'flex',
      flexDirection: 'row', // Changed to 'row' to display items side by side
      justifyContent: 'space-between', // Add some space between the two
      width: '80%' // Ensure the width is full for both elements
    }}
  >

    
  </div>

          <div className="form-row">

          <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
          <label
        htmlFor="type-select"
        style={{ marginBottom: '8px', marginLeft: '-30px', marginTop:"-20px" }}
        className="label-customer"
      >
        Category <span style={{ color: 'red' }}>*</span>
      </label>
      <Select
        value={expenseCategory}
        onChange={handleCategoryChange}
        style={{ marginBottom: '8px', marginLeft: '30px', width: "160px" }}
      >
        <Select.Option value="" disabled>Select Category</Select.Option>
        <Select.Option value="Food">Food</Select.Option>
        <Select.Option value="Transport">Transport</Select.Option>
        <Select.Option value="Entertainment">Entertainment</Select.Option>
        <Select.Option value="Other">Other</Select.Option>
      </Select>
    </div>

              

          <div className="input-data">
            <input
              type="text"
              value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
              required
              style={{ width: "150px" }}
            />
            <label
            style={{ marginBottom: '8px', marginLeft: '-10px', marginTop:"-20px" }}
            >Particulars</label>
          </div>

          <div className="input-data">
            <input
            type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              required 
              style={{ marginBottom: '8px', marginLeft: '-12px',width:"170px" ,width: "150px"}}
            />
            <label
            style={{ marginBottom: '8px', marginLeft: '-12px' }}
            >Date</label>
          </div>
       
          
          <div className="input-data">
            <input
              type="number"
              value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
              required
              style={{ width: "120px",marginBottom: '8px', marginLeft: '2px' }}
            />
            <label
            style={{ width: "200px",marginBottom: '8px', marginLeft: '2px' }}
            >Expense Amt<span style={{ color: 'red' }}>*</span> </label> 
          </div>

          
          
             
        <button
          type="submit"
          onClick={handleAddExpense}
          ref={buttonRef}
          style={{
            background: 'none',
            border: 'none',
            color: 'black',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            marginTop: '-22px',
            marginLeft: '-22px'
          }}
        >
          {/* <PlusOutlined style={{ fontSize: '24px', marginRight: '12px' }} /> */}

          <PlusCircleOutlined style={{ fontSize: '24px', marginRight: '12px' }} />
          
        </button>
        </div>

        
        


        <div className="form-row submit-btn" style={{width:"400px" , marginLeft:"10px",height: "10px" }}>
          <div className="input-data" >
            <div className="inner"></div>
            <input type="submit" value="Submit" 
            style={{ padding: "8px 15px", height: "30px", fontSize: "14px" }}
            onClick={handleButtonClick} ref={buttonRef}>
               
              </input> 
          </div>
        </div>
       

      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Expense Table */}
      <div className="expense-table">
      <table style={{ width: '100%', tableLayout: 'fixed' }}>
          <thead>
            <tr>
            <th style={{ width: '100px' }}>Action</th> {/* Fixed width for Action */}
              <th>Category</th>
              <th>Particulars</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Upload file</th>
              <th>File Name</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>
                    <button
                onClick={() => handleDeleteExpense(expense.id)}
                className="delete-btn"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ff4d4f',
                  cursor: 'pointer',
                  height: "50px"
                }}
              >
                <DeleteOutlined style={{ fontSize: '24px' }}/> {/* Delete icon */}
              </button>
                  </td>
                  <td>{expense.category}</td>
                  <td>{expense.name}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{expense.date}</td> {/* Prevent date folding */}
                  <td>{expense.amount.toFixed(2)}</td>
                  <td>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, expense.id)}
              />
            </td>
            <td>
              
            </td>
                  
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No expenses found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Total Amount */}
        <div className="total-amount">
          <strong>Total:</strong> {totalAmount}
        </div>
      </div>
    </div>
      </form>
    </div>
  );
};

export default AddExpense;
