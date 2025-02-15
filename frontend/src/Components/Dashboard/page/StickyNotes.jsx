import React, { useState } from "react";
import StickyBox from "react-sticky-box";
import { Trash2 } from 'lucide-react';

const StickyNotes = () => {
  const [notes, setNotes] = useState([
    { id: 1, type: "Meeting", title: "Client Call", description: "Discuss project scope" },
    { id: 2, type: "Task", title: "Fix Bug", description: "Resolve login issue" },
    { id: 3, type: "Reminder", title: "Submit Report", description: "Send the monthly report" },
  ]);

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Sticky Notes</h2>
      <div className="flex flex-wrap gap-6">
        {notes.map((note) => (
          <StickyBox key={note.id} className="sticky-note w-64 p-4 bg-yellow-100 shadow-lg rounded-lg transform transition-transform hover:scale-105 relative overflow-hidden">
            {/* Colored Corner */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-blue-200 transform rotate-45 translate-x-6 -translate-y-6"></div>

            {/* Note Content */}
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  note.type === "Meeting" ? "bg-blue-100 text-blue-800" :
                  note.type === "Task" ? "bg-green-100 text-green-800" :
                  "bg-yellow-200 text-yellow-800"
                }`}>
                  {note.type}
                </span>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{note.title}</h3>
              <p className="text-sm text-gray-600">{note.description}</p>
            </div>
          </StickyBox>
        ))}
      </div>
    </div>
  );
};

export default StickyNotes;