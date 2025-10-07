### Autenticación

- `POST /auth/login`: Autentica a un usuario específico y establece cookies de sesión con tokens JWT (access token y refresh token).
 - **Request Body:**
  ``` JSON
  {
    "name": "string",
    "pin": "string"
  }
  ``` 
  - **cURL Example:**
  
  El siguiente ejemplo muestra cómo autenticarse y guardar las cookies de sesión en variables de entorno para su uso posterior.

  ```Bash
  headers=$(curl -i -X POST http://127.0.0.1:9154/auth/login \
    -H 'Content-Type: application/json' \
    -d '{
      "name": "cooluser1",
      "pin": "0000"
    }')

  access_token=$(echo "$headers" | grep -o 'accessToken=[^;]*' | cut -s -d= -f2)
  refresh_token=$(echo "$headers" | grep -o 'refreshToken=[^;]*' | cut -s -d= -f2)

  export ACCESS_TOKEN="$access_token"
  export REFRESH_TOKEN="$refresh_token"
  ```

  Una vez que las variables de entorno `ACCESS_TOKEN` y `REFRESH_TOKEN` están establecidas, puedes usarlas en las cabeceras `Cookie` para las siguientes peticiones a endpoints protegidos.
  - **Response Body (Éxito - 200 OK):**
  ```JSON
  {
    "message": "Login successful"
  }
  ```
  - **Response Headers:** Se establecen cookies `accessToken` (15 min) y `refreshToken` (30 días)

- `POST /auth/refresh`: Renueva el access token usando el refresh token almacenado en cookies.
 - **Request:** El refresh token debe estar presente en las cookies
 - **cURL Example:**
  ```Bash
  curl -v -X POST http://127.0.0.1:9154/auth/refresh \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Éxito - 200 OK):**
  ```JSON
  {"message":"Access token refreshed successfully","accessToken":"..."}
  ```
  - **Response Headers:** Se actualiza la cookie `accessToken`

- `POST /auth/logout`: Cierra la sesión del usuario, revoca el refresh token y elimina las cookies de autenticación.
 - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
 - **cURL Example:** 
  ```Bash
  curl -X POST http://127.0.0.1:9154/auth/logout \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Éxito - 200 OK):**
  ```JSON
  {
    "message": "Logout successful"
  }
  ```
  - **Response Headers:** Se eliminan las cookies `accessToken` y `refreshToken`

### Notas importantes:
- La autenticación se maneja mediante cookies HTTP con tokens JWT
- El `accessToken` tiene una duración de 1 minuto
- El `refreshToken` tiene una duración de 30 días
- Para endpoints protegidos, el access token se envía automáticamente via cookies
- Cuando el access token expira, usar `/auth/refresh` para obtener uno nuevo
