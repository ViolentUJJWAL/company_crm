import api from "./api";
// Create a new meeting
export const createMeeting = async (meetingData) => {
  try {
    const response = await api.post("/meeting/create", meetingData);
    return response.data;
  } catch (error) {
    console.error("Error creating meeting:", error);
    throw error;
  }
};

// Update meeting details
export const updateMeeting = async (meetingId, updatedData) => {
  try {
    const response = await api.put(
      `/meeting/update/${meetingId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating meeting:", error);
    throw error;
  }
};

// Change meeting status
export const changeMeetingStatus = async (meetingId, statusData) => {
  try {
    const response = await api.patch(
      `/meeting/status/${meetingId}`,
      statusData
    );
    return response.data;
  } catch (error) {
    console.error("Error changing meeting status:", error);
    throw error;
  }
};

// Get meetings with filters
export const getMeetings = async (filters) => {
  try {
    const response = await api.get("/meeting/list", { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching meetings:", error);
    throw error;
  }
};

// Send meeting reminder
export const sendMeetingReminder = async (meetingId) => {
  try {
    const response = await api.get(`/meeting/send-reminder/${meetingId}`);
    return response.data;
  } catch (error) {
    console.error("Error sending meeting reminder:", error);
    throw error;
  }
};
