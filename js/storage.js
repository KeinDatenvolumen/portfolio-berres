/* Gruppenname: WI_A_Gruppe_1 */

/**
 * Zentrale Schlüssel für den Zugriff auf localStorage.
 */
const STORAGE_KEYS = {
  SHOPPING: "wg_held_einkaufsliste",
  CLEANING: "wg_held_putzplan",
  FINANCE: "wg_held_finanzen",
  ROOMMATES: "wg_held_mitbewohner",
  ROOMMATE_DETAILS: "wg_held_mitbewohner_details"
};

/**
 * Standard-Mitbewohner, falls noch keine eigenen Personen angelegt wurden.
 */
const DEFAULT_ROOMMATES = ["Alex", "Sam", "Robin", "Luca"];

const DEFAULT_ROOMMATE_DETAILS = [
  { id: "rm-1", name: "Alex", room: "Zimmer 1 (Straßenseite)", email: "alex@wg-held.de" },
  { id: "rm-2", name: "Sam", room: "Zimmer 2 (Gartenseite)", email: "sam@wg-held.de" },
  { id: "rm-3", name: "Robin", room: "Zimmer 3 (Balkon)", email: "robin@wg-held.de" },
  { id: "rm-4", name: "Luca", room: "Zimmer 4 (Dachgeschoss)", email: "luca@wg-held.de" }
];

/**
 * Lädt Daten aus dem localStorage und wandelt sie von JSON zurück in ein JS-Objekt/Array.
 * Falls noch keine Daten gespeichert sind oder ein Fehler auftritt, wird fallbackData zurückgegeben.
 *
 * @param {string} key - Der Schlüssel im localStorage
 * @param {*} fallbackData - Standarddaten, falls der Speicher leer ist
 * @returns {*} Die geladenen Daten oder fallbackData
 */
function loadFromStorage(key, fallbackData) {
  try {
    const rawData = localStorage.getItem(key);
    if (!rawData) {
      return fallbackData;
    }
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Fehler beim Laden aus localStorage:", error);
    return fallbackData;
  }
}

/**
 * Speichert beliebige Daten als JSON-String im localStorage.
 *
 * @param {string} key - Der Schlüssel im localStorage
 * @param {*} data - Die zu speichernden Daten
 */
function saveToStorage(key, data) {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error("Fehler beim Speichern in localStorage:", error);
  }
}

/**
 * Gibt das aktuelle Array der detaillierten Mitbewohner-Objekte zurück.
 *
 * @returns {Array<{id: string, name: string, room: string, email: string}>}
 */
function getRoommateDetails() {
  const details = loadFromStorage(STORAGE_KEYS.ROOMMATE_DETAILS, null);
  if (!Array.isArray(details) || details.length === 0) {
    saveToStorage(STORAGE_KEYS.ROOMMATE_DETAILS, DEFAULT_ROOMMATE_DETAILS);
    saveToStorage(
      STORAGE_KEYS.ROOMMATES,
      DEFAULT_ROOMMATE_DETAILS.map((person) => person.name)
    );
    return [...DEFAULT_ROOMMATE_DETAILS];
  }
  return details;
}

/**
 * Speichert die detaillierte Mitbewohner-Liste und synchronisiert gleichzeitig die Namensliste.
 *
 * @param {Array<{id: string, name: string, room: string, email: string}>} details
 */
function saveRoommateDetails(details) {
  saveToStorage(STORAGE_KEYS.ROOMMATE_DETAILS, details);
  const names = details.map((person) => person.name);
  saveToStorage(STORAGE_KEYS.ROOMMATES, names);
}

/**
 * Gibt das aktuelle Array der WG-Mitbewohner-Namen aus dem localStorage zurück.
 * Wird von Einkaufsliste, Putzplan und Finanzen verwendet.
 *
 * @returns {string[]} Liste der Mitbewohner-Namen
 */
function getRoommates() {
  const details = getRoommateDetails();
  return details.map((person) => person.name);
}
