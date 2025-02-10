import React, { useState, useEffect } from "react";
import { todoServices } from "../../services/todoServices";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDoneModalOpen, setIsDoneModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
  });
  const [conclusion, setConclusion] = useState("");
  const [filters, setFilters] = useState({
    priority: "",
    dueDate: "",
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [todos, filters]);

  const fetchTodos = async () => {
    try {
      const response = await todoServices.getTodos();
      const sortedTodos = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ); // Sort by newest first
      setTodos(sortedTodos);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTodo) {
        await todoServices.updateTodo(selectedTodo._id, formData);
      } else {
        await todoServices.createTodo(formData);
      }
      setIsCreateModalOpen(false);
      setSelectedTodo(null);
      resetForm();
      fetchTodos();
    } catch (error) {
      console.error("Error saving todo:", error);
    }
  };

  const handleDone = async (todoId) => {
    try {
      await todoServices.markTodoDone(todoId, conclusion);
      setIsDoneModalOpen(false);
      setConclusion("");
      fetchTodos();
    } catch (error) {
      console.error("Error marking todo as done:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      priority: "Medium",
    });
  };

  const openUpdateModal = (todo) => {
    setSelectedTodo(todo);
    setFormData({
      title: todo.title,
      description: todo.description,
      dueDate: new Date(todo.dueDate).toISOString().split("T")[0],
      priority: todo.priority,
    });
    setIsCreateModalOpen(true);
  };

  const applyFilters = () => {
    let filtered = [...todos];

    if (filters.priority) {
      filtered = filtered.filter((todo) => todo.priority === filters.priority);
    }

    if (filters.dueDate) {
      filtered = filtered.filter(
        (todo) =>
          new Date(todo.dueDate).toISOString().split("T")[0] === filters.dueDate
      );
    }

    setFilteredTodos(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Todo List</h1>
          <button
            onClick={() => {
              resetForm();
              setIsCreateModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Todo
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={filters.dueDate}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {filteredTodos.map((todo) => (
            <div
              key={todo._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {todo.title}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium
                  ${
                    todo.priority === "High"
                      ? "bg-red-100 text-red-800"
                      : todo.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {todo.priority}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{todo.description}</p>
              <div className="text-sm text-gray-500 mb-4">
                Due: {new Date(todo.dueDate).toLocaleDateString()}
              </div>
              {todo.conclusion ? (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Conclusion:</span>{" "}
                    {todo.conclusion}
                  </p>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setSelectedTodo(todo);
                      setIsDoneModalOpen(true);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => openUpdateModal(todo)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Update
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Create/Update Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-gray-500/40 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6">
                {selectedTodo ? "Update Todo" : "Create Todo"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {selectedTodo ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setSelectedTodo(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Done Modal */}
        {isDoneModalOpen && (
          <div className="fixed inset-0 bg-gray-500/40 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6">Mark Todo as Done</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conclusion
                  </label>
                  <textarea
                    value={conclusion}
                    onChange={(e) => setConclusion(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleDone(selectedTodo._id)}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => {
                      setIsDoneModalOpen(false);
                      setSelectedTodo(null);
                      setConclusion("");
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Todo;
