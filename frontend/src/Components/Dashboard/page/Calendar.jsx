import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
// import "tailwindcss/tailwind.css";

const localizer = momentLocalizer(moment);

const events = [
  { id: 1, title: "Meeting with Adit", start: new Date(2025, 1, 1, 16, 45), end: new Date(2025, 1, 1, 17, 30), type: "meeting" },
  { id: 5, title: "Meeting with Adit", start: new Date(2025, 2, 11, 16, 45), end: new Date(2025, 2, 11, 17, 30), type: "meeting" },
  { id: 1, title: "Meeting with Adit", start: new Date(2025, 1, 1, 16, 45), end: new Date(2025, 1, 1, 17, 30), type: "meeting" },
  { id: 2, title: "Weekly Meeting", start: new Date(2025, 1, 5, 12, 50), end: new Date(2025, 1, 5, 14, 0), type: "meeting" },
  { id: 3, title: "Client - Bhakti M", start: new Date(2025, 1, 6, 11, 0), end: new Date(2025, 1, 6, 12, 0), type: "lead" },
  { id: 4, title: "Domain + Hosting", start: new Date(2025, 1, 10, 12, 0), end: new Date(2025, 1, 10, 13, 0), type: "reminder" },
];

const eventColors = {
  meeting: "#3B82F6",   // Blue
  lead: "#10B981",      // Green
  reminder: "#EF4444",  // Red
};

const MyCalendar = () => {
  const [filter, setFilter] = useState("all");

  const filteredEvents = filter === "all" ? events : events.filter(event => event.type === filter);

  // Function to style calendar events dynamically
  const eventStyleGetter = (event) => {
    const backgroundColor = eventColors[event.type] || "#6B7280"; // Default gray
    return {
      style: {
        backgroundColor,
        color: "white",
        borderRadius: "5px",
        padding: "5px",
      },
    };
  };

  return (
    <div className=" h-[70vh] my-10">
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-200 p-5 mb-4">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <button className="w-full px-4 py-2 mb-2 bg-gray-700 text-white rounded-lg" onClick={() => setFilter("all")}>All</button>
        <button className="w-full px-4 py-2 mb-2 bg-blue-500 text-white rounded-lg" onClick={() => setFilter("meeting")}>Meetings</button>
        <button className="w-full px-4 py-2 mb-2 bg-green-500 text-white rounded-lg" onClick={() => setFilter("lead")}>Leads</button>
        <button className="w-full px-4 py-2 mb-2 bg-red-500 text-white rounded-lg" onClick={() => setFilter("reminder")}>Reminders</button>
      </div>

      {/* Calendar Section */}
      <div className="w-4/5 p-5">
        <h2 className="text-2xl font-bold text-center mb-4">Event Calendar</h2>
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
           views={["month", "week", "day", "agenda"]} // 👈 Adding Agenda View
        defaultView="month"
          className="rounded-lg shadow-md"
          eventPropGetter={eventStyleGetter} // Apply custom styles for event colors
        />
      </div>
    </div>
    </div>
  );
};

export default MyCalendar;
