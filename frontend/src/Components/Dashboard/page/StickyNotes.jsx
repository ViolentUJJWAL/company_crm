import React, { useState } from "react";

const StickyNotes = () => {
  const [notes, setNotes] = useState([
    { type: "Meeting", title: "Client Call", description: "Discuss project scope" },
    { type: "Task", title: "Fix Bug", description: "Resolve login issue" },
    { type: "Reminder", title: "Submit Report", description: "Send the monthly report" },
  ]);


 

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Sticky Notes</h2>
        <div className="flex flex-wrap gap-4">
        {notes.map((note, index) => (
          <div key={index} className="w-[200px] p-3 bg-yellow-200 shadow-md rounded">
            <span className="text-sm font-semibold text-gray-700">{note.type}</span>
            <h3 className="text-lg font-bold">{note.title}</h3>
            <p className="text-gray-600">{note.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StickyNotes;
