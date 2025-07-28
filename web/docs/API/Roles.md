### 2. Gestión de Roles

Los endpoints de roles permiten gestionar los diferentes roles de usuario en el sistema.

- `GET /roles`: Obtiene todos los roles del sistema.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET http://127.0.0.1:5000/roles \
    -H 'Cookie: accessToken=your_access_token_here' \
    -H 'Cookie: refreshToken=your_refresh_token_here'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  [
    {
      "id": "76ee1086-b945-4170-b2e6-9fbeb95ae0be",
      "name": "admin",
      "password": "****",
      "isAdmin": true
    },
    {
      "id": "262006ea-8782-4b08-ac3b-b3f13270fec3", 
      "name": "waiter",
      "password": "****",
      "isAdmin": false
    }
  ]
  ```
  - **Response Body (Sin contenido - 204 No Content):**
  ```json
  "No roles found"
  ```

- `GET /roles/{id}`: Obtiene un rol específico por su ID.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID del rol a obtener
  - **cURL Example:**
  ```bash
  curl -X GET http://127.0.0.1:5000/roles/76ee1086-b945-4170-b2e6-9fbeb95ae0be \
    -H 'Cookie: accessToken=your_access_token_here' \
    -H 'Cookie: refreshToken=your_refresh_token_here'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
    {
        "id": "76ee1086-b945-4170-b2e6-9fbeb95ae0be",
        "role": "admin",
        "password": "****",
        "isAdmin": true
    }
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Missing or malformed ID"
  ```
  - **Response Body (Error - 404 Not Found):**
  ```json
  "Role not found"
  ```

- `POST /roles`: Crea un nuevo rol en el sistema.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Request Body:**
  ```json
    {
        "role" : "String",
        "password": "String",
        "isAdmin": true || false
    }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST http://127.0.0.1:5000/roles \
    -H 'Content-Type: application/json' \
    -H 'Cookie: accessToken=your_access_token_here' \
    -H 'Cookie: refreshToken=your_refresh_token_here' \
    -d '{
        "role" : "admin",
        "password": "S3cur3P4ssw0rd!!",
        "isAdmin": true
    }'
  ```
  - **Response Body (Éxito - 201 Created):**
  ```json
  "Role added successfully"
  ```

- `PUT /roles/{id}`: Actualiza un rol existente.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID del rol a actualizar
  - **Request Body:**
  ```json
    {
        "role" : "admin",
        "password": "S3cur3P4ssw0rd!!",
        "isAdmin": true
    }
  ```
  - **cURL Example:**
  ```bash
  curl -X PUT http://127.0.0.1:5000/roles/76ee1086-b945-4170-b2e6-9fbeb95ae0be \
    -H 'Content-Type: application/json' \
    -H 'Cookie: accessToken=your_access_token_here' \
    -H 'Cookie: refreshToken=your_refresh_token_here' \
    -d '{
        "role" : "admin",
        "password": "S3cur3P4ssw0rd123!!",
        "isAdmin": true
    }'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  "Role updated successfully"
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Missing or malformed ID"
  ```
  - **Response Body (Error - 404 Not Found):**
  ```json
  "Role with ID: {id} not found"
  ```

- `DELETE /roles/{id}`: Elimina un rol del sistema.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID del rol a eliminar
  - **cURL Example:**
  ```bash
  curl -X DELETE http://127.0.0.1:5000/roles/76ee1086-b945-4170-b2e6-9fbeb95ae0be \
    -H 'Cookie: accessToken=your_access_token_here'
    -H 'Cokkie: refreshToken=your_refresh_token_here'
  ```
  - **Response Body (Éxito - 204 No Content):**
  ```json
  "Role deleted successfully"
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Missing or malformed ID"
  ```
  - **Response Body (Error - 404 Not Found):**
  ```json
  "Role with ID: {id} not found"
  ```

### Notas importantes:
- Todos los endpoints de roles requieren autenticación via access token
- Los IDs de roles deben ser únicos en el sistema
- La eliminación de un rol puede afectar a usuarios que tengan asignado ese rol
- Los campos `id`, `name` y `description` son requeridos para crear/actualizar roles