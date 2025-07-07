import { useEffect, useState } from "react";
import { SquarePlus } from "lucide-react";
import "./App.css";

function App() {
  const [newTaskInput, setNewTaskInput] = useState(""); // for current task input
  const [tasks, setTasks] = useState([]); // for current user's all tasks
  const [allUsersTasks, setAllUsersTasks] = useState([]); // for all users' tasks
  const [userName, setUserName] = useState("");

  // get item from local storage
  useEffect(() => {
    const storedTasks = localStorage.getItem("allUsersTasks");
    if (storedTasks) {
      setAllUsersTasks(JSON.parse(storedTasks));
    } else {
      setAllUsersTasks([]);
    }
  }, []);

  // Add a task to current user's task list
  const addTask = () => {
    setTasks([...tasks, newTaskInput.trim()]);
    setNewTaskInput("");
  };

  // create new user task
  const submitTasks = () => {
    const newUserTasks = {
      id: Date.now(),
      user: userName.trim(),
      tasks: tasks,
    };

    const updatedTasks = [...allUsersTasks, newUserTasks];
    setAllUsersTasks(updatedTasks);
    localStorage.setItem("allUsersTasks", JSON.stringify(updatedTasks));

    setTasks([]);
    setUserName("");
  };

  // Delete a user's entire task group
  const deleteUserTasks = (userNameToDelete) => {
    const updatedTasks = allUsersTasks.filter(
      (entry) => entry.user !== userNameToDelete
    );
    setAllUsersTasks(updatedTasks);
    localStorage.setItem("allUsersTasks", JSON.stringify(updatedTasks));
  };

  // delete current tasks from user
  const deleteTaskFromCurrentUser = (currentTask) => {
    setTasks(tasks.filter((entry) => entry !== currentTask));
  };

  // delete a particular task of existing user
  const deleteExistUserTask = (entry, removeTask) => {
    // Case 1: If only one task, remove the entire user entry
    if (entry.tasks.length === 1) {
      const updatedTaskEntry = allUsersTasks.filter(
        (userTask) => entry.user !== userTask.user
      );
      setAllUsersTasks(updatedTaskEntry);
      localStorage.setItem("allUsersTasks", JSON.stringify(updatedTaskEntry));
    } else {
      // Case 2: Remove only the selected task
      const updateAllUserTask = allUsersTasks.map((userTask) => {
        if (entry.user === userTask.user) {
          return {
            ...userTask,
            tasks: userTask.tasks.filter((task) => task !== removeTask),
          };
        }
        return userTask; // ← Fix here
      });
      setAllUsersTasks(updateAllUserTask);
      localStorage.setItem("allUsersTasks", JSON.stringify(updateAllUserTask));
    }
  };

  return (
    <div className="app w-screen h-screen ">
      <div className="border-1 rounded-lg p-4 shadow-md border-gray-300  w-[50%] mx-auto mt-3">
        <h1 className="text-2xl font-bold text-center text-gray-700">
          To-Do List
        </h1>

        <div className="input_section flex flex-col items-center ">
          <input
            type="text"
            placeholder="Enter user name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="text-center px-2 border border-gray-300 rounded-lg m-2 focus:outline-blue-500  w-[16rem] mr-8"
          />
          <div className="flex  justify-between">
            <input
              type="text"
              placeholder="Enter a task"
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              className="text-center px-2 border border-gray-300 rounded-lg m-2 focus:outline-blue-500 w-[16rem]"
            />
            <button
              onClick={addTask}
              className={` transition-colors ${
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
              <li>
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
                onClick={() => deleteUserTasks(entry.user)}
                className="text-red-500 "
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
                  <div> {t}</div>
                  <button
                    className="hidden group-hover:block"
                    onClick={() => {
                      deleteExistUserTask(entry, t);
                    }}
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

// allTask[entity.user]
