    import React, { useState, useEffect } from "react";
    import { useNavigate, useLocation } from "react-router-dom";
    import { getAllExpense } from '../services/api';
    import "./PartyMasterUpdate.css";
    import './AddExpense.css'; // Assuming you ha
    import axios from "axios";
    import rewindbutton from '.././rewindbutton.png';
    import {
        Button,
        Card,
        Col,
        ConfigProvider,
        DatePicker,
        Input,
        notification,
        Popover,
        Row,
        Select,
        Space,
        Spin,
        Typography,
      } from "antd";
    // ve the necessary styles
    import confetti from "canvas-confetti";
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8091";
    const ViewExpense = () => {
    const [expense, setExpense] = useState({
        empCode: '',
        empName: '',
        category: '',
        expenseName: '',
        amount: '',
        date: '',
        files: []
    });
    const navigate = useNavigate();
    const location = useLocation();
    const [response,setResponse] = useState('');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [data1, setData1] = useState([]);
    const [showModal, setShowModal] = useState(false); 
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null); // Modal data

  const expenseId = location.state?.expenseId;
    
    // Check if the expense data is passed from ExpenseList
    useEffect(() => {
        if (location.state && location.state.expense) {
        setExpense(location.state.expense); // Set the expense data from the list
        }
    }, [location.state]);

    const handleImageClick = () => {
        window.history.back(); // Takes the user to the previous page
      };
    
      const EditExpEmp = () => {
        navigate("/ExpenseList"); // Navigate to the approved list page
      };
    
      
        const handleCelebrate = () => {
          // Trigger confetti
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
      
          // Button animation
          const button = document.getElementById("celebrateBtn");
          if (button) {
            button.style.transform = "scale(0.95)";
            setTimeout(() => {
              button.style.transform = "scale(1)";
            }, 100);
          }
        };
        const handleCardClick = (item) => {
          setSelectedItem(item);
          // setIsModalOpen(true);
        };

    useEffect(() => {
        if (expenseId) {
          fetchData(expenseId); // Fetch data using the expenseId
        }
      }, [expenseId]);
    
    const fetchData = async (expenseId) => {
        setLoading(true);
        try {
        // Making the API call using axios with async/await
        const response = await axios.get(`${API_URL}/api/expense/getExpenseById?id=${expenseId}`);
        
        // Log the response to check
        console.log('View API Response:', response);
        setData1(response.data.paramObjectsMap.employeeExpensesVO);
        
        // Assuming the response data is in response.data (default axios behavior)
        setData(response.data.paramObjectsMap.employeeExpensesVO.employeeExpensesAttachmentVO);  // Set the data state with the response data
        console.log(data.attachment);
        } catch (error) {
        console.error("Error fetching data:", error);
        notification.error({
            message: "Data Fetch Error",
            description: "Failed to fetch updated data for the listing.",
        });
        } finally {
        setLoading(false);  // Ensure loading is set to false regardless of success or failure
        }
    };
    

  // Open modal for the clicked image
  const openModal = (expense) => {
    setSelectedExpense(expense);  // Set selected expense
    setShowModal(true);  // Show modal
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);  // Hide modal
    setSelectedExpense(null);  // Clear selected expense
  };
    // Fetch a single expense by ID



    
  const handleApprove = async (item) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/expense/approval1?approval=${"1"}&createdby=${localStorage.getItem(
          "userName"
        )}&id=${parseInt(expenseId)}&userType=${localStorage.getItem("userType")}`
      );

      if (response.data.status === true) {
        const audio = new Audio("/success.wav"); // Replace with your sound file path
        audio.play();

        notification.success({
          message: `Expense Claim ${expenseId} Approved`,
          description: `You have successfully approved the Expense Claim ${expenseId}.`,
        });

        EditExpEmp();

        

        // setIsModalOpen(false); // Uncomment if necessary
      } else {
        notification.error({
          message: `Item ${expenseId} failed`,
        });
      }
    } catch (error) {
      console.log("Error Response:", error.response?.data);
      const errorMessage =
        error.response?.data?.paramObjectsMap?.errorMessage ||
        error.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
      notification.error({
        message: "Error",
        description: errorMessage,
      });
      EditExpEmp();
    }
  };

  const handleReject = async (item) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/expense/approval1?approval=${"0"}&createdby=${localStorage.getItem(
          "userName"
        )}&id=${parseInt(expenseId)}&userType=${localStorage.getItem("userType")}`
      );

      if (response.data.status === true) {
        const audio = new Audio("/success.wav"); // Replace with your sound file path
        audio.play();

        notification.error({
          message: `Item ${expenseId} Rejected`,
          description: `You have rejected item ${expenseId}.`,
        });
        EditExpEmp();
        // setIsModalOpen(false);
      } else {
        notification.error({
          message: `Item ${expenseId} failed`,
        });
      }
    } catch (error) {
      console.log("Error Response:", error.response?.data);
      const errorMessage =
        error.response?.data?.paramObjectsMap?.errorMessage ||
        error.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
    }
    EditExpEmp();
  };


    return (
        <div className="container">
        <div className="text" >  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;  
         Approve Expense

        <img src={rewindbutton} alt="Go back" style={{width:"30px", marginLeft:"30px",cursor: 'pointer'  }} onClick={handleImageClick}/>
        </div>
        <br/>
        
        
        <form>
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '40px', width: '100%', marginLeft: '60px' }}>
  <p style={{ fontSize: '1.1rem' }}>Employee: {data1.empName}</p>
  <p style={{ fontSize: '1.1rem' }}>Code: {data1.empCode}</p>
</div>

<div style={{ display: 'flex', justifyContent: 'flex-start', gap: '40px', width: '100%', marginLeft: '60px' }}>
  <p style={{ fontSize: '1.1rem' }}>From: {data1.visitFrom}</p>
  <p style={{ fontSize: '1.1rem' }}>To: {data1.visitTo}</p>
</div>

        <div style={{ display: 'flex', flexDirection: 'column', width: '100%'  }}>
        <div className="expense-table">
        <table style={{ width: '100%', tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Expense</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Attachment</th>
              
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.category}</td>
                  <td>{expense.expense}</td>
                  <td>{expense.expDate}</td>
                  <td>{expense.amount}</td>
                  <td>
{/* Render image using base64 string */}
<img
        src={`data:image/png;base64,${expense.attachment}`}
        alt="No Files"
        style={{ maxWidth: '50px' }}
        onClick={() => openModal(expense)}
      />
      

                  </td>
            
                  
                </tr>
                
              ))
              
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No expenses found</td>
              </tr>
            )}
          </tbody>
          <Space style={{ marginTop: "10px",marginLeft: "50px" }}>
                              <Button
                                id="celebrateBtn"
                                type="default"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApprove(expenseId);
                                  handleCelebrate();
                                }}
                                size="small"
                                style={{
                                  borderColor: "green",
                                  color: "green",
                                  backgroundColor: "transparent",

                                  cursor: "pointer",
                                  transition: "transform 0.1s ease",
                                }}
                              >
                                Approve
                              </Button>

                              <Button
                                type="default"
                                danger
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReject(expenseId);
                                }}
                                size="small"
                                style={{
                                  backgroundColor: "transparent",
                                }}
                              >
                                Reject
                              </Button>
                            </Space>
        </table>
 {/* Modal for previewing image */}
 {showModal && selectedExpense && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            // backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark background
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            overflow: 'hidden', // Prevent scrolling when modal is open
          }}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw',  // Allow for some spacing around the image
              maxHeight: '90vh', // Prevent image from being too large
              padding: '10px',
              textAlign: 'center',
            //   backgroundColor: 'black',
            }}
          >
            <img
              src={`data:image/png;base64,${selectedExpense.attachment}`}
              alt="No Files"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',  // Ensure the image scales proportionally
              }}
            />
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

            {/* Total Amount */}
            <div className="total-amount">
            <strong>Total:</strong> {data1.totamt}
            </div>
        </div>
        </div>

            {/* <Button type="primary" onClick={handleSubmit}>Approve</Button>
            <Button type="warning" onClick={handleSubmit}>Reject</Button> */}


        </form>
        </div>
    );
    };

    export default ViewExpense;
