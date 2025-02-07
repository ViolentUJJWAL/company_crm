import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ReminderForm = () => {
  const navigate = useNavigate();
  const [reminder, setReminder] = useState({
    message: "",
    date: "",
    time: "",
    type: "Once",
    assignTo: "",
  });

  const handleChange = (e) => {
    setReminder({ ...reminder, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedReminders = JSON.parse(localStorage.getItem("reminders")) || [];
    const updatedReminders = [...storedReminders, reminder];
    // localStorage.setItem("reminders", JSON.stringify(updatedReminders));
    navigate("/reminder");
  };

  return (
    <div className="p-6">
      <button 
        onClick={() => navigate("/reminder")} 
        className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
      >
        Back
      </button>
      <h2 className="text-xl font-bold mb-4">Add Reminder</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
      <div className=" p-2 w-full flex justify-between">
          {/* <p className="mb-2 font-semibold ">Reminder Type:</p> */}
          {["Once", "Daily", "Weekly", "Monthly", "Yearly"].map((option) => (
            <label key={option} className="mr-4">
              <input 
                type="radio" 
                name="type" 
                value={option} 
                checked={reminder.type === option} 
                onChange={handleChange} 
                className="mr-1"
              />
              {option}
            </label>
          ))}
        </div>
        <div className="flex justify-between">
        <input type="datetime-local" name="date" onChange={handleChange} required className="border p-2 w-xl" />
        {/* <input type="text" name="assignTo" placeholder="Assign To" onChange={handleChange} required className="border p-2 w-xl" /> */}
        <select name="assignTo" onChange={handleChange} className="border p-2 w-xl">
          <option value="">Employee1</option>
          <option value="">Employee2</option>
          <option value="">Employee3</option>
          <option value="">Employee4</option>
          <option value="">Employee5</option>
        </select>

        </div>
        
        <input type="text" name="message" placeholder="Enter message" onChange={handleChange} required className="border p-2 w-full" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default ReminderForm;