#!/bin/bash

set -o pipefail

# This script is for installing Ambrosia POS on a Linux system.

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

TAG="1.0.0"
AMBROSIA_URL="https://github.com/btcgdl/Ambrosia-POS/releases/download/v${TAG}"
AMBROSIA_JAR="${AMBROSIA_URL}/ambrosia-${TAG}.jar"
AMBROSIA_SCRIPTS="${AMBROSIA_URL}/ambrosia-scripts-${TAG}.tar.gz"
VERIFIER_URL="https://raw.githubusercontent.com/btcgdl/Ambrosia-POS/master/scripts/verify.sh"

echo ""
echo ""
echo "🍃 Welcome to Ambrosia POS installer"
echo "-----------------------------------"
echo "This script will install Ambrosia POS Point of Sale system"
echo "-----------------------------------"
echo "Installing Ambrosia POS ${TAG} from ${AMBROSIA_URL}"
echo ""
echo "Absolute install directory path (default: /opt/ambrosia)"

INSTALL_DIR="/opt/ambrosia"
CONFIG_DIR="$HOME/.Ambrosia-POS"
BIN_DIR="/usr/local/bin"

# Create installation directories
sudo mkdir -p $INSTALL_DIR
mkdir -p $CONFIG_DIR

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 21 or higher."
    echo "On Ubuntu/Debian: sudo apt install openjdk-21-jre"
    echo "On CentOS/RHEL: sudo yum install java-21-openjdk"
    exit 1
fi

# Check Java version
JAVA_VERSION=$(java -version 2>&1 | head -n1 | cut -d'"' -f2 | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt "21" ]; then
    echo "❌ Java 21 or higher is required. Current version: $JAVA_VERSION"
    exit 1
fi

echo "✅ Java version check passed"

# Download and extract Ambrosia POS
echo "Downloading Ambrosia POS JAR..."
if ! wget -q "$AMBROSIA_JAR" -O "ambrosia-${TAG}.jar"; then
  echo "❌ Failed to download Ambrosia POS from ${AMBROSIA_JAR}" >&2
  exit 1
fi

echo "Downloading Ambrosia POS scripts..."
if ! wget -q "$AMBROSIA_SCRIPTS" -O "ambrosia-scripts-${TAG}.tar.gz"; then
  echo "❌ Failed to download Ambrosia POS scripts from ${AMBROSIA_SCRIPTS}" >&2
  exit 1
fi

if [[ ! -f "verify.sh" ]]; then
  echo "Downloading the verification script..."
  if ! wget -q "$VERIFIER_URL"; then
    echo "❌ Failed to download the verification script." >&2
    exit 1
  fi
  chmod +x verify.sh
fi

if [[ "$AUTO_YES" == true ]]; then
  ./verify.sh --yes
else
  ./verify.sh
fi
if [[ $? -ne 0 ]]; then
  echo "❌ Verification failed, aborting installation"
  exit 1
fi
rm verify.sh

# Install JAR file
sudo mv "ambrosia-${TAG}.jar" "$INSTALL_DIR/ambrosia.jar"

# Extract and install scripts
tar -xzf "ambrosia-scripts-${TAG}.tar.gz"
sudo cp scripts/*.sh "$INSTALL_DIR/"
sudo chmod +x "$INSTALL_DIR"/*.sh

# Create symbolic link for easy access
sudo ln -sf "$INSTALL_DIR/run-server.sh" "$BIN_DIR/ambrosia"

# Clean up downloaded files
rm -f "ambrosia-scripts-${TAG}.tar.gz"

echo "✅ Ambrosia POS installed to $INSTALL_DIR"

# optionally create a systemd service to start Ambrosia POS
if [[ "$AUTO_YES" == true ]]; then
  # Auto-yes mode
  echo "Auto-installing systemd service..."
  REPLY="y"
elif [[ -t 0 ]]; then
  # Interactive mode
  echo "Do you want to setup a systemd service (requires sudo permission)? (y/n): "
  read -r REPLY
else
  # Non-interactive mode (e.g., curl | bash)
  echo "Running in non-interactive mode. Skipping systemd service setup."
  echo "To set up the systemd service later, run the script interactively."
  REPLY="n"
fi

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
  echo ""
  echo ""
  echo "Run 'ambrosia' to start Ambrosia POS server"
  echo "Run '$INSTALL_DIR/run-server.sh --help' for more options"
  echo "Configuration directory: $CONFIG_DIR"
  echo "✅ DONE"
  exit
fi

sudo tee /etc/systemd/system/ambrosia.service > /dev/null << EOF
[Unit]
Description=Ambrosia POS Server
After=network.target

[Service]
ExecStart=$INSTALL_DIR/run-server.sh
WorkingDirectory=$INSTALL_DIR
User=$USER
Group=$USER
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

echo ""
sudo systemctl daemon-reload
sudo systemctl enable ambrosia
echo ""
echo "Starting Ambrosia POS service..."
sudo systemctl start ambrosia

echo ""
echo "✅ Ambrosia POS systemd service installed and started"
echo ""
echo "Useful commands:"
echo "  sudo systemctl status ambrosia    - Check service status"
echo "  sudo systemctl stop ambrosia      - Stop the service"
echo "  sudo systemctl restart ambrosia   - Restart the service"
echo "  sudo journalctl -u ambrosia -f    - View live logs"
echo ""
echo "Configuration directory: $CONFIG_DIR"
echo "Installation directory: $INSTALL_DIR"
echo ""
echo "✅ Installation completed successfully!"
