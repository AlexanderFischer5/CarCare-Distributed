/**
 * In-Memory-Speicher für Wartungsdaten.
 *
 * Da noch keine Datenbank verwendet wird, werden die Wartungen
 * im Arbeitsspeicher gehalten. Das Array wird beim Start des Servers
 * mit einigen Beispiel-Datensätzen gefüllt.
 *
 * Jede Wartung gehört über vehicleId zu einem Fahrzeug.
 */
const maintenances = [
  {
    id: 1,
    vehicleId: 1,
    title: "Ölwechsel",
    intervalKm: 30000,
    intervalMonths: 12,
    lastPerformedAt: "2025-06-15",
    lastPerformedKm: 42000,
  },
  {
    id: 2,
    vehicleId: 1,
    title: "Bremsenwechsel",
    intervalKm: 60000,
    intervalMonths: 24,
    lastPerformedAt: "2024-12-01",
    lastPerformedKm: 40000,
  },
  {
    id: 3,
    vehicleId: 2,
    title: "Inspektion",
    intervalKm: 30000,
    intervalMonths: 12,
    lastPerformedAt: "2025-03-20",
    lastPerformedKm: 72000,
  },
];

/**
 * Gibt alle gespeicherten Wartungen zurück.
 *
 * @returns {Array} Liste aller Wartungen
 */
function getAll() {
  return maintenances;
}

/**
 * Sucht eine Wartung anhand ihrer ID.
 *
 * @param {number} id - Die ID der gesuchten Wartung
 * @returns {Object|undefined} Die gefundene Wartung oder undefined
 */
function getById(id) {
  return maintenances.find((maintenance) => maintenance.id === id);
}

/**
 * Sucht alle Wartungen eines bestimmten Fahrzeugs anhand der vehicleId.
 *
 * @param {number} vehicleId - Die ID des Fahrzeugs
 * @returns {Array} Liste aller Wartungen des Fahrzeugs
 */
function getByVehicleId(vehicleId) {
  return maintenances.filter((maintenance) => maintenance.vehicleId === vehicleId);
}

/**
 * Prüft, ob eine Wartung zu einem Fahrzeug gehört.
 *
 * @param {number} vehicleId - Die ID des Fahrzeugs
 * @param {number} maintenanceId - Die ID der Wartung
 * @returns {boolean} true, wenn die Wartung zum Fahrzeug gehört
 */
function belongsToVehicle(vehicleId, maintenanceId) {
  const maintenance = getById(maintenanceId);
  return maintenance !== undefined && maintenance.vehicleId === vehicleId;
}

/**
 * Erstellt eine neue Wartung.
 *
 * @param {Object} maintenanceData - Die Daten der neuen Wartung
 * @returns {Object} Die neu erstellte Wartung mit zugewiesener ID
 */
function create(maintenanceData) {
  const newId =
    maintenances.length > 0 ? Math.max(...maintenances.map((m) => m.id)) + 1 : 1;

  const newMaintenance = {
    id: newId,
    vehicleId: maintenanceData.vehicleId,
    title: maintenanceData.title,
    intervalKm: maintenanceData.intervalKm,
    intervalMonths: maintenanceData.intervalMonths,
    lastPerformedAt: maintenanceData.lastPerformedAt,
    lastPerformedKm: maintenanceData.lastPerformedKm,
  };

  maintenances.push(newMaintenance);
  return newMaintenance;
}

/**
 * Aktualisiert eine bestehende Wartung.
 *
 * @param {number} id - Die ID der zu aktualisierenden Wartung
 * @param {Object} updates - Die zu aktualisierenden Felder
 * @returns {Object|undefined} Die aktualisierte Wartung oder undefined
 */
function update(id, updates) {
  const index = maintenances.findIndex((maintenance) => maintenance.id === id);
  if (index === -1) {
    return undefined;
  }

  maintenances[index] = {
    ...maintenances[index],
    ...updates,
    id: id,
  };

  return maintenances[index];
}

/**
 * Löscht eine Wartung aus dem Speicher.
 *
 * @param {number} id - Die ID der zu löschenden Wartung
 * @returns {boolean} true wenn gelöscht, false wenn nicht gefunden
 */
function remove(id) {
  const index = maintenances.findIndex((maintenance) => maintenance.id === id);
  if (index === -1) {
    return false;
  }

  maintenances.splice(index, 1);
  return true;
}

module.exports = {
  getAll,
  getById,
  getByVehicleId,
  belongsToVehicle,
  create,
  update,
  remove,
};
