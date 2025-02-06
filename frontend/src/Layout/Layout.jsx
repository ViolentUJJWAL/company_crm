import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

      <Sidebar isOpen={isSidebarOpen} />

      <main
        className={`pt-16 min-h-screen transition-all duration-300
        ${isSidebarOpen ? "ml-64" : "ml-20"}`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
