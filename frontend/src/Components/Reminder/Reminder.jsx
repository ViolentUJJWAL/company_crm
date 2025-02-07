import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import remindersData from "./Reminder.json";
import { FaEdit, FaSave, FaTrash } from "react-icons/fa";

const ReminderList = () => {
  const [reminders, setReminders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setReminders(remindersData);
  }, []);

  const handleDelete = (index) => {
    const updatedReminders = reminders.filter((_, i) => i !== index);
    setReminders(updatedReminders);
  };

  const handleEdit = (index) => {
    console.log("Editing reminder:", reminders[index]);
    navigate(`/reminderForm?edit=${index}`); // एडिट पेज पर भेजने के लिए
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Reminder List</h2>
      <div className="flex justify-end items-center mb-5 gap-4">
        <input
          type="text"
          placeholder="Search Reminder..."
          className="p-2 border rounded-md"
        />
        <button
          onClick={() => navigate("/reminderForm")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add Reminder
        </button>
      </div>
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr className="text-center">
            <th className="py-2">No.</th>
            <th className="py-2">Message</th>
            <th className="py-2">Date</th>
            <th className="py-2">Time</th>
            <th className="py-2">Type</th>
            <th className="py-2">Assign To</th>
            <th className="py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {reminders.map((reminder, index) => (
            <tr key={index} className="border-b hover:bg-gray-100 text-center">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{reminder.message}</td>
              <td className="p-2">{reminder.date}</td>
              <td className="p-2">{reminder.time}</td>
              <td className="p-2">{reminder.type}</td>
              <td className="p-2">{reminder.assignTo}</td>
              <td className="p-2 flex justify-center gap-4">
                <button
                  onClick={() => handleEdit(index)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
                <button className="text-green-500 hover:text-green-700">
                  <FaSave />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReminderList;
