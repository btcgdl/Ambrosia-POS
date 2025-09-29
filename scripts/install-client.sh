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

TAG="0.2.0-beta"
CLIENT_DIST_FILE="ambrosia-client-${TAG}.tar.gz"
CLIENT_DIST_URL="https://github.com/btcgdl/Ambrosia-POS/releases/download/v${TAG}/${CLIENT_DIST_FILE}"

echo " Starting Ambrosia POS Client installation "

INSTALL_DIR="$HOME/.local/ambrosia/client"
SERVICE_FILE="/etc/systemd/system/ambrosia-client.service"

# Check if Ambrosia Client is already installed
if [ -d "${INSTALL_DIR}" ]; then
  echo "⚠️ Ambrosia Client is already installed at ${INSTALL_DIR}"
  if [[ "$AUTO_YES" != true ]]; then
    read -p "Do you want to continue? This will overwrite the existing installation. (y/n): " -r CONTINUE_REPLY
    if [[ ! $CONTINUE_REPLY =~ ^[Yy]$ ]]; then
      echo "Installation cancelled."
      exit 0
    fi
  else
    echo "Running in auto-yes mode. Overwriting existing installation."
  fi
  # Clean up old installation
  echo "Removing existing installation..."
  rm -rf "${INSTALL_DIR}"
fi

# Check if Node.js and npm are installed
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    echo "❌ Node.js or npm are not installed. Please install them."
    exit 1
fi
echo "✅ Node.js and npm check passed."

# --- Prepare installation directory ---
echo "Setting up installation directory at $INSTALL_DIR..."
mkdir -p "$INSTALL_DIR"

# --- Download and extract client ---
echo "Downloading client from $CLIENT_DIST_URL..."
TEMP_DIR=$(mktemp -d)
# Use wget or curl
if command -v wget &> /dev/null; then
    wget -q -O "${TEMP_DIR}/${CLIENT_DIST_FILE}" "$CLIENT_DIST_URL"
else
    curl -sL -o "${TEMP_DIR}/${CLIENT_DIST_FILE}" "$CLIENT_DIST_URL"
fi

echo "Extracting client files to $INSTALL_DIR..."
# Assuming tarball has a top-level dir e.g.
tar -xzf "${TEMP_DIR}/${CLIENT_DIST_FILE}" -C "$INSTALL_DIR" --strip-components=1
rm -rf "$TEMP_DIR"


# --- Install production dependencies ---
echo "Installing Node.js dependencies..."
cd "$INSTALL_DIR"
npm install --production

echo "Dependencies installed."

# --- Optionally, create and configure the systemd service ---
REPLY="n"
if [[ "$AUTO_YES" == true ]]; then
  echo "Auto-installing systemd service..."
  REPLY="y"
elif [[ -t 0 ]]; then # Check if running in a terminal
  read -p "Do you want to set up a systemd service (requires sudo permissions)? (y/n): " -r REPLY
else
  echo "Running in non-interactive mode. Skipping systemd service setup."
fi

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo ""
  echo "✅ File installation completed!"
  echo "Ambrosia POS client has been installed in $INSTALL_DIR"
  echo "To start it manually, run:"
  echo "cd $INSTALL_DIR && npm start"
  echo ""
  exit 0
fi

NPM_EXEC_PATH=$(which npm)
NPM_DIR=$(dirname "$NPM_EXEC_PATH")
NODE_EXEC_PATH=$(which node)
NODE_DIR=$(dirname "$NODE_EXEC_PATH")

if [ -z "$NPM_EXEC_PATH" ]; then
    echo "❌ Could not find npm executable."
    exit 1
fi

echo "Creating systemd service file at $SERVICE_FILE..."
sudo tee "$SERVICE_FILE" > /dev/null << EOF
[Unit]
Description=Ambrosia POS Client (Next.js)
After=network.target

[Service]
User=$USER
WorkingDirectory=$INSTALL_DIR
Environment=PATH=$NPM_DIR:$NODE_DIR:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
Environment=NODE_ENV=production
ExecStart=$NPM_EXEC_PATH start
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# --- Enable and start the service ---
echo "Enabling and starting service 'ambrosia-client'..."
sudo systemctl daemon-reload
sudo systemctl enable "ambrosia-client"
sudo systemctl restart "ambrosia-client"
sudo systemctl status "ambrosia-client" --no-pager

echo ""
echo "✅ Installation completed!"
echo "Ambrosia POS client is running as a systemd service."
echo "To view the logs, use: journalctl -u ambrosia-client -f"
