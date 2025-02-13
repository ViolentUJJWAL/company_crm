import { useState, useEffect, useMemo, useCallback } from "react";
import { todoServices } from "../../services/todoServices";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  // const [dateTodos, setDateTodos] = useState({});

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [conclusion, setConclusion] = useState("");
  const [remark, setRemark] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [isAddingConclusion, setIsAddingConclusion] = useState(false);
  const [isAddingRemark, setIsAddingRemark] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
  });

  const hasIncompleteTodos = (date) => {
    return todos.some(
      (todo) =>
        new Date(todo.dueDate).toDateString() === date.toDateString() &&
        (!todo.conclusion || !todo.remark)
    );
  };

  const handleAddConclusion = async (todoId) => {
    try {
      await todoServices.updateTodo(todoId, {
        conclusion,
        status: "Conclusion",
      });
      setConclusion("");
      setIsAddingConclusion(false);
      setEditingTodoId(null);
      fetchSelectedDateTodo();
    } catch (error) {
      console.error("Error adding conclusion:", error);
    }
  };

  const handleAddRemark = async (todoId) => {
    try {
      await todoServices.updateTodo(todoId, {
        remark,
        status: "Remark",
      });
      setRemark("");
      setIsAddingRemark(false);
      setEditingTodoId(null);
      fetchSelectedDateTodo();
    } catch (error) {
      console.error("Error adding remark:", error);
    }
  };

  useEffect(() => {
    fetchSelectedDateTodo();
  }, [selectedDate]);

  const fetchSelectedDateTodo = async () => {
    try {
      console.log(selectedDate);
      const formattedDateTodo = selectedDate.toISOString().split("T")[0];
      const response = await todoServices.getTodos(
        `startDate=${formattedDateTodo}&endDate=${formattedDateTodo}`
      );
      console.log("response.data", response.data);
      setTodos(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const DateCarousel = () => {
    const [dateTodos, setDateTodos] = useState({});

    const getDates = useMemo(() => {
      const dates = [];
      for (let i = -7; i <= 7; i++) {
        const date = new Date(selectedDate);
        date.setDate(selectedDate.getDate() + i);
        dates.push(date);
      }
      return dates;
    }, [selectedDate]);

    const getTodoCountForDate = (date) => {
      const formattedDate = date.toISOString().split("T")[0];
      return dateTodos[formattedDate];
    };

    // Fetch todos for all visible dates
    useEffect(() => {
      fetchTodosForDates();
    }, []);

    const fetchTodosForDates = async () => {
      const dates = getDates;
      let todosData = {};

      await Promise.all(
        dates.map(async (date) => {
          const formattedDate = date.toISOString().split("T")[0];
          try {
            const response = await todoServices.getTodos(
              `startDate=${formattedDate}&endDate=${formattedDate}`
            );
            todosData[formattedDate] = response.data.length;
          } catch (error) {
            console.error(`Error fetching todos for ${formattedDate}`, error);
            todosData[formattedDate] = 0;
          }
        })
      );
      console.log(todosData);
      setDateTodos(todosData);
    };

    return (
      <div className="flex items-center justify-center space-x-4 mb-6">
        <button
          onClick={() => {
            const newDate = new Date(selectedDate);
            newDate.setDate(selectedDate.getDate() - 1);
            setSelectedDate(newDate);
          }}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex space-x-3 overflow-x-auto py-2">
          {getDates.map((date, index) => {
            const formattedDate = date.toISOString().split("T")[0];
            const todoCount = getTodoCountForDate(date);
            const hasIncomplete = hasIncompleteTodos(date);

            return (
              <button
                key={index}
                onClick={() => setSelectedDate(date)}
                className="relative group"
              >
                <div
                  className={`px-6 py-3 rounded-lg flex flex-col items-center transition-all
                  ${
                    date.toDateString() === selectedDate.toDateString()
                      ? "bg-blue-600 text-white"
                      : hasIncomplete
                      ? "bg-red-50 border border-red-200"
                      : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-sm font-medium">
                    {date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>

                  {/* Todo Count Circle */}
                  {todoCount > 0 && (
                    <div
                      className={`absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium
                      ${
                        date.toDateString() === selectedDate.toDateString()
                          ? "bg-red-500 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {todoCount}
                    </div>
                  )}

                  {/* Todos Count */}
                  <div
                    className={`text-xs mt-1 font-medium
                    ${
                      date.toDateString() === selectedDate.toDateString()
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  ></div>
                </div>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => {
            const newDate = new Date(selectedDate);
            newDate.setDate(selectedDate.getDate() + 1);
            setSelectedDate(newDate);
          }}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Todo Manager</h1>
          <button
            onClick={() => setFormModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Create Todo
          </button>
        </div>

        <DateCarousel />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Task Details
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-1/4">
                  Conclusion
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-1/4">
                  Remark
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {todos.map((todo) => (
                <tr
                  key={todo._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-start justify-between">
                        <span className="font-medium text-gray-900">
                          {todo.title}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            todo.priority === "High"
                              ? "bg-red-100 text-red-700"
                              : todo.priority === "Medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {todo.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {todo.description}
                      </p>
                      <span className="text-xs text-gray-500">
                        Due: {new Date(todo.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {editingTodoId === todo._id && isAddingConclusion ? (
                      <div className="space-y-2">
                        <textarea
                          value={conclusion}
                          onChange={(e) => setConclusion(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows="3"
                          placeholder="Enter conclusion..."
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAddConclusion(todo._id)}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setIsAddingConclusion(false);
                              setEditingTodoId(null);
                              setConclusion("");
                            }}
                            className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {todo.conclusion ? (
                          <p className="text-sm text-gray-600">
                            {todo.conclusion}
                          </p>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingTodoId(todo._id);
                              setIsAddingConclusion(true);
                            }}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                          >
                            Add Conclusion
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingTodoId === todo._id && isAddingRemark ? (
                      <div className="space-y-2">
                        <textarea
                          value={remark}
                          onChange={(e) => setRemark(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          rows="3"
                          placeholder="Enter remark..."
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAddRemark(todo._id)}
                            className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-purple-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setIsAddingRemark(false);
                              setEditingTodoId(null);
                              setRemark("");
                            }}
                            className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {todo.remark ? (
                          <p className="text-sm text-gray-600">{todo.remark}</p>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingTodoId(todo._id);
                              setIsAddingRemark(true);
                            }}
                            className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-purple-700 transition-colors"
                          >
                            Add Remark
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {todos.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No todos found for this date
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {formModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Create Todo</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await todoServices.createTodo(formData);
                    setFormModalOpen(false);
                    setFormData({
                      title: "",
                      description: "",
                      dueDate: "",
                      priority: "Medium",
                    });
                    fetchSelectedDateTodo();
                  } catch (error) {
                    console.error("Error creating todo:", error);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormModalOpen(false);
                      setFormData({
                        title: "",
                        description: "",
                        dueDate: "",
                        priority: "Medium",
                      });
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Todo;
