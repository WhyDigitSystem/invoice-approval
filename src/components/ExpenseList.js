import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { getAllExpense } from "../services/api";
import "./ExpenseList.css"; // Add the ticket styling here
// import "./PartyMasterUpdate.css";
// import "./style.css";
import rewindbutton from '.././rewindbutton.png';
import NoDataAvailable from '../utils/NoDataAvailable';

const ExpenseList = () => {
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [createdDate, setCreatedDate] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    getAllExpense()
      .then((response) => {
        const sortedData = response.sort((a, b) => b.expenseId - a.expenseId);
        setData(sortedData); // Assuming the API returns an array of expense objects// ); // Assuming the API returns an array of expense objects
        setLoading(false);
        console.log("Response", sortedData )
      })
      .catch(() => {
        notification.error({
          message: "Data Fetch Error",
          description: "Failed to fetch updated data for the listing.",
        });
        setLoading(false);
      });
  };

  const handleRowClick = (expenseId) => {
    navigate("/ViewExpense", { state: { expenseId } });
  };

  const handleImageClick = () => {
    window.history.back(); // Takes the user to the previous page
  };


  return (
    <div className="container" style={{width:"2200px"}}>
    <div className="expenseListContainer">
    
  
      {/* <br/> */}
      {/* <p >Expense Claim List</p> */}
      <div 
  className="text" 
  style={{
    backgroundImage: 'linear-gradient(to right, #56d8e4, #9f01ea, #56d8e4, #9f01ea)',
    WebkitBackgroundClip: 'text',
    color: 'transparent', /* Make the text color transparent so the gradient shows */
    fontWeight: 'bold', /* Optional, to make the text bolder */
    fontSize: '24px' /* Optional, to adjust the font size */
  }}
>
  Expense Claim List
  <img 
    src={rewindbutton} 
    alt="Go back" 
    style={{
      width: "30px", 
      marginLeft: "30px", 
      cursor: 'pointer', 
      marginTop: "10px"
    }} 
    onClick={handleImageClick}
  />
</div>

<br/>
      <div className="ticketList">
          {loading ? (
            <div style={{ textAlign: "center", fontSize: "18px" }}>Loading...</div>
          ) : data.length === 0 ? (
            <NoDataAvailable message="No records to display" />
          ) : (
        data.map((expense) => (
          <div
            className="ticketContainer"
            key={expense.id}
            onClick={() => handleRowClick(expense.id)}
          >
           
           
           <div class="card">
       <div class="face face1">
         <div class="content" >
         <i class="fab fa-android" ></i><h3>{expense.empName}</h3>
         </div>
       </div>
       <div class="face face2">
         <div class="content">
           <p> Code:&nbsp; {expense.empCode}</p>
           <p>Amount: R<span style={{ fontSize: "0.8em" }}>s</span> {expense.totamt}</p>
           <p>Claim ID: {expense.id}</p>
           <p>Claimed On: <br/> {expense.createdUpdatedDate.createdon}</p>
           <a href="#" className="view-more-btn" style={{background: "transparent", color: "black", padding: "10px 20px", border: "2px solid white", textDecoration: "none", display: "inline-block"}}>
        View More
      </a>
         </div>
       </div>
    </div>
           
           
            </div>
            ))
          )}
      </div>
    </div>
    
      </div>
  );
};

export default ExpenseList;
