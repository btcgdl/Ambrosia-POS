#!/bin/bash

# Termina el script inmediatamente si un comando falla.
set -e

# --- Validación de argumentos ---
AUTO_YES=false
for arg in "$@"; do
  case $arg in
    --yes|-y)
      AUTO_YES=true
      shift
      ;;
    *)
      # Opción desconocida
      ;;
  esac
done

if [[ "$AUTO_YES" != true ]]; then
  echo "❓ No se detectó el modo automático (--yes)."
  echo "¿Deseas continuar con la instalación en modo interactivo? (y/n): "
  read -r REPLY
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Instalación cancelada."
    exit 0
  fi
fi

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
