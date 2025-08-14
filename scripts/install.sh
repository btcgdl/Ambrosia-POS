#!/bin/bash

# Termina el script inmediatamente si un comando falla.
set -e

# --- Funciones para mejorar la legibilidad ---
print_header() {
  echo "----------------------------------------"
  echo " 🚀 Instalador Unificado Ambrosia & Phoenixd"
  echo "----------------------------------------"
}

install_ambrosia() {
  echo "➡️  Iniciando instalación de Ambrosia POS..."
  curl -fsSL https://raw.githubusercontent.com/btcgdl/Ambrosia-POS/master/scripts/ambrosia.sh | bash -s -- "$@"
  echo "✅ Ambrosia POS instalado."
}

install_phoenixd() {
  echo "➡️  Iniciando instalación de phoenixd..."
  curl -fsSL https://raw.githubusercontent.com/btcgdl/Ambrosia-POS/master/scripts/phoenixd.sh | bash -s -- "$@"
  echo "✅ phoenixd instalado."
}

# --- Flujo principal de ejecución ---
print_header
install_ambrosia
install_phoenixd

echo "🎉 ¡Instalación completa!"
