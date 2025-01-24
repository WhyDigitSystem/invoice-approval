    import React, { useState, useEffect } from "react";
    import { useNavigate, useLocation } from "react-router-dom";
    import { Button, notification } from "antd";
    import { getAllExpense } from '../services/api';
    import "./PartyMasterUpdate.css";
    import './AddExpense.css'; // Assuming you ha
    import axios from "axios";
    // ve the necessary styles
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
    
  const expenseId = location.state?.expenseId;
    
    // Check if the expense data is passed from ExpenseList
    useEffect(() => {
        if (location.state && location.state.expense) {
        setExpense(location.state.expense); // Set the expense data from the list
        }
    }, [location.state]);

    

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


    const handleSubmit = async () => {
        // Handle your submit logic here
        console.log("Submit expense data:", expense);
        notification.success({
        message: 'Expense submitted successfully',
        });
        navigate("/ExpenseList"); // Navigate back to the Expense List page after submission
    };

    return (
        <div className="container">
        <div className="text">Approve Expense</div>
        <br/>
        <form>
        <div style={{ display: 'flex', flexDirection: 'column', width: '200%'  }}>
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
        alt="Expense Attachment"
        style={{ maxWidth: '50px' }}
        onClick={() => openModal(expense)}
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
              alt="Expense Attachment"
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

            <Button type="primary" onClick={handleSubmit}>Submit Expense</Button>
        </form>
        </div>
    );
    };

    export default ViewExpense;
