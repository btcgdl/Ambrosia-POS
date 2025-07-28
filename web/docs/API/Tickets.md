### Gestión de Tickets

Los endpoints de tickets permiten administrar las facturas y recibos del sistema de punto de venta.

- `GET /tickets`: Obtiene todos los tickets del sistema.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/tickets" \
    -H 'Cookie: accessToken=your_access_token_here' \
    -H 'Cookie: refreshToken=your_refresh_token_here' \
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  [
    {
      "id": "2be55b66-819e-47f6-870a-a0d2cfbca279",
      "order_id": "11122afd-3dda-4455-82de-310fc94f58db",
      "user_id": "941bc7aa-ee4c-45cf-844d-1a624a870fed",
      "ticket_date": "2025-07-27T10:30:00Z",
      "status": 1,
      "total_amount": 45.50,
      "notes": "Pago en efectivo"
    },
    {
      "id": "88a3aea6-ac53-4a40-842d-ee2d08be74f5",
      "order_id": "027fd070-33fb-4e5c-918f-9cc6f7dc1a94",
      "user_id": "a227d382-e1d0-4b02-b4ce-864274604d76",
      "ticket_date": "2025-07-27T11:15:00Z",
      "status": 2,
      "total_amount": 32.80,
      "notes": "Pago con tarjeta"
    }
  ]
  ```
  - **Response Body (Sin contenido - 204 No Content):**
  ```json
  "No tickets found"
  ```

- `GET /tickets/{id}`: Obtiene un ticket específico por su ID.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID del ticket a obtener
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/tickets/64bec9ff-c8a2-47db-8f4b-f7d92b47dc1a" \
    -H 'Cookie: accessToken=your_access_token_here'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "id": "12226fd9-7299-4c75-b573-2d4a586ac8ab",
    "order_id": "83bb3cc3-7c60-4ad2-a4c3-e0601c028106",
    "user_id": "22ed1170-ccb7-4a2d-9fc6-47ac6b39c2ca",
    "ticket_date": "2025-07-27T10:30:00Z",
    "status": 1,
    "total_amount": 45.50,
    "notes": "Pago en efectivo"
  }
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Missing or malformed ID"
  ```
  - **Response Body (Error - 404 Not Found):**
  ```json
  "Ticket not found"
  ```

- `POST /tickets`: Crea un nuevo ticket.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Request Body:**
  ```json
  {
    "order_id": "string",
    "user_id": "string",
    "ticket_date": "2025-07-27T10:30:00Z",
    "status": 1,
    "total_amount": 0.0,
    "notes": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/tickets" \
    -H 'Cookie: accessToken=your_access_token_here' \
    -H "Content-Type: application/json" \
    -d '{
      "order_id": "80506193-de42-4a5e-958f-9e6c9b59d19d",
      "user_id": "f31def9e-2382-4b51-b61d-199843b663b0",
      "ticket_date": "2025-07-27T12:00:00Z",
      "status": 1,
      "total_amount": 67.25,
      "notes": "Pago mixto: efectivo + tarjeta"
    }'
  ```
  - **Response Body (Éxito - 201 Created):**
  ```json
  {
    "id": "1633ebd2-7462-4c6c-aa57-41143e8a087a"
  }
  ```

- `PUT /tickets/{id}`: Actualiza un ticket existente.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID del ticket a actualizar
  - **Request Body:**
  ```json
  {
    "order_id": "string",
    "user_id": "string",
    "ticket_date": "2025-07-27T10:30:00Z",
    "status": 1,
    "total_amount": 0.0,
    "notes": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X PUT "http://127.0.0.1:9154/tickets/2ce883f9-bd79-447c-b840-af418ca2223c" \
    -H 'Cookie: accessToken=your_access_token_here' \
    -H "Content-Type: application/json" \
    -d '{
      "order_id": "2ce883f9-bd79-447c-b840-af418ca2223c",
      "user_id": "089a081a-43fd-413d-937e-d12f245bf800",
      "ticket_date": "2025-07-27T10:30:00Z",
      "status": 2,
      "total_amount": 45.50,
      "notes": "Pago procesado correctamente"
    }'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  "Ticket updated successfully"
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Missing or malformed ID"
  ```
  - **Response Body (Error - 404 Not Found):**
  ```json
  "Ticket not found"
  ```

- `DELETE /tickets/{id}`: Elimina un ticket del sistema.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID del ticket a eliminar
  - **cURL Example:**
  ```bash
  curl -X DELETE "http://127.0.0.1:9154/tickets/6eb9893a-8a48-419f-be2f-1353a5c0f43a" \
    -H 'Cookie: accessToken=your_access_token_here'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  "Ticket deleted successfully"
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Missing or malformed ID"
  ```
  - **Response Body (Error - 404 Not Found):**
  ```json
  "Ticket not found"
  ```

### Notas importantes:
- Todos los endpoints de tickets requieren autenticación 
- Los IDs de tickets son UUID generados automáticamente
- Un ticket debe estar asociado a una orden válida (`order_id`)
- Un ticket debe estar asociado a un usuario válido (`user_id`)
- El formato de fecha es ISO 8601 (YYYY-MM-DDTHH:MM:SSZ)
- Los estados de ticket comunes:
  - `1`: Pendiente
  - `2`: Pagado
  - `3`: Cancelado
- El `total_amount` debe coincidir con el total de la orden asociada
- El campo `notes` puede contener información sobre el método de pago o detalles especiales
