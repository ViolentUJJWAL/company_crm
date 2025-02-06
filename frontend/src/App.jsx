import { useState } from "react";
import "./App.css";
import Layout from "./Layout/Layout";
import { BrowserRouter, Routes, Route } from "react-router";
import CompanyRegistration from "./Components/Registration/CompanyRegistration";
import EmployeeRegistration from "./Components/Registration/EmployeeRegistration";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<Layout>
            <h1 className="text-3xl bg-red-500 font-bold">
              Hello, world!
              <br />
              Frontend Setup
            </h1>
          </Layout>} />
          <Route path="/company-register" element={<CompanyRegistration />} />
          <Route path="/employee-register" element={<EmployeeRegistration />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
