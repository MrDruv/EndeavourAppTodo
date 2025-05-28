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
            <div class="task-details" style="display: none;">
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

    li.addEventListener("click", () => {
      const details = li.querySelector(".task-details");
      details.style.display = "block";
    });
    li.addEventListener("dblclick", () => {
      const details = li.querySelector(".task-details");
      details.style.display = "none";
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
