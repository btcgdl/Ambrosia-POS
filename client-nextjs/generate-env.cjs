const fs = require("fs");
const os = require("os");
const path = require("path");

const confPath = path.join(os.homedir(), ".Ambrosia-POS", "ambrosia.conf");
const envPath = path.join(__dirname, ".env");

let apiBaseUrl = "";
let host = "";

try {
  const raw = fs.readFileSync(confPath, "utf-8");
  const lines = raw.split("\n");

  const confData = {};
  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine.includes("=")) {
      const [key, value] = trimmedLine.split("=").map((s) => s.trim());
      confData[key] = value;
    }
  });

  const ip = confData["http-bind-ip"];
  const port = confData["http-bind-port"];
  const hostValue = confData["http-bind-ip"];

  // Combinar IP y puerto para la URL base
  if (ip && port) {
    apiBaseUrl = `http://${ip}:${port}`;
    console.log("✅ API Base URL generada:", apiBaseUrl);
  }

  // Obtener el valor de HOST
  if (hostValue) {
    host = hostValue;
    console.log("✅ HOST generado:", host);
  }

  // Crear el contenido final para el .env
  let envContent = "";
  // if (apiBaseUrl) {
  //   envContent += `NEXT_PUBLIC_API_URL=${apiBaseUrl}\n`;
  // }
  if (host) {
    envContent += `HOST=${host}\n`;
  }
  if (port) {
    envContent += `NEXT_PUBLIC_PORT_API=${port}\n`;
  }

  fs.writeFileSync(envPath, envContent);

  console.log("✅ Archivo .env escrito exitosamente.");
} catch (err) {
  console.error("❌ Error generando .env desde ambrosia.conf:", err.message);
}
