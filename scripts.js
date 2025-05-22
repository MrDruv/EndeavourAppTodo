document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');

    // stores todos here
    let todos=[];

    function render(todos){
        taskList.innerHTML='';


    todos.forEach((task, index) => { // task:value of current item. index:position
         li.innerHTML = `
    <div class="task-header">
        <label>
        
        <input type="checkbox">
        <span>${taskText}</span>
        </label>
    </div>
        `;
      taskList.appendChild(li)
    });
       
    }



  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
       const li =document.createElement("li");
       todos.push(taskText);    // add to array
       render(todos); //render inputs  
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
