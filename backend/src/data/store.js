/**
 * In-Memory-Speicher für Fahrzeugdaten.
 *
 * Da noch keine Datenbank verwendet wird, werden die Fahrzeuge
 * im Arbeitsspeicher gehalten. Das Array wird beim Start des Servers
 * mit einigen Beispiel-Datensätzen gefüllt.
 */
const vehicles = [
  {
    id: 1,
    brand: "Volkswagen",
    model: "Golf",
    year: 2021,
    licensePlate: "B-HT 1234",
    mileage: 45000,
  },
  {
    id: 2,
    brand: "BMW",
    model: "320d",
    year: 2019,
    licensePlate: "B-BM 5678",
    mileage: 78000,
  },
];

/**
 * Gibt alle gespeicherten Fahrzeuge zurück.
 *
 * @returns {Array} Liste aller Fahrzeuge
 */
function getAll() {
  return vehicles;
}

/**
 * Sucht ein Fahrzeug anhand seiner ID.
 *
 * @param {number} id - Die ID des gesuchten Fahrzeugs
 * @returns {Object|undefined} Das gefundene Fahrzeug oder undefined
 */
function getById(id) {
  return vehicles.find((vehicle) => vehicle.id === id);
}

/**
 * Fügt ein neues Fahrzeug zum Speicher hinzu.
 *
 * @param {Object} vehicleData - Die Daten des neuen Fahrzeugs
 * @returns {Object} Das neu erstellte Fahrzeug mit zugewiesener ID
 */
function create(vehicleData) {
  // Einfache ID-Generierung: höchste vorhandene ID + 1
  const newId = vehicles.length > 0 ? Math.max(...vehicles.map((v) => v.id)) + 1 : 1;

  const newVehicle = {
    id: newId,
    brand: vehicleData.brand,
    model: vehicleData.model,
    year: vehicleData.year,
    licensePlate: vehicleData.licensePlate,
    mileage: vehicleData.mileage,
  };

  vehicles.push(newVehicle);
  return newVehicle;
}

/**
 * Aktualisiert ein bestehendes Fahrzeug.
 *
 * @param {number} id - Die ID des zu aktualisierenden Fahrzeugs
 * @param {Object} updates - Die zu aktualisierenden Felder
 * @returns {Object|undefined} Das aktualisierte Fahrzeug oder undefined
 */
function update(id, updates) {
  const index = vehicles.findIndex((vehicle) => vehicle.id === id);
  if (index === -1) {
    return undefined;
  }

  // Aktualisiere nur die übergebenen Felder
  vehicles[index] = {
    ...vehicles[index],
    ...updates,
    id: id, // Die ID darf nicht verändert werden
  };

  return vehicles[index];
}

/**
 * Löscht ein Fahrzeug aus dem Speicher.
 *
 * @param {number} id - Die ID des zu löschenden Fahrzeugs
 * @returns {boolean} true wenn gelöscht, false wenn nicht gefunden
 */
function remove(id) {
  const index = vehicles.findIndex((vehicle) => vehicle.id === id);
  if (index === -1) {
    return false;
  }

  vehicles.splice(index, 1);
  return true;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
