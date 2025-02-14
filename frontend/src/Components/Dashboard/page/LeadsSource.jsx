import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const LeadSourceChart = () => {
  const leadSourceData = [
    { id: 1, source: "Website", date: "2025-02-01" },
    { id: 2, source: "Website",  date: "2025-02-02" },
    { id: 3, source: "WhatsApp", date: "2025-02-05" },
    { id: 4, source: "WhatsApp",  date: "2025-02-10" },
    { id: 5, source: "Online",  date: "2025-02-15" },
    { id: 6, source: "Online",  date: "2025-02-20" },
    { id: 7, source: "Personal",  date: "2025-02-22" },
  ];

  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(lastDayOfMonth);
  const [filteredData, setFilteredData] = useState([]);

  const filterDataByDateRange = () => {
    const filtered = leadSourceData.filter((item) => {
      const itemDate = new Date(item.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return itemDate >= start && itemDate <= end;
    });

    const aggregatedData = filtered.reduce((acc, item) => {
      const key = `${item.source}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const pieChartData = Object.keys(aggregatedData).map((key) => ({
      name: key,
      value: aggregatedData[key],
    }));

    setFilteredData(pieChartData);
  };

  useEffect(() => {
    filterDataByDateRange();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF1919"];

  return (
    <div className="w-[48%] p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Lead Source</h2>
      
      <div className="flex space-x-4 mb-6">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={filterDataByDateRange}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>
      
      {/* Pie Chart */}
      <div className="h-64">
        {filteredData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center">No leads found for the selected date range.</p>
        )}
      </div>
    </div>
  );
};

export default LeadSourceChart;
