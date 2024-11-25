const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const searchInput = document.getElementById('search-input');

// Load tasks from localStorage when the page loads
document.addEventListener('DOMContentLoaded', loadTasks);

// Event listener to add task
addBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  if (taskText) {
    addTask(taskText);
    saveTaskToLocalStorage(taskText);
    taskInput.value = ''; // Clear input
  } else {
    alert('Please enter a task.');
  }
});

// Event listener for search functionality
searchInput.addEventListener('input', filterTasks);

// Function to add a new task
function addTask(taskText, completed = false) {
  // Create new task item
  const taskItem = document.createElement('li');
  taskItem.classList.add('todo-item');
  if (completed) taskItem.classList.add('completed');

  // Circle for task completion
  const circle = document.createElement('span');
  circle.classList.add('completion-circle');
  if (completed) circle.classList.add('completed-circle');
  circle.addEventListener('click', () => {
    taskItem.classList.toggle('completed');
    circle.classList.toggle('completed-circle');
    updateTaskStatusInLocalStorage(taskText, taskItem.classList.contains('completed'));
  });

  // Task text
  const taskTextSpan = document.createElement('span');
  taskTextSpan.textContent = taskText;
  taskTextSpan.classList.add('task-text');

  // Ellipsis Menu
  const menuIcon = document.createElement('span');
  menuIcon.classList.add('menu-icon');
  menuIcon.innerHTML = '&#x22EE;'; // Vertical Ellipsis
  menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('active');
  });

  const taskMenu = document.createElement('div');
  taskMenu.classList.add('task-menu');

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', () => {
    const newTaskText = prompt('Edit task:', taskTextSpan.textContent);
    if (newTaskText) {
      updateTaskInLocalStorage(taskText, newTaskText.trim());
      taskTextSpan.textContent = newTaskText.trim();
    }
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => {
    deleteTaskFromLocalStorage(taskText);
    taskItem.remove();
  });

  taskMenu.append(editBtn, deleteBtn);
  taskItem.append(circle, taskTextSpan, menuIcon, taskMenu);

  // Append task to list
  todoList.appendChild(taskItem);
}

// Function to filter tasks based on search input
function filterTasks() {
  const filterText = searchInput.value.toLowerCase();
  const tasks = document.querySelectorAll('.todo-item');

  tasks.forEach(task => {
    const taskText = task.querySelector('.task-text').textContent.toLowerCase();
    if (taskText.includes(filterText)) {
      task.style.display = 'flex'; // Show matching tasks
    } else {
      task.style.display = 'none'; // Hide non-matching tasks
    }
  });
}

// LocalStorage Functions

// Save task to localStorage
function saveTaskToLocalStorage(taskText) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push({ text: taskText, completed: false });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => addTask(task.text, task.completed));
}

// Update task completion status in localStorage
function updateTaskStatusInLocalStorage(taskText, completed) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const task = tasks.find(task => task.text === taskText);
  if (task) {
    task.completed = completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

// Update task text in localStorage
function updateTaskInLocalStorage(oldText, newText) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const task = tasks.find(task => task.text === oldText);
  if (task) {
    task.text = newText;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

// Delete task from localStorage
function deleteTaskFromLocalStorage(taskText) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const updatedTasks = tasks.filter(task => task.text !== taskText);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}