/**
 * REST-Routen für Wartungen.   Hier werden die WARTUNGSDATEN abgefragt.  Das ist die Schnittstelle zwischen dem Reminder-Service und dem Backend.
 *
 * Bietet CRUD-Operationen für Wartungsdaten an.
 * Alle Routen sind unterhalb eines Fahrzeugs erreichbar:
 *
 * - GET    /api/vehicles/:vehicleId/maintenances
 * - GET    /api/vehicles/:vehicleId/maintenances/:id
 * - POST   /api/vehicles/:vehicleId/maintenances
 * - PUT    /api/vehicles/:vehicleId/maintenances/:id
 * - DELETE /api/vehicles/:vehicleId/maintenances/:id
 */

const express = require("express");
const router = express.Router({ mergeParams: true });

// Import des In-Memory-Speichers für Wartungen
const maintenanceStore = require("../data/maintenanceStore");

// ============================================================
// GET /api/vehicles/:vehicleId/maintenances
// ============================================================

/**
 * Gibt alle Wartungen eines Fahrzeugs zurück.
 */
router.get("/", (req, res) => {                            //Hier empfängt das Backend die Anfrage vom Reminder-Service und verarbeitet sie.
  const vehicleId = parseInt(req.params.vehicleId, 10);    //Das ist die Verknüpfung zum Fahrzeug. Welche Wartungen gehören zu welchem Fahrzeug? Das wird hier über die vehicleId ermittelt.
  const maintenances = maintenanceStore.getByVehicleId(vehicleId); //Das wird hier über die vehicleId ermittelt/rausgefiltert.  Das ist die Stelle, an der das Backend die Wartungsdaten für das angefragte Fahrzeug abruft.

  res.json({                                            //Das ist die Stelle, an der das Backend die JSON-Antwort erzeugt und zurückschickt.
    success: true,
    count: maintenances.length,
    data: maintenances,
  });
});

// ============================================================
// GET /api/vehicles/:vehicleId/maintenances/:id
// ============================================================

/**
 * Gibt eine einzelne Wartung zurück.
 * Zusätzlich wird geprüft, ob die Wartung zum angegebenen Fahrzeug gehört.
 */
router.get("/:id", (req, res) => {
  const vehicleId = parseInt(req.params.vehicleId, 10);
  const id = parseInt(req.params.id, 10);
  const maintenance = maintenanceStore.getById(id);

  if (!maintenance) {
    return res.status(404).json({
      success: false,
      message: `Wartung mit ID ${id} nicht gefunden.`,
    });
  }

  if (!maintenanceStore.belongsToVehicle(vehicleId, id)) {
    return res.status(404).json({
      success: false,
      message: `Wartung mit ID ${id} gehört nicht zu Fahrzeug ${vehicleId}.`,
    });
  }

  res.json({
    success: true,
    data: maintenance,
  });
});

// ============================================================
// POST /api/vehicles/:vehicleId/maintenances
// ============================================================

/**
 * Erstellt eine neue Wartung für ein Fahrzeug.
 *
 * Erwartete Felder im Request-Body:
 * - title (string)               Bezeichnung der Wartung
 * - intervalKm (number)          Intervall in Kilometern
 * - intervalMonths (number)      Intervall in Monaten
 * - lastPerformedAt (string)     Datum der letzten Durchführung (YYYY-MM-DD)
 * - lastPerformedKm (number)     Kilometerstand bei der letzten Durchführung
 */
router.post("/", (req, res) => {
  const vehicleId = parseInt(req.params.vehicleId, 10);
  const { title, intervalKm, intervalMonths, lastPerformedAt, lastPerformedKm } =
    req.body;

  if (
    !title ||
    intervalKm === undefined ||
    intervalMonths === undefined ||
    !lastPerformedAt ||
    lastPerformedKm === undefined
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Alle Felder (title, intervalKm, intervalMonths, lastPerformedAt, lastPerformedKm) sind erforderlich.",
    });
  }

  const newMaintenance = maintenanceStore.create({
    vehicleId,
    title,
    intervalKm,
    intervalMonths,
    lastPerformedAt,
    lastPerformedKm,
  });

  res.status(201).json({
    success: true,
    message: "Wartung erfolgreich erstellt.",
    data: newMaintenance,
  });
});

// ============================================================
// PUT /api/vehicles/:vehicleId/maintenances/:id
// ============================================================

/**
 * Aktualisiert eine bestehende Wartung.
 *
 * Prüft zuerst, ob die Wartung existiert und zum Fahrzeug gehört.
 */
router.put("/:id", (req, res) => {
  const vehicleId = parseInt(req.params.vehicleId, 10);
  const id = parseInt(req.params.id, 10);
  const existingMaintenance = maintenanceStore.getById(id);

  if (!existingMaintenance) {
    return res.status(404).json({
      success: false,
      message: `Wartung mit ID ${id} nicht gefunden.`,
    });
  }

  if (!maintenanceStore.belongsToVehicle(vehicleId, id)) {
    return res.status(404).json({
      success: false,
      message: `Wartung mit ID ${id} gehört nicht zu Fahrzeug ${vehicleId}.`,
    });
  }

  const updatedMaintenance = maintenanceStore.update(id, req.body);

  res.json({
    success: true,
    message: "Wartung erfolgreich aktualisiert.",
    data: updatedMaintenance,
  });
});

// ============================================================
// DELETE /api/vehicles/:vehicleId/maintenances/:id
// ============================================================

/**
 * Löscht eine Wartung.
 *
 * Prüft zuerst, ob die Wartung existiert und zum Fahrzeug gehört.
 */
router.delete("/:id", (req, res) => {
  const vehicleId = parseInt(req.params.vehicleId, 10);
  const id = parseInt(req.params.id, 10);
  const maintenance = maintenanceStore.getById(id);

  if (!maintenance) {
    return res.status(404).json({
      success: false,
      message: `Wartung mit ID ${id} nicht gefunden.`,
    });
  }

  if (!maintenanceStore.belongsToVehicle(vehicleId, id)) {
    return res.status(404).json({
      success: false,
      message: `Wartung mit ID ${id} gehört nicht zu Fahrzeug ${vehicleId}.`,
    });
  }

  maintenanceStore.remove(id);

  res.json({
    success: true,
    message: `Wartung mit ID ${id} erfolgreich gelöscht.`,
  });
});

module.exports = router;
