import React, { useState } from "react";
import {
  ChevronRight,
  Home,
  FileText,
  Users,
  Calendar,
  Settings,
  MessageSquare,
  Filter,
  Bell,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router";
import authServices from "../services/authServices"; // Import the logout service

const Sidebar = ({ isOpen }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: "Dashboard", navigate: "/" },
    { icon: FileText, label: "Documents", navigate: "/df" },
    { icon: Filter, label: "Lead", navigate: "/lead" },
    { icon: Filter, label: "Roles", navigate: "/roles" },
    {
      icon: Filter,
      label: "Emp. Verification",
      navigate: "/employee-verification",
    },
    { icon: Bell, label: "Reminder", navigate: "/reminder" },
    { icon: Users, label: "Users", navigate: "/df" },
    { icon: Calendar, label: "Calendar", navigate: "/df" },
    { icon: MessageSquare, label: "Messages", navigate: "/df" },
    { icon: Settings, label: "Settings", navigate: "/df" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await authServices.logout();
      console.log("Logout successful:", response);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setError(error.message || "Failed to logout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside
      className={`fixed left-0 top-14 h-[calc(100vh-4rem)] bg-white shadow-lg transition-all duration-300 z-20 
      flex flex-col justify-between 
      ${isOpen ? "w-48" : "w-15"}`}
    >
      <div className="flex flex-col py-4">
        {menuItems.map((item, index) => (
          <button
            onClick={() => handleNavigation(item.navigate)}
            key={index}
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          >
            <item.icon size={20} />
            {isOpen && (
              <span className="ml-4 text-sm font-medium">{item.label}</span>
            )}
            {!isOpen && (
              <ChevronRight size={16} className="ml-auto text-gray-400" />
            )}
          </button>
        ))}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        disabled={loading}
        className="flex items-center px-4 py-3 mb-5 text-red-600 hover:bg-red-100 transition-colors"
      >
        <LogOut size={20} />
        {isOpen && (
          <span className="ml-4 text-sm font-medium">
            {loading ? "Logging out..." : "Logout"}
          </span>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-center text-sm py-2">{error}</p>
      )}
    </aside>
  );
};

export default Sidebar;
