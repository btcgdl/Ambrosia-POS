### 1. Gestión de Usuarios

Los endpoints de usuarios permiten gestionar las cuentas de usuario en el sistema Ambrosia POS.

- `GET /users`: Obtiene todos los usuarios del sistema.
  - **Authorization:** Requiere autenticación básica
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/users" \
    -H 'Cookie: accessToken=your_access_token_here' \
    -H 'Cookie: refreshToken=your_refresh_token_here' 
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  [
    {
      "id": "76ee1086-b945-4170-b2e6-9fbeb95ae0be",
      "name": "admin",
      "pin": "****",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "role": "262006ea-8782-4b08-ac3b-b3f13270fec3"
    },
    {
      "id": "262006ea-8782-4b08-ac3b-b3f13270fec3",
      "name": "waiter01",
      "pin": "****",
      "refreshToken": null,
      "role": "76ee1086-b945-4170-b2e6-9fbeb95ae0be"
    }
  ]
  ```
  - **Response Body (Sin contenido - 204 No Content):**
  ```json
  "No users found"
  ```

- `GET /users/{id}`: Obtiene un usuario específico por su ID.
  - **Authorization:** Requiere autenticación básica
  - **Path Parameters:**
    - `id` (string): ID del usuario a obtener
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/users/76ee1086-b945-4170-b2e6-9fbeb95ae0be" \
    -H 'Cookie: accessToken=your_access_token_here' \
    -H 'Cookie: refreshToken=your_refresh_token_here' 
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "id": "76ee1086-b945-4170-b2e6-9fbeb95ae0be",
    "name": "admin",
    "pin": "****",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "role": "262006ea-8782-4b08-ac3b-b3f13270fec3"
  }
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Missing or malformed ID"
  ```
  - **Response Body (Error - 404 Not Found):**
  ```json
  "User not found"
  ```

- `POST /users`: Crea un nuevo usuario en el sistema.
  - **Authorization:** Requiere autenticación básica
  - **Request Body:**
  ```json
  {
    "name": "string",
    "pin": "string",
    "refreshToken": "string",
    "role": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/users" \
    -H 'Cookie: accessToken=your_access_token_here' \
    -H 'Cookie: refreshToken=your_refresh_token_here' \
    -H "Content-Type: application/json" \
    -d '{
      "name": "newuser",
      "pin": "1234",
      "refreshToken": null,
      "role": "262006ea-8782-4b08-ac3b-b3f13270fec3"
    }'
  ```
  - **Response Body (Éxito - 201 Created):**
  ```json
  "User added successfully"
  ```

- `PUT /users/{id}`: Actualiza un usuario existente.
  - **Authorization:** Requiere autenticación básica
  - **Path Parameters:**
    - `id` (string): ID del usuario a actualizar
  - **Request Body:**
  ```json
  {
    "name": "string",
    "pin": "string",
    "refreshToken": "string",
    "role": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X PUT "http://197.0.0.1:9154/users/76ee1086-b945-4170-b2e6-9fbeb95ae0be" \
    -H 'Cookie: accessToken=your_access_token_here' \
    -H 'Cookie: refreshToken=your_refresh_token_here' \
    -H "Content-Type: application/json" \
    -d '{
      "name": "updateduser",
      "pin": "5678",
      "refreshToken": "new-refresh-token",
      "role": "262006ea-8782-4b08-ac3b-b3f13270fec3"
    }'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  "User updated successfully"
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Missing or malformed ID"
  ```
  - **Response Body (Error - 404 Not Found):**
  ```json
  "User with ID: {id} not found"
  ```

- `DELETE /users/{id}`: Elimina un usuario del sistema.
  - **Authorization:** Requiere autenticación básica
  - **Path Parameters:**
    - `id` (string): ID del usuario a eliminar
  - **cURL Example:**
  ```bash
  curl -X DELETE "http://197.0.0.1:9154/users/76ee1086-b945-4170-b2e6-9fbeb95ae0be" \
    -H 'Cookie: accessToken=your_access_token_here' \
    -H 'Cookie: refreshToken=your_refresh_token_here' \
  ```
  - **Response Body (Éxito - 204 No Content):**
  ```json
  "User deleted successfully"
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Missing or malformed ID"
  ```
  - **Response Body (Error - 404 Not Found):**
  ```json
  "User with ID: {id} not found"
  ```

### Notas importantes:
- Todos los endpoints de usuarios requieren autenticación 
- Los IDs de usuarios son UUID generados automáticamente
- El campo `role` debe ser un UUID de un rol existente en el sistema
- El PIN se almacena hasheado y se devuelve enmascarado como "****" por seguridad
- El campo `refreshToken` es opcional y puede ser `null`
