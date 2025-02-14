import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { red } from '@mui/material/colors';
import { blue } from '@mui/material/colors';
import { green } from '@mui/material/colors';


const localizer = momentLocalizer(moment);
const label = { inputProps: { "aria-label": "Checkbox demo" } };

const events = [
  {id: 1,title: "Meeting with Adit",start: new Date(2025, 1, 1, 16, 45),end: new Date(2025, 1, 1, 17, 30),type: "meeting",},
  {id: 1,title: "Meeting with Adit",start: new Date(2025, 1, 1, 16, 45),end: new Date(2025, 1, 1, 17, 30),type: "meeting",},  
  {id: 5,title: "Meeting with Adit",start: new Date(2025, 2, 11, 16, 45),end: new Date(2025, 2, 11, 17, 30),type: "meeting",},
  {id: 2,title: "Weekly Meeting",start: new Date(2025, 1, 5, 12, 50),end: new Date(2025, 1, 5, 14, 0),type: "meeting",},
  {id: 3,title: "Client - Bhakti M",start: new Date(2025, 1, 6, 11, 0),end: new Date(2025, 1, 6, 12, 0),type: "lead",},
  {id: 4,title: "Domain + Hosting",start: new Date(2025, 1, 10, 12, 0),end: new Date(2025, 1, 10, 13, 0),type: "reminder",},
];

const eventColors = {
  meeting: "#3B82F6", // Blue
  lead: "#10B981", // Green
  reminder: "#EF4444", // Red
};

const MyCalendar = () => {
  const [selectedFilters, setSelectedFilters] = useState([
    "meeting",
    "lead",
    "reminder",
  ]); 

  const toggleFilter = (filter) => {
    setSelectedFilters(
      (prev) =>
        prev.includes(filter)
          ? prev.filter((item) => item !== filter) // Remove if already selected
          : [...prev, filter] // Add if not selected
    );
  };

  const filteredEvents = events.filter((event) =>
    selectedFilters.includes(event.type)
  );

  const eventStyleGetter = (event) => {
    const backgroundColor = eventColors[event.type] || "#6B7280"; // Default gray
    return {
      style: {
        backgroundColor,
        color: "white",
        borderRadius: "5px",
        padding: "0px px",
      },
    };
  };

  return (
    <div className="h-[70vh] my-10">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/5 bg-gray-200 p-5 mb-4 flex flex-col">
          <h2 className="text-xl font-bold mb-4">Filters</h2>

          <FormControlLabel
            label="Meetings"
            control={
              <Checkbox
                {...label}
                defaultChecked
                onChange={() => toggleFilter("meeting")}
                checked={selectedFilters.includes("meeting")}
                sx={{
                  color: blue[800],
                  '&.Mui-checked': {
                    color: blue[600],
                  },}}               />
            }
          />
          <FormControlLabel
            label="Leads"
            control={
              <Checkbox
                {...label}
                defaultChecked
                onChange={() => toggleFilter("lead")}
                checked={selectedFilters.includes("lead")}
                sx={{
                  color: green[800],
                  '&.Mui-checked': {
                    color: green[600],
                  },}}               />
            }
          />
          <FormControlLabel
            label="Reminder"
            control={
              <Checkbox
                {...label}
                defaultChecked
                onChange={() => toggleFilter("reminder")}
                checked={selectedFilters.includes("reminder")}
                sx={{
                  color: red[800],
                  '&.Mui-checked': {
                    color: red[600],
                  },}}              />
            }
          />
        </div>

        {/* Calendar Section */}
        <div className="w-4/5 p-5">
          <h2 className="text-2xl font-bold text-center mb-4">
            Event Calendar
          </h2>
          <Calendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            views={["month", "week", "day", "agenda"]}
            defaultView="month"
            className="rounded-lg shadow-md"
            eventPropGetter={eventStyleGetter}
          />
        </div>
      </div>
    </div>
  );
};

export default MyCalendar;
