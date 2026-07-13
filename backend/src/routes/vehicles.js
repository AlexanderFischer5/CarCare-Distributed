/**
 * REST-Routen für Fahrzeuge.    Hier werden die FAHRZEUGDATEN abgefragt.
 *
 * Bietet CRUD-Operationen für Fahrzeugdaten an:
 * - GET    /api/vehicles       Alle Fahrzeuge abrufen
 * - GET    /api/vehicles/:id   Ein einzelnes Fahrzeug abrufen
 * - POST   /api/vehicles       Neues Fahrzeug erstellen
 * - PUT    /api/vehicles/:id   Fahrzeug aktualisieren
 * - DELETE /api/vehicles/:id   Fahrzeug löschen
 */

const express = require("express");
const router = express.Router();

// Import des In-Memory-Speichers
const vehicleStore = require("../data/store");

/**
 * GET /api/vehicles
 * Gibt alle gespeicherten Fahrzeuge zurück.
 */
router.get("/", (req, res) => {         //Hier empfängt das Backend die Anfrage vom Reminder-Service und verarbeitet sie.
  const vehicles = vehicleStore.getAll();
  res.json({
    success: true,
    count: vehicles.length,
    data: vehicles,
  });
});

/**
 * GET /api/vehicles/:id
 * Gibt ein einzelnes Fahrzeug anhand der ID zurück.
 */
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const vehicle = vehicleStore.getById(id);

  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: `Fahrzeug mit ID ${id} nicht gefunden.`,
    });
  }

  res.json({
    success: true,
    data: vehicle,
  });
});

/**
 * POST /api/vehicles
 * Erstellt ein neues Fahrzeug.
 *
 * Erwartete Felder im Request-Body:
 * - brand (string)      Hersteller
 * - model (string)      Modell
 * - year (number)       Baujahr
 * - licensePlate (string) Kennzeichen
 * - mileage (number)    Kilometerstand
 */
router.post("/", (req, res) => {
  const { brand, model, year, licensePlate, mileage } = req.body;

  // Einfache Validierung der Pflichtfelder
  if (!brand || !model || !year || !licensePlate || mileage === undefined) {
    return res.status(400).json({
      success: false,
      message: "Alle Felder (brand, model, year, licensePlate, mileage) sind erforderlich.",
    });
  }

  const newVehicle = vehicleStore.create({
    brand,
    model,
    year,
    licensePlate,
    mileage,
  });

  res.status(201).json({
    success: true,
    message: "Fahrzeug erfolgreich erstellt.",
    data: newVehicle,
  });
});

/**
 * PUT /api/vehicles/:id
 * Aktualisiert ein bestehendes Fahrzeug.
 *
 * Es können einzelne oder mehrere Felder aktualisiert werden.
 */
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existingVehicle = vehicleStore.getById(id);

  if (!existingVehicle) {
    return res.status(404).json({
      success: false,
      message: `Fahrzeug mit ID ${id} nicht gefunden.`,
    });
  }

  // Aktualisiere nur die übergebenen Felder
  const updatedVehicle = vehicleStore.update(id, req.body);

  res.json({
    success: true,
    message: "Fahrzeug erfolgreich aktualisiert.",
    data: updatedVehicle,
  });
});

/**
 * DELETE /api/vehicles/:id
 * Löscht ein Fahrzeug anhand der ID.
 */
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const deleted = vehicleStore.remove(id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: `Fahrzeug mit ID ${id} nicht gefunden.`,
    });
  }

  res.json({
    success: true,
    message: `Fahrzeug mit ID ${id} erfolgreich gelöscht.`,
  });
});

module.exports = router;
