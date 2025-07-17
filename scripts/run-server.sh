#!/bin/bash

# Script para ejecutar Ambrosia POS Server con logs habilitados
# Uso: ./run-server.sh [opciones para la aplicación]

# Route to the JAR file
JAR_PATH="ambrosia.jar"

# Verificar que el JAR existe
if [ ! -f "$JAR_PATH" ]; then
    echo "Error: $JAR_PATH not found"
    echo "Add the JAR file to your datapath."
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
    echo "Using embedded logback configuration (logback.xml from JAR)"
fi

java $JVM_OPTS -jar "$JAR_PATH" "$@"
