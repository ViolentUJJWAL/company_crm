import React, { useState } from "react";
import {
  X,
  Phone,
  Mail,
  User,
  Calendar,
  MessageCircle,
  Tag,
  Users,
} from "lucide-react";

const LeadDetailsModal = ({ lead, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [followUpText, setFollowUpText] = useState("");

  const handleAddFollowUp = async () => {
    if (!followUpText.trim()) return;
    try {
      await fetch(`/api/leads/${lead._id}/followups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conclusion: followUpText }),
      });
      setFollowUpText("");
      // Refresh lead details after adding follow-up
      onUpdate();
    } catch (error) {
      console.error("Error adding follow-up:", error);
    }
  };

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Lead Details
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  lead.status
                )}`}
              >
                {lead.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "details"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "followups"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("followups")}
          >
            Follow-ups ({lead.followUps?.length || 0})
          </button>
        </div>

        {/* Content */}
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 180px)" }}
        >
          {activeTab === "details" ? (
            <div className="p-6 space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Name</label>
                    <div className="text-sm font-medium">
                      {lead.contact?.name}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Phone</label>
                    <div className="text-sm font-medium">
                      {lead.contact?.phoneNo}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Email</label>
                    <div className="text-sm font-medium">
                      {lead.contact?.email}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Source</label>
                    <div className="text-sm font-medium">
                      {lead.source?.name}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Lead Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Created By</label>
                    <div className="text-sm font-medium">
                      {lead.createdBy?.name}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">
                      Created Date
                    </label>
                    <div className="text-sm font-medium">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Lead For</label>
                    <div className="text-sm font-medium">{lead.for?.name}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Follow-ups List */}
              <div className="space-y-4">
                {lead.followUps?.map((followUp, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 relative"
                  >
                    <div className="absolute -left-2 -top-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                      {followUp.sequence}
                    </div>
                    <div className="ml-2">
                      <div className="text-xs text-gray-500 mb-1">
                        {new Date(followUp.createdAt).toLocaleString()}
                      </div>
                      <div className="text-sm">{followUp.conclusion}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Follow-up Form */}
              <div className="mt-4">
                <textarea
                  value={followUpText}
                  onChange={(e) => setFollowUpText(e.target.value)}
                  placeholder="Enter follow-up details..."
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <button
                  onClick={handleAddFollowUp}
                  disabled={!followUpText.trim()}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Follow-up
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsModal;
