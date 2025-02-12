import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { MdEmail } from "react-icons/md";
import { FaWhatsapp, FaLink } from "react-icons/fa6";
import { IoPersonAdd } from "react-icons/io5";
import { FiSend } from "react-icons/fi";
import leadsJson from './leads.json'; 

const LeadCard = ({ lead }) => (
  <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 text-left hover:shadow-[0_8px_10px_rgba(0,0,0,0.2)] transition duration-300   ">
    <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">{lead.label}</span>
    <h3 className="font-semibold text-lg mt-2">{lead.name}</h3>
    <p className="text-gray-600">📞 {lead.phone}</p>
    <p className="text-sm text-gray-500">CD: {lead.cd}</p>
    <p className="text-sm text-gray-500">BY: {lead.by}</p>
    <p className="text-sm text-gray-500">TO: {lead.to}</p>
    <p className="text-sm text-gray-500">NFD: {lead.nfd}</p>
    <div className="mt-2 flex space-x-2 text-gray-500">
      <span className='cursor-pointer '><MdDelete /></span>
      <span className='cursor-pointer '><CiEdit/></span>
      <span className='cursor-pointer '><MdEmail  /></span>
      <span className='cursor-pointer '><FaWhatsapp /></span>
      <span className='cursor-pointer '><FaLink /></span>
      <span className='cursor-pointer '><IoPersonAdd /></span>
      <span className='cursor-pointer '><FiSend/></span>
    </div>
  </div>
);

function Lead() {
  const [leads, setLeads] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("All Labels");
  const [searchTerm, setSearchTerm] = useState("");
  const [url, setUrl] = useState("https://www.example.com");


  const [newLead, setNewLead] = useState({
    label: '',
    name: '',
    phone: '',
    cd: '',
    by: '',
    to: '',
    nfd: ''
  });

  const labels = ["All Labels", "Engineer", "Leader", "Graphic Designer", "Developer"];

  useEffect(() => {
    setLeads(leadsJson);
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewLead({ ...newLead, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const updatedLeads = [...leads];
    updatedLeads[0].leads.push(newLead);
    updatedLeads[0].count += 1;
    setLeads(updatedLeads);
    setShowForm(false);
    setNewLead({ label: '', name: '', phone: '', cd: '', by: '', to: '', nfd: '' });
  };

  const filteredLeads = leads.map(category => ({
    ...category,
    leads: category.leads
      .filter(lead => selectedLabel === "All Labels" || lead.label === selectedLabel)
      .filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.by.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.to.toLowerCase().includes(searchTerm.toLowerCase())
      )
  }));

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      alert("URL copied to clipboard!");
    }).catch((err) => {
      console.error("Error copying URL: ", err);
    });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const sourceIndex = leads.findIndex(category => category.title === result.source.droppableId);
    const destIndex = leads.findIndex(category => category.title === result.destination.droppableId);
    
    const sourceLeads = [...leads[sourceIndex].leads];
    
    // Move the item within the same column
    if (sourceIndex === destIndex) {
      const [reorderedLead] = sourceLeads.splice(result.source.index, 1);
      sourceLeads.splice(result.destination.index, 0, reorderedLead);
      
      const updatedLeads = [...leads];
      updatedLeads[sourceIndex].leads = sourceLeads;
      setLeads(updatedLeads);
      return;
    }
    
    // Move the item to a different column
    const destLeads = [...leads[destIndex].leads];
    const [movedLead] = sourceLeads.splice(result.source.index, 1);
    destLeads.splice(result.destination.index, 0, movedLead);
    
    const updatedLeads = [...leads];
    updatedLeads[sourceIndex].leads = sourceLeads;
    updatedLeads[sourceIndex].count = sourceLeads.length;
    updatedLeads[destIndex].leads = destLeads;
    updatedLeads[destIndex].count = destLeads.length;
    
    setLeads(updatedLeads);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>

    <div className="p-6 bg-gray-100 min-h-screen w-full">
      <div className="flex justify-between items-center mb-15">
        <h2 className="text-2xl font-bold">Leads</h2>
        {/* <input type="text" placeholder="Search..." className="p-2 border rounded-md" /> */}
        <div className="flex items-center space-x-2">
        <p className=' text-xl font-bold'>Inquiry URL</p>
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
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md shadow">Table View</button>
        </div>
        <div className='flex space-x-2'>
          <select className="p-2 border rounded-md" onChange={(e) => setSelectedLabel(e.target.value)}>
            {labels.map((label, index) => (
              <option key={index} value={label}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <button className="px-4 py-2 bg-purple-500 text-white rounded-md shadow" onClick={() => setShowForm(true)}>
            + Add Lead
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h3 className="text-xl font-semibold mb-4">Add New Lead</h3>
            <form onSubmit={handleFormSubmit}>
              <select name="label" value={newLead.label} onChange={handleFormChange} className="w-full p-2 mb-2 border rounded-md">
                {labels.map((label, index) => (
                  <option key={index} value={label}>{label}</option>
                ))}
              </select>
              <input type="text" name="name" placeholder="Name" value={newLead.name} onChange={handleFormChange} required className="w-full p-2 mb-2 border rounded-md" />
              <input type="number" name="phone" placeholder="Phone" value={newLead.phone} onChange={handleFormChange} required className="w-full p-2 mb-2 border rounded-md" />
              <input type="date" name="cd" placeholder="CD" value={newLead.cd} onChange={handleFormChange} required className="w-full p-2 mb-2 border rounded-md" />
              <input type="text" name="by" placeholder="By" value={newLead.by} onChange={handleFormChange} required className="w-full p-2 mb-2 border rounded-md" />
              <input type="text" name="to" placeholder="To" value={newLead.to} onChange={handleFormChange} required className="w-full p-2 mb-2 border rounded-md" />
              <input type="datetime-local" name="nfd" placeholder="NFD" value={newLead.nfd} onChange={handleFormChange} required className="w-full p-2 mb-2 border rounded-md" />
              <div className='flex justify-between'>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Add Lead</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-red-500 text-white rounded-md">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex gap-4 justify-between h-[600px]">
        {filteredLeads.map((column) => (
          // <div key={column.title} className={` rounded-md ${column.color} ${column.border} border-2 overflow-auto w-[250px]`}>
          //   <h3 className={`font-semibold p-3 bg-gray-200 `}>{column.title} ({column.count})</h3>
            <Droppable key={column.title} droppableId={column.title}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className={`p-1 rounded-lg shadow-md ${column.color} ${column.border} border-2 overflow-auto w-[250px]`}>
                  <h3 className={` font-bold mb-2 rounded-sm p-3 flex justify-between ${
                     column.title === "New"
                     ? "bg-teal-300 " : column.title === "Processing" ? "bg-yellow-200" : column.title=== "Close-by" ? "bg-purple-300" :column.title === "Confirm" ? "bg-green-300" :"bg-red-300"
                   
                  }`}> <p>{column.title}</p> <div className={`w-[25px] h-[25px] rounded-3xl bg-amber-700 text-center ${
                    column.title === "New"
                    ? "bg-teal-200 " : column.title === "Processing" ? "bg-yellow-50" : column.title=== "Close-by" ? "bg-purple-200" :column.title === "Confirm" ? "bg-green-200" :"bg-red-200"
                  
                 } `}>{column.count}</div></h3>
                  {column.leads.map((lead, index) => (
                    <Draggable key={lead.phone} draggableId={lead.phone} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="mb-2">
                          <LeadCard lead={lead} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>       
              //  </div>
        ))}
      </div>
    </div>
    </DragDropContext>

  );
}

export default Lead;
