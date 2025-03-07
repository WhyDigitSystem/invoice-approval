import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Approved2List from "./components/Approved2List";
import ApprovedList from "./components/ApprovedList";
import ConfirmationPage from "./components/ConfirmationPage";
import Dashboard from "./components/Dashbord";
import ListingPage from "./components/ListingPage";
import LoginPage from "./components/LoginPage";
import MIS from "./components/MIS";
import Overview from "./components/Overview";

import { Screen } from "./components/Screen";
import { UserCreation } from "./components/UserCreation";
import PartyMasterUpdate from "./components/PartyMasterUpdate";
import APAgeing from "./components/APAgeing";
import Reports from "./components/Reports";
import AddExpense from "./components/AddExpense";
import CNPreApproval from "./components/CNPreApproval";
import CRListingPage from "./components/CRListingPage";
import CRApprovedList from "./components/CRApprovedList";
import ExpenseList from "./components/ExpenseList";
import ViewExpense from "./components/ViewExpense";
import Transactions from "./components/Transactions";
import Test from "./components/Test";
import AccessDenied from "./components/AccessDenied";
import DayBookBranchWise from "./components/DayBookBranchWise";
import ARAgeing from "./components/ARAgeing";
import ARAgeingOS from "./components/ARAgeingOS";
import APAgeingOS from "./components/APAgeingOS";
import PartyLedger from "./components/PartyLedger";
import LedgerReport from "./components/LedgerReport";
import GSTR1Filling from "./components/GSTR1Filling";
import ProfitAndLoss from "./components/ProfitAndLoss";
import JobCard from "./components/JobCard";
import JobCostSheetDetails from "./components/JobCostSheetDetails";
import JobCostSheetSummary from "./components/JobCostSheetSummary";
import ExpandingCards from "./components/ExpandingCards";
import TaxInvoicePdf from "./components/TaxInvoicePdf";
import TaxInvoiceList from "./components/TaxInvoiceList";
import TaxInvoiceCommonTable from "./components/TaxInvoiceCommonTable";

function App() {
  return (
    <Router future={{ v7_relativeSplatPath: true }}>
      {" "}
      {/* Add future flag */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Dashboard />}>
          <Route path="overview" element={<Overview />} />
          <Route path="approvedlist" element={<ApprovedList />} />
          <Route path="authenticate" element={<ConfirmationPage />} />
          <Route path="listing" element={<ListingPage />} />
          <Route path="reports" element={<Reports />} />
          <Route path="screen" element={<Screen />} />
          <Route path="userCreation" element={<UserCreation />} />
          <Route path="approved2list" element={<Approved2List />} />
          <Route path="MIS" element={<MIS />} />
          <Route path="partyMasterUpdate" element={<PartyMasterUpdate />} />
          <Route path="APAgeing" element={<APAgeing />} />
          <Route path="AddExpense" element={<AddExpense />} />

          <Route path="CNPreApproval" element={<CNPreApproval />} />
          <Route path="CRlisting" element={<CRListingPage />} />
          <Route path="CRApprovedList" element={<CRApprovedList />} />
          <Route path="ExpenseList" element={<ExpenseList />} />
          <Route path="ViewExpense" element={<ViewExpense />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="test" element={<Test />} />

          <Route path="/access-denied" component={AccessDenied} />
          <Route path="/DayBookBranchWise" element={<DayBookBranchWise />} />
          <Route path="ARAgeing" element={<ARAgeing />} />
          <Route path="ARAgeingOS" element={<ARAgeingOS />} />
          <Route path="APAgeingOS" element={<APAgeingOS />} />
          <Route path="PartyLedger" element={<PartyLedger />} />
          <Route path="LedgerReport" element={<LedgerReport />} />
          <Route path="GSTR1Filling" element={<GSTR1Filling />} />
          <Route path="ProfitAndLoss" element={<ProfitAndLoss />} />
          <Route path="JobCard" element={<JobCard />} />
          <Route path="JobCostSheetDetails" element={<JobCostSheetDetails />} />
          <Route path="JobCostSheetSummary" element={<JobCostSheetSummary />} />
          <Route path="ExpandingCards" element={<ExpandingCards />} />
          <Route path="TaxInvoicePdf" element={<TaxInvoicePdf />} />
          <Route path="TaxInvoiceList" element={<TaxInvoiceList />} />
          <Route
            path="/TaxInvoicePdf/:documentNumber"
            element={<TaxInvoicePdf />}
          />
        </Route>
        <Route
          path="TaxInvoiceCommonTable"
          element={<TaxInvoiceCommonTable />}
        />
      </Routes>
    </Router>
  );
}

export default App;
