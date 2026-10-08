// Get HTML elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyMessage = document.getElementById("emptyMessage");
const clearCompletedBtn = document.getElementById("clearCompleted");


// Load saved tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// Display tasks when page loads
renderTasks();


// Add new task
addTaskBtn.addEventListener("click", addTask);


// Add task using Enter key
taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});


// Function to add task
function addTask() {

    const taskText = taskInput.value.trim();

    // Don't add empty tasks
    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}


// Display all tasks
function renderTasks() {

    taskList.innerHTML = "";

    // Show empty message if there are no tasks
    if (tasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }


    // Create each task
    tasks.forEach(function (task) {

        const li = document.createElement("li");

        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }


        // Checkbox
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;


        checkbox.addEventListener("change", function () {
            toggleTask(task.id);
        });


        // Task text
        const text = document.createElement("span");

        text.className = "task-text";
        text.textContent = task.text;


        // Buttons container
        const actions = document.createElement("div");

        actions.className = "task-actions";


        // Edit button
        const editButton = document.createElement("button");

        editButton.textContent = "Edit";
        editButton.className = "edit-btn";

        editButton.addEventListener("click", function () {
            editTask(task.id);
        });


        // Delete button
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function () {
            deleteTask(task.id);
        });


        // Add buttons
        actions.appendChild(editButton);
        actions.appendChild(deleteButton);


        // Add everything to task
        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(actions);


        taskList.appendChild(li);
    });


    updateTaskCount();
}


// Mark task completed/uncompleted
function toggleTask(id) {

    tasks = tasks.map(function (task) {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });


    saveTasks();
    renderTasks();
}


// Edit task
function editTask(id) {

    const task = tasks.find(function (task) {
        return task.id === id;
    });


    if (!task) {
        return;
    }


    const newText = prompt("Edit your task:", task.text);


    if (newText === null) {
        return;
    }


    const updatedText = newText.trim();


    if (updatedText === "") {
        alert("Task cannot be empty.");
        return;
    }


    task.text = updatedText;

    saveTasks();
    renderTasks();
}


// Delete task
function deleteTask(id) {

    const confirmDelete = confirm("Do you want to delete this task?");

    if (!confirmDelete) {
        return;
    }


    tasks = tasks.filter(function (task) {
        return task.id !== id;
    });


    saveTasks();
    renderTasks();
}


// Remove all completed tasks
clearCompletedBtn.addEventListener("click", function () {

    tasks = tasks.filter(function (task) {
        return !task.completed;
    });


    saveTasks();
    renderTasks();
});


// Update remaining task count
function updateTaskCount() {

    const remainingTasks = tasks.filter(function (task) {
        return !task.completed;
    });


    taskCount.textContent = remainingTasks.length;
}


// Save tasks in localStorage
function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));
}