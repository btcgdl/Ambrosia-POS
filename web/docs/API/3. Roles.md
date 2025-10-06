### Gestión de Roles

Los endpoints de roles permiten gestionar los diferentes roles de usuario en el sistema.

- `GET /roles`: Obtiene todos los roles del sistema.
  - **Authorization:** Requiere access token válido (admin)
  - **cURL Example:**
  ```bash
  curl -X GET http://127.0.0.1:9154/roles \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  [
    {
      "id": "e7349203-1bdf-4d8a-8a83-0f5dccb23e1b",
      "role": "coolrolename",
      "password": "******",
      "isAdmin": true
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
  curl -X GET http://127.0.0.1:9154/roles/76ee1086-b945-4170-b2e6-9fbeb95ae0be \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "id": "e7349203-1bdf-4d8a-8a83-0f5dccb23e1b",
    "role": "coolrolename",
    "password": "******",
    "isAdmin": true
  }
  ```

- `POST /roles`: Crea un nuevo rol en el sistema.
  - **Authorization:** Requiere access token válido (admin)
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
  curl -X POST http://127.0.0.1:9154/roles \
    -H 'Content-Type: application/json' \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -d '{
        "role" : "admin",
        "password": "S3cur3P4ssw0rd!!",
        "isAdmin": true
    }'
  ```
  - **Response Body (Éxito - 201 Created):**
  ```json
  {
    "id": "5f80cf01-9448-4332-a981-0140cba12279",
    "message": "Role added successfully"
  }
  ```

- `PUT /roles/{id}`: Actualiza un rol existente.
  - **Authorization:** Requiere access token válido (admin)
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
  curl -X PUT http://127.0.0.1:9154/roles/76ee1086-b945-4170-b2e6-9fbeb95ae0be \
    -H 'Content-Type: application/json' \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
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

- `DELETE /roles/{id}`: Elimina un rol del sistema.
  - **Authorization:** Requiere access token válido (admin)
  - **Path Parameters:**
    - `id` (string): ID del rol a eliminar
  - **cURL Example:**
  ```bash
  curl -X DELETE http://127.0.0.1:9154/roles/76ee1086-b945-4170-b2e6-9fbeb95ae0be \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Éxito - 204 No Content):**
  ```json
  "Role deleted successfully"
  ```

### Notas importantes:
- Todos los endpoints de roles requieren autenticación via access token
- Los IDs de roles deben ser únicos en el sistema
- La eliminación de un rol puede afectar a usuarios que tengan asignado ese rol
- Los campos `id` y `name` son requeridos para crear/actualizar roles