
function render(todos, taskList){
        taskList.innerHTML='';
    
todos.forEach((task) => { 
        const li=document.createElement('li')
         li.innerHTML = `
            <div class="task-header">
                <label>
                
                <input type="checkbox">
                <span>${task}</span>
                </label>
            </div>
        `;
      taskList.appendChild(li)
    });
}  

  function addTask(taskInput, todos, taskList) {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
       
       todos.push(taskText);    // add to array
       render(todos, taskList);           //render updated list
       taskInput.value = '';
    }else{
        alert("Please enter the task")
    }  
  }

document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');
    // stores todos here
    const todos=[];
  //Enter key
  taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTask(taskInput,  todos,  taskList);
    }
  });
});
