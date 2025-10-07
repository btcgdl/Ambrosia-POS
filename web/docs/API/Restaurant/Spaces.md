### Gestión de Espacios

Los endpoints de espacios permiten administrar las áreas físicas del establecimiento.

- `GET /spaces`: Obtiene todos los espacios del establecimiento.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/spaces" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  [
    {
      "id": "9214936c-0d95-4101-97ac-a2f04e4929bd",
      "name": "Terraza"
    },
    {
      "id": "9008646f-b24b-4e14-9c4a-00cec2d124da", 
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
  curl -X GET "http://127.0.0.1:9154/spaces/34fe7489-74e9-4e7a-968a-66cd0cdc00d7" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "id": "34fe7489-74e9-4e7a-968a-66cd0cdc00d7",
    "name": "Terraza"
  }
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
  curl -X POST "http://127.0.0.1:9154/spaces" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Jardín Exterior"
    }'
  ```
  - **Response Body (Éxito - 201 Created):**
  ```json
  {
    "id": "cadd2c99-3a87-4fb6-802d-9a57b4c05ba5",
    "message": "Space added successfully"
  }
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
  curl -X PUT "http://127.0.0.1:9154/spaces/9008646f-b24b-4e14-9c4a-00cec2d124da" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Terraza Renovada"
    }'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "id": "9008646f-b24b-4e14-9c4a-00cec2d124da",
    "message": "Space updated successfully"
  }
  ```

- `DELETE /spaces/{id}`: Elimina un espacio del sistema.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID del espacio a eliminar
  - **cURL Example:**
  ```bash
  curl -X DELETE "http://127.0.0.1:9154/spaces/9008646f-b24b-4e14-9c4a-00cec2d124da" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "id": "9008646f-b24b-4e14-9c4a-00cec2d124da",
    "message": "Space deleted successfully"
  }
  ```

### Notas importantes:
- Todos los endpoints de espacios requieren autenticación 
- Los IDs de espacios son UUID generados automáticamente
- Un espacio puede contener múltiples mesas
- No se puede eliminar un espacio que tenga mesas asociadas