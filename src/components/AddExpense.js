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
import Nobills from "../Nobills.jpg"


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
    const defaultImagePath = "src/Nobills.jpg"; 
    const [filePreviews,setFilePreviews] =  useState({});
    // For Branch and Profoma select (as per your example)
    
  
    // // Handle form submission to add expense
    // const handleAddExpense = (e) => {
    //   e.preventDefault();
  
    //   if (!expenseName || !expenseAmount || !expenseCategory || !expenseDate) {
    //     alert('Please fill all fields');
    //     return;
    //   }
  
    //   const newExpense = {
    //     id: Date.now(),
    //     name: expenseName,
    //     amount: parseFloat(expenseAmount),
    //     category: expenseCategory,
    //     date: expenseDate,
    //   };
  
    //   setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  
    //   // Reset form fields
    //   setExpenseName('');
    //   setExpenseAmount('');
    //   setExpenseCategory('');
    //   setExpenseDate('');
    // };
  
    const handleAddExpense = (e) => {
      e.preventDefault();
    
      if (!expenseName || !expenseAmount || !expenseCategory || !expenseDate) {
        alert('Please fill all fields');
        return;
      }
    
      // Ensure files is initialized as an empty array
      const newExpense = {
        id: Date.now(),
        name: expenseName,
        amount: parseFloat(expenseAmount),
        category: expenseCategory,
        date: expenseDate,
        files: []  // Initialize files as an empty array
      };
    
      // Set the default image for the new expense row
      const defaultImage = new File([defaultImagePath], 'Nobills.jpg', { type: 'image/jpeg' });
    
      // Now you can safely push the default image to the files array
      newExpense.files.push(defaultImage);
    
      // Update state
      setExpenses((prev) => [...prev, newExpense]);
      setFilePreviews((prev) => ({
        ...prev,
        [newExpense.id]: [defaultImage], // Set the default image as file object
      }));
    
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
  

    // const handleFileChange = (e, expenseId) => {
    //   const file = e.target.files[0]; // Get the selected file
    //   console.log("File selected for expenseId:", expenseId, file);
    //   if (file) {
    //     setUploadedFiles((prevState) => ({
    //       ...prevState,
    //        file, // Store the file for the specific expense ID
    //     }));
    //     console.log("uploadedFiles",uploadedFiles);
    //   }
    // };

    // const handleFileChange = (e, expenseId) => {
    //   const files = e.target.files; // Get the selected files
    //   console.log("Files selected for expenseId:", expenseId, files);
    
    //   if (files.length > 0) {
    //     setUploadedFiles((prevState) => {
    //       // If no files are present for this expenseId, initialize it as an empty array
    //       const existingFiles = prevState[expenseId] || [];
          
    //       // Append the new files to the existing files array for the expenseId
    //       return {
    //         ...prevState,
    //         [expenseId]: [...existingFiles, ...Array.from(files)],
    //       };
    //     });
    
    //     console.log("uploadedFiles", uploadedFiles);
    //   }
    // };


    // const handleFileChange = (e, expenseId) => {
    //   const files = e.target.files; // Get the selected files
    //   console.log("Files selected for expenseId:", expenseId, files);
    
    //   if (files.length > 0) {
    //     setUploadedFiles((prevState) => {
    //       // If no files are present for this expenseId, initialize it as an empty array
    //       const existingFiles = prevState[expenseId] || [];
    
    //       // Append the new files to the existing files array for the expenseId
    //       const newState = {
    //         ...prevState,
    //         [expenseId]: [...existingFiles, ...Array.from(files)],
    //       };
    
    //       console.log("Updated uploadedFiles state:", newState);  // Debug: check state after update
    
    //       return newState;
    //     });
    //   }
    // };
    




    

// Example of setting the state initially (can be done once when the page loads)



// Ensure all rows have either uploaded files or the default imag

// Helper function to prepare image payload (making sure default image is included when no file is uploaded)
// const prepareImagePayload = () => {
//   return expenses.map((expense) => {
//     // Check if files exist in state for the current expense
//     const files = filePreviews[expense.id] && filePreviews[expense.id].length > 0
//       ? filePreviews[expense.id]  // If files exist in the state, use them
//       : [new File([defaultImagePath], 'Nobills.jpg', { type: 'image/jpeg' })]; // If no files uploaded, use default image

//     return {
//       expenseId: expense.id,
//       files,
//     };
//   });
// };

// Helper function to prepare image payload (making sure default image is included when no file is uploaded)
// const handleFileChange = (e, expenseId) => {
//   const files = e.target.files;
//   console.log("Files selected for expenseId:", expenseId, files);

//   if (files.length > 0) {
//     setUploadedFiles((prevState) => {
//       const existingFiles = prevState[expenseId] || [];
//       const newFiles = [...existingFiles, ...Array.from(files)];

//       console.log("Updated files for expenseId:", expenseId, newFiles);  // Debugging here

//       return {
//         ...prevState,
//         [expenseId]: newFiles,
//       };
//     });
//   }
// };

const handleFileChange = (e, expenseId) => {
  const files = e.target.files; // Get the selected files
  console.log("Files selected for expenseId:", expenseId, files);

  if (files.length > 0) {
    // Convert the file list to an array of files
    const updatedFiles = Array.from(files);

    console.log("Updated files for expenseId:", expenseId, updatedFiles);

    setFilePreviews((prevState) => ({
      ...prevState,
      [expenseId]: updatedFiles, // Store files for the given expenseId
    }));
  }
};





// When preparing the payload
const prepareImagePayload = () => {
  return expenses.map((expense) => {
    // Get uploaded files for the given expenseId
    const uploadedFiles = filePreviews[expense.id];

    console.log("Checking uploaded files for expenseId", expense.id, uploadedFiles);

    // Check if uploaded files are available
    const files = uploadedFiles && uploadedFiles.length > 0
      ? uploadedFiles // Use the uploaded files if available
      : [new File([defaultImagePath], 'Nobills.jpg', { type: 'image/jpeg' })]; // Use default image if no files are uploaded

    return {
      expenseId: expense.id,
      files,
    };
  });
};


useEffect(() => {
  // This will run whenever uploadedFiles changes
  console.log("Updated uploaded files state:", uploadedFiles);
}, [uploadedFiles]);

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
    createdBy:'',
    files:'',
    expenseId:''
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
  
//   const handleSubmit = async () => {
//     try {
//       // Prepare master data and payload
//       const masterData = {
//         createdBy: localStorage.getItem("userName"),
//         empCode: localStorage.getItem("userName"),
//         empName: localStorage.getItem("nickName"),
//       };

//       const employeeExpensesAttachmentDTO = expenses.map((expense) => ({
//         category: expense.category,
//         expense: expense.name,
//         amount: expense.amount,
//         expDate: expense.date,
//       }));

//       const fullPayload = {
//         ...masterData,
//         employeeExpensesAttachmentDTO,
//       };

//       // Submit the expenses to create them
//       const response = await axios.put(
//         `${API_URL}/api/expense/createEmpExpense`,
//         fullPayload
//       );

//       if (
//         response.status === 200 ||
//         response.status === 201 &&
//         response.data.statusFlag === "Ok"
//       ) {
//         console.log("Expenses created successfully!");

//         const expenseVOid =
//           response.data.paramObjectsMap.expenseVO.id;

//         const expenseAttachments =
//           response.data.paramObjectsMap.expenseVO.employeeExpensesAttachmentVO;

//         // // Ensure imageFiles is defined before proceeding
//         // if (!imageFiles) {
//         //   console.error("imageFiles object is not provided or is empty.");
//         //   return;
//         // }

//         // Iterate over the attachments and upload corresponding images
        
//         // Assuming 'uploadedFiles' holds the file object for each expenseId
// for (const attachment of expenseAttachments) {
//   const expenseId = attachment.id; // Extract the ID of the expense
//   const file = uploadedFiles[0]; // Get the file associated with the expenseId

// console.log("uploadedFiles",file);


  
//   // Check if file exists for the given expenseId
  
//     // const fileToUpload = uploadedFiles[expenseId];
    
//     // // Construct the payload for each expenseId
//     // const imagePayload = {
//     //   expenseId: expenseVOid,
//     //   files: uploadedFiles.file, // Send the file directly
//     // };
//     // console.log("imagePayload",imagePayload);

  
  
      
//       // Check if uploadedFiles contains a file corresponding to the expenseId
//       const fileToUpload = uploadedFiles[expenseId]; // Assuming uploadedFiles is an object mapping expenseId to files

//       // If a file is found for this expenseId, append it to the FormData
      
//          const imagePayload = {
//             expenseId: expenseVOid,
//             files: uploadedFiles.file, // Send the file directly
//           };
//         console.log(`No image found for expense ID: ${expenseId}`);
      
    



// // Optionally, modify the filename before appending to FormData
// // const updatedFileName = `expense_${expenseId}_${file.name}`;

// // // Create a new FormData object
// // const formData = new FormData();

// // // Append the file to FormData with the updated filename
// // formData.append("files", uploadedFiles ); // The third argument sets the file's name in the FormData
// // console.log("imagepayload", imagepayload ); 
// // // Append the expenseId for reference
// // formData.append("expenseId", expenseId);

// // console.log("Expense ID:", expenseId);
// // console.log("Uploaded Files Keys:", Object.keys(uploadedFiles));





// console.log("formData",formData);        

//           if (uploadedFiles ) {
            
//   // formData.append("files", uploadedFiles); // Append the file object
//   // formData.append("expenseId", expenseId); // Append the expense ID
//   // console.log("formData",formData);
//   // console.log("file type", file instanceof File); 
  
  
  

//             try {
//               const uploadResponse = await axios.put(
//                 `${API_URL}/api/expense/uploadimage`,
//                 imagePayload,{
//                   headers: {
//                     "Content-Type": "multipart/form-data",
//                   },
//                 }
              
//               );
            

//               if (uploadResponse.status === 200) {
//                 console.log(`Image uploaded successfully for ID: ${expenseId}`);
//               } else {
//                 console.log(`Failed to upload image for ID: ${expenseId}`);
//               }
//             } catch (error) {
//               console.error(
//                 `Error uploading image for expense ID: ${expenseId}`,
//                 error
//               );
//             }
//           } else {
//             console.log(`No image found for expense ID: ${expenseId}`);
//           }
//         }
//       } else {
//         console.log("Failed to create expenses.");
//       }
//     } catch (error) {
//       console.error("Error submitting expenses:", error);
//     }
//   };



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

      const expenseVOid =
        response.data.paramObjectsMap.expenseVO.id;

      

      // // Ensure imageFiles is defined before proceeding
      // if (!imageFiles) {
      //   console.error("imageFiles object is not provided or is empty.");
      //   return;
      // }

      const expenseAttachments = response.data.paramObjectsMap.expenseVO.employeeExpensesAttachmentVO;

        const formData = new FormData();
        
 
        // const imagePayload = {
        //   expenseId: expenseVOid,
        //   files: uploadedFiles, // Send the file directly
        // };
        
      
        const imagePayload = prepareImagePayload();
        console.log("imagePayload",imagePayload);

        imagePayload.forEach(({ expenseId, files }) => {
          // Append files for each expenseId to the FormData
          files.forEach(file => {
            formData.append('files', file); // Add each file to the formData
          });
          formData.append('expenseId', expenseVOid); // Append the corresponding expenseId
        });

        console.log("formData",formData);

      // If there are files to upload, proceed with the API call
      
        console.log("Uploading multiple images for the expenses...");

        try {
          // Send the image upload request with multiple files in a single API call
          const uploadResponse = await axios.put(
            `${API_URL}/api/expense/uploadimage`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data", // Required for file upload
              },
            }
          );

          if (uploadResponse.status === 200) {
            console.log("Images uploaded successfully for the respective expense IDs.");
          } else {
            console.log("Failed to upload images.");
          }
        } catch (error) {
          console.error("Error uploading images for the expenses:", error);
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
                 id="fileInput" name="files" multiple 
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
