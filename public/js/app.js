const API_BASE_URL = 'http://localhost:3000/api';

let todos = [];
let currentFilter = 'all';
let editingTodoId = null;

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const todosList = document.getElementById('todosList');
const editModal = document.getElementById('editModal');
const editInput = document.getElementById('editInput');
const closeModal = document.getElementById('closeModal');
const cancelEdit = document.getElementById('cancelEdit');
const saveEdit = document.getElementById('saveEdit');
const filterBtns = document.querySelectorAll('.filter-btn');
const notification = document.getElementById('notification');

const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');

document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    setupEventListeners();
});

function setupEventListeners() {
    addBtn.addEventListener('click', addTodo);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    closeModal.addEventListener('click', closeEditModal);
    cancelEdit.addEventListener('click', closeEditModal);
    saveEdit.addEventListener('click', saveTodoEdit);
    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveTodoEdit();
        } else if (e.key === 'Escape') {
            closeEditModal();
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });

    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && editModal.classList.contains('show')) {
            closeEditModal();
        }
    });
}

async function loadTodos() {
    try {
        const response = await fetch(`${API_BASE_URL}/todos`);
        const result = await response.json();
        todos = result.data || [];
        renderTodos();
        updateStats();
    } catch (error) {
        console.error('Error loading todos:', error);
        showNotification('Failed to load tasks. Make sure the server is running.', 'error');
    }
}

async function addTodo() {
    const task = taskInput.value.trim();
    
    if (!task) {
        showNotification('Please enter a task', 'error');
        taskInput.focus();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task })
        });

        const result = await response.json();
        
        if (response.ok) {
            todos.unshift(result.data);
            taskInput.value = '';
            renderTodos();
            updateStats();
            showNotification('Task added successfully!', 'success');
            taskInput.focus();
        } else {
            showNotification(result.error || 'Failed to add task', 'error');
        }
    } catch (error) {
        console.error('Error adding todo:', error);
        showNotification('Failed to add task. Check your connection.', 'error');
    }
}

async function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const newCompletedStatus = !todo.completed;

    try {
        const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: newCompletedStatus })
        });

        const result = await response.json();
        
        if (response.ok) {
            todo.completed = result.data.completed;
            renderTodos();
            updateStats();
            showNotification(
                newCompletedStatus ? 'Task completed! 🎉' : 'Task marked as pending',
                'success'
            );
        } else {
            showNotification(result.error || 'Failed to update task', 'error');
        }
    } catch (error) {
        console.error('Error toggling todo:', error);
        showNotification('Failed to update task', 'error');
    }
}

function openEditModal(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    editingTodoId = id;
    editInput.value = todo.task;
    editModal.classList.add('show');
    setTimeout(() => {
        editInput.focus();
        editInput.select();
    }, 100);
}

function closeEditModal() {
    editModal.classList.remove('show');
    editingTodoId = null;
    editInput.value = '';
}

async function saveTodoEdit() {
    if (!editingTodoId) return;

    const newTask = editInput.value.trim();
    
    if (!newTask) {
        showNotification('Task cannot be empty', 'error');
        editInput.focus();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/todos/${editingTodoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task: newTask })
        });

        const result = await response.json();
        
        if (response.ok) {
            const todo = todos.find(t => t.id === editingTodoId);
            if (todo) {
                todo.task = result.data.task;
            }
            renderTodos();
            closeEditModal();
            showNotification('Task updated successfully!', 'success');
        } else {
            showNotification(result.error || 'Failed to update task', 'error');
        }
    } catch (error) {
        console.error('Error updating todo:', error);
        showNotification('Failed to update task', 'error');
    }
}

async function deleteTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    if (!confirm(`Are you sure you want to delete "${todo.task}"?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            todos = todos.filter(t => t.id !== id);
            renderTodos();
            updateStats();
            showNotification('Task deleted successfully!', 'success');
        } else {
            const result = await response.json();
            showNotification(result.error || 'Failed to delete task', 'error');
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
        showNotification('Failed to delete task', 'error');
    }
}

function renderTodos() {
    const filteredTodos = getFilteredTodos();
    
    if (filteredTodos.length === 0) {
        todosList.innerHTML = `
            <li class="empty-state">
                <div class="empty-icon">${getEmptyIcon()}</div>
                <p>${getEmptyMessage()}</p>
            </li>
        `;
        return;
    }

    todosList.innerHTML = filteredTodos.map(todo => `
        <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo(${todo.id})"
            >
            <span class="todo-text">${escapeHtml(todo.task)}</span>
            <div class="todo-actions">
                <button class="action-btn edit-btn" onclick="openEditModal(${todo.id})" title="Edit task">
                    ✏️
                </button>
                <button class="action-btn delete-btn" onclick="deleteTodo(${todo.id})" title="Delete task">
                    🗑️
                </button>
            </div>
        </li>
    `).join('');
}

function getFilteredTodos() {
    switch (currentFilter) {
        case 'completed':
            return todos.filter(t => t.completed);
        case 'pending':
            return todos.filter(t => !t.completed);
        default:
            return todos;
    }
}

function getEmptyIcon() {
    switch (currentFilter) {
        case 'completed':
            return '✅';
        case 'pending':
            return '📋';
        default:
            return '📝';
    }
}

function getEmptyMessage() {
    switch (currentFilter) {
        case 'completed':
            return 'No completed tasks yet.';
        case 'pending':
            return 'No pending tasks. Great job! 🎉';
        default:
            return 'No tasks yet. Add one above to get started!';
    }
}

function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;

    animateNumber(totalTasksEl, total);
    animateNumber(completedTasksEl, completed);
    animateNumber(pendingTasksEl, pending);
}

function animateNumber(element, targetValue) {
    const currentValue = parseInt(element.textContent) || 0;
    const increment = targetValue > currentValue ? 1 : -1;
    const duration = 300;
    const steps = Math.abs(targetValue - currentValue);
    const stepDuration = duration / steps;

    if (steps === 0) return;

    let current = currentValue;
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        
        if (current === targetValue) {
            clearInterval(timer);
        }
    }, stepDuration);
}

function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.toggleTodo = toggleTodo;
window.openEditModal = openEditModal;
window.deleteTodo = deleteTodo;

