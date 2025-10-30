### Development Environment

A clean, structured guide to run Ambrosia‑POS locally with native tools.

## Requirements:
- SDKMAN (official: https://sdkman.io/)
  ```bash
  curl -s "https://get.sdkman.io" | bash
  source "$HOME/.sdkman/bin/sdkman-init.sh"
  ```
- Java 21 (Temurin):
  ```bash
  sdk list java
  sdk install java 21-tem
  java -version
  ```
- Gradle:
  ```bash
  sdk install gradle
  gradle -v
  ```
- Node.js >= 18 and npm.
- phoenixd (Lightning):
  ```bash
  curl -fsSL https://raw.githubusercontent.com/btcgdl/Mastering-phoenixd/master/scripts/install.sh | bash -s -- --yes
  ```
  Full guide: https://btcgdl.github.io/Mastering-phoenixd/

## Quick check
```bash
java -version && gradle -v | head -n1 && node -v && npm -v
```

## Step 1 · Start phoenixd
After installation, ensure the service is running and `~/.phoenix` is initialized as per the Mastering phoenixd guide.

## Step 2 · Backend (Kotlin/Ktor)
```bash
cd server
./gradlew run    # API on :9154
```
- Tests: `./gradlew test`

## Step 3 · Frontend (Next.js)
```bash
cd client
npm install
npm run dev      # web on :3000
```
- Lint: `npm run lint`
- Tests: `npm test`

## Local endpoints
- API: http://127.0.0.1:9154
- Web: http://127.0.0.1:3000

## Troubleshooting
:::tip Tips
- Use the `./gradlew` wrapper to avoid PATH issues.
- If a port is busy, change `3000`/`9154` or stop the conflicting process.
- phoenixd: ensure it’s running and `~/.phoenix` contains expected config.
:::
