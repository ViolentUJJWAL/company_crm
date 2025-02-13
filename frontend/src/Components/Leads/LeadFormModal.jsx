const LeadFormModal = ({
  showForm,
  leadData,
  leadFors,
  leadSources,
  contacts,
  statuses,
  employees,
  onClose,
  onSubmit,
  onInputChange,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h3 className="text-xl font-semibold mb-4">Add New Lead</h3>
        <form onSubmit={onSubmit}>
          <select
            name="leadForId"
            value={leadData.leadForId}
            onChange={onInputChange}
            className="w-full p-2 mb-2 border rounded-md"
            required
          >
            <option value="">Select Lead For</option>
            {leadFors.map((leadFor) => (
              <option key={leadFor._id} value={leadFor._id}>
                {leadFor.name}
              </option>
            ))}
          </select>

          <select
            name="leadSourceId"
            value={leadData.leadSourceId}
            onChange={onInputChange}
            className="w-full p-2 mb-2 border rounded-md"
            required
          >
            <option value="">Select Lead Source</option>
            {leadSources.map((source) => (
              <option key={source._id} value={source._id}>
                {source.name}
              </option>
            ))}
          </select>

          <select
            name="priority"
            value={leadData.priority}
            onChange={onInputChange}
            className="w-full p-2 mb-2 border rounded-md"
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <select
            name="contactId"
            value={leadData.contactId}
            onChange={onInputChange}
            className="w-full p-2 mb-2 border rounded-md"
            required
          >
            <option value="">Select Contact</option>
            {contacts.map((contact) => (
              <option key={contact._id} value={contact._id}>
                {contact.name}
              </option>
            ))}
          </select>

          <select
            name="statusId"
            value={leadData.statusId}
            onChange={onInputChange}
            className="w-full p-2 mb-2 border rounded-md"
            required
          >
            <option value="">Select Status</option>
            {statuses.map((status) => (
              <option key={status._id} value={status._id}>
                {status.name}
              </option>
            ))}
          </select>

          <select
            name="assignedTo"
            value={leadData.assignedTo}
            onChange={onInputChange}
            className="w-full p-2 mb-2 border rounded-md"
            required
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.user.name}
              </option>
            ))}
          </select>

          <textarea
            name="remark"
            placeholder="Remark"
            value={leadData.remark}
            onChange={onInputChange}
            className="w-full p-2 mb-2 border rounded-md"
          />

          <div className="mb-4 border-t pt-4">
            <h4 className="font-medium mb-2">Reference Information</h4>
            <input
              type="text"
              name="reference.name"
              placeholder="Reference Name"
              value={leadData.reference.name}
              onChange={onInputChange}
              className="w-full p-2 mb-2 border rounded-md"
            />
            <input
              type="email"
              name="reference.email"
              placeholder="Reference Email"
              value={leadData.reference.email}
              onChange={onInputChange}
              className="w-full p-2 mb-2 border rounded-md"
            />
            <input
              type="tel"
              name="reference.phoneNo"
              placeholder="Reference Phone (10-15 digits)"
              value={leadData.reference.phoneNo}
              onChange={onInputChange}
              pattern="\d{10,15}"
              className="w-full p-2 mb-2 border rounded-md"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Add Lead
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadFormModal;
