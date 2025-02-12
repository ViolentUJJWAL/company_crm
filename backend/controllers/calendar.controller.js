const Employee = require("../models/employee.model");
const Lead = require("../models/lead.model");
const Meeting = require("../models/meeting.model");
const TaskAssigned = require("../models/taskAssigned.model");
const Todo = require("../models/todo.model");
const Role = require("../models/role.model");
const { fetchReminders } = require("./reminder.controller");

// 📌 Fetch tasks, todos, meetings, and leads within a date range with permission check
exports.fetchDataByDateRange = async (req, res) => {
    try {
        let { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start date and end date are required" });
        }

        startDate = new Date(startDate);
        endDate = new Date(endDate);
        startDate.setHours(0, 0, 0, 0); // Include the full start day
        endDate.setHours(23, 59, 59, 999); // Include the full end day

        if (isNaN(startDate) || isNaN(endDate)) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        const company = req.user.company;
        const user = req.user;

        // Find employee details and their role
        const employee = await Employee.findOne({ user: user._id }).populate("role");
        const role = employee?.role;

        let data = {};

        // Fetch Tasks if the employee has read permission
        if (role.permissions.tasks.read || user.role === "CompanyAdmin") {
            data.tasks = await TaskAssigned.find({
                dueDate: { $gte: startDate, $lte: endDate },
                company,
            }).populate("assignedTo assignedBy");
        }

        // Fetch Todos if the employee has read permission
        if (role.permissions.todos.read || user.role === "CompanyAdmin") {
            data.todos = await Todo.find({
                dueDate: { $gte: startDate, $lte: endDate },
                company,
            });
        }

        // Fetch Meetings if the employee has read permission
        if (role.permissions.meeting.read || user.role === "CompanyAdmin") {
            data.meetings = await Meeting.find({
                scheduledTime: { $gte: startDate, $lte: endDate },
                company,
            });
        }

        // Fetch Leads if the employee has read permission
        if (role.permissions.leads.read || user.role === "CompanyAdmin") {
            data.leads = await Lead.find({
                "followUps.date": { $gte: startDate, $lte: endDate },
                company,
            }).populate("for source contact assignedTo company");
        }

        // Fetch Reminders
        data.reminders = await fetchReminders(startDate, endDate, user);

        return res.status(200).json({
            message: "Data fetched successfully",
            data,
        });

    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
