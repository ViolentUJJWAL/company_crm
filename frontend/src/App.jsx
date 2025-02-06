import { useState } from "react";
import "./App.css";
import Layout from "./Layout/Layout";
import { BrowserRouter, Routes, Route } from "react-router";
import CompanyRegistration from "./Components/Registration/CompanyRegistration";

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
          <Route path="/register" element={<CompanyRegistration />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
