import React, { useState, useEffect } from "react";
import {
  getUnverifiedEmployees,
  verifyEmployee,
} from "../../services/employeeServices";
import { roleService } from "../../services/roleServices";

const EmployeeVerification = () => {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [verifying, setVerifying] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [employeesResponse, rolesResponse] = await Promise.all([
        getUnverifiedEmployees(),
        roleService.getActiveRoles(),
      ]);

      if (employeesResponse.data) {
        setEmployees(employeesResponse.data);
      }

      if (rolesResponse.data) {
        setRoles(rolesResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (employeeId, roleId) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [employeeId]: roleId,
    }));
  };

  const handleVerify = async (employeeId) => {
    const roleId = selectedRoles[employeeId];
    if (!roleId) {
      alert("Please select a role first");
      return;
    }

    setVerifying((prev) => ({ ...prev, [employeeId]: true }));
    try {
      await verifyEmployee(employeeId, roleId);
      // Remove verified employee from the list
      setEmployees((prev) => prev.filter((emp) => emp._id !== employeeId));
      alert("Employee verified successfully");
    } catch (error) {
      console.error("Verification error:", error);
      alert("Failed to verify employee");
    } finally {
      setVerifying((prev) => ({ ...prev, [employeeId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Employee Verification
        </h1>
        <p className="mt-2 text-gray-600">
          Verify employees and assign their roles
        </p>
      </div>

      {employees.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No unverified employees found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Employee
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {employee.user.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {employee.user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {employee.user.email}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      onChange={(e) =>
                        handleRoleChange(employee._id, e.target.value)
                      }
                      value={selectedRoles[employee._id] || ""}
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role._id} value={role._id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleVerify(employee._id)}
                      disabled={
                        verifying[employee._id] || !selectedRoles[employee._id]
                      }
                      className={`px-4 py-2 rounded-md text-sm font-medium text-white 
                        ${
                          verifying[employee._id] ||
                          !selectedRoles[employee._id]
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                      {verifying[employee._id] ? "Verifying..." : "Verify"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeVerification;
