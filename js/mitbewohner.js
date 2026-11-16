/* Gruppenname: WI_A_Gruppe_1 */

let roommateDetails = [];

const roommateForm = document.getElementById("roommate-form");
const roommateNameInput = document.getElementById("roommate-name");
const roommateRoomInput = document.getElementById("roommate-room");
const roommateEmailInput = document.getElementById("roommate-email");
const roommateError = document.getElementById("roommate-error");
const roommateListElement = document.getElementById("roommate-list");

/**
 * Initialisiert die Mitbewohner-Seite beim Laden.
 */
function initRoommatesPage() {
  roommateDetails = getRoommateDetails();
  renderRoommateList();

  roommateForm.addEventListener("submit", handleAddRoommate);
}

/**
 * Zeigt eine Fehlermeldung im Formular an.
 *
 * @param {string} message - Der anzuzeigende Fehlertext
 */
function showRoommateError(message) {
  roommateError.textContent = message;
  roommateError.hidden = false;
}

/**
 * Blendet die Fehlermeldung wieder aus.
 */
function clearRoommateError() {
  roommateError.textContent = "";
  roommateError.hidden = true;
}

/**
 * Prüft die Eingaben für eine neue Person.
 *
 * @param {string} name - Name des Mitbewohners
 * @param {string} email - Optionale E-Mail-Adresse
 * @returns {string|null} Fehlermeldung oder null
 */
function validateRoommateInput(name, email) {
  if (!name || name.length < 2) {
    return "Bitte gib einen Namen mit mindestens 2 Zeichen ein.";
  }

  const nameExists = roommateDetails.some(
    (person) => person.name.toLowerCase() === name.toLowerCase()
  );
  if (nameExists) {
    return "Eine Person mit diesem Namen ist bereits in der WG eingetragen.";
  }

  if (email && !email.includes("@")) {
    return "Bitte gib eine gültige E-Mail-Adresse mit @-Zeichen ein.";
  }

  return null;
}

/**
 * Verarbeitet das Hinzufügen eines neuen Mitbewohners.
 *
 * @param {Event} event - Submit-Event des Formulars
 */
function handleAddRoommate(event) {
  event.preventDefault();

  const name = roommateNameInput.value.trim();
  const room = roommateRoomInput.value.trim() || "Noch kein Zimmer zugewiesen";
  const email = roommateEmailInput.value.trim();

  const validationError = validateRoommateInput(name, email);
  if (validationError) {
    showRoommateError(validationError);
    return;
  }

  clearRoommateError();

  const newPerson = {
    id: `rm-${Date.now()}`,
    name: name,
    room: room,
    email: email
  };

  roommateDetails.push(newPerson);
  saveRoommateDetails(roommateDetails);
  renderRoommateList();

  roommateForm.reset();
  roommateNameInput.focus();
}

/**
 * Entfernt einen Mitbewohner anhand der ID (mindestens 1 Person muss bleiben).
 *
 * @param {string} personId - ID des zu löschenden Eintrags
 */
function deleteRoommate(personId) {
  if (roommateDetails.length <= 1) {
    showRoommateError("Mindestens eine Person muss in der WG verbleiben.");
    return;
  }

  clearRoommateError();
  roommateDetails = roommateDetails.filter((person) => person.id !== personId);
  saveRoommateDetails(roommateDetails);
  renderRoommateList();
}

/**
 * Erstellt das DOM-Listenelement für einen Mitbewohner.
 *
 * @param {Object} person - Das Mitbewohner-Objekt
 * @returns {HTMLLIElement}
 */
function createRoommateElement(person) {
  const listItem = document.createElement("li");
  listItem.className = "item-card";

  const infoContainer = document.createElement("div");

  const nameElement = document.createElement("strong");
  nameElement.textContent = person.name;

  const detailsParagraph = document.createElement("p");
  const roomBadge = document.createElement("span");
  roomBadge.className = "badge badge-category";
  roomBadge.textContent = person.room;

  detailsParagraph.appendChild(roomBadge);

  if (person.email) {
    const emailSpan = document.createElement("span");
    emailSpan.textContent = ` • ${person.email}`;
    detailsParagraph.appendChild(emailSpan);
  }

  infoContainer.appendChild(nameElement);
  infoContainer.appendChild(detailsParagraph);

  const actionContainer = document.createElement("div");
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "btn btn-danger btn-sm";
  deleteButton.textContent = "Entfernen";
  deleteButton.addEventListener("click", () => {
    deleteRoommate(person.id);
  });

  actionContainer.appendChild(deleteButton);

  listItem.appendChild(infoContainer);
  listItem.appendChild(actionContainer);

  return listItem;
}

/**
 * Rendert alle Mitbewohner in die Liste.
 */
function renderRoommateList() {
  roommateListElement.innerHTML = "";

  for (let i = 0; i < roommateDetails.length; i++) {
    const element = createRoommateElement(roommateDetails[i]);
    roommateListElement.appendChild(element);
  }
}

initRoommatesPage();
