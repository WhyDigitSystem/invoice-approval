import React, { useEffect, useState } from "react";
import { DeleteOutlined } from '@ant-design/icons';
import { getAllExpense } from '../services/api';
import { useNavigate } from "react-router-dom";
import { Button, notification } from "antd";
import CommonTable from "./CommonTable"; // Importing the CommonTable component
import "./PartyMasterUpdate.css";
import "./AddExpense.css";
import confetti from 'canvas-confetti'; 

const ExpenseList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  const handleRowClick = (expenseId) => {
    // Pass the expenseId to the ViewExpense component via navigate
    navigate("/ViewExpense", { state: { expenseId } });
  };
  
  // Columns definition for the table
 

  // Fetch expenses data from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    getAllExpense()
      .then((response) => {
        console.log('API Response:', response);
        setData(response); // Assuming the API returns an array of expense objects
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

  // Handle adding new expense
  const onAddNewExpense = () => {
    navigate("/AddExpense");
  }

 
  // Handle row click - navigate to AddExpense and pass selected expense data


  return (
    <div className="container">
      <div className="text">Expense Claim List</div>
      <br />
      <form >


      <div style={{ display: 'flex', flexDirection: 'column', width: '200%' }}>
      {/* Expense Table */}
      <div className="expense-table">
      <table style={{ width: '100%', tableLayout: 'fixed' }}>
          <thead>
            <tr>
            
              <th>ExpenseId</th>
              <th>EmpCode</th>
              <th>Employee</th>
              <th>Amount</th>
              
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((expense) => (
                <tr key={expense.id} onClick={() => handleRowClick(expense.id)}>
                <td>{expense.id}</td>
                  <td>{expense.empCode}</td>
                  <td>{expense.empName}</td>
                  <td>{expense.totamt}</td>
                
                  
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No expenses found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Total Amount */}
        <div className="total-amount">
          <strong>Total:</strong> {data.totamt}
        </div>
      </div>
    </div>
      </form>
    </div>
  );
};

export default ExpenseList;
