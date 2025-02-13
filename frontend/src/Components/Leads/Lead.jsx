import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import leadServices from "../../services/leadServices";
import { getVerifiedEmployees } from "../../services/employeeServices";
import LeadForServices from "../../services/LeadForServices";
import LeadStatusLabelService from "../../services/leadStatusLabelServices";
import contactServices from "../../services/contactServices";
import LeadSourceService from "../../services/leadSourceService";
import LeadCard from "./LeadCard";
import LeadDetailsModal from "./LeadDetailsModal";
import LeadFormModal from "./LeadFormModal";

function Lead() {
  const [leads, setLeads] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("All Labels");
  const [searchTerm, setSearchTerm] = useState("");
  const [url, setUrl] = useState("https://www.example.com");
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leadFors, setLeadFors] = useState([]);
  const [leadSources, setLeadSources] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [employees, setEmployees] = useState([]);

  const labels = ["label 1", "label 2"];

  const [leadData, setLeadData] = useState({
    leadForId: "",
    leadSourceId: "",
    priority: "Medium",
    contactId: "",
    statusId: "",
    assignedTo: "",
    remark: "",
    reference: {
      name: "",
      email: "",
      phoneNo: "",
    },
  });

  // Fetch leads
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await leadServices.getLeads();
      console.log("response.data", response.data);
      setLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leadForsRes = await LeadForServices.getActiveLeadFors();
        console.log("Lead Fors:", leadForsRes.data);
        setLeadFors(leadForsRes.data);

        const leadSourcesRes = await LeadSourceService.getActiveLeadSources();
        console.log("Lead Sources:", leadSourcesRes.data);
        setLeadSources(leadSourcesRes.data);

        const contactsRes = await contactServices.getContacts();
        console.log("Contacts:", contactsRes.contacts);
        setContacts(contactsRes.contacts);

        const statusesRes =
          await LeadStatusLabelService.getAllLeadStatusLabels();
        console.log("Lead Statuses:", statusesRes.data);
        setStatuses(statusesRes.data);

        const employeesRes = await getVerifiedEmployees();
        console.log("Employees:", employeesRes.data);
        setEmployees(employeesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("reference.")) {
      const field = name.split(".")[1];
      setLeadData({
        ...leadData,
        reference: {
          ...leadData.reference,
          [field]: value,
        },
      });
    } else {
      setLeadData({ ...leadData, [name]: value });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await leadServices.createLead(leadData);
      setShowForm(false);
      setLeadData({
        leadForId: "",
        leadSourceId: "",
        priority: "Medium",
        contactId: "",
        statusId: "",
        assignedTo: "",
        remark: "",
        reference: {
          name: "",
          email: "",
          phoneNo: "",
        },
      });
      fetchLeads(); // Refresh leads after creating
    } catch (error) {
      console.error("Error creating lead:", error);
    }
  };

  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
  };

  const handleAddFollowUp = async (leadId, conclusion) => {
    try {
      await leadServices.addFollowUp(leadId, conclusion);
      // Refresh lead details
      const updatedLead = await leadServices.getLeadById(leadId);
      setSelectedLead(updatedLead.data);
    } catch (error) {
      console.error("Error adding follow-up:", error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("URL copied to clipboard!");
      })
      .catch((err) => {
        console.error("Error copying URL: ", err);
      });
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const sourceIndex = leads.findIndex(
      (category) => category.title === result.source.droppableId
    );
    const destIndex = leads.findIndex(
      (category) => category.title === result.destination.droppableId
    );

    try {
      // Get the lead being moved
      const sourceLeads = [...leads[sourceIndex].leads];
      const [movedLead] = sourceLeads.splice(result.source.index, 1);

      // Update the lead status in the backend
      await leadServices.changeLeadStatus(
        movedLead._id,
        result.destination.droppableId
      );

      // Update local state
      const destLeads = [...leads[destIndex].leads];
      destLeads.splice(result.destination.index, 0, movedLead);

      const updatedLeads = [...leads];
      updatedLeads[sourceIndex].leads = sourceLeads;
      updatedLeads[sourceIndex].count = sourceLeads.length;
      updatedLeads[destIndex].leads = destLeads;
      updatedLeads[destIndex].count = destLeads.length;

      setLeads(updatedLeads);
    } catch (error) {
      console.error("Error updating lead status:", error);
      // Revert the UI if the backend update fails
      fetchLeads();
    }
  };

  const filteredLeads = leads.map((category) => ({
    ...category,
    leads: category.leads
      ?.filter(
        (lead) => selectedLabel === "All Labels" || lead.label === selectedLabel
      )
      ?.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.phone.includes(searchTerm) ||
          lead.by.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.to.toLowerCase().includes(searchTerm.toLowerCase())
      ),
  }));

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="p-6 bg-gray-100 min-h-screen w-full">
        <div className="flex justify-between items-center mb-15">
          <h2 className="text-2xl font-bold">Leads</h2>
          {/* <input type="text" placeholder="Search..." className="p-2 border rounded-md" /> */}
          <div className="flex items-center space-x-2">
            <p className=" text-xl font-bold">Inquiry URL</p>
            <input
              type="text"
              value={url}
              disabled
              className="p-1 border rounded-md text-gray-700 bg-gray-100"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-1 bg-blue-500 text-white rounded-md"
            >
              Copy URL
            </button>
          </div>
          <input
            type="text"
            placeholder="Search Leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-1 border rounded-md"
          />
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md shadow">
              Table View
            </button>
          </div>
          <div className="flex space-x-2">
            <select
              className="p-2 border rounded-md"
              onChange={(e) => setSelectedLabel(e.target.value)}
            >
              {labels.map((label, index) => (
                <option key={index} value={label}>
                  {label}
                </option>
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

        <div className="flex gap-4 justify-between h-[600px]">
          {filteredLeads.map((column) => (
            <Droppable key={column.title} droppableId={column.title}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-1 rounded-lg shadow-md ${column.color} ${column.border} border-2 overflow-auto w-[250px]`}
                >
                  <h3
                    className={`font-bold mb-2 rounded-sm p-3 flex justify-between ${
                      column.title === "New"
                        ? "bg-teal-300"
                        : column.title === "Processing"
                        ? "bg-yellow-200"
                        : column.title === "Close-by"
                        ? "bg-purple-300"
                        : column.title === "Confirm"
                        ? "bg-green-300"
                        : "bg-red-300"
                    }`}
                  >
                    <p>{column.title}</p>
                    <div
                      className={`w-[25px] h-[25px] rounded-3xl text-center ${
                        column.title === "New"
                          ? "bg-teal-200"
                          : column.title === "Processing"
                          ? "bg-yellow-50"
                          : column.title === "Close-by"
                          ? "bg-purple-200"
                          : column.title === "Confirm"
                          ? "bg-green-200"
                          : "bg-red-200"
                      }`}
                    >
                      {column.count}
                    </div>
                  </h3>
                  {column.leads?.map((lead, index) => (
                    <Draggable
                      key={lead.phone}
                      draggableId={lead.phone}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-2"
                        >
                          <LeadCard lead={lead} onLeadClick={handleLeadClick} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </div>

      {showForm && (
        <LeadFormModal
          showForm={showForm}
          leadData={leadData}
          leadFors={leadFors}
          leadSources={leadSources}
          contacts={contacts}
          statuses={statuses}
          employees={employees}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
          onInputChange={handleInputChange}
        />
      )}

      {selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onAddFollowUp={handleAddFollowUp}
        />
      )}
    </DragDropContext>
  );
}

export default Lead;
