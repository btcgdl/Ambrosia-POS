#!/bin/bash
set -e

TAG="0.1.0-alpha"
# Navigate to the client directory
cd "$(dirname "$0")/../client"

echo "=== Packaging Next.js application for distribution ==="

# Verify if the dist directory exists, if not, create it
if [ ! -d "./dist" ]; then
  echo "Creating dist directory in client/..."
  mkdir -p ./dist
else
  echo "Dist directory already exists."
fi

# 1. Build the application
echo "Building the Next.js application..."
npm run build

# 2. Create temporary directory for the package
PACKAGE_NAME="ambrosia-client-dist"
rm -rf "/tmp/$PACKAGE_NAME"
mkdir -p "/tmp/$PACKAGE_NAME"

# 3. Copy necessary files for production
echo "Copying build artifacts..."
cp -r .next "/tmp/$PACKAGE_NAME/"
cp -r public "/tmp/$PACKAGE_NAME/"
cp package.json "/tmp/$PACKAGE_NAME/"
cp package-lock.json "/tmp/$PACKAGE_NAME/"
cp next.config.mjs "/tmp/$PACKAGE_NAME/"
cp generate-env.cjs "/tmp/$PACKAGE_NAME/"

# 4. Copy installation script
echo "Copying installation script..."
cp ../scripts/install-client.sh "/tmp/$PACKAGE_NAME/"

# 5. Create compressed file
DIST_FILE="ambrosia-client-$TAG.tar.gz"
echo "Creating distribution file: $DIST_FILE..."
cd /tmp
tar -czf "$DIST_FILE" "$PACKAGE_NAME"
cd -

mv "/tmp/$DIST_FILE" ./dist/

# 6. Clean up
rm -rf "/tmp/$PACKAGE_NAME"

echo ""
echo "✅ Packaging complete!"
echo "Your distribution package is located at: client/dist/$DIST_FILE"
