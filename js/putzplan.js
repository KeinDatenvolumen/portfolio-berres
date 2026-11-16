/* Gruppenname: WI_A_Gruppe_1 */
function loadRoommates() {
    if (typeof getRoommates !== "function") {
        return [];
    }

    const storedRoommates = getRoommates();

    if (!Array.isArray(storedRoommates)) {
        return [];
    }

    return storedRoommates.filter(function (name) {
        return (
            typeof name === "string" &&
            name.trim() !== ""
        );
    });
}

const roommates = loadRoommates();

function createDefaultTasks() {
    const exampleTasks = [];

    if (roommates.length >= 1) {
        exampleTasks.push({
            id: 1,
            title: "Arbeitsplatte reinigen",
            room: "Küche",
            person: roommates[0],
            dueDate: "2026-11-20",
            completed: false
        });
    }

    if (roommates.length >= 2) {
        exampleTasks.push({
            id: 2,
            title: "Spiegel putzen",
            room: "Bad",
            person: roommates[1],
            dueDate: "2026-11-21",
            completed: false
        });
    }

    return exampleTasks;
}

const defaultTasks = createDefaultTasks();

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

const scheduleBody = document.getElementById("schedule-body");

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

function addRoommateOptions(selectElement, firstOptionText) {
    selectElement.replaceChildren();

    const firstOption = document.createElement("option");
    firstOption.value = "";
    firstOption.textContent = firstOptionText;

    selectElement.appendChild(firstOption);

    roommates.forEach(function (roommate) {
        const option = document.createElement("option");
        option.value = roommate;
        option.textContent = roommate;

        selectElement.appendChild(option);
    });
}

function populateRoommateDropdowns() {
    addRoommateOptions(
        taskPersonInput,
        "Bitte wählen"
    );

    addRoommateOptions(
        personFilter,
        "Alle Personen"
    );
}

function createScheduleCell(text, elementName) {
    const cell = document.createElement(elementName);
    cell.textContent = text;

    return cell;
}

function renderScheduleTable() {
    if (scheduleBody === null) {
        return;
    }

    scheduleBody.replaceChildren();

    if (roommates.length === 0) {
        const row = document.createElement("tr");
        const emptyCell = document.createElement("td");

        emptyCell.colSpan = 5;
        emptyCell.className = "empty-state";
        emptyCell.textContent =
            "Noch keine Mitbewohner eingetragen.";

        row.appendChild(emptyCell);
        scheduleBody.appendChild(row);

        return;
    }

    roommates.forEach(function (roommate, weekIndex) {
        const row = document.createElement("tr");

        const weekCell = createScheduleCell(
            String(weekIndex + 1),
            "th"
        );

        weekCell.scope = "row";
        row.appendChild(weekCell);

        for (let roomIndex = 0; roomIndex < 4; roomIndex += 1) {
            const roommateIndex =
                (weekIndex + roomIndex) % roommates.length;

            const nameCell = createScheduleCell(
                roommates[roommateIndex],
                "td"
            );

            row.appendChild(nameCell);
        }

        scheduleBody.appendChild(row);
    });
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

    const infoContainer = document.createElement("div");

    const taskTitle = document.createElement("h3");
    taskTitle.textContent = task.title;

    const taskDetails = document.createElement("p");

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

    taskDetails.appendChild(roomBadge);
    taskDetails.appendChild(document.createTextNode(" "));
    taskDetails.appendChild(statusBadge);

    taskDetails.appendChild(
        document.createTextNode(
            " • Zuständig: " +
            task.person +
            " • Fällig: " +
            task.dueDate
        )
    );

    infoContainer.appendChild(taskTitle);
    infoContainer.appendChild(taskDetails);

    const actionContainer = document.createElement("div");
    actionContainer.className = "form-row";

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

    actionContainer.appendChild(statusButton);
    actionContainer.appendChild(deleteButton);

    taskArticle.appendChild(infoContainer);
    taskArticle.appendChild(actionContainer);

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

populateRoommateDropdowns();
renderScheduleTable();

addTaskButton.addEventListener("click", addTask);

personFilter.addEventListener("change", renderTasks);
roomFilter.addEventListener("change", renderTasks);

resetFilterButton.addEventListener(
    "click",
    resetFilters
);

renderPage();