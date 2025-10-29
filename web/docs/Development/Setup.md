### Entorno de Desarrollo

Una guía clara y ordenada para trabajar en Ambrosia‑POS usando herramientas nativas.

## Requisitos:
- SDKMAN (oficial: https://sdkman.io/)
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
- Node.js >= 18 y npm.
- phoenixd (Lightning):
  ```bash
  curl -fsSL https://raw.githubusercontent.com/btcgdl/Mastering-phoenixd/master/scripts/install.sh | bash -s -- --yes
  ```
  Guía completa: https://btcgdl.github.io/Mastering-phoenixd/

## Verificación rápida
```bash
java -version && gradle -v | head -n1 && node -v && npm -v
```

## Paso 1 · Iniciar phoenixd
Tras la instalación, asegúrate de que el servicio esté corriendo y que `~/.phoenix` esté inicializado según la guía de Mastering phoenixd.

## Paso 2 · Backend (Kotlin/Ktor)
```bash
cd server
./gradlew run    # API en :9154
```
- Tests: `./gradlew test`

## Paso 3 · Frontend (Next.js)
```bash
cd client
npm install
npm run dev      # web en :3000
```
- Lint: `npm run lint`
- Tests: `npm test`

## Endpoints locales
- API: http://127.0.0.1:9154
- Web: http://127.0.0.1:3000

## Solución de problemas
:::tip Consejos
- Usa el wrapper `./gradlew` para evitar problemas de PATH.
- Si algún puerto está ocupado, cambia `3000`/`9154` o detén el proceso en conflicto.
- phoenixd: valida que corre y que `~/.phoenix` contiene la configuración esperada.
:::
