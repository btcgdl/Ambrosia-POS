# Installation Guide - Ambrosia POS

## Project Dependencies

### Main Requirements

- **npm**: To manage frontend dependencies (React/Electron).
- **Gradle 8.1.4**: To build and manage the Kotlin backend.
- **JDK 21**: Java Development Kit version 21, required to compile and run the backend.

### Installing Node.js and npm with nvm

It is recommended to use `nvm` (Node Version Manager) to install Node.js and npm. This allows you to easily manage multiple versions of Node.js.

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

> [!NOTE]
> **Installing JDK with SDKMAN!**
>
> To install the Java Development Kit (JDK), we recommend using [SDKMAN!](https://sdkman.io/), a tool for managing multiple versions of Software Development Kits.

```bash
# Instalar SDKMAN!
curl -s "https://get.sdkman.io" | bash

# Cargar SDKMAN! en la sesión actual y agregarlo a tu shell
source "$HOME/.sdkman/bin/sdkman-init.sh"
 
# Instalar Java 21
sdk install java 21.0.8-tem
 ```
 **Note:** Remember to add `source "$HOME/.sdkman/bin/sdkman-init.sh"` to your `~/.bashrc` or `~/.zshrc` file so that `sdk` is available in all future terminal sessions.

## Interactive Installation (Recommended)

**Option 1: Full Installation (Ambrosia + phoenixd)**
```bash
wget -q https://raw.githubusercontent.com/btcgdl/Ambrosia-POS/master/scripts/install.sh
chmod +x install.sh
./install.sh
```

The phoenixd installation script installs phoenixd automatically. The script downloads phoenixd v0.7.1, verifies the package integrity using GPG and checksums, installs it in `/usr/local/bin`, and optionally configures a systemd service for automatic startup.

Check [Mastering Phoenixd](https://btcgdl.github.io/Mastering-phoenixd/) for more details.

**Option 2: Project Scripts (without systemd)**
```bash
curl -fsSL https://raw.githubusercontent.com/btcgdl/Ambrosia-POS/master/scripts/install.sh | bash
```

## Uninstallation 

To uninstall Ambrosia POS and phoenixd, run the following script:

```bash
curl -fsSL https://raw.githubusercontent.com/btcgdl/Ambrosia-POS/master/scripts/uninstall.sh | bash
```

## Development Scripts

### docker-compose with all 3 images (phoenixd, ambrosia, and ambrosia-client)
To set up the entire docker-compose environment (including installing dependencies if not already installed):

This command will optionally build the client and server docker images (required on first run)
```sh
make run-rebuild
```

This command will only rebuild the server jar and restart any containers whose images have been rebuilt:
```sh
make run
```

Command for rebuilding the server image without rebuilding the other containers (useful for rapid development on the server Kotlin code):
```sh
cd server/ && ./gradlew jar && cd .. && docker-compose build ambrosia && make run
```

### Server (Backend - Kotlin/Gradle)

To run the server in development mode, go to the `server/` directory and run:

```sh
./gradlew run
```

### Client (Frontend - React/Electron)

Inside the `client/` directory, you can use the following scripts:

- **Install dependencies:**
  ```sh
  npm install
  ```

- **Start in development mode:**
  ```sh
  npm run dev
  ```

- **Build for production:**
  ```sh
  npm run build
  ```

- **Start in production mode (after building):**
  ```sh
  npm start
  ```