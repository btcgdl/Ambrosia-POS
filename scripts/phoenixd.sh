#!/bin/bash

set -o pipefail

# This script is for install phoenix on a Linux system.

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

TAG="0.6.2"
PHOENIXD_URL="https://github.com/ACINQ/phoenixd/releases/download/v${TAG}"

# Detect the OS architecture and set the appropriate URL
ARCH=$(uname -m)
if [[ "$ARCH" == "x86_64" ]]; then
  PHOENIXD_ZIP="${PHOENIXD_URL}/phoenixd-${TAG}-linux-x64.zip"
elif [[ "$ARCH" == "aarch64" ]]; then
  PHOENIXD_ZIP="${PHOENIXD_URL}/phoenixd-${TAG}-linux-arm64.zip"
else
  echo "❌ Unsupported architecture: $ARCH"
  exit 1
fi

echo "Detected architecture: $ARCH"
echo "Using URL: $PHOENIXD_ZIP"

VERIFIER_URL="https://raw.githubusercontent.com/btcgdl/Ambrosia-POS/master/scripts/verify.sh"

echo ""
echo ""
echo "⚡️ Welcome to Mastering phoenixd installer"
echo "-----------------------------------------"
echo "This script will install linux-x64 version of phoenixd"
echo "-----------------------------------------"

# Check if phoenixd and phoenix-cli are already installed
if command -v phoenixd >/dev/null 2>&1 && command -v phoenix-cli >/dev/null 2>&1; then
  echo "❌ phoenixd and phoenix-cli are already installed on this system"
  echo "Current phoenixd location: $(which phoenixd)"
  echo "Current phoenix-cli location: $(which phoenix-cli)"
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

echo "Installing phoenixd ${TAG} from ${PHOENIXD_URL}"
echo ""
echo "Absolute install directory path (default: /usr/local/bin)"

INSTALL_DIR="/usr/local/bin"

# Create installation directory
sudo mkdir -p $INSTALL_DIR

# Download and extract phoenixd
echo "Downloading phoenixd..."
if ! wget -q "$PHOENIXD_ZIP"; then
  echo "❌ Failed to download phoenixd from ${PHOENIXD_ZIP}" >&2
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

sudo unzip -j phoenixd-${TAG}-linux-x64.zip -d /usr/local/bin

rm -f phoenixd-${TAG}-linux-x64.zip

echo "✅ phoenixd installed to $INSTALL_DIR"

# optionally create a systemd service to start phoenixd
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
  echo "Run 'phoenixd' to start the daemon"
  echo "Run 'phoenix-cli' to interact with the daemon"
  echo "✅ DONE"
  exit
fi

sudo tee /etc/systemd/system/phoenixd.service > /dev/null << EOF
[Unit]
Description=Phoenix Daemon
After=network.target

[Service]
ExecStart=$INSTALL_DIR/phoenixd --agree-to-terms-of-service --chain=testnet
User=$USER
Restart=always
RestartSec=5
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target
EOF

echo ""
sudo systemctl enable phoenixd
echo ""
sudo systemctl start phoenixd

echo "Run 'sudo systemctl status phoenixd' to check the status of Phoenix Daemon"
echo "Run 'sudo systemctl stop phoenixd' to stop Phoenix Daemon"