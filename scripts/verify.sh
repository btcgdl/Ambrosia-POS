#!/bin/bash

TAG="0.6.0"

PHOENIXD_SIG="https://github.com/ACINQ/phoenixd/releases/download/v${TAG}/SHA256SUMS.asc"
ACINQ_PGP_KEY="https://acinq.co/pgp/padioupm.asc"

verify_package() {

  while true; do
    read -r -p "Verify package signature and integrity? (Y/N): " response
    case "$response" in
      [Yy]) break ;;
      [Nn]) echo "Verification skipped." ; return 0 ;;
      *) echo "Invalid input. Please enter Y or N." ;;
    esac
  done

  echo "🔐 Starting package verification..."
  
  # Download and import PGP key
  if ! wget -q "$ACINQ_PGP_KEY" 2>/dev/null; then
    echo "❌ Failed to download PGP key." >&2
    return 1
  fi
  
  if ! gpg --import padioupm.asc >/dev/null 2>&1; then
    echo "❌ Failed to import PGP key." >&2
    return 1
  fi

  # Download and verify signature
  if ! wget -q "$PHOENIXD_SIG" 2>/dev/null; then
    echo "❌ Failed to download signature file." >&2
    return 1
  fi

  if ! gpg --quiet --decrypt SHA256SUMS.asc > SHA256SUMS.stripped 2>/dev/null; then
    echo "❌ Failed to verify signature." >&2
    return 1
  fi

  # Verify checksums
  if sha256sum -c SHA256SUMS.stripped 2>/dev/null | grep -q " OK"; then
    echo "✅ Package verification successful."
  else
    echo "❌ Checksum verification failed." >&2
    echo "Visit https://github.com/ACINQ/phoenixd/releases for more information." >&2
    return 1
  fi

  echo "✅ Verification successful. The package is authentic and intact."
  
  # Clean up temporary files
  rm -f padioupm.asc SHA256SUMS.asc SHA256SUMS.stripped 2>/dev/null
  
  return 0
}

verify_package

if [[ $? -ne 0 ]]; then
  echo "❌ Verification failed, aborting installation"
  exit 1
fi