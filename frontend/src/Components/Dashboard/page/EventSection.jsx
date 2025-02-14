import React, { useState } from "react";

const EventSection = () => {
  const [filter, setFilter] = useState("all"); // State for filtering

  const events = [
    { id: 1, title: "Meeting with Client", date: "01/12/2022", type: "meeting" },
    { id: 2, title: "Reminder: Follow up on Leads", date: "02/12/2022", type: "reminder" },
    { id: 4, title: "Team Standup", date: "03/12/2022", type: "meeting" },
    { id: 5, title: "Reminder: Send Report", date: "04/12/2022", type: "reminder" },
  ];

  // Filter events based on the selected filter
  const filteredEvents =
    filter === "all"
      ? events
      : events.filter((event) => event.type === filter);

  return (
    <div className="w-[400px] h-[350px] overflow-y-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Events</h2>

      {/* Filter Buttons */}
      <div className="flex space-x-3 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("meeting")}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            filter === "meeting" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Meetings
        </button>
        <button
          onClick={() => setFilter("reminder")}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            filter === "reminder" ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Reminders
        </button>
       
      </div>

      {/* Event List */}
      <ul className="space-y-3">
        {filteredEvents.map((event) => (
          <li key={event.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
            <div>
            <p className="text-gray-700 font-medium">{event.title}</p>
            <p className="text-sm text-gray-500">{event.date}</p>
            </div>
           
            <span
              className={`inline-block px-3 py-1 mt-2 rounded-full text-xs font-semibold ${
                event.type === "meeting"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {event.type}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventSection;