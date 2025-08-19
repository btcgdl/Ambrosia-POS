# Guía de Instalación - Ambrosia POS

## Dependencias del Proyecto

### Requisitos principales

- **npm**: Para gestionar las dependencias del frontend (React/Electron).
- **Gradle 8.1.4**: Para construir y gestionar el backend en Kotlin.
- **JDK 21**: Java Development Kit versión 21, requerido para compilar y ejecutar el backend.

### Phoenix - Lightning Network Daemon (phoenixd)

Este proyecto requiere **phoenixd** para el procesamiento de pagos mediante Lightning Network. Si aún no tienes phoenixd instalado, sigue estas instrucciones:

## Instalación Interactiva (Recomendada)

**Opción 1: Instalación completa (Ambrosia + phoenixd)**
```bash
wget -q https://raw.githubusercontent.com/btcgdl/Ambrosia-POS/master/scripts/install.sh
chmod +x install.sh
./install.sh
```

El script de instalación de phoenixd instala phoenixd automáticamente. El script descarga phoenixd v0.6.2, verifica la integridad del paquete usando GPG y checksums, instala en `/usr/local/bin`, y opcionalmente configura un servicio systemd para inicio automático.

Check [Mastering Phoenixd](https://btcgdl.github.io/Mastering-phoenixd/) for more details.

**Opción 2: Scripts del proyecto (sin systemd)**
```bash
curl -fsSL https://raw.githubusercontent.com/btcgdl/Ambrosia-POS/master/scripts/install.sh | bash
```

## Desinstalación 

Para desinstalar Ambrosia POS y phoenixd, ejecuta el siguiente script:

```bash
curl -fsSL https://raw.githubusercontent.com/btcgdl/Ambrosia-POS/master/scripts/uninstall.sh | bash
```

## Scripts de Desarrollo
### Servidor (Backend - Kotlin/Gradle)

Para ejecutar el servidor en modo de desarrollo dirígete a `server/` y ejecuta:

```sh
./gradlew run
```

### Cliente (Frontend - React/Electron)

Para instalar las dependencias del cliente dirígete a `client/` y ejecuta:

```sh
npm install
```

Luego, inicia el entorno de desarrollo del cliente con:

```sh
npm run dev
```