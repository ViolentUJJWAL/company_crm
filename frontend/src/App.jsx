import { useState } from "react";
// import "./App.css";
import Layout from "./Layout/Layout";
import { BrowserRouter, Routes, Route } from "react-router";
import CompanyRegistration from "./Components/Registration/CompanyRegistration";
import EmployeeRegistration from "./Components/Registration/EmployeeRegistration";
import Lead from './Components/Leads/Lead'
import Dashboard from "./Components/Dashboard/Dashboard";
import Login from "./Components/Login/Login";
import ResetPasswordForm from "./Components/Login/ResetPasswordForm";
import Roles from "./Components/Roles/Roles";
import EmployeeVerification from "./Components/EmployeeVerification/EmployeeVerification";
import ReminderList from './Components/Reminder/Reminder'
import ReminderForm from './Components/Reminder/ReminderForm'
import Settings from "./Components/Settings/Settings";
import LeadSource from "./Components/Settings/Leads/LeadSource";
import LeadStatusLabel from "./Components/Settings/Leads/LeadStatusLabel";
import RoleSettings from "./Components/Settings/Role Settings/RoleSettings";
import EmployeeSettings from "./Components/Settings/EmployeeSettings/EmployeeSettings";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/company-register" element={<CompanyRegistration />} />
          <Route path="/employee-register" element={<EmployeeRegistration />} />
          <Route path="/reset-password/:token" element={<ResetPasswordForm/>} />
          <Route path="/lead" element={<Layout><Lead /></Layout>} />
          <Route path="/roles" element={<Layout><Roles /></Layout>} />
          <Route path="/reminder" element={<Layout><ReminderList /></Layout>} />
          <Route path="/reminderForm" element={<Layout><ReminderForm /></Layout>} />
          <Route path="/employee-verification" element={<Layout><EmployeeVerification /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          <Route path="/lead-for" element={<Layout><LeadSource /></Layout>} />
          <Route path="/lead-source" element={<Layout><LeadSource /></Layout>} />
          <Route path="/lead-status-label" element={<Layout><LeadStatusLabel /></Layout>} />
          <Route path="/role-settings" element={<Layout><RoleSettings /></Layout>} />
          <Route path="/employee-settings" element={<Layout><EmployeeSettings /></Layout>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
