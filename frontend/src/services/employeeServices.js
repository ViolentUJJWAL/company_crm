import api from "./api";

// ✅ Fetch all employees
export const getAllEmployees = async () => {
  try {
    const response = await api.get("/company/employee/all");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// ✅ Fetch verified employees
export const getVerifiedEmployees = async () => {
  try {
    const response = await api.get("/company/employee/verify");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// ✅ Fetch unverified employees
export const getUnverifiedEmployees = async () => {
  try {
    const response = await api.get("/company/employee/unverify");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// ✅ Fetch employee by ID
export const getEmployeeById = async (employeeId) => {
  try {
    const response = await api.get(`/company/employee/profile/${employeeId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// ✅ Verify Employee and Assign Role
export const verifyEmployee = async (employeeId, roleId) => {
  try {
    const response = await api.post("/company/employee/verification", {
      employeeId,
      roleId,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
