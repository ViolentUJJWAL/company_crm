import React, { useState, useEffect } from "react";
import StickyBox from "react-sticky-box";
import { Trash2 } from "lucide-react";
import { getStickyNotes, deleteStickyNote } from "../../../services/stickyNotesServices";

const StickyNotes = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await getStickyNotes();
      if (response.success) {
        setNotes(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await deleteStickyNote(id);
      // After successful deletion, update the UI
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  // Function to format title and description from message
  const formatNoteContent = (message) => {
    if (message.includes(" - Scheduled for:")) {
      const [title, description] = message.split(" - Scheduled for:");
      return {
        title: title,
        description: `Scheduled for:${description}`,
      };
    }
    return {
      title: message.substring(0, 20) + (message.length > 20 ? "..." : ""),
      description: message,
    };
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Sticky Notes</h2>
      <div className="flex gap-5 flex-wrap">
        {notes.map((note) => {
          const { title, description } = formatNoteContent(note.message);
          return (
            <StickyBox
              key={note._id}
              className="w-48 p-2 bg-gray-300 shadow-md rounded"
            >
              <div className="flex justify-between items-center">
                <p className="w-[80px] rounded-2xl text-[12px] font-bold bg-gray-100 p-1 text-center">
                  {note.type.charAt(0).toUpperCase() + note.type.slice(1)}
                </p>
                <p className="" onClick={() => deleteNote(note._id)}>
                  <Trash2 size={16} />
                </p>
              </div>
              <h1 className="font-bold">{title}</h1>
              <p>{description}</p>
            </StickyBox>
          );
        })}
      </div>
    </div>
  );
};

export default StickyNotes;
