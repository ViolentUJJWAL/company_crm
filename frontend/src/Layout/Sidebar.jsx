import React from "react";
import {
  ChevronRight,
  Home,
  FileText,
  Users,
  Calendar,
  Settings,
  MessageSquare,
  Filter ,
  Bell
} from "lucide-react";
import { useNavigate } from "react-router";

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { icon: Home, label: "Dashboard", navigate: "/" },
    { icon: FileText, label: "Documents", navigate: "/df" },
    { icon: Filter , label: "Lead", navigate: "/lead" },
    { icon: Bell , label: "Reminder", navigate: "/reminder" },
    { icon: Users, label: "Users", navigate: "/df" },
    { icon: Calendar, label: "Calendar", navigate: "/df" },
    { icon: MessageSquare, label: "Messages", navigate: "/df" },
    { icon: Settings, label: "Settings", navigate: "/df" },
  ];

  const navigate = useNavigate();

  const handleNavigation = (item) => {
    navigate(item);
  };

  return (
    <aside
      className={`fixed left-0 top-14 h-[calc(100vh-4rem)] bg-white shadow-lg transition-all duration-300 z-20 
      ${isOpen ? "w-48" : "w-15"}`}
    >
      ,
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
    </aside>
  );
};

export default Sidebar;
