/* Gruppenname: WI_A_Gruppe_1 */

/**
 * Standard-Beispieldaten für die Einkaufsliste, falls der localStorage noch leer ist.
 */
const DEFAULT_SHOPPING_ITEMS = [
  {
    id: "item-1",
    name: "Hafermilch",
    quantity: 3,
    unit: "Liter",
    category: "Kühlregal",
    person: "Alex",
    completed: false
  },
  {
    id: "item-2",
    name: "Spülmaschinentabs",
    quantity: 1,
    unit: "Packung",
    category: "Haushalt",
    person: "Sam",
    completed: false
  },
  {
    id: "item-3",
    name: "Äpfel",
    quantity: 6,
    unit: "Stück",
    category: "Obst & Gemüse",
    person: "Robin",
    completed: true
  }
];

let shoppingItems = [];
let roommates = [];

const shoppingForm = document.getElementById("shopping-form");
const itemNameInput = document.getElementById("item-name");
const itemQuantityInput = document.getElementById("item-quantity");
const itemUnitInput = document.getElementById("item-unit");
const itemCategorySelect = document.getElementById("item-category");
const itemPersonSelect = document.getElementById("item-person");
const shoppingError = document.getElementById("shopping-error");
const shoppingListElement = document.getElementById("shopping-list");
const shoppingEmptyHint = document.getElementById("shopping-empty");

const filterSearchInput = document.getElementById("filter-search");
const filterCategorySelect = document.getElementById("filter-category");
const clearCompletedButton = document.getElementById("clear-completed-btn");

const statTotalElement = document.getElementById("stat-total");
const statOpenElement = document.getElementById("stat-open");
const statDoneElement = document.getElementById("stat-done");

/**
 * Initialisiert die Einkaufsliste beim Laden der Seite.
 */
function initShoppingPage() {
  roommates = getRoommates();
  renderRoommateOptions();

  shoppingItems = loadFromStorage(STORAGE_KEYS.SHOPPING, DEFAULT_SHOPPING_ITEMS);
  saveToStorage(STORAGE_KEYS.SHOPPING, shoppingItems);
  renderShoppingList();

  shoppingForm.addEventListener("submit", handleAddShoppingItem);
  filterSearchInput.addEventListener("input", renderShoppingList);
  filterCategorySelect.addEventListener("change", renderShoppingList);
  clearCompletedButton.addEventListener("click", handleClearCompletedItems);
}

/**
 * Befüllt das Dropdown-Menü (#item-person) dynamisch mit den aktuellen WG-Mitbewohnern.
 */
function renderRoommateOptions() {
  itemPersonSelect.innerHTML = "";

  for (let i = 0; i < roommates.length; i++) {
    const option = document.createElement("option");
    option.value = roommates[i];
    option.textContent = roommates[i];
    itemPersonSelect.appendChild(option);
  }
}

/**
 * Zeigt eine Fehlermeldung im Einkaufsformular an.
 *
 * @param {string} message - Der anzuzeigende Fehlertext
 */
function showValidationError(message) {
  shoppingError.textContent = message;
  shoppingError.hidden = false;
}

/**
 * Blendet die Fehlermeldung im Einkaufsformular wieder aus.
 */
function clearValidationError() {
  shoppingError.textContent = "";
  shoppingError.hidden = true;
}

/**
 * Prüft die Formulareingaben für einen Einkaufsartikel auf Gültigkeit.
 *
 * @param {string} name - Name des Artikels
 * @param {number} quantity - Anzahl des Artikels
 * @returns {string|null} Fehlermeldung oder null, wenn alles gültig ist
 */
function validateShoppingInput(name, quantity) {
  if (!name || name.length < 2) {
    return "Bitte gib eine gültige Artikelbezeichnung (mindestens 2 Zeichen) ein.";
  }

  if (Number.isNaN(quantity) || quantity < 1 || quantity > 99) {
    return "Bitte gib eine gültige Anzahl zwischen 1 und 99 ein.";
  }

  return null;
}

/**
 * Verarbeitet das Absenden des Einkaufsformulars.
 *
 * @param {Event} event - Das Submit-Event des Formulars
 */
function handleAddShoppingItem(event) {
  event.preventDefault();

  const name = itemNameInput.value.trim();
  const quantity = Number(itemQuantityInput.value);
  const unit = itemUnitInput.value.trim() || "Stück";
  const category = itemCategorySelect.value;
  const person = itemPersonSelect.value;

  const validationError = validateShoppingInput(name, quantity);
  if (validationError) {
    showValidationError(validationError);
    return;
  }

  clearValidationError();

  const newItem = {
    id: `item-${Date.now()}`,
    name: name,
    quantity: quantity,
    unit: unit,
    category: category,
    person: person,
    completed: false
  };

  shoppingItems.push(newItem);
  saveToStorage(STORAGE_KEYS.SHOPPING, shoppingItems);
  renderShoppingList();

  shoppingForm.reset();
  itemQuantityInput.value = "1";
  itemNameInput.focus();
}

/**
 * Schaltet den Erledigt-Status eines Einkaufsartikels um.
 *
 * @param {string} itemId - Die ID des betreffenden Artikels
 */
function toggleShoppingItemStatus(itemId) {
  for (let i = 0; i < shoppingItems.length; i++) {
    if (shoppingItems[i].id === itemId) {
      shoppingItems[i].completed = !shoppingItems[i].completed;
      break;
    }
  }

  saveToStorage(STORAGE_KEYS.SHOPPING, shoppingItems);
  renderShoppingList();
}

/**
 * Löscht einen Artikel anhand seiner ID aus der Einkaufsliste.
 *
 * @param {string} itemId - Die ID des zu löschenden Artikels
 */
function deleteShoppingItem(itemId) {
  shoppingItems = shoppingItems.filter((item) => item.id !== itemId);
  saveToStorage(STORAGE_KEYS.SHOPPING, shoppingItems);
  renderShoppingList();
}

/**
 * Entfernt alle bereits als erledigt markierten Artikel aus der Liste.
 */
function handleClearCompletedItems() {
  shoppingItems = shoppingItems.filter((item) => !item.completed);
  saveToStorage(STORAGE_KEYS.SHOPPING, shoppingItems);
  renderShoppingList();
}

/**
 * Aktualisiert die Statistik-Kacheln (Gesamt, Offen, Erledigt).
 */
function updateShoppingStatistics() {
  const totalCount = shoppingItems.length;
  const completedCount = shoppingItems.filter((item) => item.completed).length;
  const openCount = totalCount - completedCount;

  statTotalElement.textContent = String(totalCount);
  statOpenElement.textContent = String(openCount);
  statDoneElement.textContent = String(completedCount);
}

/**
 * Filtert die Einkaufsartikel anhand von Suchbegriff und gewählter Kategorie.
 *
 * @returns {Array<Object>} Gefilterte Liste der Artikel
 */
function getFilteredShoppingItems() {
  const searchTerm = filterSearchInput.value.trim().toLowerCase();
  const selectedCategory = filterCategorySelect.value;

  return shoppingItems.filter((item) => {
    const matchesSearch =
      !searchTerm ||
      item.name.toLowerCase().includes(searchTerm) ||
      item.person.toLowerCase().includes(searchTerm);

    const matchesCategory =
      selectedCategory === "ALL" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
}

/**
 * Erstellt das DOM-Listenelement (<li>) für einen einzelnen Einkaufsartikel.
 *
 * @param {Object} item - Das Artikel-Objekt
 * @returns {HTMLLIElement} Das fertige Listenelement
 */
function createShoppingListElement(item) {
  const listItem = document.createElement("li");
  listItem.className = item.completed ? "item-card item-completed" : "item-card";

  const infoContainer = document.createElement("div");

  const titleElement = document.createElement("h3");
  titleElement.textContent = `${item.quantity} ${item.unit} ${item.name}`;

  const detailsParagraph = document.createElement("p");
  const categoryBadge = document.createElement("span");
  categoryBadge.className = "badge badge-category";
  categoryBadge.textContent = item.category;

  const statusBadge = document.createElement("span");
  statusBadge.className = item.completed ? "badge badge-done" : "badge badge-open";
  statusBadge.textContent = item.completed ? "Gekauft" : "Offen";

  const personInfo = document.createElement("span");
  personInfo.textContent = ` • Zuständig: ${item.person}`;

  detailsParagraph.appendChild(categoryBadge);
  detailsParagraph.appendChild( document.createTextNode(" ") );
  detailsParagraph.appendChild(statusBadge);
  detailsParagraph.appendChild(personInfo);

  infoContainer.appendChild(titleElement);
  infoContainer.appendChild(detailsParagraph);

  const actionContainer = document.createElement("div");
  actionContainer.className = "form-row";

  const toggleButton = document.createElement("button");
  toggleButton.type = "button";
  toggleButton.className = "btn btn-secondary btn-sm";
  toggleButton.textContent = item.completed ? "Rückgängig" : "Erledigen";
  toggleButton.addEventListener("click", () => {
    toggleShoppingItemStatus(item.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "btn btn-danger btn-sm";
  deleteButton.textContent = "Löschen";
  deleteButton.addEventListener("click", () => {
    deleteShoppingItem(item.id);
  });

  actionContainer.appendChild(toggleButton);
  actionContainer.appendChild(deleteButton);

  listItem.appendChild(infoContainer);
  listItem.appendChild(actionContainer);

  return listItem;
}

/**
 * Rendert alle gefilterten Einkaufsartikel in das DOM und aktualisiert die Statistik.
 */
function renderShoppingList() {
  updateShoppingStatistics();

  const filteredItems = getFilteredShoppingItems();
  shoppingListElement.innerHTML = "";

  if (filteredItems.length === 0) {
    shoppingEmptyHint.hidden = false;
    return;
  }

  shoppingEmptyHint.hidden = true;

  for (let i = 0; i < filteredItems.length; i++) {
    const itemElement = createShoppingListElement(filteredItems[i]);
    shoppingListElement.appendChild(itemElement);
  }
}

initShoppingPage();
