#!/bin/bash
set -e
set -o pipefail

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

# Variables
APP_NAME="ambrosia-client"
INSTALL_DIR="$HOME/.local/ambrosia/client"
SERVICE_FILE="/etc/systemd/system/$APP_NAME.service"
SRC_DIR=$(dirname "$(readlink -f "$0")")/../client

echo "=== Starting Ambrosia POS Client installation ==="

# Check if Node.js and npm are installed
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    echo "❌ Node.js or npm are not installed. Please install them."
    exit 1
fi
echo "✅ Node.js and npm check passed."

# --- Prepare installation directory ---
echo "Setting up installation directory at $INSTALL_DIR..."
mkdir -p "$INSTALL_DIR"

echo "Copying client files from $SRC_DIR..."
if [ ! -d "$SRC_DIR" ]; then
    echo "❌ Error: Client directory not found at $SRC_DIR"
    exit 1
fi
# Use -a to preserve attributes and . to include dotfiles
cp -a "$SRC_DIR"/. "$INSTALL_DIR"/

# --- Install production dependencies ---
echo "Installing Node.js dependencies..."
cd "$INSTALL_DIR"
npm install --production

echo "Dependencies installed."

# --- Optionally, create and configure the systemd service ---
if [[ "$AUTO_YES" == true ]]; then
  echo "Auto-installing systemd service..."
  REPLY="y"
elif [[ -t 0 ]]; then
  echo "Do you want to set up a systemd service (requires sudo permissions)? (y/n): "
  read -r REPLY
else
  echo "Running in non-interactive mode. Skipping systemd service setup."
  REPLY="n"
fi

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo ""
  echo "✅ File installation completed!"
  echo "Ambrosia POS client has been installed in $INSTALL_DIR"
  echo "To start it manually, run:"
  echo "cd $INSTALL_DIR && npm start"
  echo ""
  exit
fi

NPM_EXEC_PATH=$(which npm)
if [ -z "$NPM_EXEC_PATH" ]; then
    echo "❌ Could not find npm executable."
    exit 1
fi

echo "Creating systemd service file at $SERVICE_FILE..."

sudo tee "$SERVICE_FILE" > /dev/null <<EOF
[Unit]
Description=Ambrosia POS Client (Next.js)
After=network.target

[Service]
User=$USER
WorkingDirectory=$INSTALL_DIR
ExecStart=$NPM_EXEC_PATH start
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# --- Enable and start the service ---
echo "Enabling and starting service '$APP_NAME'..."
sudo systemctl daemon-reload
sudo systemctl enable "$APP_NAME"
sudo systemctl restart "$APP_NAME"
sudo systemctl status "$APP_NAME" --no-pager

echo ""
echo "✅ Installation completed!"
echo "Ambrosia POS client is running as a systemd service."
echo "To view the logs, use: journalctl -u $APP_NAME -f"
