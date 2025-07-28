### Gestión de Espacios

Los endpoints de espacios permiten administrar las áreas físicas del establecimiento.

- `GET /spaces`: Obtiene todos los espacios del establecimiento.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET "http://localhost:8080/spaces" \
    -H 'Cookie: accessToken=your_access_token_here'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  [
    {
      "id": "space-uuid-1",
      "name": "Terraza"
    },
    {
      "id": "space-uuid-2", 
      "name": "Salón Principal"
    }
  ]
  ```
  - **Response Body (Sin contenido - 204 No Content):**
  ```json
  "No spaces found"
  ```

- `GET /spaces/{id}`: Obtiene un espacio específico por su ID.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID del espacio a obtener
  - **cURL Example:**
  ```bash
  curl -X GET "http://localhost:8080/spaces/space-uuid-1" \
    -H 'Cookie: accessToken=your_access_token_here'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "id": "space-uuid-1",
    "name": "Terraza"
  }
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Missing or malformed ID"
  ```
  - **Response Body (Error - 404 Not Found):**
  ```json
  "Space not found"
  ```

- `POST /spaces`: Crea un nuevo espacio.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Request Body:**
  ```json
  {
    "name": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://localhost:8080/spaces" \
    -H 'Cookie: accessToken=your_access_token_here' \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Jardín Exterior"
    }'
  ```
  - **Response Body (Éxito - 201 Created):**
  ```json
  "Space added successfully"
  ```

- `PUT /spaces/{id}`: Actualiza un espacio existente.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID del espacio a actualizar
  - **Request Body:**
  ```json
  {
    "name": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X PUT "http://localhost:8080/spaces/space-uuid-1" \
    -H 'Cookie: accessToken=your_access_token_here' \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Terraza Renovada"
    }'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  "Space updated successfully"
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Missing or malformed ID"
  ```
  - **Response Body (Error - 404 Not Found):**
  ```json
  "Space not found"
  ```

- `DELETE /spaces/{id}`: Elimina un espacio del sistema.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID del espacio a eliminar
  - **cURL Example:**
  ```bash
  curl -X DELETE "http://localhost:8080/spaces/space-uuid-1" \
    -H 'Cookie: accessToken=your_access_token_here'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  "Space deleted successfully"
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Missing or malformed ID"
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Space not found"
  ```

### Notas importantes:
- Todos los endpoints de espacios requieren autenticación 
- Los IDs de espacios son UUID generados automáticamente
- Un espacio puede contener múltiples mesas
- No se puede eliminar un espacio que tenga mesas asociadas
