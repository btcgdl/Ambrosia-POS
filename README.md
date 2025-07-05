# Ambrosia-POS
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/JordyPirata/Ambrosia-POS)

**Status: In Development**

> This project is currently under active development. Features and functionalities described below are subject to change as development progresses.

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

**Opción 1: Script del proyecto**
```bash
chmod +x phoenixd.sh
./phoenixd.sh
```

**Opción 2: Instalación directa**
```bash
curl -fsSL https://raw.githubusercontent.com/btcgdl/Ambrosia-POS/master/phoenixd.sh | bash -s -- --yes
```

El script descarga phoenixd v0.6.0, verifica la integridad del paquete usando GPG y checksums, instala en `/usr/local/bin`, y opcionalmente configura un servicio systemd para inicio automático.

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
REACT_APP_API_BASE_URL=http://0.0.0.0:5000
```

- Si estás trabajando directamente en Linux, usa `http://0.0.0.0:5000`.
- Si estás usando WSL, coloca la IP correspondiente a tu entorno de WSL (puedes obtenerla con `ip addr`, suele ser una IP tipo `172.x.x.x`). Ejemplo:

```
REACT_APP_API_BASE_URL=http://172.18.223.141:5000
```

Luego, inicia el entorno de desarrollo del cliente con:

```sh
npm start
```

> 🔧 **Nota sobre el backend en desarrollo:** Actualmente el servidor backend no cuenta con endpoints funcionales, por lo que cualquier llamada a la API generará errores. El cliente cuenta con un sistema de fallback que usa una base de datos simulada directamente en el frontend para permitir la navegación y prueba de funcionalidades durante esta etapa.
>
> ⚠️ Este comportamiento es **temporal**. Una vez que el backend esté completo, será necesario actualizar el manejo de errores del frontend para desactivar el uso de datos simulados y responder correctamente a las respuestas reales del servidor.

### Servidor (Backend - Kotlin/Gradle)

*Install App*

Para generar el data directory y el token del API:

```sh
./install.sh 
```

Para ejecutar el servidor en modo de desarrollo:

```sh
./gradlew run
```

Para construir el proyecto del servidor:

```sh
./gradlew build
```
