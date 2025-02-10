const Meeting = require('../models/Meeting');
const Lead = require('../models/Lead');

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
            date: scheduledTime,
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

    const meeting = await Meeting.findOne({_id: id, company: req.user.company});
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
            "followUps.$.date": scheduledTime,
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

    const meeting = await Meeting.findOne({_id: id, company: req.user.company});
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
    const {participants, status, startDate, endDate } = req.query;
    let filters = {company: req.user.company};

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
