document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const filterButtons = {
        all: document.getElementById('allTasks'),
        pending: document.getElementById('pendingTasks'),
        completed: document.getElementById('completedTasks')
    };

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Render tasks based on the filter
    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            if (filter === 'all' || (filter === 'completed' && task.completed) || (filter === 'pending' && !task.completed)) {
                const taskItem = document.createElement('li');
                taskItem.className = `taskItem${task.completed ? ' completed' : ''}`;
                taskItem.innerHTML = `
                    <span>${task.text}</span>
                    <div class="taskButtons">
                        <button onclick="toggleComplete(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
                        <button onclick="editTask(${index})">Edit</button>
                        <button onclick="deleteTask(${index})">Delete</button>
                    </div>
                `;
                taskList.appendChild(taskItem);
            }
        });
    }

    // Add a new task
    addTaskButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            tasks.push({ text: taskText, completed: false });
            taskInput.value = '';
            saveTasks();
            renderTasks();
        }
    });

    // Toggle task completion
    window.toggleComplete = function(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    };

    // Edit a task
    window.editTask = function(index) {
        const newTaskText = prompt('Edit Task', tasks[index].text);
        if (newTaskText !== null && newTaskText.trim() !== '') {
            tasks[index].text = newTaskText.trim();
            saveTasks();
            renderTasks();
        }
    };

    // Delete a task
    window.deleteTask = function(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    };

    // Filter tasks
    filterButtons.all.addEventListener('click', () => renderTasks('all'));
    filterButtons.pending.addEventListener('click', () => renderTasks('pending'));
    filterButtons.completed.addEventListener('click', () => renderTasks('completed'));

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Initial render
    renderTasks();
});