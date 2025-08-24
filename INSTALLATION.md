# Guía de Instalación - Ambrosia POS

## Dependencias del Proyecto

### Requisitos principales

- **npm**: Para gestionar las dependencias del frontend (React/Electron).
- **Gradle 8.1.4**: Para construir y gestionar el backend en Kotlin.
- **JDK 21**: Java Development Kit versión 21, requerido para compilar y ejecutar el backend.

### Instalación de Node.js y npm con nvm

Se recomienda utilizar `nvm` (Node Version Manager) para instalar Node.js y npm. Esto permite gestionar múltiples versiones de Node.js fácilmente.

```bash
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# in lieu of restarting the shell
. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 22

# Verify the Node.js version:
node -v # Should print "v22.18.0".
nvm current # Should print "v22.18.0".

# Verify npm version:
npm -v # Should print "10.9.3".
```

> [!INFO]
> **Instalación de JDK con SDKMAN!**
>
> Para instalar Java Development Kit (JDK), recomendamos usar [SDKMAN!](https://sdkman.io/), una herramienta para gestionar múltiples versiones de Kits de Desarrollo de Software.
>
> ```bash
> # Instalar SDKMAN!
> curl -s "https://get.sdkman.io" | bash
> 
> # Cargar SDKMAN! en la sesión actual y agregarlo a tu shell
> source "$HOME/.sdkman/bin/sdkman-init.sh"
> 
> # Instalar Java 21
> sdk install java 21.0.8-tem
> ```
> **Nota:** Recuerda añadir `source "$HOME/.sdkman/bin/sdkman-init.sh"` a tu archivo `~/.bashrc` o `~/.zshrc` para que `sdk` esté disponible en todas las futuras sesiones de tu terminal.

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

Dentro del directorio `client/`, puedes utilizar los siguientes scripts:

- **Instalar dependencias:**
  ```sh
  npm install
  ```

- **Iniciar en modo de desarrollo:**
  ```sh
  npm run dev
  ```

- **Compilar para producción:**
  ```sh
  npm run build
  ```

- **Iniciar en modo de producción (después de compilar):**
  ```sh
  npm start
  ```