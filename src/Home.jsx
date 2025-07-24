import { useEffect, useState } from "react";
import { SquarePlus } from "lucide-react";
import "./App.css";

function Home({ authToken }) {
  const [newTaskInput, setNewTaskInput] = useState(""); // new task input
  const [tasks, setTasks] = useState([]); // current user tasks
  const [allUsersTasks, setAllUsersTasks] = useState([]); // all user task data
  const [userName, setUserName] = useState("");

  // ✅ Fetch all users and their tasks
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8000/users/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const transformed = data.map((user) => ({
        id: user.id,
        user: user.name,
        tasks: user.task || [],
      }));
      setAllUsersTasks(transformed);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addTask = () => {
    setTasks([...tasks, newTaskInput.trim()]);
    setNewTaskInput("");
  };

  // ✅ Submit new user and their tasks to backend
  const submitTasks = async () => {
    const newUser = {
      name: userName.trim(),
      task: tasks,
    };

    const res = await fetch("http://localhost:8000/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
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
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    setAllUsersTasks(allUsersTasks.filter((u) => u.id !== userIdToDelete));
  };

  // ✅ Remove task locally from new user task list
  const deleteTaskFromCurrentUser = (currentTask) => {
    setTasks(tasks.filter((entry) => entry !== currentTask));
  };

  // ✅ Remove task from existing user's task list
  const deleteExistUserTask = async (entry, removeTask) => {
    const newTaskList = entry.tasks.filter((t) => t !== removeTask);

    if (newTaskList.length === 0) {
      await deleteUserTasks(entry.id);
      return;
    }

    const updatedUser = {
      name: entry.user,
      task: newTaskList,
    };

    const res = await fetch(`http://localhost:8000/users/${entry.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
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

        <div className="input_section flex flex-col items-center">
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

export default Home;
