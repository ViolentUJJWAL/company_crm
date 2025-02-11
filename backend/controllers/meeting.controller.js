const Lead = require("../models/lead.model");
const Meeting = require("../models/meeting.model");


// Create Meeting
exports.createMeeting = async (req, res) => {
  try {
    const { title, participants, forLead, scheduledTime, agenda, addParticipants } = req.body;

    if (!title || !participants || !scheduledTime || !agenda) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    if (!Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ message: "At least one employee must be added to the meeting" });
    }

    if (!await Lead.findOne({ _id: forLead, company: req.user.company })) return res.status(400).json({ message: "Lead not found." })

    const meeting = new Meeting({
      title,
      participants,
      forLead,
      scheduledTime,
      agenda,
      addParticipants,
      company: req.user.company,
    });

    await meeting.save();

    // If meeting is related to a lead, add a follow-up entry
    if (forLead) {
      const sequence = await getNextFollowUpSequence(forLead);
      await Lead.findByIdAndUpdate(forLead, {
        $push: {
          followUps: {
            sequence,
            conclusion: `Meeting for ${title}`,
            meeting: meeting._id,
          },
        },
      });
    }

    res.status(201).json({ message: "Meeting created successfully", meeting });
  } catch (error) {
    console.error("Error creating meeting:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Update Meeting
exports.updateMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, participants, forLead, scheduledTime, agenda, addParticipants } = req.body;

    if (!title || !participants || !scheduledTime || !agenda) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    if (forLead) {
      if (!await Lead.findOne({ _id: forLead, company: req.user.company })) return res.status(400).json({ message: "Lead not found." })
    }

    const meeting = await Meeting.findOne({ _id: id, company: req.user.company });
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    meeting.title = title;
    meeting.participants = participants;
    meeting.forLead = forLead;
    meeting.scheduledTime = scheduledTime;
    meeting.agenda = agenda;
    meeting.addParticipants = addParticipants;

    await meeting.save();

    // If meeting is linked to a lead, update the follow-up entry
    if (forLead) {
      await Lead.updateOne(
        { _id: forLead, "followUps.meeting": id },
        {
          $set: {
            "followUps.$.conclusion": `Updated meeting for ${title}`,
          },
        }
      );
    }

    res.status(200).json({ message: "Meeting updated successfully", meeting });
  } catch (error) {
    console.error("Error updating meeting:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Change Meeting Status
exports.changeMeetingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "Complete", "Cancel"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const meeting = await Meeting.findOne({ _id: id, company: req.user.company });
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    meeting.meetingStatus = status;
    await meeting.save();

    res.status(200).json({ message: "Meeting status updated", meeting });
  } catch (error) {
    console.error("Error updating meeting status:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get Meetings with Filters
exports.getMeetings = async (req, res) => {
  try {
    const { participants, status, startDate, endDate } = req.query;
    let filters = { company: req.user.company };

    if (participants) filters.participants = { $in: participants };
    if (status) filters.meetingStatus = status;
    if (startDate && endDate) {
      filters.scheduledTime = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const meetings = await Meeting.find(filters).populate("participants forLead addParticipants company");

    if (meetings.length === 0) {
      return res.status(404).json({ message: "No meetings found with the provided filters" });
    }

    res.status(200).json({ meetings });
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Helper function to get next sequence for follow-up
const getNextFollowUpSequence = async (leadId) => {
  try {
    const lead = await Lead.findById(leadId);
    return lead ? lead.followUps.length + 1 : 1;
  } catch (error) {
    console.error("Error fetching follow-up sequence:", error);
    return 1;
  }
};


exports.sendMeetingReminder = async (req, res) => {
  try {
    const { meetingId } = req.params;
    if (!meetingId) return res.status(400).json({ message: "Meeting ID is required" });

    const meeting = await Meeting.findOne({ _id: meetingId, company: req.user.company })
      .populate({
        path: "participants",
        populate: { path: "user", select: "email name" },
      })
      .populate("addParticipants", "email name");

    if (!meeting) return res.status(404).json({ message: "Meeting not found" });

    if (meeting.meetingStatus !== "Pending") {
      return res.status(400).json({ message: "Only pending meetings can have reminders sent" });
    }

    const participantEmails = meeting.participants.map(p => p.email);
    const additionalEmails = meeting.addParticipants.map(c => c.email);
    const allEmails = [...new Set([...participantEmails, ...additionalEmails])];

    if (allEmails.length === 0) {
      return res.status(400).json({ message: "No participants found to send reminders" });
    }

    // Construct email content
    const subject = `Reminder: Upcoming Meeting - ${meeting.title}`;
    const message = `
          <h3>Meeting Reminder</h3>
          <p><strong>Title:</strong> ${meeting.title}</p>
          <p><strong>Scheduled Time:</strong> ${new Date(meeting.scheduledTime).toLocaleString()}</p>
          <p><strong>Agenda:</strong> ${meeting.agenda}</p>
          <p>Please be prepared for the meeting.</p>
      `;

    const chunkSize = 5;
    let sentCount = 0;
    let failedEmails = [];
    let remainingEmails = allEmails.length;

    // Start chunked response
    res.setHeader("Content-Type", "application/json");
    res.write(`{"message": "Sending meeting reminders", "totalEmails": ${allEmails.length}, "updates": [`); // Start JSON array

    for (let i = 0; i < allEmails.length; i += chunkSize) {
      const emailChunk = allEmails.slice(i, i + chunkSize);
      const results = await Promise.all(
        emailChunk.map(email => sendEmail(email, subject, message))
      );

      results.forEach((success, index) => {
        const email = emailChunk[index];
        remainingEmails--;

        if (success) {
          sentCount++;
          res.write(JSON.stringify({ email, status: "sent", remainingEmails }) + ","); // Stream response
        } else {
          failedEmails.push(email);
          res.write(JSON.stringify({ email, status: "failed", remainingEmails }) + ","); // Stream response
        }
      });
    }

    res.write(`], "sentCount": ${sentCount}, "failedCount": ${failedEmails.length}, "failedEmails": ${JSON.stringify(failedEmails)}}`); // Close JSON
    res.end(); // End response

  } catch (error) {
    console.error("Error sending meeting reminder:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
