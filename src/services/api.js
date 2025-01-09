import { MicNone } from "@mui/icons-material";
import axios from "axios";


const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8091";

const branchName=null;
const fromDate=null;
const toDate=null;
const status=null;

const div=null;
const branchname=null;
const ptype=null;
const sbcode=null;
const slab1=null;
const slab2=null;
const slab3=null;
const slab4=null;
const slab5=null;
const slab6=null;
const slab7=null;
const asondt=null;

export const getListingData = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/InvoiceApproval/getPendingDetails?userType=${localStorage.getItem(
        "userType"
      )}&userName=${localStorage.getItem("userName")}`
    ); // Replace `/your-api-endpoint` with the actual endpoint path
    if (
      response.data.status &&
      response.data.paramObjectsMap?.pendingApprovalDetails
    ) {
      return response.data.paramObjectsMap.pendingApprovalDetails.map(
        (item) => ({
          expenceId: item.docId,
          name: item.partyName,
          amount: item.totalInvAmtLc,
          currency: "INR", // Assuming it's always INR; adjust if needed.
          docId: item.docId,
          docDate: item.docDate,
          creditDays: item.creditDays,
          creditLimit: item.creditLimit,
          outStanding: item.outStanding,
          id: item.gstInvoiceHdrId,
          eligiSlab: item.eligiSlab,
          slabRemarks: item.slabRemarks,
          exceedDays: item.exceedDays,
          unApproveAmt: item.unApproveAmt,
          category: item.category,
          controllingOffice: item.controllingOffice,
          osBeyond: item.osBeyond,
          excessCredit: item.excessCredit,
          salespersonName: item.salespersonName,
          branchCode: item.branchCode      

        })
      );
    } else {
      throw new Error("Data not found or API error");
    }
  } catch (error) {
    console.error("Error fetching listing data:", error);
    throw error;
  }
};

export const getInvDetailsApprove1 = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/InvoiceApproval/getInvDetailsApprove1?userType=${localStorage.getItem(
        "userType"
      )}&userName=${localStorage.getItem("userName")}`
    ); // Replace `/your-api-endpoint` with the actual endpoint path
    if (
      response.data.status &&
      response.data.paramObjectsMap?.approvedApprovalDetails1
    ) {
      return response.data.paramObjectsMap.approvedApprovalDetails1.map(
        (item) => ({
          expenceId: item.docId,
          name: item.partyName,
          amount: item.totalInvAmtLc,
          currency: "INR", // Assuming it's always INR; adjust if needed.
          docId: item.docId,
          docDate: item.docDate,
          creditDays: item.creditDays,
          creditLimit: item.creditLimit,
          outStanding: item.outStanding,
          id: item.gstInvoiceHdrId,
          approved1on: item.approve1on,
          approved2on: item.approve2on,
          approved3on: item.approve3on,
          eligiSlab: item.eligiSlab,
          slabRemarks: item.slabRemarks,
          exceedDays: item.exceedDays,
          unApproveAmt: item.unApproveAmt,
          category: item.category,
          controllingOffice: item.controllingOffice,
          osBeyond: item.osBeyond,
          excessCredit: item.excessCredit,
          salespersonName: item.salespersonName    ,
          branchCode: item.branchCode        
        })
      );
    } else {
      throw new Error("Data not found or API error");
    }
  } catch (error) {
    console.error("Error fetching listing data:", error);
    throw error;
  }
};


export const getInvDetailsApprove2 = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/InvoiceApproval/getInvDetailsApprove2?userType=${localStorage.getItem(
        "userType"
      )}&userName=${localStorage.getItem("userName")}`
    ); // Replace `/your-api-endpoint` with the actual endpoint path
    if (
      response.data.status &&
      response.data.paramObjectsMap?.approvedApprovalDetails2
    ) {
      return response.data.paramObjectsMap.approvedApprovalDetails2.map(
        (item) => ({
          expenceId: item.docId,
          name: item.partyName,
          amount: item.totalInvAmtLc,
          currency: "INR", // Assuming it's always INR; adjust if needed.
          docId: item.docId,
          docDate: item.docDate,
          creditDays: item.creditDays,
          creditLimit: item.creditLimit,
          outStanding: item.outStanding,
          id: item.gstInvoiceHdrId,
          approved1on: item.approve1on,
          approved2on: item.approve2on,
          approved3on: item.approve3on,
          eligiSlab: item.eligiSlab,
          totalInvAmtLc: item.totalInvAmtLc,
          slabRemarks: item.slabRemarks,
          exceedDays: item.exceedDays,
          unApproveAmt: item.unApproveAmt,
          category: item.category,
          controllingOffice: item.controllingOffice,
          osBeyond: item.osBeyond,
          excessCredit: item.excessCredit,
          salespersonName: item.salespersonName      
        })
      );
    } else {
      throw new Error("Data not found or API error");
    }
  } catch (error) {
    console.error("Error fetching listing data:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    // Corrected the endpoint URL and closing braces issue
    const response = await axios.get(`${API_URL}/api/auth/allUsers`);

    // Ensure that the response contains the expected structure
    if (response.data && response.data.paramObjectsMap?.userVO) {
      return response.data.paramObjectsMap.userVO.map((item) => ({
        id: item.id,
        userName: item.userName,
        nickName: item.nickName,
        email: item.email,
      }));
    } else {
      throw new Error("Data not found or API error");
    }
  } catch (error) {
    console.error("Error fetching listing data:", error);
    throw error; // Re-throw error to propagate it to the caller
  }
};

export const getAllActiveUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/auth/allUsers`);

    // Ensure that the response contains the expected structure
    if (response.data && response.data.paramObjectsMap?.userVO) {
      // Filter the users by active status
      const activeUsers = response.data.paramObjectsMap.userVO.filter(
        (item) => item.active === "Active"
      );

      // Map the filtered users to the required format
      return activeUsers.map((item) => ({
        id: item.id,
        userName: item.userName,
        nickName: item.nickName,
        email: item.email,
      }));
    } else {
      throw new Error("Data not found or API error");
    }
  } catch (error) {
    console.error("Error fetching listing data:", error);
    throw error; // Re-throw error to propagate it to the caller
  }
};

export const getAllScreens = async () => {
  try {
    // Corrected the endpoint URL and closing braces issue
    const response = await axios.get(`${API_URL}/api/auth/getAllScreenNames`);

    // Ensure that the response contains the expected structure
    if (response.data && response.data.paramObjectsMap?.screenNamesVO) {
      return response.data.paramObjectsMap.screenNamesVO.map((item) => ({
        id: item.id,
        screenName: item.screenName,
        screenCode: item.screenCode,
        active: item.active,
      }));
    } else {
      throw new Error("Data not found or API error");
    }
  } catch (error) {
    console.error("Error fetching Screen List:", error);
    throw error; // Re-throw error to propagate it to the caller
  }
};

export const getAllRoles = async () => {
  try {
    // Corrected the endpoint URL and closing braces issue
    const response = await axios.get(`${API_URL}/api/auth/allActiveRoles`);

    // Ensure that the response contains the expected structure
    if (response.data && response.data.paramObjectsMap?.rolesVO) {
      return response.data.paramObjectsMap.rolesVO.map((item) => ({
        id: item.id,
        role: item.role,
      }));
    } else {
      throw new Error("Data not found or API error");
    }
  } catch (error) {
    console.error("Error fetching Roles List:", error);
    throw error; // Re-throw error to propagate it to the caller
  }
};

export const getAllResponsiblities = async () => {
  try {
    // Corrected the endpoint URL and closing braces issue
    const response = await axios.get(`${API_URL}/api/auth/allResponsibility`);

    // Ensure that the response contains the expected structure
    if (response.data && response.data.paramObjectsMap?.responsibilityVO) {
      return response.data.paramObjectsMap.responsibilityVO.map((item) => ({
        id: item.id,
        responsibility: item.responsibility,
      }));
    } else {
      throw new Error("Data not found or API error");
    }
  } catch (error) {
    console.error("Error fetching Responsibilities List:", error);
    throw error; // Re-throw error to propagate it to the caller
  }
};


export const getUserBranch = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/user/getBranchCodeByUser?userName=${localStorage.getItem("userName")}`
    ); // Replace `/your-api-endpoint` with the actual endpoint path
    if (
      response.data.status &&
      response.data.paramObjectsMap?.userVO
    ) {
      return response.data.paramObjectsMap.userVO.map(
        (item) => ({
          branchCode: item.branchCode,
          branchName: item.branchName,
          userName: item.userName

        })
      );
    } else {
      throw new Error("User Branch not found or API error");
    }
  } catch (error) {
    console.error("Error fetching User Branch data:", error);
    throw error;
  }
};


export const getAllAPParties = async () => {
  try {
    // Corrected the endpoint URL and closing braces issue
    const response = await axios.get(`${API_URL}/api/InvoiceApproval/getAllAPParties`);

    // Ensure that the response contains the expected structure
    if (response.data && response.data.paramObjectsMap?.partyDetails) {
      return response.data.paramObjectsMap.partyDetails.map((item) => ({
        subledgerName: item.subledgerName,
        subledgerCode: item.subledgerCode
      }));
    } else {
      throw new Error("Data not found or API error");
    }
  } catch (error) {
    console.error("Error fetching AP Party data:", error);
    throw error; // Re-throw error to propagate it to the caller
  }
};

export const getMIS = async (branchName, status, fromDate, toDate) => {
  try {
    const response = await axios.get(
     `${API_URL}/api/InvoiceApproval/getMIS?branchName=${branchName}&status=${status}&fromDate=${fromDate}&toDate=${toDate}`
    ); // Replace `/your-api-endpoint` with the actual endpoint path
    if (
      response.data.status &&
      response.data.paramObjectsMap?.misDetails
    ) {
      return response.data.paramObjectsMap.misDetails.map(
        (item) => ({
          jobBranch : item.jobBranch,
          income : item.income ? new Intl.NumberFormat('en-IN').format(item.income) : "0", 
          expense : item.expense ? new Intl.NumberFormat('en-IN').format(item.expense) : "0",
          gp : item.gp ? new Intl.NumberFormat('en-IN').format(item.gp) : "0",
          issuedGP: item.issuedGP ? new Intl.NumberFormat('en-IN').format(item.issuedGP) : "0",
          receivedGP: item.receivedGP ? new Intl.NumberFormat('en-IN').format(item.receivedGP) : "0",
          branchGP: item.branchGP ? new Intl.NumberFormat('en-IN').format(item.branchGP) : "0",
          retainGP: item.retainGP ? new Intl.NumberFormat('en-IN').format(item.retainGP) : "0"
         
        })
      );
    } else {
      throw new Error("MIS Data not found or API error");
    }
  } catch (error) {
    console.error("Error fetching MIS data:", error);
    throw error;
  }
};






export const getAPAgeing = async (asondt,div,pbranchname,ptype,subledgerName,slab1,slab2,slab3,slab4,slab5,slab6,slab7) => {
  try {
    const response = await axios.get(
     `${API_URL}/api/InvoiceApproval/getAPAgeingInternal?asondt=${asondt}&div=${div}&pbranchname=${pbranchname}&ptype=${ptype}&sbcode=${subledgerName}&slab1=${slab1}&slab2=${slab2}&slab3=${slab3}&slab4=${slab4}&slab5=${slab5}&slab6=${slab6}&slab7=${slab7}`
    ); // Replace `/your-api-endpoint` with the actual endpoint path
    if (
      response.data.status &&
      response.data.paramObjectsMap?.apAgeingDetails
    ) {
      return response.data.paramObjectsMap.apAgeingDetails.map(
        (item) => ({
          refNo : item.refNo,
          suppRefNo : item.suppRefNo,
          dueDate: item.dueDate ? new Date(item.dueDate).toLocaleDateString("en-GB"):"", 
          totalDue : item.totalDue ? new Intl.NumberFormat('en-IN').format(item.totalDue) : "0",
          suppRefDate : item.suppRefDate  ? new Date(item.suppRefDate).toLocaleDateString("en-GB"):"",
          whRefNo : item.whRefNo,
          salesPersonName : item.salesPersonName,
          currency : item.currency,
          subledgerCode : item.subledgerCode,
          docdt : item.docdt ? new Date(item.docdt).toLocaleDateString("en-GB"):"",
          amount : item.totalDue ? new Intl.NumberFormat('en-IN').format(item.amount) : "0",
          subledgerName: item.subledgerName,
          docid : item.docid,
          hno : item.hno,
          mno : item.mno,
          branchName : item.branchName,
          outStanding : item.totalDue ? new Intl.NumberFormat('en-IN').format(item.outStanding) : "0",
          unAdjusted : item.totalDue ? new Intl.NumberFormat('en-IN').format(item.unAdjusted) : "0",
          refDate : item.refDate ? new Date(item.refDate).toLocaleDateString("en-GB"):"",
          cbranch : item.cbranch,
          mslab1 : item.totalDue ? new Intl.NumberFormat('en-IN').format(item.mslab1) : "0",
          mslab2 : item.totalDue ? new Intl.NumberFormat('en-IN').format(item.mslab2) : "0",
          mslab3 : item.totalDue ? new Intl.NumberFormat('en-IN').format(item.mslab3) : "0",
          mslab4 : item.totalDue ? new Intl.NumberFormat('en-IN').format(item.mslab4) : "0",
          mslab5 : item.totalDue ? new Intl.NumberFormat('en-IN').format(item.mslab5) : "0",
          mslab6 : item.totalDue ? new Intl.NumberFormat('en-IN').format(item.mslab6) : "0",
          mslab7 : item.totalDue ? new Intl.NumberFormat('en-IN').format(item.mslab7) : "0",
          
        })
      );
    } else {
      throw new Error("MIS Data not found or API error");
    }
  } catch (error) {
    console.error("Error fetching MIS data:", error);
    throw error;
  }
};



export const getAllCreditParties = async () => {
  try {
    const response = await axios.get(
     `${API_URL}/api/InvoiceApproval/getAllCreditParties`
    ); // Replace `/your-api-endpoint` with the actual endpoint path
    if (
      response.data.status &&
      response.data.paramObjectsMap?.partyDetails
    ) {
      return response.data.paramObjectsMap.partyDetails.map(
        (item) => ({
          partyName : item.partyName,
          partyCode: item.partyCode,
          creditLimit : item.creditLimit, 
          creditDays: item.creditDays,
          category: item.category,
          salesPersonName: item.salesPersonName,
          controllingOffice: item.controllingOffice
         
        })
      );
    } else {
      throw new Error("Party Data not found or API error");
    }
  } catch (error) {
    console.error("Error fetching Party data:", error);
    throw error;
  }
};
