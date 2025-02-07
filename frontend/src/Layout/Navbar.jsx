import React from 'react';
import { Menu, X, Users } from 'lucide-react';

const Navbar = ({ isSidebarOpen, setSidebarOpen }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-indigo-600 h-14 flex items-center px-4 z-30">
      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="text-white p-2 hover:bg-indigo-700 rounded-lg"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <div className="ml-4 text-white font-semibold text-lg">Your App Name</div>
      <div className="ml-auto flex items-center gap-4">
        <div className="bg-indigo-500 p-2 rounded-full">
          <Users size={20} className="text-white" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;