import api from "./api";

const handleRequest = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};

export const createLead = async (leadData) => {
  return handleRequest(api.post("/lead/create", leadData));
};

export const updateLead = async (id, leadData) => {
  return handleRequest(api.put(`/lead/update/${id}`, leadData));
};

export const changeLeadStatus = async (id, status) => {
  return handleRequest(api.patch(`/lead/status/${id}`, { status }));
};

export const getLeads = async (filters) => {
  return handleRequest(api.get("/lead/list", { params: filters }));
};

export const getLeadById = async (id) => {
  return handleRequest(api.get(`/lead/${id}`));
};

export const addFollowUp = async (id, conclusion) => {
  return handleRequest(api.post(`/lead/follow-up/add/${id}`, { conclusion }));
};

export const updateFollowUp = async (id, followUpId, conclusion) => {
  return handleRequest(
    api.put(`/lead/follow-up/update/${id}/${followUpId}`, { conclusion })
  );
};
