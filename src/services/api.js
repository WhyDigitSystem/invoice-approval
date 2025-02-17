import { MicNone } from "@mui/icons-material";
import { experimentalStyled } from "@mui/material";
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



export const getCRListingData = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/crpreapp/getCRPendingDetails?userType=${localStorage.getItem(
        "userType"
      )}&userName=${localStorage.getItem("userName")}`
    ); // Replace `/your-api-endpoint` with the actual endpoint path
    if (
      response.data.status &&
      response.data.paramObjectsMap?.pendingApprovalDetails
    ) {
      return response.data.paramObjectsMap.pendingApprovalDetails.map(
        (item) => ({
          profoma: item.profoma,
          vchNo: item.vchNo,
          reason: item.reason,
          invAmt: item.invAmt,
          vchDt: item.vchDt,
          crRemarks: item.crRemarks,
          partyCode: item.partyCode,
          partyName: item.partyName,
          pType: item.pType,
          branchName: item.branchName,
          id: item.gst_precreditId,
          crAmt: item.crAmt,
          dDays: item.dDays,
          osbcd: item.osbcd,
          creditDays: item.creditDays,
          creditLimit: item.creditLimit ? new Intl.NumberFormat('en-IN').format(item.creditLimit) : "0",
          controllingOffice: item.controllingOffice,
          salesPersonName: item.salesPersonName,
          category: item.category,
          totDue: item.totDue ? new Intl.NumberFormat('en-IN').format(item.totDue) : "0"
          
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

export const getCRDetailsApprove1 = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/crpreapp/getCRDetailsApprove1?userType=${localStorage.getItem(
        "userType"
      )}&userName=${localStorage.getItem("userName")}`
    ); // Replace `/your-api-endpoint` with the actual endpoint path
    if (
      response.data.status &&
      response.data.paramObjectsMap?.approvedApprovalDetails1
    ) {
      return response.data.paramObjectsMap.approvedApprovalDetails1.map(
        (item) => ({
          profoma: item.profoma,
          vchNo: item.vchNo,
          reason: item.reason,
          invAmt: item.invAmt,
          vchDt: item.vchDt,
          crRemarks: item.crRemarks,
          partyCode: item.partyCode,
          partyName: item.partyName,
          pType: item.pType,
          branchName: item.branchName,
          gst_precreditId: item.gst_precreditId,
          crAmt: item.crAmt,
          dDays: item.dDays,
          osbcd: item.osbcd,
          creditDays: item.creditDays,
          creditLimit: item.creditLimit ? new Intl.NumberFormat('en-IN').format(item.creditLimit) : "0",
          controllingOffice: item.controllingOffice,
          salesPersonName: item.salesPersonName,
          category: item.category,
          totDue: item.totDue ? new Intl.NumberFormat('en-IN').format(item.totDue) : "0"
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
          amount: item.totalInvAmtLc ,
          currency: "INR", // Assuming it's always INR; adjust if needed.
          docId: item.docId,
          docDate: item.docDate,
          creditDays: item.creditDays,
          creditLimit: item.creditLimit ,
          outStanding: item.outStanding ,
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
          osBeyond: item.osBeyond ,
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
          creditLimit: item.creditLimit , 
          outStanding: item.outStanding ,
          id: item.gstInvoiceHdrId,
          approved1on: item.approve1on,
          approved2on: item.approve2on,
          approved3on: item.approve3on,
          eligiSlab: item.eligiSlab,
          totalInvAmtLc: item.totalInvAmtLc ,
          slabRemarks: item.slabRemarks,
          exceedDays: item.exceedDays,
          unApproveAmt: item.unApproveAmt,
          category: item.category,
          controllingOffice: item.controllingOffice,
          osBeyond: item.osBeyond,
          excessCredit: item.excessCredit ,
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


export const getAllARParties = async () => {
  try {
    // Corrected the endpoint URL and closing braces issue
    const response = await axios.get(`${API_URL}/api/InvoiceApproval/getAllARParties`);

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



export const getPartyLedgerPartyName = async (pType) => {
  try {
    // Corrected the endpoint URL and closing braces issue
    const response = await axios.get(`${API_URL}/api/InvoiceApproval/getPartyLedgerPartyName?pType=${pType}`);

    // Ensure that the response contains the expected structure
    if (response.data && response.data.paramObjectsMap?.plParties) {
      return response.data.paramObjectsMap.plParties.map((item) => ({
        subledgerName: item.subledgerName,
      }));
    } else {
      throw new Error("Data not found or API error");
    }
  } catch (error) {
    console.error("Error fetching Party data:", error);
    throw error; // Re-throw error to propagate it to the caller
  }
};


export const getPartyLedger = async (branchName, sbcode, fromdate, todate,ptype,div) => {
  try {
    const response = await axios.get(
     `${API_URL}/api/InvoiceApproval/getPartyLedger?branchName=${branchName}&sbcode=${sbcode}&fromdate=${fromdate}&todate=${todate}&subledgerType=${ptype}&WithDet=${div}`
    ); // Replace `/your-api-endpoint` with the actual endpoint path
    if (
      response.data.status &&
      response.data.paramObjectsMap?.pldetails
    ) {
      return response.data.paramObjectsMap.pldetails.map(
        
        (item) => ({
          docid : item.docid,
          docDate : item.docDate ? new Date(item.docDate).toLocaleDateString("en-GB"): " ",
          refNo : item.refNo,
          refDate : item.refDate ? new Date(item.refDate).toLocaleDateString("en-GB"): " ",
          suppRefNo : item.suppRefNo,
          suppRefDate : item.suppRefDate ? new Date(item.suppRefDate).toLocaleDateString("en-GB"): " ",
          subledgerCode : item.subledgerCode,
          subledgerName : item.subledgerName,
          subledger : item.subledger,
          currency : item.currency,
          opbal : item.opbal === "0.00"|| item.opbal === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.opbal) ,
          dbAmount : item.dbAmount === "0.00"|| item.dbAmount === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.dbAmount), 
          crAmount : item.crAmount === "0.00"|| item.crAmount === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.crAmount),
          billDbAmount : item.billDbAmount === "0.00"|| item.billDbAmount === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.billDbAmount),
          billCrAmount: item.billCrAmount === "0.00" || item.billCrAmount === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.billCrAmount),
          particulars: item.particulars,
          sno: item.sno
         
        })
      );
    } else {
      throw new Error("PL Data not found or API error");
    }
  } catch (error) {
    console.error("Error fetching PL data:", error);
    throw error;
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
          income : item.income === "0.00" || item.income === 0  ? "" : new Intl.NumberFormat('en-IN').format(item.income) , 
          expense : item.expense === "0.00" || item.expense  === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.expense) ,
          gp : item.gp === "0.00" || item.gp === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.gp),
          issuedGP: item.issuedGP === "0.00" ||  item.issuedGP === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.issuedGP) ,
          receivedGP: item.receivedGP === "0.00" || item.receivedGP === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.receivedGP) ,
          branchGP: item.branchGP === "0.00" || item.branchGP === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.branchGP) ,
          retainGP: item.retainGP === "0.00" || item.retainGP === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.retainGP) 
         
          
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




export const getDayBookBranchWise = async (branchName, fromDate, toDate) => {
  try {
    const response = await axios.get(
     `${API_URL}/api/InvoiceApproval/getDayBookBranchWise?branchName=${branchName}&fromDate=${fromDate}&toDate=${toDate}`
    ); // Replace `/your-api-endpoint` with the actual endpoint path
    if (
      response.data.status &&
      response.data.paramObjectsMap?.dayBookBranchWiseDetails
    ) {
      return response.data.paramObjectsMap.dayBookBranchWiseDetails.map(
        (item) => ({
          branchCode : item.branchCode,
          vchNo : item.vchNo, 
          vchDate : item.vchDate ? new Date(item.vchDate).toLocaleDateString("en-GB"): " ",
          docId : item.docId ,
          docDt: item.docDt ? new Date(item.docDt).toLocaleDateString("en-GB"): " ",
          accountCode: item.accountCode,
          ledger: item.ledger,
          subledgerCode: item.subledgerCode,
          subledgerName: item.subledgerName,
          curr: item.curr,
          exRate : item.exRate,
          bdbAmount :item.bdbAmount === "0.00"|| item.bdbAmount === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.bdbAmount) , 
          bcrAmount : item.bcrAmount === "0.00"|| item.bcrAmount === 0 ?  "" :new Intl.NumberFormat('en-IN').format(item.bcrAmount) , 
          remarks: item.remarks
         
        })
      );
    } else {
      throw new Error("DayBook Data not found or API error");
    }
  } catch (error) {
    console.error("Error fetching DayBook data:", error);
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
          refNo: item.refNo,
          suppRefNo: item.suppRefNo,
          dueDate: item.dueDate ? new Date(item.dueDate).toLocaleDateString("en-GB") : "",
          totalDue: item.totalDue === "0.00" || item.totalDue === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.totalDue),
          suppRefDate: item.suppRefDate ? new Date(item.suppRefDate).toLocaleDateString("en-GB") : "",
          whRefNo: item.whRefNo,
          salesPersonName: item.salesPersonName,
          currency: item.currency,
          subledgerCode: item.subledgerCode,
          docdt: item.docdt ? new Date(item.docdt).toLocaleDateString("en-GB") : "",
          amount: item.amount === "0.00" || item.amount === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.amount),
          subledgerName: item.subledgerName,
          docid: item.docid,
          hno: item.hno,
          mno: item.mno,
          branchName: item.branchName,
          outStanding: item.outStanding === "0.00" || item.outStanding === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.outStanding),
          unAdjusted: item.unAdjusted === "0.00" || item.unAdjusted === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.unAdjusted),
          refDate: item.refDate ? new Date(item.refDate).toLocaleDateString("en-GB") : "",
          cbranch: item.cbranch,
          mslab1: item.mslab1 === "0.00" || item.mslab1 === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.mslab1),
          mslab2: item.mslab2 === "0.00" || item.mslab2 === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.mslab2),
          mslab3: item.mslab3 === "0.00" || item.mslab3 === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.mslab3),
          mslab4: item.mslab4 === "0.00" || item.mslab4 === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.mslab4),
          mslab5: item.mslab5 === "0.00" || item.mslab5 === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.mslab5),
          mslab6: item.mslab6 === "0.00" || item.mslab6 === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.mslab6),
          mslab7: item.mslab7 === "0.00" || item.mslab7 === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.mslab7),
          
          
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



export const getARAgeing = async (asondt,div,pbranchname,ptype,subledgerName,slab1,slab2,slab3,slab4,slab5,slab6,slab7) => {
  try {
    const response = await axios.get(
     `${API_URL}/api/InvoiceApproval/getARAgeingInternal?asondt=${asondt}&div=${div}&pbranchname=${pbranchname}&ptype=${ptype}&sbcode=${subledgerName}&slab1=${slab1}&slab2=${slab2}&slab3=${slab3}&slab4=${slab4}&slab5=${slab5}&slab6=${slab6}&slab7=${slab7}`
    ); // Replace `/your-api-endpoint` with the actual endpoint path
    if (
      response.data.status &&
      response.data.paramObjectsMap?.arAgeingDetails
    ) {
      return response.data.paramObjectsMap.arAgeingDetails.map(
        (item) => ({
          refNo: item.refNo,
          suppRefNo: item.suppRefNo,
          dueDate: item.dueDate ? new Date(item.dueDate).toLocaleDateString("en-GB") : "",
          totalDue: item.totalDue === "0.00" || item.totalDue === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.totalDue),
          suppRefDate: item.suppRefDate ? new Date(item.suppRefDate).toLocaleDateString("en-GB") : "",
          whRefNo: item.whRefNo,
          salesPersonName: item.salesPersonName,
          currency: item.currency,
          subledgerCode: item.subledgerCode,
          docdt: item.docdt ? new Date(item.docdt).toLocaleDateString("en-GB") : "",
          amount: item.amount === "0.00" || item.amount === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.amount),
          subledgerName: item.subledgerName,
          docid: item.docid,
          hno: item.hno,
          mno: item.mno,
          branchName: item.branchName,
          outStanding: item.outStanding === "0.00" || item.outStanding === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.outStanding),
          unAdjusted: item.unAdjusted === "0.00" || item.unAdjusted === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.unAdjusted),
          refDate: item.refDate ? new Date(item.refDate).toLocaleDateString("en-GB") : "",
          cbranch: item.cbranch,
          mslab1: item.mslab1 === "0.00" || item.mslab1 === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.mslab1),
          mslab2: item.mslab2 === "0.00" || item.mslab2 === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.mslab2),
          mslab3: item.mslab3 === "0.00" || item.mslab3 === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.mslab3),
          mslab4: item.mslab4 === "0.00" || item.mslab4 === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.mslab4),
          mslab5: item.mslab5 === "0.00" || item.mslab5 === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.mslab5),
          mslab6: item.mslab6 === "0.00" || item.mslab6 === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.mslab6),
          mslab7: item.mslab7 === "0.00" || item.mslab7 === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.mslab7),
          
          
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


export const getAROS = async (asondt,div,pbranchname,ptype,subledgerName,slab1,slab2,slab3,slab4,slab5,slab6,slab7) => {
  try {
    const response = await axios.get(
     `${API_URL}/api/InvoiceApproval/getAROS?asondt=${asondt}&div=${div}&pbranchname=${pbranchname}&ptype=${ptype}&sbcode=${subledgerName}&slab1=${slab1}&slab2=${slab2}&slab3=${slab3}&slab4=${slab4}&slab5=${slab5}&slab6=${slab6}&slab7=${slab7}`
    ); // Replace `/your-api-endpoint` with the actual endpoint path
    if (
      response.data.status &&
      response.data.paramObjectsMap?.arOSDetails
    ) {
      return response.data.paramObjectsMap.arOSDetails.map(
        (item) => ({
         
         
          totalDue: item.totalDue === "0.00" || item.totalDue === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.totalDue),
          creditDays: item.creditDays,
          creditLimit: item.creditLimit,
          salesPersonName: item.salesPersonName,
          currency: item.currency,
          subledgerCode: item.subledgerCode,
          docdt: item.docdt ? new Date(item.docdt).toLocaleDateString("en-GB") : "",
          amount: item.amount === "0.00" || item.amount === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.amount),
          subledgerName: item.subledgerName,
          jobBranch: item.jobBranch,
          currency: item.currency,
          outStanding: item.outStanding === "0.00" || item.outStanding === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.outStanding),
          unAdjusted: item.unAdjusted === "0.00" || item.unAdjusted === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.unAdjusted),
          cbranch: item.cbranch,
          mslab1: item.mslab1 === "0.00" || item.mslab1 === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.mslab1),
          mslab2: item.mslab2 === "0.00" || item.mslab2 === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.mslab2),
          mslab3: item.mslab3 === "0.00" || item.mslab3 === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.mslab3),
          mslab4: item.mslab4 === "0.00" || item.mslab4 === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.mslab4),
          mslab5: item.mslab5 === "0.00" || item.mslab5 === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.mslab5),
          
         
          
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


export const getAPOS = async (asondt,div,pbranchname,ptype,subledgerName,slab1,slab2,slab3,slab4,slab5,slab6,slab7) => {
  try {
    const response = await axios.get(
     `${API_URL}/api/InvoiceApproval/getAPOS?asondt=${asondt}&div=${div}&pbranchname=${pbranchname}&ptype=${ptype}&sbcode=${subledgerName}&slab1=${slab1}&slab2=${slab2}&slab3=${slab3}&slab4=${slab4}&slab5=${slab5}&slab6=${slab6}&slab7=${slab7}`
    ); // Replace `/your-api-endpoint` with the actual endpoint path
    if (
      response.data.status &&
      response.data.paramObjectsMap?.apOSDetails
    ) {
      return response.data.paramObjectsMap.apOSDetails.map(
        (item) => ({
         
         
          totalDue: item.totalDue === "0.00" || item.totalDue === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.totalDue),
          creditDays: item.creditDays,
          creditLimit: item.creditLimit,
          salesPersonName: item.salesPersonName,
          currency: item.currency,
          subledgerCode: item.subledgerCode,
          docdt: item.docdt ? new Date(item.docdt).toLocaleDateString("en-GB") : "",
          amount: item.amount === "0.00" || item.amount === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.amount),
          subledgerName: item.subledgerName,
          jobBranch: item.jobBranch,
          currency: item.currency,
          outStanding: item.outStanding === "0.00" || item.outStanding === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.outStanding),
          unAdjusted: item.unAdjusted === "0.00" || item.unAdjusted === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.unAdjusted),
          cbranch: item.cbranch,
          mslab1: item.mslab1 === "0.00" || item.mslab1 === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.mslab1),
          mslab2: item.mslab2 === "0.00" || item.mslab2 === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.mslab2),
          mslab3: item.mslab3 === "0.00" || item.mslab3 === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.mslab3),
          mslab4: item.mslab4 === "0.00" || item.mslab4 === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.mslab4),
          mslab5: item.mslab5 === "0.00" || item.mslab5 === 0 ? "" : new Intl.NumberFormat('en-IN').format(item.mslab5),
          
          
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



export const getInvoices = async (userName,branchName) => {
  try {
    const response = await axios.get(
     `${API_URL}/api/InvoiceApproval/getInvoices?userName=${userName}&branchName=${branchName}`
    ); // Replace `/your-api-endpoint` with the actual endpoint path
    if (
      response.data.status &&
      response.data.paramObjectsMap?.invDetails
    ) {
      return response.data.paramObjectsMap.invDetails.map(
        (item) => ({
          profoma : item.docid,
          partyName : item.partyName,
          partyCode : item.partyCode,
          vchNo : item.vchno,
          vchDt : item.vchDt ? new Date(item.vchdt).toLocaleDateString("en-GB"):"",
          invAmt : item.totinvamtLc 
          
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


export const getAllExpense = async () => {
  try {
    const response = await axios.get(
     `${API_URL}/api/expense/getAllExpense`
    ); // Replace `/your-api-endpoint` with the actual endpoint path
    if (
      response.data.status &&
      response.data.paramObjectsMap?.employeeExpensesVO
    ) {
      return response.data.paramObjectsMap.employeeExpensesVO.map(
        (item) => ({
          createdBy : item.createdBy,
          empCode : item.empCode,
          partyCode : item.partyCode,
          empName : item.empName,
          totamt : item.totamt ,
          id:item.id,
          createdUpdatedDate:item.createdUpdatedDate
          
        })
      );
    } else {
      throw new Error("Expense Data not found or API error");
    }
  } catch (error) {
    console.error("Error fetching Expense data:", error);
    throw error;
  }
};