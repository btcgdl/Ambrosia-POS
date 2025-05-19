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

## Scripts de Desarrollo

*Cliente (Frontend - React/Electron)*

Para instalar las dependencias del cliente, ejecuta:

```sh
npm install
```

Para iniciar el entorno de desarrollo del cliente:

```sh
npm start
```

*Servidor (Backend - Kotlin/Gradle)*

*Generar Token*

Para generar un token de autenticación para pruebas o desarrollo:

```sh
./generate-token.sh
```

Para ejecutar el servidor en modo de desarrollo:

```sh
./gradlew run
```

Para construir el proyecto del servidor:

```sh
./gradlew build
```