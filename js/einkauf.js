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
    completed: false
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
 * Erstellt das DOM-Listenelement (<li>) für einen einzelnen Einkaufsartikel.
 *
 * @param {Object} item - Das Artikel-Objekt
 * @returns {HTMLLIElement} Das fertige Listenelement
 */
function createShoppingListElement(item) {
  const listItem = document.createElement("li");
  listItem.className = "item-card";

  const infoContainer = document.createElement("div");

  const titleElement = document.createElement("strong");
  titleElement.textContent = `${item.quantity} ${item.unit} ${item.name}`;

  const detailsParagraph = document.createElement("p");
  const categoryBadge = document.createElement("span");
  categoryBadge.className = "badge badge-category";
  categoryBadge.textContent = item.category;

  const personInfo = document.createElement("span");
  personInfo.textContent = ` • Zuständig: ${item.person}`;

  detailsParagraph.appendChild(categoryBadge);
  detailsParagraph.appendChild(personInfo);

  infoContainer.appendChild(titleElement);
  infoContainer.appendChild(detailsParagraph);

  const actionContainer = document.createElement("div");

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "btn btn-danger btn-sm";
  deleteButton.textContent = "Löschen";
  deleteButton.addEventListener("click", () => {
    deleteShoppingItem(item.id);
  });

  actionContainer.appendChild(deleteButton);

  listItem.appendChild(infoContainer);
  listItem.appendChild(actionContainer);

  return listItem;
}

/**
 * Rendert alle Einkaufsartikel in das DOM.
 */
function renderShoppingList() {
  shoppingListElement.innerHTML = "";

  if (shoppingItems.length === 0) {
    shoppingEmptyHint.hidden = false;
    return;
  }

  shoppingEmptyHint.hidden = true;

  for (let i = 0; i < shoppingItems.length; i++) {
    const itemElement = createShoppingListElement(shoppingItems[i]);
    shoppingListElement.appendChild(itemElement);
  }
}

initShoppingPage();
