import { useState } from "react";
// import "./App.css";
import Layout from "./Layout/Layout";
import { BrowserRouter, Routes, Route } from "react-router";
import CompanyRegistration from "./Components/Registration/CompanyRegistration";
import EmployeeRegistration from "./Components/Registration/EmployeeRegistration";
import Login from "./Components/Login/Login";
import Dashboard from "./Components/Dashboard/Dashboard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/company-register" element={<CompanyRegistration />} />
          <Route path="/employee-register" element={<EmployeeRegistration />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
