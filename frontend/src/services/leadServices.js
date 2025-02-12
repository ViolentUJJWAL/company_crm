// services/leadService.js
import api from "./api"; // Import the Axios instance from api.js

const leadServices = {
  // ✅ Create a Lead
  createLead: async (leadData) => {
    try {
      const response = await api.post("/lead/create", leadData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // ✅ Update a Lead
  updateLead: async (id, leadData) => {
    try {
      const response = await api.put(`/lead/update/${id}`, leadData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // ✅ Change Lead Status
  changeLeadStatus: async (id, statusId) => {
    try {
      const response = await api.patch(`/lead/status/${id}`, { statusId });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // ✅ Get All Leads (with optional filters)
  getLeads: async (filters = {}) => {
    try {
      const response = await api.get("/lead/list", { params: filters });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // ✅ Get Lead by ID
  getLeadById: async (id) => {
    try {
      const response = await api.get(`/lead/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // ✅ Add Follow-Up to a Lead
  addFollowUp: async (id, conclusion) => {
    try {
      const response = await api.post(`/lead/follow-up/add/${id}`, {
        conclusion,
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // ✅ Update Follow-Up for a Lead
  updateFollowUp: async (id, followUpId, conclusion) => {
    try {
      const response = await api.put(
        `/lead/follow-up/update/${id}/${followUpId}`,
        { conclusion }
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default leadServices;
