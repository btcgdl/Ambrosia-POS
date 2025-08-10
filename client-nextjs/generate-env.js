const fs = require("fs");
const os = require("os");
const path = require("path");

const confPath = path.join(os.homedir(), ".Ambrosia-POS", "ambrosia.conf");
const envPath = path.join(__dirname, ".env");

// Variables que sí quieres copiar
const allowedKeys = ["REACT_APP_API_BASE_URL", "HOST"];

try {
  const raw = fs.readFileSync(confPath, "utf-8");
  const lines = raw.split("\n");

  const filtered = lines
    .map((line) => line.trim())
    .filter((line) => allowedKeys.some((key) => line.startsWith(key + "=")));

  fs.writeFileSync(envPath, filtered.join("\n") + "\n");

  console.log("✅ .env generado con:", filtered);
} catch (err) {
  console.error("❌ Error generando .env desde ambrosia.conf:", err.message);
}
