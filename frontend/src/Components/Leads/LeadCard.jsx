import React from "react";
import {
  Edit2,
  MessageCircle,
  Plus,
  Phone,
  Mail,
  User,
  Calendar,
  MessageSquare,
} from "lucide-react";

const LeadCard = ({ lead, onLeadClick, onEditClick, onFollowUpClick }) => {
  const getStatusColor = (status) => {
    const colors = {
      New: "bg-blue-100 text-blue-800",
      Contacted: "bg-yellow-100 text-yellow-800",
      Qualified: "bg-green-100 text-green-800",
      Converted: "bg-purple-100 text-purple-800",
      Closed: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 p-4 border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            lead.status
          )}`}
        >
          {lead.status}
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditClick(lead);
            }}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Edit2 size={16} className="text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFollowUpClick(lead);
            }}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            {lead.followUps?.length > 0 ? (
              <MessageSquare size={16} className="text-blue-600" />
            ) : (
              <Plus size={16} className="text-gray-600" />
            )}
          </button>
        </div>
      </div>

      <div className="cursor-pointer" onClick={() => onLeadClick(lead)}>
        <div className="mb-3">
          <h3 className="font-medium text-gray-900">{lead.contact?.name}</h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
            <Phone size={14} />
            {lead.contact?.phoneNo}
          </div>
          {lead.contact?.email && (
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
              <Mail size={14} />
              {lead.contact?.email}
            </div>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <User size={14} />
            <span>Created by {lead.createdBy?.name}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={14} />
            <span>{formatDate(lead.createdAt)}</span>
          </div>
        </div>

        {lead.followUps?.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <MessageCircle size={14} />
              <span>{lead.followUps.length} Follow-ups</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadCard;
