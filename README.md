# Ambrosia-POS
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/JordyPirata/Ambrosia-POS)

**Status: In Development**

> [!WARNING] **Advertencia de Seguridad:** El sistema utiliza Bitcoin en local. El usuario y contraseña por defecto son:
>
> - **Usuario:** `admin`
> - **Pin:** `0000`
>
> **¡No dejes estas credenciales por defecto en producción! Cambia el usuario y la contraseña inmediatamente después de la instalación para proteger tus fondos.**

<p align="center">
  <img src="imgs/Ambrosia.png" alt="Ambrosia Logo" width="300"/>
</p>

Este repositorio contiene la documentación y detalles del proyecto de un sistema de punto de venta (POS) para restaurantes, con un frontend desarrollado en React y Electron, y un backend en Kotlin. A continuación, se describen los archivos principales y su contenido:

## Archivos Principales

- [Propuesta.md](Propuesta.md): Contiene una descripción general del sistema, incluyendo los módulos principales y sus funcionalidades. Es ideal para entender el alcance y propósito del proyecto.
- [Tabla-de-Objetivos.md](Tabla-de-Objetivos.md): Presenta una tabla detallada con los módulos del sistema y sus objetivos.

## Descripción General

El sistema está diseñado para optimizar las operaciones diarias de un restaurante, como la gestión de pedidos, mesas y finanzas, con una interfaz moderna y reactiva. Incluye funcionalidades como autenticación, gestión de usuarios, manejo de menús, pedidos, punto de venta, y más.

Consulta los archivos mencionados para obtener más detalles sobre el proyecto.

## Dependencias del Proyecto

### Requisitos principales

- **npm**: Para gestionar las dependencias del frontend (React/Electron).
- **Gradle 8.1.4**: Para construir y gestionar el backend en Kotlin.
- **JDK 21**: Java Development Kit versión 21, requerido para compilar y ejecutar el backend.

### Phoenix - Lightning Network Daemon (phoenixd)

Este proyecto requiere **phoenixd** para el procesamiento de pagos mediante Lightning Network. Si aún no tienes phoenixd instalado, sigue estas instrucciones:

#### Instalación automática (Recomendada)

**Opción 1: Instalación directa**
```bash
curl -fsSL https://raw.githubusercontent.com/btcgdl/Ambrosia-POS/master/scripts/phoenixd.sh | bash -s -- --yes
```

**Opción 2: Script del proyecto**
```bash
cd scripts
chmod +x phoenixd.sh
./phoenixd.sh
```

El script descarga phoenixd v0.6.0, verifica la integridad del paquete usando GPG y checksums, instala en `/usr/local/bin`, y opcionalmente configura un servicio systemd para inicio automático.

Check [Mastering Phoenixd](https://btcgdl.github.io/Mastering-phoenixd/) for more details.

#### Instalación manual

Para instalación manual, consulta la [documentación oficial](https://phoenix.acinq.co/server) para obtener las instrucciones específicas para tu sistema operativo.

## Scripts de Desarrollo

### Cliente (Frontend - React/Electron)

Para instalar las dependencias del cliente, ejecuta:

```sh
cd client
npm install
```

Antes de iniciar el entorno de desarrollo, crea un archivo `.env` dentro de la carpeta `client/` con la siguiente variable:

```
REACT_APP_API_BASE_URL=http://127.0.0.1:9154
```

- Si estás trabajando directamente en Linux, usa `http://127.0.0.1:9154`.
- Si estás usando WSL, coloca la IP correspondiente a tu entorno de WSL (puedes obtenerla con `ip addr`, suele ser una IP tipo `172.x.x.x`). Ejemplo:

```
REACT_APP_API_BASE_URL=http://172.18.223.141:9154
```

Luego, inicia el entorno de desarrollo del cliente con:

```sh
HOST="127.0.0.1" npm start
```

### Servidor (Backend - Kotlin/Gradle)

**Desarrollo**

Para ejecutar el servidor en modo de desarrollo dirígete a `server/` y ejecuta:

```sh
./gradlew run
```

**Producción**

Para desplegar en producción, primero construye el JAR:

```sh
./gradlew jar
```

Esto generará `ambrosia.jar` en `server/app/build/libs/`. Copia este archivo junto con el script `scripts/run-server.sh` a tu servidor de producción.

Para ejecutar en producción:

```sh
chmod +x run-server.sh
./run-server.sh
```

El script automáticamente:
- Busca el archivo `ambrosia.jar` en el directorio actual
- Configura el logging usando `$HOME/.Ambrosia-POS/Ambrosia-Logs.xml` si existe
- Ejecuta la aplicación con las opciones JVM apropiadas

Para configuración adicional o servicios systemd, consulta la documentación de deployment del proyecto.

---

## ¿Quieres contribuir?

Consulta la [Guía de Contribución](Contributing.md) para saber cómo puedes ayudar y ser parte del futuro de los sistemas POS para restaurantes.
