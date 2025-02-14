import React from "react";
import LeadSection from "./page/LeadSection";
import TaskSection from "./page/TaskSection";
import EventSection from "./page/EventSection";
import StickyNotes from "./page/StickyNotes";
import LeadsStatus from "./page/LeadsStatus";
import LeadSourceChart from "./page/LeadsSource";
import Calendar from "./page/Calendar";

function Dashboard() {
  return (
    <div>
      <h1 className=" text-3xl font-bold mb-10">Dashboard</h1>

      <div className="flex justify-between">
        <LeadSection />
        <TaskSection />
        <EventSection />
      </div>
      <div className="mt-10">
        <StickyNotes />
      </div>
      <div className="flex justify-between gap-1 mt-10">
        <LeadsStatus />
        <LeadSourceChart />
      </div>
      <div>
        <Calendar />
      </div>
    </div>
  );
}

export default Dashboard;
