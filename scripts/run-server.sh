#!/bin/bash

# Script para ejecutar Ambrosia POS Server con logs habilitados
# Uso: ./run-server.sh [opciones para la aplicación]

# Initialize SDKMAN! if installed
if [ -f "$HOME/.sdkman/bin/sdkman-init.sh" ]; then
    source "$HOME/.sdkman/bin/sdkman-init.sh"
fi

# Determine the script's real directory (resolving symlinks)
SCRIPT_PATH="${BASH_SOURCE[0]}"
# Resolve symlinks to get the actual script location
while [ -L "$SCRIPT_PATH" ]; do
    SCRIPT_DIR=$(cd -- "$(dirname -- "$SCRIPT_PATH")" &> /dev/null && pwd)
    SCRIPT_PATH=$(readlink "$SCRIPT_PATH")
    # Handle relative symlinks
    [[ $SCRIPT_PATH != /* ]] && SCRIPT_PATH="$SCRIPT_DIR/$SCRIPT_PATH"
done
SCRIPT_DIR=$(cd -- "$(dirname -- "$SCRIPT_PATH")" &> /dev/null && pwd)

# Route to the JAR file, assuming it's in the same directory as the script
JAR_PATH="$SCRIPT_DIR/ambrosia.jar"

# Verificar que el JAR existe
if [ ! -f "$JAR_PATH" ]; then
    echo "Error: $JAR_PATH not found"
    echo "Please ensure Ambrosia POS is installed correctly in $SCRIPT_DIR"
    exit 1
fi

# Directorio de configuración personalizado
CONFIG_DIR="$HOME/.Ambrosia-POS"

# Configuración de logging
LOGBACK_CONFIG="$CONFIG_DIR/Ambrosia-Logs.xml"

# Opciones de la JVM para logging
JVM_OPTS=""

# Verificar que el archivo de configuración de logs existe
if [ -f "$LOGBACK_CONFIG" ]; then
    echo "Using external logback configuration: $LOGBACK_CONFIG"
    JVM_OPTS="-Dlogback.configurationFile=file:$LOGBACK_CONFIG"
else
    echo "Using embedded logback configuration"
fi

java $JVM_OPTS -jar "$JAR_PATH" "$@"
