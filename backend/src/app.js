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
