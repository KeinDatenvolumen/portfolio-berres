/* Gruppenname: WI_A_Gruppe_1 */
"use strict";

// ---------- DOM-Referenzen ----------
const expenseForm = document.getElementById("expense-form");
const titleInput = document.getElementById("expense-title");
const amountInput = document.getElementById("expense-amount");
const personSelect = document.getElementById("expense-person");
const categorySelect = document.getElementById("expense-category");
const dateInput = document.getElementById("expense-date");
const errorMessage = document.getElementById("finance-error");
const expenseList = document.getElementById("expense-list");
const emptyMessage = document.getElementById("empty-message");

// ---------- Hilfsfunktionen: Mitbewohner ----------
function getRoommateNames() {
    return getRoommates().map(function (roommate) {
        return typeof roommate === "string" ? roommate : roommate.name;
    });
}

// ---------- Start-Beispieldaten ----------
function createDefaultExpenses() {
    const names = getRoommateNames();
    const nameAt = function (index) {
        return names.length > 0 ? names[index % names.length] : "Unbekannt";
    };
    return [
        { id: 1, title: "Wocheneinkauf Rewe", amount: 42.5, person: nameAt(0), category: "Lebensmittel", date: "2026-11-02" },
        { id: 2, title: "Putzmittel & Schwämme", amount: 12.8, person: nameAt(1), category: "Haushalt", date: "2026-11-05" },
        { id: 3, title: "Pizza-Abend", amount: 27.9, person: nameAt(2), category: "Freizeit", date: "2026-11-08" }
    ];
}

const defaultExpenses = createDefaultExpenses();
let expenses = loadFromStorage(STORAGE_KEYS.FINANCE, defaultExpenses);

// ---------- Formatierung ----------
function formatEuro(amount) {
    return Number(amount).toFixed(2).replace(".", ",") + " €";
}

function getTodayAsInputValue() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return today.getFullYear() + "-" + month + "-" + day;
}

// ---------- Fehleranzeige ----------
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
}

function clearError() {
    errorMessage.textContent = "";
    errorMessage.hidden = true;
}

// ---------- Dropdown „Bezahlt von“ ----------
function renderPersonSelect() {
    const previousValue = personSelect.value;
    personSelect.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Bitte wählen …";
    personSelect.appendChild(placeholder);

    getRoommateNames().forEach(function (name) {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        personSelect.appendChild(option);
    });

    personSelect.value = previousValue;
}

// ---------- Validierung ----------
function validateExpenseInput() {
    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);
    const person = personSelect.value;
    const category = categorySelect.value;
    const date = dateInput.value;

    if (title === "") {
        return { error: "Bitte gib einen Verwendungszweck ein." };
    }
    if (amountInput.value === "" || Number.isNaN(amount) || amount <= 0) {
        return { error: "Bitte gib einen gültigen Betrag größer als 0 ein." };
    }
    if (person === "") {
        return { error: "Bitte wähle aus, wer bezahlt hat." };
    }
    if (date === "") {
        return { error: "Bitte wähle ein Datum." };
    }

    return {
        expense: {
            id: Date.now(),
            title: title,
            amount: Number(amount.toFixed(2)),
            person: person,
            category: category,
            date: date
        }
    };
}

// ---------- Rendering ----------
function createInfoContainer(item) {
    const infoContainer = document.createElement("div");

    const heading = document.createElement("h3");
    heading.textContent = item.title + " – " + formatEuro(item.amount);

    const details = document.createElement("p");
    const badge = document.createElement("span");
    badge.className = "badge badge-category";
    badge.textContent = item.category;
    details.appendChild(badge);
    details.appendChild(
        document.createTextNode(" • Bezahlt von: " + item.person + " • Datum: " + item.date)
    );

    infoContainer.appendChild(heading);
    infoContainer.appendChild(details);
    return infoContainer;
}

function createActionContainer(item) {
    const actionContainer = document.createElement("div");

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn btn-danger btn-sm";
    deleteButton.textContent = "Löschen";
    deleteButton.setAttribute("aria-label", "Ausgabe „" + item.title + "“ löschen");
    deleteButton.addEventListener("click", function () {
        deleteExpense(item.id);
    });

    actionContainer.appendChild(deleteButton);
    return actionContainer;
}

function createExpenseCard(item) {
    const card = document.createElement("li");
    card.className = "item-card";
    card.appendChild(createInfoContainer(item));
    card.appendChild(createActionContainer(item));
    return card;
}

function renderExpenses() {
    expenseList.innerHTML = "";
    emptyMessage.hidden = expenses.length > 0;

    const sorted = expenses.slice().sort(function (a, b) {
        return b.date.localeCompare(a.date);
    });
    sorted.forEach(function (item) {
        expenseList.appendChild(createExpenseCard(item));
    });
}

// ---------- Aktionen ----------
function addExpense(expense) {
    expenses.push(expense);
    saveToStorage(STORAGE_KEYS.FINANCE, expenses);
    renderExpenses();
}

function deleteExpense(expenseId) {
    expenses = expenses.filter(function (item) {
        return item.id !== expenseId;
    });
    saveToStorage(STORAGE_KEYS.FINANCE, expenses);
    renderExpenses();
}

function resetForm() {
    expenseForm.reset();
    dateInput.value = getTodayAsInputValue();
}

function handleFormSubmit(event) {
    event.preventDefault();
    const result = validateExpenseInput();

    if (result.error) {
        showError(result.error);
        return;
    }

    clearError();
    addExpense(result.expense);
    resetForm();
}

// ---------- Initialisierung ----------
function init() {
    renderPersonSelect();
    dateInput.value = getTodayAsInputValue();
    renderExpenses();
    expenseForm.addEventListener("submit", handleFormSubmit);
}

init();