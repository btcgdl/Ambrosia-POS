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

TAG="0.2.0-beta"
AMBROSIA_URL="https://github.com/btcgdl/Ambrosia-POS/releases/download/v${TAG}"
AMBROSIA_JAR="${AMBROSIA_URL}/ambrosia-${TAG}.jar"
RUN_SERVER="https://raw.githubusercontent.com/btcgdl/Ambrosia-POS/v${TAG}/scripts/run-server.sh"

echo ""
echo "🍃 Welcome to Ambrosia POS installer"
echo "-----------------------------------"
echo "This script will install Ambrosia POS Point of Sale system"
echo "-----------------------------------"
echo "Installing Ambrosia POS ${TAG} from ${AMBROSIA_URL}"
echo ""
echo "Absolute install directory path (default: $HOME/.local/ambrosia)"

INSTALL_DIR="$HOME/.local/ambrosia"
CONFIG_DIR="$HOME/.Ambrosia-POS"
BIN_DIR="$HOME/.local/bin"

# Check if Ambrosia POS is already installed
if command -v ambrosia >/dev/null 2>&1; then
  echo "❌ Ambrosia POS is already installed on this system"
  echo "Current ambrosia location: $(which ambrosia)"
  echo ""
  if [[ "$AUTO_YES" != true ]]; then
    echo "Do you want to continue with the installation anyway? This will overwrite the existing installation. (y/n): "
    read -r CONTINUE_REPLY
    if [[ ! $CONTINUE_REPLY =~ ^[Yy]$ ]]; then
      echo "Installation cancelled."
      exit 0
    fi
  else
    echo "Running in auto-yes mode. Installation cancelled to prevent overwriting existing installation."
    echo "If you want to overwrite the existing installation, run the script interactively without --yes flag."
    exit 0
  fi
fi

# Create bin directory if it doesn't exist
mkdir -p "$BIN_DIR"

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

# Create installation directory if it doesn't exist
mkdir -p "$INSTALL_DIR"

# Download and extract Ambrosia POS
echo "Downloading Ambrosia POS JAR..."
if ! wget -q "$AMBROSIA_JAR" -O "ambrosia.jar"; then
  echo "❌ Failed to download Ambrosia POS from ${AMBROSIA_JAR}" >&2
  exit 1
fi

# Make the JAR file executable
chmod +x "ambrosia.jar"

# Download run-server script
echo "Downloading run-server script..."
if ! wget -q "$RUN_SERVER" -O "run-server.sh"; then
  echo "❌ Failed to download run-server script from ${RUN_SERVER}" >&2
  exit 1
fi

# Make run-server script executable
chmod +x run-server.sh

# Install files
mv "ambrosia.jar" "$INSTALL_DIR/ambrosia.jar"
mv "run-server.sh" "$INSTALL_DIR/run-server.sh"

# Create symbolic link for easy access
ln -sf "$INSTALL_DIR/run-server.sh" "$BIN_DIR/ambrosia"

# Add bin directory to PATH if not already there
if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.bashrc"
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.zshrc"
fi

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
Restart=always
RestartSec=5
LimitNOFILE=4096

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
