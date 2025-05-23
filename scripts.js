const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// stores todos here
const todos = [];

function render(todos, taskList) {
  taskList.innerHTML = "";

  todos.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <div class="task-header">
                <label>
                <input type="checkbox">
                <span>${task.text}</span>
                </label>
            </div>
            <div class="task-details" style="display: none;">
            <div class="task-meta">
              Added on: ${new Date().toLocaleDateString()} <br />
              <label>Due-Date</label>
              <input id = "due-date" type="date">
              <label>notes</label>
              <textarea id="notesInput" placeholder="Add notes..."></textarea><br>
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

    taskList.appendChild(li);
  });
}

function addTask(taskInput, todos, taskList) {
  const taskText = taskInput.value.trim();
  if (taskText == "") {
    alert("Please enter the task");
    return;
  }

  const newTask = {
    id: todos.length + 1,
    text: taskText,
  };
  todos.push(newTask); // add to array
  render(todos, taskList); //render updated list
  taskInput.value = "";
}

document.addEventListener("DOMContentLoaded", () => {
  //Enter key
  taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addTask(taskInput, todos, taskList);
    }
  });
});
