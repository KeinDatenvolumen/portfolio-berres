/* Gruppenname: WI_A_Gruppe_1 */
const defaultTasks = [
    {
        id: 1,
        title: "Arbeitsplatte reinigen",
        room: "Küche",
        person: "Alex",
        dueDate: "2026-11-20"
    },
    {
        id: 2,
        title: "Spiegel putzen",
        room: "Bad",
        person: "Sam",
        dueDate: "2026-11-21"
    }
];

let tasks = loadTasks();

const taskForm = document.getElementById("task-form");
const addTaskButton = document.getElementById("add-task-btn");
const taskTitleInput = document.getElementById("task-title");
const taskRoomInput = document.getElementById("task-room");
const taskPersonInput = document.getElementById("task-person");
const taskDateInput = document.getElementById("task-date");
const taskList = document.getElementById("task-list");
const errorMessage = document.getElementById("error-message");

function loadTasks() {
    if (
        typeof loadFromStorage === "function" &&
        typeof STORAGE_KEYS !== "undefined"
    ) {
        return loadFromStorage(STORAGE_KEYS.CLEANING, defaultTasks);
    }

    const storedTasks = localStorage.getItem("cleaningTasks");

    if (storedTasks === null) {
        return [...defaultTasks];
    }

    try {
        return JSON.parse(storedTasks);
    } catch (error) {
        console.error("Die gespeicherten Putzaufgaben konnten nicht geladen werden.");
        return [...defaultTasks];
    }
}

function saveTasks() {
    if (
        typeof saveToStorage === "function" &&
        typeof STORAGE_KEYS !== "undefined"
    ) {
        saveToStorage(STORAGE_KEYS.CLEANING, tasks);
        return;
    }

    localStorage.setItem("cleaningTasks", JSON.stringify(tasks));
}

function validateForm() {
    const title = taskTitleInput.value.trim();
    const room = taskRoomInput.value;
    const person = taskPersonInput.value;
    const dueDate = taskDateInput.value;

    if (
        title === "" ||
        room === "" ||
        person === "" ||
        dueDate === ""
    ) {
        errorMessage.textContent = "Bitte alle Felder ausfüllen.";
        return false;
    }

    errorMessage.textContent = "";
    return true;
}

function addTask() {
    if (!validateForm()) {
        return;
    }

    const newTask = {
        id: Date.now(),
        title: taskTitleInput.value.trim(),
        room: taskRoomInput.value,
        person: taskPersonInput.value,
        dueDate: taskDateInput.value
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();
    taskForm.reset();
}

function deleteTask(taskId) {
    tasks = tasks.filter(function (task) {
        return task.id !== taskId;
    });

    saveTasks();
    renderTasks();
}

function createTaskCard(task) {
    const taskArticle = document.createElement("article");
    taskArticle.className = "item-card";

    const taskTitle = document.createElement("h3");
    taskTitle.textContent = task.title;

    const roomBadge = document.createElement("span");
    roomBadge.className = "badge badge-category";
    roomBadge.textContent = task.room;

    const responsiblePerson = document.createElement("p");
    responsiblePerson.textContent = "Zuständig: " + task.person;

    const dueDate = document.createElement("p");
    dueDate.textContent = "Fällig: " + task.dueDate;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn btn-danger btn-sm";
    deleteButton.textContent = "Löschen";

    deleteButton.addEventListener("click", function () {
        deleteTask(task.id);
    });

    taskArticle.appendChild(taskTitle);
    taskArticle.appendChild(roomBadge);
    taskArticle.appendChild(responsiblePerson);
    taskArticle.appendChild(dueDate);
    taskArticle.appendChild(deleteButton);

    return taskArticle;
}

function renderTasks() {
    taskList.replaceChildren();

    if (tasks.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-state";
        emptyMessage.textContent = "Keine Aufgaben vorhanden.";

        taskList.appendChild(emptyMessage);
        return;
    }

    tasks.forEach(function (task) {
        const taskCard = createTaskCard(task);
        taskList.appendChild(taskCard);
    });
}

addTaskButton.addEventListener("click", addTask);

renderTasks();