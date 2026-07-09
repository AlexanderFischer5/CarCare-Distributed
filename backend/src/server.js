/**
 * HTTP-Server-Startpunkt für das CarCare-Distributed Backend.
 *
 * Diese Datei erstellt den Server, bindet die Express-App ein
 * und lauscht auf dem konfigurierten Port.
 */

const app = require("./app");

// ============================================================
// Konfiguration
// ============================================================

/**
 * Port, auf dem der Server lauscht.
 * Kann über die Umgebungsvariable PORT überschrieben werden
 * (z. B. für unterschiedliche Umgebungen oder Docker).
 */
const PORT = process.env.PORT || 3000;

// ============================================================
// Server starten
// ============================================================

const server = app.listen(PORT, () => {
  console.log(`Backend-Server läuft auf http://localhost:${PORT}`);
  console.log(`Fahrzeug-API verfügbar unter http://localhost:${PORT}/api/vehicles`);
});

module.exports = server;
