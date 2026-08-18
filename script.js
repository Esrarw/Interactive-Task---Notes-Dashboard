const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Load saved tasks from localStorage when page opens
document.addEventListener('DOMContentLoaded', loadTasks);

function createTaskElement(text, completed = false) {
    const li = document.createElement('li');
    li.className = `task-item ${completed ? 'completed' : ''}`;

    li.innerHTML = `
        <span class="task-text">${text}</span>
        <button class="delete-btn">حذف 🗑️</button>
    `;

    // Toggle completed state
    const span = li.querySelector('.task-text');
    span.addEventListener('click', function() {
        li.classList.toggle('completed');
        saveTasks();
    });

    // Delete task
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function() {
        li.remove();
        saveTasks();
    });

    taskList.appendChild(li);
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert('الرجاء كتابة النص للمهمة أولاً!');
        return;
    }

    createTaskElement(taskText);
    saveTasks();
    taskInput.value = '';
}

// Save all tasks to localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(item => {
        tasks.push({
            text: item.querySelector('.task-text').textContent,
            completed: item.classList.contains('completed')
        });
    });
    localStorage.setItem('user_tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const saved = localStorage.getItem('user_tasks');
    if (saved) {
        const tasks = JSON.parse(saved);
        tasks.forEach(task => createTaskElement(task.text, task.completed));
    }
}

// Event Listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addTask();
});