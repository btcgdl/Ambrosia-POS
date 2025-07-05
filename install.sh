#!/bin/bash
set -euo pipefail # Exit on error, unset variable, or pipe failure

# --- Configuration ---
# The Diceware wordlist file. Expected to be in the same directory as the script.
# Downloaded  from: https://www.eff.org/files/2016/07/18/eff_large_wordlist.txt
WORDLIST_URL="https://raw.githubusercontent.com/btcgdl/ambrosia-pos/main/scripts/eff_large_wordlist.txt"
DB_URL="https://raw.githubusercontent.com/btcgdl/ambrosia-pos/main/db/ambrosia.db"
readonly NUM_WORDS=6 # Number of words for the passphrase

# --- Help Message ---
# Show help message if -h or --help is provided.
if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
    echo "Usage: $0 [-y|--yes]"
    echo
    echo "Generates a Diceware passphrase, its SHA-256 hash, and a Base64 encoding."
    echo "The script expects '$WORDLIST' to be present in the current directory."
    echo
    echo "Flags:"
    echo "  -y, --yes   Automatic yes to prompts; enables non-interactive mode."
    echo "              In this mode, the raw passphrase is NOT printed to stdout."
    echo "              If a ambrosia.conf file exists, it will be overwritten without a prompt."
    echo
    echo "To decode the Base64 string in your console, use:"
    echo "  echo Base64String | base64 -d"
    exit 0
fi

# --- Parse Flags ---
# Check for -y or --yes flag for non-interactive mode.
AUTO_YES=0
for arg in "$@"; do
    if [[ "$arg" == "-y" || "$arg" == "--yes" ]]; then
        AUTO_YES=1
    fi
done

# --- Prerequisite: Download Wordlist ---
# Always download the wordlist, use it, then delete it
WORDLIST="eff_large_wordlist.txt"
echo "Downloading wordlist..." >&2
if ! curl -s -o "$WORDLIST" "$WORDLIST_URL"; then
    echo "Error: Failed to download wordlist from $WORDLIST_URL" >&2
    exit 1
fi

# --- Core Functions ---
# Function to generate a random dice roll string (e.g., "12345")
# Uses Bash's $RANDOM. For highly sensitive cryptographic material,
get_word() {
    roll=""
    for _ in {1..5}; do
        roll="${roll}$((1 + RANDOM % 6))"
    done
    grep "^$roll" "$WORDLIST" | cut -f2
}

# --- Generation Logic ---
# Generate a phrase of 6 words
passphrase=$(for i in {1..6}; do get_word; done | paste -sd' ')

# Calculate the hash SHA-256
hash=$(printf "$passphrase" | sha256sum | awk '{print $1}')

# Encode in Base64
base64=$(echo -n "$passphrase" | base64 | tr -d '\n')

# Delete the wordlist after use
rm "$WORDLIST" >/dev/null 2>&1

# --- Display Results ---
echo "Api passphrase:"
echo "$passphrase"
echo
echo "Token hash (SHA-256):"
echo "$hash"
echo
echo "Token base64:"
echo "$base64"
echo

# --- Save to ambrosia.conf file ---
# Ask if the user wants to save to a ambrosia.conf file
if [[ $AUTO_YES -eq 1 ]]; then
    save_env="y"
else
    read -p "Do you want to save the hash and base64 to a ambrosia.conf file? [Y/n]: " save_env
fi

# Check if the ambrosia.conf file already exists and prompt replacement
if [ -f "ambrosia.conf" ] && [[ "$save_env" =~ ^[Yy]$ ]]; then
    if [[ $AUTO_YES -eq 1 ]]; then
        overwrite="y"
    else
        read -p "ambrosia.conf file already exists. Do you want to overwrite it? [Y/n]: " overwrite
    fi
    if [[ ! "$overwrite" =~ ^[Yy]$ ]]; then
        echo "Exiting without saving."
        exit 0
    fi
fi

# Make data directory if it doesn't exist in $HOME
if [ ! -d "$HOME/.Ambrosia-POS" ]; then
    mkdir "$HOME/.Ambrosia-POS"
    echo "Created directory $HOME/.Ambrosia-POS"
fi

# If the user wants to save, create or overwrite the ambrosia.conf file
if [[ "$save_env" =~ ^[Yy]$ ]]; then
    echo 
    echo "Creating ambrosia.conf in $HOME/.Ambrosia-POS"
    echo "TOKEN_HASH=$hash" >> "$HOME/.Ambrosia-POS/ambrosia.conf"
    echo "TOKEN_BASE64=$base64" >> "$HOME/.Ambrosia-POS/ambrosia.conf"
    echo "Values saved to ambrosia.conf in $HOME/.Ambrosia-POS"
    echo 
else
    echo "Exiting without saving."
fi

# Check if ambrosia.db exists, if not, download it
if [ ! -f "$HOME/.Ambrosia-POS/ambrosia.db" ]; then
    echo "Downloading ambrosia.db from $DB_URL"
    curl -s -o "$HOME/.Ambrosia-POS/ambrosia.db" "$DB_URL"
else
    echo "ambrosia.db already exists in $HOME/.Ambrosia-POS"
fi
# --- End of Script ---