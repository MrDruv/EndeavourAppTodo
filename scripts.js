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
        `;
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
