import React, { useState } from "react";

const LeadDetailsModal = ({ lead, onClose, onAddFollowUp }) => {
  const [followUpText, setFollowUpText] = useState("");

  const handleSubmitFollowUp = async () => {
    try {
      await onAddFollowUp(lead._id, followUpText);
      setFollowUpText("");
    } catch (error) {
      console.error("Error adding follow-up:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-[800px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-semibold">Lead Details</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="font-bold">Name:</p>
            <p>{lead.name}</p>
          </div>
          <div>
            <p className="font-bold">Phone:</p>
            <p>{lead.phone}</p>
          </div>
          <div>
            <p className="font-bold">Status:</p>
            <p>{lead.label}</p>
          </div>
          {lead.reference && (
            <div className="col-span-2 bg-gray-50 p-4 rounded">
              <p className="font-bold mb-2">Reference Contact:</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Name:</p>
                  <p>{lead.reference.name}</p>
                </div>
                <div>
                  <p className="font-semibold">Phone:</p>
                  <p>{lead.reference.phoneNo}</p>
                </div>
                {lead.reference.email && (
                  <div>
                    <p className="font-semibold">Email:</p>
                    <p>{lead.reference.email}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h4 className="font-semibold mb-2">Follow-ups</h4>
          <div className="space-y-4">
            {lead.followUps?.map((followUp, index) => (
              <div key={index} className="border-l-2 border-blue-500 pl-4 ml-4">
                <p className="text-sm text-gray-500">#{followUp.sequence}</p>
                <p>{followUp.conclusion}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Add Follow-up</h4>
          <textarea
            value={followUpText}
            onChange={(e) => setFollowUpText(e.target.value)}
            className="w-full p-2 border rounded-md mb-2"
            placeholder="Enter follow-up details..."
          />
          <button
            onClick={handleSubmitFollowUp}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Add Follow-up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsModal;
    