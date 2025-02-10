import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Plus, Edit2, Filter, X , Clock, User, UserCheck, Flag, CheckCircle, AlertCircle } from 'lucide-react';
import taskServices from "../../services/taskServices";
import { getVerifiedEmployees } from "../../services/employeeServices";

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const TaskAssign = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({
    assignedBy: "",
    assignedTo: "",
    startDate: "",
    endDate: "",
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assignedTo: "",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false); // New state for loading

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await taskServices.getAllTasks(filters);
      console.log("response", response);
      setTasks(response.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await getVerifiedEmployees();
      console.log("response", response.data);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting
    try {
      if (selectedTask) {
        await taskServices.updateTask(selectedTask._id, formData);
      } else {
        await taskServices.createTask(formData);
      }
      setIsModalOpen(false);
      fetchTasks();
      resetForm();
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setLoading(false); // Reset loading state after submission
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "Medium",
      assignedTo: "",
      dueDate: "",
    });
    setSelectedTask(null);
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      assignedTo: task.assignedTo._id,
      dueDate: format(new Date(task.dueDate), "yyyy-MM-dd"),
    });
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md mb-6 p-4">
        <div className="flex items-center mb-4">
          <Filter className="w-4 h-4 mr-2" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned To
            </label>
            <select
              value={filters.assignedTo}
              onChange={(e) =>
                setFilters({ ...filters, assignedTo: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select employee</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.user.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            />
          </div>
          <button
            onClick={fetchTasks}
            className="mt-4 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {task.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {task.priority.charAt(0).toUpperCase() +
                        task.priority.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{task.description}</p>
                </div>
                <button
                  onClick={() => handleEdit(task)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <Edit2 className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Assigned By</p>
                    <p className="font-medium text-gray-800">
                      {task.assignedBy.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Assigned To</p>
                    <p className="font-medium text-gray-800">
                      {task.assignedTo.user}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="font-medium text-gray-800">
                      {format(new Date(task.dueDate), "PP")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="flex items-center gap-1">
                      {task.conclusion ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                      )}
                      <p className="font-medium text-gray-800">
                        {task.conclusion ? "Completed" : "Pending"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {task.conclusion && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-sm font-medium text-gray-700">
                      Conclusion
                    </span>
                    <p className="text-gray-600 mt-1">{task.conclusion}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTask ? "Edit Task" : "Create New Task"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border rounded-lg p-2"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign To
            </label>
            <select
              value={formData.assignedTo}
              onChange={(e) =>
                setFormData({ ...formData, assignedTo: e.target.value })
              }
              className="w-full border rounded-lg p-2"
              required
            >
              <option value="">Select employee</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.user.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            disabled={loading} // Disable button when loading
          >
            {loading
              ? selectedTask
                ? "Updating..."
                : "Submitting..."
              : selectedTask
              ? "Update Task"
              : "Create Task"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default TaskAssign;
