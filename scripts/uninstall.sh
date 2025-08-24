#!/bin/bash

set -o pipefail

# This script is for uninstalling Ambrosia POS from a Linux system.

# Parse command line arguments
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

INSTALL_DIR="$HOME/.local/ambrosia"
CONFIG_DIR="$HOME/.Ambrosia-POS"
BIN_DIR="$HOME/.local/bin"
SERVICE_FILE="/etc/systemd/system/ambrosia.service"

echo ""
echo "🗑️  Ambrosia POS Uninstaller"
echo "-----------------------------------"
echo "This script will remove all Ambrosia POS components from your system."
echo ""

if [[ "$AUTO_YES" == true ]]; then
  # Auto-yes mode
  REPLY="y"
elif [[ -t 0 ]]; then
  # Interactive mode
  echo "Are you sure you want to uninstall Ambrosia POS? This will remove all data. (y/n): "
  read -r REPLY
else
  # Non-interactive mode
  echo "Running in non-interactive mode. Proceeding with uninstallation."
  REPLY="y"
fi

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Uninstallation cancelled."
  exit 0
fi

# Check if systemd service exists and stop/disable it
if [ -f "$SERVICE_FILE" ]; then
  echo "Stopping and disabling Ambrosia POS service..."
  sudo systemctl stop ambrosia 2>/dev/null || true
  sudo systemctl disable ambrosia 2>/dev/null || true
  sudo rm -f "$SERVICE_FILE" 2>/dev/null || true
  sudo systemctl daemon-reload 2>/dev/null || true
  echo "✅ Systemd service removed"
fi

# Remove binary symlink
if [ -L "$BIN_DIR/ambrosia" ]; then
  echo "Removing binary symlink..."
  rm -f "$BIN_DIR/ambrosia"
  echo "✅ Binary symlink removed"
fi

# Remove installation directory
if [ -d "$INSTALL_DIR" ]; then
  echo "Removing installation directory..."
  rm -rf "$INSTALL_DIR"
  echo "✅ Installation directory removed"
fi

# Ask about removing configuration directory
if [ -d "$CONFIG_DIR" ]; then
  if [[ "$AUTO_YES" == true ]]; then
    REMOVE_CONFIG="y"
  elif [[ -t 0 ]]; then
    echo "Do you want to remove the configuration directory with all your settings? (y/n): "
    read -r REMOVE_CONFIG
  else
    # In non-interactive mode, preserve config by default
    REMOVE_CONFIG="n"
  fi

  if [[ $REMOVE_CONFIG =~ ^[Yy]$ ]]; then
    echo "Removing configuration directory..."
    rm -rf "$CONFIG_DIR"
    echo "✅ Configuration directory removed"
  else
    echo "Configuration directory preserved at: $CONFIG_DIR"
  fi
fi

echo ""
echo "✅ Ambrosia POS has been uninstalled successfully!"
echo ""
echo "Note: Any PATH modifications made during installation were not removed."
echo "If you'd like to remove them, please edit your ~/.bashrc and ~/.zshrc files."
echo ""

# Uninstall phoenixd
BIN_DIR="/usr/local/bin"
SERVICE_FILE="/etc/systemd/system/phoenixd.service"

echo ""
echo "🗑️  phoenixd Uninstaller"
echo "-----------------------------------"
echo "This script will remove phoenixd binaries and service from your system."
echo "⚠️  Note: Your wallet data and configuration files will NOT be removed."
echo ""

if [[ "$AUTO_YES" == true ]]; then
  REPLY="y"
elif [[ -t 0 ]]; then
  echo "Are you sure you want to uninstall phoenixd? (y/n): "
  read -r REPLY
else
  echo "Running in non-interactive mode. Proceeding with uninstallation."
  REPLY="y"
fi

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Uninstallation cancelled."
  exit 0
fi

if [ -f "$SERVICE_FILE" ]; then
  echo "Stopping and disabling phoenixd service..."
  sudo systemctl stop phoenixd 2>/dev/null || true
  sudo systemctl disable phoenixd 2>/dev/null || true
  sudo rm -f "$SERVICE_FILE" 2>/dev/null || true
  sudo systemctl daemon-reload 2>/dev/null || true
  echo "✅ Systemd service removed"
fi

if [ -f "$BIN_DIR/phoenixd" ]; then
  echo "Removing phoenixd binary..."
  sudo rm -f "$BIN_DIR/phoenixd"
  echo "✅ phoenixd binary removed"
fi

if [ -f "$BIN_DIR/phoenix-cli" ]; then
  echo "Removing phoenix-cli binary..."
  sudo rm -f "$BIN_DIR/phoenix-cli"
  echo "✅ phoenix-cli binary removed"
fi

echo ""
echo "✅ phoenixd has been uninstalled successfully!"
echo ""
echo "⚠️  IMPORTANT: Your wallet data has been preserved for security reasons."
echo "If you need to remove wallet data, you must do it manually."
echo "Data directory location: ~/.phoenix"
echo ""
echo "Note: If you manually added phoenixd to your PATH, please remove those entries"
echo "from your ~/.bashrc, ~/.zshrc, or other shell configuration files."
echo ""

# Uninstall Ambrosia Client
CLIENT_INSTALL_DIR="$HOME/.local/ambrosia/client"
CLIENT_SERVICE_FILE="/etc/systemd/system/ambrosia-client.service"

echo ""
echo "🗑️  Ambrosia POS Client Uninstaller"
echo "-----------------------------------"
echo "This script will remove all Ambrosia POS Client components from your system."
echo ""

if [[ "$AUTO_YES" == true ]]; then
  # Auto-yes mode
  REPLY="y"
elif [[ -t 0 ]]; then
  # Interactive mode
  echo "Are you sure you want to uninstall Ambrosia POS Client? (y/n): "
  read -r REPLY
else
  # Non-interactive mode
  echo "Running in non-interactive mode. Proceeding with uninstallation."
  REPLY="y"
fi

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Client uninstallation cancelled."
else
  # Check if systemd service exists and stop/disable it
  if [ -f "$CLIENT_SERVICE_FILE" ]; then
    echo "Stopping and disabling Ambrosia POS Client service..."
    sudo systemctl stop ambrosia-client 2>/dev/null || true
    sudo systemctl disable ambrosia-client 2>/dev/null || true
    sudo rm -f "$CLIENT_SERVICE_FILE" 2>/dev/null || true
    sudo systemctl daemon-reload 2>/dev/null || true
    echo "✅ Client systemd service removed"
  fi

  # Remove installation directory
  if [ -d "$CLIENT_INSTALL_DIR" ]; then
    echo "Removing client installation directory..."
    rm -rf "$CLIENT_INSTALL_DIR"
    echo "✅ Client installation directory removed"
  fi

  echo ""
  echo "✅ Ambrosia POS Client has been uninstalled successfully!"
  echo ""
fi
