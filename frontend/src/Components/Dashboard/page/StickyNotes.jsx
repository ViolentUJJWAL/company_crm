import React, { useState } from "react";
import StickyBox from "react-sticky-box";
import { Trash2 } from 'lucide-react';


const StickyNotes = () => {
  const [notes, setNotes] = useState([
    { id:1, type: "Meeting", title: "Client Call", description: "Discuss project scope" },
    { id:2, type: "Task", title: "Fix Bug", description: "Resolve login issue" },
    { id:3, type: "Reminder", title: "Submit Report", description: "Send the monthly report" },
  ]);

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

 

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Sticky Notes</h2>
      <div className="flex gap-5 flex-wrap">
      {notes.map((note) => (
          <StickyBox key={note.id} className="w-48 p-2 bg-gray-300 shadow-md rounded">
            <div className="flex justify-between items-center">
            <p className=" w-[80px] rounded-2xl text-[12px] font-bold bg-gray-100 p-1 text-center">{note.type}</p>
            <p className=""
                 onClick={() => deleteNote(note.id)}
            >   
             <Trash2 size={16} />
            </p>
            </div>
            
            <h1 className="font-bold">{note.title}</h1>
            <p >{note.description}</p>
            
          </StickyBox>
        ))}
      </div>
    </div>
  );
};

export default StickyNotes;
