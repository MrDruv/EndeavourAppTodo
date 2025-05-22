document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');

  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
       const li =document.createElement("li");
    li.innerHTML = `
    <div class="task-header">
        <label>
        
        <input type="checkbox">
        <span>${taskText}</span>
        </label>
    </div>
        `;
      taskList.appendChild(li)
      taskInput.value = '';
    }else{
        alert("Please enter the task")
    }  
  }
  
  //Enter key
  taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
  });
});
