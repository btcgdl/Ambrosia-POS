### Gestión de Turnos

Los endpoints de turnos permiten administrar los horarios de trabajo del personal del restaurante.

- `GET /shifts`: Obtiene todos los turnos del sistema.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET "http://localhost:8080/shifts" \
    -H 'Cookie: accessToken=your_access_token_here'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  [
    {
      "id": "shift-uuid-1",
      "user_id": "user-uuid-1",
      "shift_date": "2025-07-27",
      "start_time": "08:00:00",
      "end_time": "16:00:00",
      "notes": "Turno de mañana"
    },
    {
      "id": "shift-uuid-2",
      "user_id": "user-uuid-2",
      "shift_date": "2025-07-27",
      "start_time": "16:00:00",
      "end_time": null,
      "notes": "Turno de tarde - En curso"
    }
  ]
  ```
  - **Response Body (Sin contenido - 204 No Content):**
  ```json
  "No shifts found"
  ```

- `GET /shifts/{id}`: Obtiene un turno específico por su ID.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID del turno a obtener
  - **cURL Example:**
  ```bash
  curl -X GET "http://localhost:8080/shifts/shift-uuid-1" \
    -H 'Cookie: accessToken=your_access_token_here'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "id": "shift-uuid-1",
    "user_id": "user-uuid-1",
    "shift_date": "2025-07-27",
    "start_time": "08:00:00",
    "end_time": "16:00:00",
    "notes": "Turno de mañana"
  }
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Missing or malformed ID"
  ```
  - **Response Body (Error - 404 Not Found):**
  ```json
  "Shift not found"
  ```

- `POST /shifts`: Crea un nuevo turno.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Request Body:**
  ```json
  {
    "user_id": "string",
    "shift_date": "YYYY-MM-DD",
    "start_time": "HH:MM:SS",
    "end_time": "HH:MM:SS",
    "notes": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://localhost:8080/shifts" \
    -H 'Cookie: accessToken=your_access_token_here' \
    -H "Content-Type: application/json" \
    -d '{
      "user_id": "user-uuid-3",
      "shift_date": "2025-07-28",
      "start_time": "09:00:00",
      "end_time": "17:00:00",
      "notes": "Turno completo de día"
    }'
  ```
  - **Response Body (Éxito - 201 Created):**
  ```json
  {
    "shiftId": "generated-uuid"
  }
  ```

- `PUT /shifts/{id}`: Actualiza un turno existente.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID del turno a actualizar
  - **Request Body:**
  ```json
  {
    "user_id": "string",
    "shift_date": "YYYY-MM-DD",
    "start_time": "HH:MM:SS",
    "end_time": "HH:MM:SS",
    "notes": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X PUT "http://localhost:8080/shifts/shift-uuid-1" \
    -H 'Cookie: accessToken=your_access_token_here' \
    -H "Content-Type: application/json" \
    -d '{
      "user_id": "user-uuid-1",
      "shift_date": "2025-07-27",
      "start_time": "08:00:00",
      "end_time": "17:00:00",
      "notes": "Turno extendido por eventos especiales"
    }'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  "Shift updated successfully"
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Missing or malformed ID"
  ```
  - **Response Body (Error - 404 Not Found):**
  ```json
  "Shift not found"
  ```

- `DELETE /shifts/{id}`: Elimina un turno del sistema.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID del turno a eliminar
  - **cURL Example:**
  ```bash
  curl -X DELETE "http://localhost:8080/shifts/shift-uuid-1" \
    -H 'Cookie: accessToken=your_access_token_here'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  "Shift deleted successfully"
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Missing or malformed ID"
  ```
  - **Response Body (Error - 404 Not Found):**
  ```json
  "Shift not found"
  ```

### Notas importantes:
- Todos los endpoints de turnos requieren autenticación 
- Los IDs de turnos son UUID generados automáticamente
- Un turno debe estar asociado a un usuario válido (`user_id`)
- El formato de fecha es YYYY-MM-DD (ISO 8601)
- El formato de hora es HH:MM:SS (24 horas)
- El campo `end_time` puede ser `null` para turnos en curso
- El campo `notes` es opcional y puede contener información adicional
- No puede haber turnos solapados para el mismo usuario en la misma fecha
