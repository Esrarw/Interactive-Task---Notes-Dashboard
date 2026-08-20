// --- DARK / LIGHT MODE LOGIC ---
const themeToggleBtn = document.getElementById('themeToggle');

// قراءة الثيم المحفوظ أو الاعتماد على Light كافتراضي
const savedTheme = localStorage.getItem('user_theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
if (themeToggleBtn) {
    updateThemeButtonText(savedTheme);
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('user_theme', newTheme);
        updateThemeButtonText(newTheme);
    });
}

function updateThemeButtonText(theme) {
    themeToggleBtn.textContent = theme === 'dark' ? '☀️ الوضع المضيء' : '🌙 الوضع المظلم';
}
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', loadTasks);

function createTaskElement(text, completed = false) {
    const li = document.createElement('li');
    li.className = `task-item ${completed ? 'completed' : ''}`;

    li.innerHTML = `
        <span class="task-text">${text}</span>
        <button class="delete-btn">حذف 🗑️</button>
    `;

    const span = li.querySelector('.task-text');
    span.addEventListener('click', function() {
        li.classList.toggle('completed');
        saveTasks();
        updateCounters();
        applyFilter();
    });

    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function() {
        li.remove();
        saveTasks();
        updateCounters();
        applyFilter();
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
    updateCounters();
    applyFilter();
    taskInput.value = '';
}

// Filter tasks based on selected tab
function applyFilter() {
    const allTasks = document.querySelectorAll('.task-item');
    allTasks.forEach(item => {
        const isCompleted = item.classList.contains('completed');
        if (currentFilter === 'all') {
            item.style.display = 'flex';
        } else if (currentFilter === 'pending') {
            item.style.display = isCompleted ? 'none' : 'flex';
        } else if (currentFilter === 'completed') {
            item.style.display = isCompleted ? 'flex' : 'none';
        }
    });
}

// Filter buttons click handler
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        applyFilter();
    });
});

function updateCounters() {
    const allTasks = document.querySelectorAll('.task-item');
    const completedTasks = document.querySelectorAll('.task-item.completed');
    
    const completed = completedTasks.length;
    const pending = allTasks.length - completed;

    if (pendingCount) pendingCount.textContent = pending;
    if (completedCount) completedCount.textContent = completed;
}

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

function loadTasks() {
    const saved = localStorage.getItem('user_tasks');
    if (saved) {
        const tasks = JSON.parse(saved);
        tasks.forEach(task => createTaskElement(task.text, task.completed));
    }
    updateCounters();
    applyFilter();
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addTask();
});
// Clear all tasks logic
const clearAllBtn = document.getElementById('clearAllBtn');

clearAllBtn.addEventListener('click', function() {
    const allTasks = document.querySelectorAll('.task-item');
    if (allTasks.length === 0) {
        alert('القائمة فارغة بالفعل!');
        return;
    }

    if (confirm('هل أنتِ متاكدة من حذف جميع المهام؟')) {
        taskList.innerHTML = '';
        localStorage.removeItem('user_tasks');
        updateCounters();
    }
});