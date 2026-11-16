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
const filterPersonSelect = document.getElementById("filter-person");
const filterCategorySelect = document.getElementById("filter-category");
const statTotal = document.getElementById("stat-total");
const statPerHead = document.getElementById("stat-per-head");
const statCount = document.getElementById("stat-count");
const balanceSummary = document.getElementById("balance-summary");
const balanceList = document.getElementById("balance-list");

// ---------- Mitbewohner & Beteiligte ----------
// Unterstützt Strings ("Anna") und Objekte ({ name: "Anna" }) aus getRoommates()
function getRoommateNames() {
    return getRoommates().map(function (roommate) {
        return typeof roommate === "string" ? roommate : roommate.name;
    });
}

// Alle Mitbewohner plus Personen, die nur noch in Buchungen vorkommen
function getParticipantNames() {
    const names = getRoommateNames();
    expenses.forEach(function (item) {
        if (!names.includes(item.person)) {
            names.push(item.person);
        }
    });
    return names;
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

function formatSignedEuro(amount) {
    const sign = amount > 0 ? "+" : "-";
    return sign + formatEuro(Math.abs(amount));
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

// ---------- Dropdowns ----------
function fillSelect(select, firstLabel, names) {
    const previousValue = select.value;
    select.innerHTML = "";

    const firstOption = document.createElement("option");
    firstOption.value = "";
    firstOption.textContent = firstLabel;
    select.appendChild(firstOption);

    names.forEach(function (name) {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
    });

    select.value = previousValue;
}

function renderPersonSelects() {
    fillSelect(personSelect, "Bitte wählen …", getRoommateNames());
    fillSelect(filterPersonSelect, "Alle Personen", getParticipantNames());
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

// ---------- Filter ----------
function getFilteredExpenses() {
    const person = filterPersonSelect.value;
    const category = filterCategorySelect.value;
    return expenses.filter(function (item) {
        const personMatches = person === "" || item.person === person;
        const categoryMatches = category === "" || item.category === category;
        return personMatches && categoryMatches;
    });
}

// ---------- Berechnungen ----------
function calculateTotal() {
    return expenses.reduce(function (sum, item) {
        return sum + Number(item.amount);
    }, 0);
}

function calculatePerHead() {
    const participantCount = getParticipantNames().length;
    return participantCount > 0 ? calculateTotal() / participantCount : 0;
}

function calculatePaidBy(name) {
    return expenses
        .filter(function (item) { return item.person === name; })
        .reduce(function (sum, item) { return sum + Number(item.amount); }, 0);
}

// Saldo > 0: bekommt Geld zurück, Saldo < 0: muss nachzahlen
function calculateBalance(name) {
    return Number((calculatePaidBy(name) - calculatePerHead()).toFixed(2));
}

// ---------- Rendering: Statistik ----------
function renderStats() {
    statTotal.textContent = formatEuro(calculateTotal());
    statPerHead.textContent = formatEuro(calculatePerHead());
    statCount.textContent = String(expenses.length);
}

// ---------- Rendering: Kassensturz ----------
function createBalanceText(balance) {
    const text = document.createElement("strong");
    if (balance > 0) {
        text.className = "balance-positive";
        text.textContent = "bekommt " + formatSignedEuro(balance);
    } else if (balance < 0) {
        text.className = "balance-negative";
        text.textContent = "zahlt " + formatSignedEuro(balance);
    } else {
        text.textContent = "ist ausgeglichen";
    }
    return text;
}

function createBalanceRow(name) {
    const row = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = name + " hat " + formatEuro(calculatePaidBy(name)) + " bezahlt → ";
    row.appendChild(label);
    row.appendChild(createBalanceText(calculateBalance(name)));
    return row;
}

function renderBalance() {
    const names = getParticipantNames();
    balanceList.innerHTML = "";

    if (names.length === 0) {
        balanceSummary.textContent = "Noch keine Mitbewohner vorhanden.";
        return;
    }

    balanceSummary.textContent =
        "Pro-Kopf-Anteil bei " + names.length + " Personen: " + formatEuro(calculatePerHead());
    names.forEach(function (name) {
        balanceList.appendChild(createBalanceRow(name));
    });
}

// ---------- Rendering: Ausgabenliste ----------
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

function renderExpenseList() {
    const visible = getFilteredExpenses().sort(function (a, b) {
        return b.date.localeCompare(a.date);
    });

    expenseList.innerHTML = "";
    if (visible.length === 0) {
        emptyMessage.textContent = expenses.length === 0
            ? "Noch keine Ausgaben erfasst."
            : "Keine Ausgaben für diesen Filter gefunden.";
        emptyMessage.hidden = false;
    } else {
        emptyMessage.hidden = true;
    }

    visible.forEach(function (item) {
        expenseList.appendChild(createExpenseCard(item));
    });
}

function renderAll() {
    renderPersonSelects();
    renderStats();
    renderExpenseList();
    renderBalance();
}

// ---------- Aktionen ----------
function addExpense(expense) {
    expenses.push(expense);
    saveToStorage(STORAGE_KEYS.FINANCE, expenses);
    renderAll();
}

function deleteExpense(expenseId) {
    expenses = expenses.filter(function (item) {
        return item.id !== expenseId;
    });
    saveToStorage(STORAGE_KEYS.FINANCE, expenses);
    renderAll();
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
    dateInput.value = getTodayAsInputValue();
    renderAll();
    expenseForm.addEventListener("submit", handleFormSubmit);
    filterPersonSelect.addEventListener("change", renderExpenseList);
    filterCategorySelect.addEventListener("change", renderExpenseList);
}

init();