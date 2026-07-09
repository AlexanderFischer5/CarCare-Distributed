/**
 * Express-Anwendungskonfiguration.
 *
 * Diese Datei richtet die Middleware und die Routen ein.
 * Der eigentliche Server wird in server.js gestartet.
 */

const express = require("express");
const cors = require("cors");

// Erstelle eine neue Express-App
const app = express();

// ============================================================
// Middleware
// ============================================================

/**
 * CORS-Middleware erlaubt Anfragen von anderen Ursprüngen.
 * In der verteilten Anwendung wird das Frontend später
 * vermutlich von einem anderen Port aus auf das Backend zugreifen.
 */
app.use(cors());

/**
 * Body-Parser-Middleware: Wandelt eingehende JSON-Request-Bodies
 * in JavaScript-Objekte um, damit sie über req.body verfügbar sind.
 */
app.use(express.json());

/**
 * Body-Parser-Middleware für URL-encoded Formulardaten.
 */
app.use(express.urlencoded({ extended: true }));

// ============================================================
// Routen
// ============================================================

/**
 * Alle Wartungs-Routen werden unterhalb eines Fahrzeugs verfügbar gemacht.
 * Beispiel: /api/vehicles/1/maintenances
 *
 * WICHTIG: Diese Routen MÜSSEN vor den Fahrzeug-Routen registriert werden,
 * da der vehiclesRouter die Route /:id enthält, die sonst
 * /api/vehicles/1/maintenances als id="1/maintenances" matchen würde.
 */
const maintenancesRouter = require("./routes/maintenances");
app.use("/api/vehicles/:vehicleId/maintenances", maintenancesRouter);

/**
 * Alle Fahrzeug-Routen werden unter /api/vehicles verfügbar gemacht.
 */
const vehiclesRouter = require("./routes/vehicles");
app.use("/api/vehicles", vehiclesRouter);

// ============================================================
// Fehlerbehandlung
// ============================================================

/**
 * Allgemeiner Fehler-Handler für nicht gefundene Routen (404).
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Die angeforderte Route existiert nicht.",
  });
});

module.exports = app;
