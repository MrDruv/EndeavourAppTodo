const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const API_URL = "http://localhost:5000/todos";

let todos = []; // Will fetch from backend

async function fetchTodosFromServer() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch todos");
    todos = await res.json();
    render(todos, taskList);
  } catch (err) {
    console.error(err);
    alert("Failed to load todos from server");
  }
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, function (match) {
    const escapeChars = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return escapeChars[match];
  });
}

function render(todos, taskList) {
  taskList.innerHTML = "";

  todos.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <div class="task-header">
                <label>
                <input type="checkbox">
                <span>${escapeHTML(task.text)}</span>
                </label>
            </div>
            <div class="task-details">
            <div class="task-meta">
              Added on: ${new Date(task.createAt).toLocaleDateString()} <br />
              <label>Due-Date</label>
              <input class = "due-date" type="date"><br />
              <label>Notes</label>
              <textarea class="notesInput" placeholder="Add notes..."></textarea><br>
            </div>
            <button class="btn-delete" data-id="${task.id}">Delete</button>
            </div>
        `;
    const taskHeader = li.querySelector(".task-header");
    const details = li.querySelector(".task-details");
    const checkbox = li.querySelector('input[type="checkbox"]');
    const dueDateInput = li.querySelector(".due-date");
    const notesInput = li.querySelector(".notesInput");

    taskHeader.addEventListener("click", () => {
      details.classList.add("show");
    });
    taskHeader.addEventListener("dblclick", () => {
      details.classList.remove("show");
    });

    checkbox.checked = task.completed;
    checkbox.addEventListener("change", async () => {
      task.completed = checkbox.checked;
      try {
        const res = await fetch(`${API_URL}/${task.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(task),
        });
        if (!res.ok) throw new Error("Failed to update todo");
      } catch (err) {
        console.error(err);
        alert("Failed to update task on server");
      }
    });

    dueDateInput.value = task.dueDate;
    dueDateInput.addEventListener("change", async () => {
      task.dueDate = dueDateInput.value;
      try {
        const res = await fetch(`${API_URL}/${task.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(task),
        });
        if (!res.ok) throw new Error("Failed to update todo");
      } catch (err) {
        console.error(err);
        alert("Failed to update task on server");
      }
    });

    notesInput.value = task.notes;
    notesInput.addEventListener("input", async () => {
      task.notes = notesInput.value;
      try {
        const res = await fetch(`${API_URL}/${task.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(task),
        });
        if (!res.ok) throw new Error("Failed to update todo");
      } catch (err) {
        console.error(err);
        alert("Failed to update task on server");
      }
    });

    const deleteBtn = li.querySelector(".btn-delete");
    deleteBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const confirmed = confirm("Are you sure,want to delete?");
      if (!confirmed) return;
      try {
        const res = await fetch(`${API_URL}/${task.id}`, {
          method: "DELETE",
        });
        if (!res.ok && res.status !== 204)
          throw new Error("Failed to delete todo");
        todos.splice(
          todos.findIndex((t) => t.id === task.id),
          1,
        );
        render(todos, taskList);
      } catch (err) {
        console.error(err);
        alert("Failed to delete task on server");
      }
    });

    taskList.appendChild(li);
  });
}

function extractInputText(input) {
  const text = input.value.trim();
  if (text === "") {
    alert("Please enter the task");
    return null;
  }
  return text;
}

async function addTask(text) {
  const newTask = {
    id: Date.now(),
    text,
    createAt: new Date().toISOString(),
    completed: false,
    dueDate: "",
    notes: "",
  };
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });
    if (!res.ok) throw new Error("Failed to add todo");
    const savedTask = await res.json();
    todos.push(savedTask);
    render(todos, taskList);
  } catch (err) {
    console.error(err);
    alert("Failed to add task to server");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchTodosFromServer();

  taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const text = extractInputText(taskInput);
      if (!text) return;
      addTask(text);
      taskInput.value = "";
    }
  });
});
