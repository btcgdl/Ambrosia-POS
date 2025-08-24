#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Argument validation ---
AUTO_YES=false
for arg in "$@"; do
  case $arg in
    --yes|-y)
      AUTO_YES=true
      shift
      ;;
    *)
      # Unknown option
      ;;
  esac
done

# --- Functions for readability ---
print_header() {
  echo "----------------------------------------"
  echo " 🚀 Unified Ambrosia & Phoenixd Installer"
  echo "----------------------------------------"
}

install_ambrosia() {
  echo "➡️  Starting Ambrosia POS installation..."
  local script_path="/tmp/ambrosia_install_temp.sh"
  if ! curl -fsSL "https://raw.githubusercontent.com/btcgdl/Ambrosia-POS/master/scripts/ambrosia.sh" -o "$script_path"; then
    echo "❌ Error downloading Ambrosia installation script." >&2
    exit 1
  fi
  chmod +x "$script_path"
  "$script_path" "$@"
  rm "$script_path"
  echo "✅ Ambrosia POS installed."
}

install_phoenixd() {
  echo "➡️  Starting phoenixd installation..."
  local script_path="/tmp/phoenixd_install_temp.sh"
  if ! curl -fsSL "https://raw.githubusercontent.com/btcgdl/Ambrosia-POS/master/scripts/phoenixd.sh" -o "$script_path"; then
    echo "❌ Error downloading phoenixd installation script." >&2
    exit 1
  fi
  chmod +x "$script_path"
  "$script_path" "$@"
  rm "$script_path"
  echo "✅ phoenixd installed."
}

install_client() {
  echo "➡️  Starting client installation..."
  local script_path="/tmp/client_install_temp.sh"
  if ! curl -fsSL "https://raw.githubusercontent.com/btcgdl/Ambrosia-POS/master/scripts/install-client.sh" -o "$script_path"; then
    echo "❌ Error downloading client installation script." >&2
    exit 1
  fi
  chmod +x "$script_path"
  "$script_path" "$@"
  rm "$script_path"
  echo "✅ Client installed."
}

# --- Main execution flow ---
print_header
install_phoenixd
install_ambrosia
install_client


echo "🎉 Installation complete!"