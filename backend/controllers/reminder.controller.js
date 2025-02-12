const Reminder = require("../models/reminde.model");

// Add a new reminder
exports.addReminder = async (req, res) => {
    try {
        const { type, dateTime, days, message } = req.body;

        if (!type || !message) {
            return res.status(400).json({ message: "Type, message, and user are required" });
        }

        if (type === "Weekly" && (!days || days.length === 0)) {
            return res.status(400).json({ message: "Days are required for weekly reminders" });
        }

        if (type !== "Daily" && type !== "Weekly" && !dateTime) {
            return res.status(400).json({ message: "DateTime is required for non-daily/weekly reminders" });
        }

        const newReminder = new Reminder({ type, dateTime, days, message, user: req.user._id });
        await newReminder.save();

        return res.status(201).json({ message: "Reminder added successfully", reminder: newReminder });
    } catch (error) {
        console.error("Error adding reminder:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Delete a reminder by ID
exports.deleteReminder = async (req, res) => {
    try {
        const { reminderId } = req.params;

        if (!reminderId) {
            return res.status(400).json({ message: "Reminder ID is required" });
        }

        const reminder = await Reminder.findOneAndDelete({ _id: reminderId, user: req.user._id });
        if (!reminder) {
            return res.status(404).json({ message: "Reminder not found" });
        }

        return res.status(200).json({ message: "Reminder deleted successfully" });
    } catch (error) {
        console.error("Error deleting reminder:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.getRemindersByDateRange = async (req, res) => {
    try {
        const { startDateTime, endDateTime } = req.body;

        if (!startDateTime || !endDateTime) {
            return res.status(400).json({ message: "Start and end datetime are required" });
        }

        const reminders = await this.fetchReminders(startDateTime, endDateTime, req.user._id);

        return res.status(200).json({
            message: "Reminders fetched successfully",
            reminders
        });

    } catch (error) {
        console.error("Error fetching reminders:", error);
        return res.status(500).json({ message: error.message });
    }
};

// this is not controller This is function
exports.fetchReminders = async (startDateTime, endDateTime, userId) => {
    try {
        const start = new Date(startDateTime);
        const end = new Date(endDateTime);

        if (start > end) {
            throw new Error("Start datetime must be before end datetime");
        }

        // Fetch one-time reminders in the date range
        const fixedReminders = await Reminder.find({
            type: "Once",
            dateTime: { $gte: start, $lte: end }, user: userId
        });

        // Fetch all recurring reminders
        const dailyReminders = await Reminder.find({ type: "Daily", user: userId });
        const weeklyReminders = await Reminder.find({ type: "Weekly", user: userId });
        const monthlyReminders = await Reminder.find({ type: "Monthly", user: userId });
        const yearlyReminders = await Reminder.find({ type: "Yearly", user: userId });

        let allReminders = [...fixedReminders];

        // 📌 **Generate Daily Reminders**
        let tempDate = new Date(start);
        while (tempDate <= end) {
            dailyReminders.forEach(reminder => {
                allReminders.push({
                    ...reminder.toObject(),
                    dateTime: new Date(tempDate.setHours(9, 0, 0, 0)), // Set to 09:00 AM
                    generated: true
                });
            });
            tempDate.setDate(tempDate.getDate() + 1);
        }

        // 📌 **Generate Weekly Reminders**
        weeklyReminders.forEach(reminder => {
            let weekDate = new Date(start);
            while (weekDate <= end) {
                if (reminder.days.includes(weekDate.getDay())) {
                    allReminders.push({
                        ...reminder.toObject(),
                        dateTime: new Date(weekDate.setHours(9, 0, 0, 0)), // Set to 09:00 AM
                        generated: true
                    });
                }
                weekDate.setDate(weekDate.getDate() + 1);
            }
        });

        // 📌 **Generate Monthly Reminders**
        monthlyReminders.forEach(reminder => {
            let monthDate = new Date(start);
            while (monthDate <= end) {
                if (monthDate.getDate() === new Date(reminder.dateTime).getDate()) {
                    allReminders.push({
                        ...reminder.toObject(),
                        dateTime: new Date(monthDate.setHours(9, 0, 0, 0)), // Set to 9:00 AM
                        generated: true
                    });
                }
                monthDate.setDate(monthDate.getDate() + 1);
            }
        });

        // 📌 **Generate Yearly Reminders**
        yearlyReminders.forEach(reminder => {
            let yearDate = new Date(start);
            while (yearDate <= end) {
                if (
                    yearDate.getDate() === new Date(reminder.dateTime).getDate() &&
                    yearDate.getMonth() === new Date(reminder.dateTime).getMonth()
                ) {
                    allReminders.push({
                        ...reminder.toObject(),
                        dateTime: new Date(yearDate.setHours(9, 0, 0, 0)), // Set to 9:00 AM
                        generated: true
                    });
                }
                yearDate.setDate(yearDate.getDate() + 1);
            }
        });

        // Sort by dateTime
        allReminders.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

        return allReminders;
    } catch (error) {
        throw error;
    }
};


