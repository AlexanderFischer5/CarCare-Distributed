/**
 * Reminder-Service für CarCare-Distributed.
 *
 * Dieser Service sendet eine HTTP-GET-Anfrage an das Backend
 * und gibt die empfangenen Wartungsdaten in der Konsole aus.
 */

const http = require("http");

// ============================================================
// Konfiguration
// ============================================================

/**
 * URL des Backend-Servers.
 * Muss an die tatsächliche Backend-URL angepasst werden,
 * falls der Service auf einem anderen Host oder Port läuft.
 */
const BACKEND_URL = "http://localhost:3000";

/**
 * Fahrzeug-ID, dessen Wartungen abgerufen werden sollen.
 */
const VEHICLE_ID = 1;

// ============================================================
// Hauptfunktion
// ============================================================

/**
 * Ruft die Wartungen für ein Fahrzeug vom Backend ab
 * und gibt sie in der Konsole aus.
 */
function fetchMaintenances() {
  console.log(`Ruft Wartungen für Fahrzeug ${VEHICLE_ID} ab...`);
  console.log(`Backend-URL: ${BACKEND_URL}/api/vehicles/${VEHICLE_ID}/maintenances`);
  console.log("");

  const url = `${BACKEND_URL}/api/vehicles/${VEHICLE_ID}/maintenances`;

  http.get(url, (res) => {
    let data = "";

    // Empfange die Antwortdaten in Chunks
    res.on("data", (chunk) => {
      data += chunk;
    });

    // Wenn die Antwort vollständig ist
    res.on("end", () => {
      try {
        const result = JSON.parse(data);

        if (!result.success) {
          console.log("Fehler:", result.message || "Unbekannter Fehler");
          return;
        }

        if (result.count === 0) {
          console.log("Keine Wartungen für dieses Fahrzeug gefunden.");
          return;
        }

        // Überschrift ausgeben
        console.log(`Gefundene Wartungen: ${result.count}`);
        console.log("=".repeat(60));

        // Jede Wartung formatiert ausgeben
        result.data.forEach((maintenance, index) => {
          console.log(`\nWartung #${index + 1}`);
          console.log(`  ID:           ${maintenance.id}`);
          console.log(`  Bezeichnung:  ${maintenance.title}`);
          console.log(
            `  Intervall:    ${maintenance.intervalKm} km / ${maintenance.intervalMonths} Monate`
          );
          console.log(`  Letzte Durchführung: ${maintenance.lastPerformedAt}`);
          console.log(`  Kilometerstand:      ${maintenance.lastPerformedKm} km`);
        });

        console.log("\n" + "=".repeat(60));
      } catch (error) {
        console.error("Fehler beim Parsen der Antwort:", error.message);
        console.error("Empfangene Daten:", data);
      }
    });
  }).on("error", (error) => {
    // Fehler beim Verbindungsaufbau
    console.error("");
    console.error("Fehler: Backend nicht erreichbar!");
    console.error(`  URL: ${url}`);
    console.error(`  Details: ${error.message}`);
    console.error("");
    console.error("Bitte prüfen Sie, ob der Backend-Server läuft.");
  });
}

// ============================================================
// Service starten
// ============================================================

// Führe die Hauptfunktion aus
fetchMaintenances();
