import { useState, useEffect } from "react";
import taskServices from "../../services/taskServices";

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ title: "", priority: "", dueDate: "" });
  const [modalTask, setModalTask] = useState(null);
  const [conclusion, setConclusion] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await taskServices.getMyTasks();
        if (Array.isArray(data.tasks)) {
          setTasks(data.tasks);
        } else {
          console.warn("⚠ Invalid Response:", data);
        }
      } catch (error) {
        console.error("❌ Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredTasks = tasks.filter(task =>
    (filters.title === "" || task.title.toLowerCase().includes(filters.title.toLowerCase())) &&
    (filters.priority === "" || task.priority === filters.priority) &&
    (filters.dueDate === "" || task.dueDate === filters.dueDate)
  );

  const openModal = (task) => {
    if (!task || !task._id) {
      console.error("❌ Task ID is missing!", task);
      return;
    }
    setModalTask({ ...task, id: task._id }); // ✅ _id ko id me map kar diya
    setConclusion(task.conclusion || "");
  };
  
  

  const closeModal = () => {
    setModalTask(null);
    setConclusion("");
  };

  const handleSubmit = async () => {
    if (!modalTask || !modalTask.id) {
      console.error("❌ Task ID is undefined!");
      return;
    }

    console.log("✅ Submitting conclusion for Task ID:", modalTask.id);

    try {
      const updatedTask = await taskServices.addConclusion(modalTask.id, conclusion);
      console.log("✅ API Response:", updatedTask);

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === modalTask.id
            ? { ...task, conclusion: updatedTask.conclusion, conclusionSubmitTime: new Date().toISOString() }
            : task
        )
      );

      console.log("✅ Updated tasks state:", tasks);
      closeModal();
    } catch (error) {
      console.error("❌ Error updating conclusion:", error);
    }
  };

  // useEffect(() => {
  //   console.log("🔍 modalTask Updated:", modalTask);
  // }, [modalTask]);

  

  return (
    <div className="p-4 px-10 max-w-5xl bg-white rounded-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Assigned Tasks</h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          name="title"
          placeholder="Filter by title"
          value={filters.title}
          onChange={handleFilterChange}
          className="p-2 border rounded w-full"
        />
        <select name="priority" value={filters.priority} onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <input
          type="date"
          name="dueDate"
          value={filters.dueDate}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
      </div>

      {filteredTasks.map(task => (
        <div key={task.id || task._id} className="border p-4 mb-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="text-gray-600">{task.description}</p>
          <p className="text-sm text-gray-500">Priority: {task.priority}</p>
          <p className="text-sm text-gray-500">Due Date: {task.dueDate}</p>

          {task.conclusion ? (
            <div className="mt-2">
              <p className="text-green-600 font-semibold">Conclusion: {task.conclusion}</p>
              <p className="text-gray-500 text-sm">
                Submitted on: {new Date(task.conclusionSubmitTime).toLocaleString()}
              </p>
              <button
                className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={() => openModal(task)}
              >
                Edit Conclusion
              </button>
            </div>
          ) : (
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => openModal(task)}
            >
              Submit Conclusion
            </button>
          )}
        </div>
      ))}

      {modalTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500/40 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold">{modalTask.title}</h3>
            <textarea
              className="w-full p-2 border rounded mt-2"
              placeholder="Enter your conclusion..."
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 bg-gray-500 text-white rounded mr-2" onClick={closeModal}>Cancel</button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTasks;
