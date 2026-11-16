/* Gruppenname: WI_A_Gruppe_1 */
const defaultTasks = [
    {
        id: 1,
        title: "Arbeitsplatte reinigen",
        room: "Küche",
        person: "Alex",
        dueDate: "2026-11-20",
        completed: false
    },
    {
        id: 2,
        title: "Spiegel putzen",
        room: "Bad",
        person: "Sam",
        dueDate: "2026-11-21",
        completed: false
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

const personFilter = document.getElementById("person-filter");
const roomFilter = document.getElementById("room-filter");
const resetFilterButton = document.getElementById("reset-filter-btn");

const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");

function loadTasks() {
    let loadedTasks;

    if (
        typeof loadFromStorage === "function" &&
        typeof STORAGE_KEYS !== "undefined"
    ) {
        loadedTasks = loadFromStorage(
            STORAGE_KEYS.CLEANING,
            defaultTasks
        );
    } else {
        const storedTasks = localStorage.getItem("cleaningTasks");

        if (storedTasks === null) {
            loadedTasks = [...defaultTasks];
        } else {
            try {
                loadedTasks = JSON.parse(storedTasks);
            } catch (error) {
                console.error(
                    "Die gespeicherten Putzaufgaben konnten nicht geladen werden."
                );

                loadedTasks = [...defaultTasks];
            }
        }
    }

    if (!Array.isArray(loadedTasks)) {
        return [...defaultTasks];
    }

    return loadedTasks.map(function (task) {
        return {
            ...task,
            completed: task.completed === true
        };
    });
}

function saveTasks() {
    if (
        typeof saveToStorage === "function" &&
        typeof STORAGE_KEYS !== "undefined"
    ) {
        saveToStorage(STORAGE_KEYS.CLEANING, tasks);
        return;
    }

    localStorage.setItem(
        "cleaningTasks",
        JSON.stringify(tasks)
    );
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
        errorMessage.textContent =
            "Bitte alle Felder ausfüllen.";

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
        dueDate: taskDateInput.value,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderPage();
    taskForm.reset();
}

function deleteTask(taskId) {
    tasks = tasks.filter(function (task) {
        return task.id !== taskId;
    });

    saveTasks();
    renderPage();
}

function toggleTaskStatus(taskId) {
    const selectedTask = tasks.find(function (task) {
        return task.id === taskId;
    });

    if (selectedTask === undefined) {
        return;
    }

    selectedTask.completed = !selectedTask.completed;

    saveTasks();
    renderPage();
}

function getFilteredTasks() {
    const selectedPerson = personFilter.value;
    const selectedRoom = roomFilter.value;

    return tasks.filter(function (task) {
        const matchesPerson =
            selectedPerson === "" ||
            task.person === selectedPerson;

        const matchesRoom =
            selectedRoom === "" ||
            task.room === selectedRoom;

        return matchesPerson && matchesRoom;
    });
}

function createBadge(text, className) {
    const badge = document.createElement("span");
    badge.className = className;
    badge.textContent = text;

    return badge;
}

function createTaskCard(task) {
    const taskArticle = document.createElement("article");
    taskArticle.className = "item-card";

    if (task.completed) {
        taskArticle.classList.add("item-completed");
    }

    const taskTitle = document.createElement("h3");
    taskTitle.textContent = task.title;

    const badgeContainer = document.createElement("p");

    const roomBadge = createBadge(
        task.room,
        "badge badge-category"
    );

    const statusBadge = createBadge(
        task.completed ? "Erledigt" : "Offen",
        task.completed
            ? "badge badge-done"
            : "badge badge-open"
    );

    badgeContainer.appendChild(roomBadge);
    badgeContainer.appendChild(document.createTextNode(" "));
    badgeContainer.appendChild(statusBadge);

    const responsiblePerson = document.createElement("p");
    responsiblePerson.textContent =
        "Zuständig: " + task.person;

    const dueDate = document.createElement("p");
    dueDate.textContent =
        "Fällig: " + task.dueDate;

    const statusButton = document.createElement("button");
    statusButton.type = "button";
    statusButton.className = "btn btn-secondary btn-sm";
    statusButton.textContent = task.completed
        ? "Als offen markieren"
        : "Als erledigt markieren";

    statusButton.addEventListener("click", function () {
        toggleTaskStatus(task.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn btn-danger btn-sm";
    deleteButton.textContent = "Löschen";

    deleteButton.addEventListener("click", function () {
        deleteTask(task.id);
    });

    taskArticle.appendChild(taskTitle);
    taskArticle.appendChild(badgeContainer);
    taskArticle.appendChild(responsiblePerson);
    taskArticle.appendChild(dueDate);
    taskArticle.appendChild(statusButton);
    taskArticle.appendChild(deleteButton);

    return taskArticle;
}

function renderTasks() {
    taskList.replaceChildren();

    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-state";
        emptyMessage.textContent =
            "Keine passenden Aufgaben vorhanden.";

        taskList.appendChild(emptyMessage);
        return;
    }

    filteredTasks.forEach(function (task) {
        const taskCard = createTaskCard(task);
        taskList.appendChild(taskCard);
    });
}

function updateProgress() {
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(function (task) {
        return task.completed;
    }).length;

    let progressPercentage = 0;

    if (totalTasks > 0) {
        progressPercentage = Math.round(
            completedTasks / totalTasks * 100
        );
    }

    progressText.textContent =
        completedTasks +
        " von " +
        totalTasks +
        " Aufgaben erledigt (" +
        progressPercentage +
        " %)";

    progressBar.style.width = progressPercentage + "%";

    progressBar.setAttribute(
        "aria-valuenow",
        String(progressPercentage)
    );
}

function resetFilters() {
    personFilter.value = "";
    roomFilter.value = "";

    renderTasks();
}

function renderPage() {
    renderTasks();
    updateProgress();
}

addTaskButton.addEventListener("click", addTask);

personFilter.addEventListener("change", renderTasks);
roomFilter.addEventListener("change", renderTasks);

resetFilterButton.addEventListener(
    "click",
    resetFilters
);

renderPage();