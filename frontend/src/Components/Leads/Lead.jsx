import React, { useState } from 'react';

const leadsData = [
  { title: "New", count: 0, color: "bg-teal-100", border: "border-teal-300", leads: [] },
  { title: "Processing", count: 0, color: "bg-yellow-100", border: "border-yellow-300", leads: [] },
  { title: "Close-by", count: 0, color: "bg-purple-100", border: "border-purple-300", leads: [] },
  { title: "Confirm", count: 0, color: "bg-green-100", border: "border-green-300", leads: [] },
  { title: "Cancel", count: 0, color: "bg-red-100", border: "border-red-300", leads: [] },
];

const LeadCard = ({ lead }) => (
  <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 text-left">
    <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">{lead.label}</span>
    <h3 className="font-semibold text-lg mt-2">{lead.name}</h3>
    <p className="text-gray-600">📞{lead.phone}</p>
    <p className="text-sm text-gray-500">CD: {lead.cd}</p>
    <p className="text-sm text-gray-500">BY: {lead.by}</p>
    <p className="text-sm text-gray-500">TO: {lead.to}</p>
    <div className="mt-2 flex space-x-2 text-gray-500">
      <span>✏️</span>
      <span>🗑️</span>
      <span>📩</span>
    </div>
  </div>
);

function Lead() {
  const [leads, setLeads] = useState(leadsData);
  const [showForm, setShowForm] = useState(false);
  const [newLead, setNewLead] = useState({
    label: '',
    name: '',
    phone: '',
    cd: '',
    by: '',
    to: ''
  });

  const labels = ["All Labels", "Engineer", "Leader", "Graphic Designer", "Developer"];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewLead({ ...newLead, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Add the new lead to the "New" section
    const updatedLeads = [...leads];
    updatedLeads[0].leads.push(newLead); // Add new lead to the "New" section

    // Update the count of the "New" section
    updatedLeads[0].count += 1; // Increment the count

    setLeads(updatedLeads); // Update the leads state
    setShowForm(false); // Close the form after submitting
    setNewLead({ label: '', name: '', phone: '', cd: '', by: '', to: '' }); // Reset the form fields
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen w-full border-amber-600 border-4 ">
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Leads</h2>
        <input type="text" placeholder="Search..." className="p-2 border rounded-md" />
        </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md shadow">Table View</button>
        </div>
        <div className='flex space-x-2'>
        <select className="p-2 border rounded-md">
            {labels.map((label, index) => (
              <option key={index}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded-md shadow"
            onClick={() => setShowForm(true)}
          >
            + Add Lead
          </button>
        </div>
      </div>

      {/* Pop-up Form */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h3 className="text-xl font-semibold mb-4">Add New Lead</h3>
            <form onSubmit={handleFormSubmit}>
              <select
                name="label"
                value={newLead.label}
                onChange={handleFormChange}
                className="w-full p-2 mb-2 border rounded-md"
              >
                {labels.map((label, index) => (
                  <option key={index} value={label}>{label}</option>
                ))}
              </select>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newLead.name}
                onChange={handleFormChange}
                className="w-full p-2 mb-2 border rounded-md"
              />
              <input
                type="number"
                name="phone"
                placeholder="Phone"
                value={newLead.phone}
                onChange={handleFormChange}
                className="w-full p-2 mb-2 border rounded-md"
              />
              <input
                type="date"
                name="cd"
                placeholder="CD"
                value={newLead.cd}
                onChange={handleFormChange}
                className="w-full p-2 mb-2 border rounded-md"
              />
              <input
                type="text"
                name="by"
                placeholder="BY"
                value={newLead.by}
                onChange={handleFormChange}
                className="w-full p-2 mb-2 border rounded-md"
              />
              <input
                type="text"
                name="to"
                placeholder="TO"
                value={newLead.to}
                onChange={handleFormChange}
                className="w-full p-2 mb-4 border rounded-md"
              />
              <input
              type="datetime-local"
              name="to"
              placeholder="NFD"
              value={newLead.to}
              onChange={handleFormChange}
              className="w-full p-2 mb-4 border rounded-md"
            />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-400 text-white rounded-md"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Add Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex gap-4 justify-between">
        {leads.map((column) => (
          <div key={column.title} className={`p-3 rounded-md ${column.color} ${column.border} border-2`}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{column.title}</h3>
              <span className="text-sm bg-white px-2 py-1 rounded-md shadow-sm">{column.count}</span>
            </div>
            <div className="space-y-3">
              {column.leads.map((lead, index) => (
                <LeadCard key={index} lead={lead} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Lead;
