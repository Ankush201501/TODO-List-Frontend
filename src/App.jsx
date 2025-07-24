import { useEffect, useState } from "react";
import { SquarePlus } from "lucide-react";
import "./App.css";

function App() {
  const [newTaskInput, setNewTaskInput] = useState(""); //naye task ka input
  const [tasks, setTasks] = useState([]);
  const [allUsersTasks, setAllUsersTasks] = useState([]);
  const [userName, setUserName] = useState("");

  // ✅ Fetch all users' tasks from backend
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8000/users/");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      const transformed = data.map((user) => ({
        id: user.id,
        user: user.name,
        tasks: user.task || [],
      }));
      setAllUsersTasks(transformed);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      // Handle error in UI, e.g., toast or message
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Add a new task to current task list (local)
  const addTask = () => {
    setTasks([...tasks, newTaskInput.trim()]);
    setNewTaskInput("");
  };

  // ✅ Submit task to backend as a new user
  const submitTasks = async () => {
    const newUser = {
      name: userName.trim(),
      task: tasks,
    };

    const res = await fetch("http://localhost:8000/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    const data = await res.json();
    setAllUsersTasks([
      ...allUsersTasks,
      { id: data.id, user: data.name, tasks: data.task || [] },
    ]);
    setTasks([]);
    setUserName("");
  };

  // ✅ Delete a user from backend
  const deleteUserTasks = async (userIdToDelete) => {
    await fetch(`http://localhost:8000/users/${userIdToDelete}`, {
      method: "DELETE",
    });
    setAllUsersTasks(allUsersTasks.filter((u) => u.id !== userIdToDelete));
  };

  // ✅ Delete a task from current new user (local only)
  const deleteTaskFromCurrentUser = (currentTask) => {
    setTasks(tasks.filter((entry) => entry !== currentTask));
  };

  // ✅ Update a user's task list by removing a specific task
  const deleteExistUserTask = async (entry, removeTask) => {
    const newTaskList = entry.tasks.filter((t) => t !== removeTask);
    if (newTaskList.length === 0) {
      await deleteUserTasks(entry.id);
      return;
    }

    console.log("new task list", newTaskList);
    // const updatedTaskDict = {};
    // newTaskList.forEach((task, i) => {
    //   updatedTaskDict[i + 1] = task;
    // });

    const updatedUser = {
      name: entry.user,
      task: newTaskList,
    };

    console.log("Updated User:", updatedUser);
    const res = await fetch(`http://localhost:8000/users/${entry.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    });

    const data = await res.json();
    const updatedAll = allUsersTasks.map((u) =>
      u.id === data.id ? { id: data.id, user: data.name, tasks: data.task } : u
    );

    setAllUsersTasks(updatedAll);
  };

  return (
    <div className="app w-screen h-screen">
      <div className="border-1 rounded-lg p-4 shadow-md border-gray-300 w-[50%] mx-auto mt-3">
        <h1 className="text-2xl font-bold text-center text-gray-700">
          To-Do List
        </h1>

        <div className="input_section flex flex-col items-center ">
          <input
            type="text"
            placeholder="Enter user name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="text-center px-2 border border-gray-300 rounded-lg m-2 focus:outline-blue-500 w-[16rem] mr-8"
          />
          <div className="flex justify-between">
            <input
              type="text"
              placeholder="Enter a task"
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              className="text-center px-2 border border-gray-300 rounded-lg m-2 focus:outline-blue-500 w-[16rem]"
            />
            <button
              onClick={addTask}
              className={`transition-colors ${
                newTaskInput.trim() === ""
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={newTaskInput.trim() === ""}
            >
              <SquarePlus className="text-green-500" />
            </button>
          </div>

          <ul>
            {tasks.map((entry) => (
              <li key={entry}>
                {entry}{" "}
                <button onClick={() => deleteTaskFromCurrentUser(entry)}>
                  ❌
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={submitTasks}
            className={`px-3 py-1 border rounded border-blue-500 text-blue-700 hover:bg-blue-100 transition-colors ${
              tasks.length === 0 || userName.trim() === ""
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={tasks.length === 0 || userName.trim() === ""}
          >
            Submit
          </button>
        </div>
      </div>

      <ul className="task-list mt-6 grid grid-cols-4 gap-2">
        {allUsersTasks.map((entry) => (
          <li
            key={entry.id}
            className="mb-4 border-1 border-gray-300 p-2 rounded-md shadow-sm m-3"
          >
            <div className="flex justify-end">
              <button
                onClick={() => deleteUserTasks(entry.id)}
                className="text-red-500"
              >
                ❌
              </button>
            </div>
            <div className="font-semibold text-gray-800 mb-3 text-center underline underline-offset-8">
              {entry.user}'s Tasks:
            </div>
            <ul className="list-disc list-inside text-gray-600 mb-2 text-start px-4">
              {entry.tasks.map((t, idx) => (
                <li
                  key={idx}
                  className="flex justify-between group hover:bg-gray-100 px-2 py-1 rounded"
                >
                  <div>{t}</div>
                  <button
                    className="hidden group-hover:block"
                    onClick={() => deleteExistUserTask(entry, t)}
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
