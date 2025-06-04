const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// stores todos here
const todos = [];

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
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
    });

    dueDateInput.value = task.dueDate;
    dueDateInput.addEventListener("change", () => {
      task.dueDate = dueDateInput.value;
    });

    notesInput.value = task.notes;
    notesInput.addEventListener("input", () => {
      task.notes = notesInput.value;
    });

    const deleteBtn = li.querySelector(".btn-delete");
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const confirmed = confirm("Are you sure,want to delete?");
      if (!confirmed) return;
      todos.splice(
        todos.findIndex((t) => t.id === task.id),
        1,
      );
      render(todos, taskList);
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

function addTask(text, state) {
  const newTask = {
    id: state.length + 1,
    text,
    createAt: new Date().toISOString(),
    completed: false,
    dueDate: "",
    notes: "",
  };
  return [...state, newTask];
}

document.addEventListener("DOMContentLoaded", () => {
  taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const text = extractInputText(taskInput);
      if (!text) return;

      const newState = addTask(text, todos);
      todos.splice(0, todos.length, ...newState); // mutate old state
      render(todos, taskList);
      taskInput.value = "";
    }
  });
});
