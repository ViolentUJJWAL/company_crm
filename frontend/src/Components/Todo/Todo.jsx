import React, { useState, useEffect } from "react";
import { todoServices } from "../../services/todoServices";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDoneModalOpen, setIsDoneModalOpen] = useState(false);
  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
  });
  const [conclusion, setConclusion] = useState("");
  const [remark, setRemark] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await todoServices.getTodos();
      console.log('Todos', response.data)
      const sortedTodos = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
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
      await todoServices.createTodo(formData);
      setIsCreateModalOpen(false);
      resetForm();
      fetchTodos();
    } catch (error) {
      console.error("Error saving todo:", error);
    }
  };

  const handleDone = async (todoId) => {
    try {
      await todoServices.updateTodo(todoId, {
        conclusion,
        status: "Conclusion",
      });
      setIsDoneModalOpen(false);
      setConclusion("");
      setSelectedTodo(null);
      fetchTodos();
    } catch (error) {
      console.error("Error adding conclusion:", error);
    }
  };

  const handleRemark = async (todoId) => {
    try {
      await todoServices.updateTodo(todoId, {
        remark,
        status: "Remark",
      });
      setIsRemarkModalOpen(false);
      setRemark("");
      setSelectedTodo(null);
      fetchTodos();
    } catch (error) {
      console.error("Error adding remark:", error);
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

  const TodoCard = ({ todo, onDone, onRemark }) => (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{todo.title}</h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
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
      <p className="text-sm text-gray-600 mb-2">{todo.description}</p>
      <div className="text-xs text-gray-500 mb-2">
        Due: {new Date(todo.dueDate).toLocaleDateString()}
      </div>
      {todo.conclusion && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
          <p className="text-gray-600">
            <span className="font-medium">Conclusion:</span> {todo.conclusion}
          </p>
        </div>
      )}
      {todo.remark && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
          <p className="text-gray-600">
            <span className="font-medium">Remark:</span> {todo.remark}
          </p>
        </div>
      )}
      {onDone && (
        <button
          onClick={onDone}
          className="mt-2 w-full bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          Add Conclusion
        </button>
      )}
      {onRemark && (
        <button
          onClick={onRemark}
          className="mt-2 w-full bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
        >
          Add Remark
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            ToDo / Conclusion
          </h1>
          <div className="flex items-center space-x-4">
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              className="border rounded px-3 py-1"
            >
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* ToDo Column */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 flex justify-between items-center">
              TO-DO
            </h2>
            {todos
              .filter((todo) => !todo.conclusion && !todo.remark)
              .map((todo) => (
                <TodoCard
                  key={todo._id}
                  todo={todo}
                  onDone={() => {
                    setSelectedTodo(todo);
                    setIsDoneModalOpen(true);
                  }}
                />
              ))}
          </div>

          {/* Conclusion Column */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 flex justify-between items-center">
              Conclusion
            </h2>
            {todos
              .filter((todo) => todo.conclusion && !todo.remark)
              .map((todo) => (
                <TodoCard
                  key={todo._id}
                  todo={todo}
                  onRemark={() => {
                    setSelectedTodo(todo);
                    setIsRemarkModalOpen(true);
                  }}
                />
              ))}
          </div>

          {/* Remarks Column */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 flex justify-between items-center">
              Remarks
            </h2>
            {todos
              .filter((todo) => todo.remark)
              .map((todo) => (
                <TodoCard key={todo._id} todo={todo} />
              ))}
          </div>
        </div>

        {/* Create Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Create Todo</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Conclusion Modal */}
        {isDoneModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Add Conclusion</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Conclusion
                  </label>
                  <textarea
                    value={conclusion}
                    onChange={(e) => setConclusion(e.target.value)}
                    className="w-full border rounded p-2"
                    rows="3"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleDone(selectedTodo._id)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => {
                      setIsDoneModalOpen(false);
                      setSelectedTodo(null);
                      setConclusion("");
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Remark Modal */}
        {isRemarkModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Add Remark</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Remark
                  </label>
                  <textarea
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    className="w-full border rounded p-2"
                    rows="3"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleRemark(selectedTodo._id)}
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => {
                      setIsRemarkModalOpen(false);
                      setSelectedTodo(null);
                      setRemark("");
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
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
