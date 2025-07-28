### 5. Gestión de Órdenes

Los endpoints de órdenes permiten gestionar los pedidos del restaurante, incluyendo los platos asociados.

- `GET /orders`: Obtiene todas las órdenes del sistema.
  - **Authorization:** Requiere autenticación básica
  - **cURL Example:**
  ```bash
  curl -X GET "http://localhost:8080/orders" \
    -H "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=" \
    -H "Content-Type: application/json"
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  [
    {
      "id": "76ee1086-b945-4170-b2e6-9fbeb95ae0be",
      "user_id": "262006ea-8782-4b08-ac3b-b3f13270fec3",
      "table_id": "123e4567-e89b-12d3-a456-426614174000",
      "waiter": "Juan Pérez",
      "status": "pending",
      "total": 45.50,
      "created_at": "2025-01-15T14:30:00Z"
    }
  ]
  ```
  - **Response Body (Sin contenido - 204 No Content):**
  ```json
  "No orders found"
  ```

- `GET /orders/{id}`: Obtiene una orden específica por su ID.
  - **Authorization:** Requiere autenticación básica
  - **Path Parameters:**
    - `id` (string): ID de la orden a obtener
  - **cURL Example:**
  ```bash
  curl -X GET "http://localhost:8080/orders/76ee1086-b945-4170-b2e6-9fbeb95ae0be" \
    -H "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=" \
    -H "Content-Type: application/json"
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "id": "76ee1086-b945-4170-b2e6-9fbeb95ae0be",
    "user_id": "262006ea-8782-4b08-ac3b-b3f13270fec3",
    "table_id": "123e4567-e89b-12d3-a456-426614174000",
    "waiter": "Juan Pérez",
    "status": "pending",
    "total": 45.50,
    "created_at": "2025-01-15T14:30:00Z"
  }
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Missing or malformed ID"
  ```
  - **Response Body (Error - 404 Not Found):**
  ```json
  "Order not found"
  ```

- `GET /orders/{id}/complete`: Obtiene una orden completa con todos sus platos.
  - **Authorization:** Requiere autenticación básica
  - **Path Parameters:**
    - `id` (string): ID de la orden a obtener
  - **cURL Example:**
  ```bash
  curl -X GET "http://localhost:8080/orders/76ee1086-b945-4170-b2e6-9fbeb95ae0be/complete" \
    -H "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=" \
    -H "Content-Type: application/json"
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "order": {
      "id": "76ee1086-b945-4170-b2e6-9fbeb95ae0be",
      "user_id": "262006ea-8782-4b08-ac3b-b3f13270fec3",
      "table_id": "123e4567-e89b-12d3-a456-426614174000",
      "waiter": "Juan Pérez",
      "status": "pending",
      "total": 45.50,
      "created_at": "2025-01-15T14:30:00Z"
    },
    "dishes": [
      {
        "id": "dish-uuid-1",
        "order_id": "76ee1086-b945-4170-b2e6-9fbeb95ae0be",
        "dish_id": "pizza-uuid",
        "price_at_order": 15.99,
        "notes": "Sin cebolla"
      }
    ]
  }
  ```

- `POST /orders`: Crea una nueva orden en el sistema.
  - **Authorization:** Requiere autenticación básica
  - **Request Body:**
  ```json
  {
    "user_id": "string",
    "table_id": "string",
    "waiter": "string",
    "status": "string",
    "total": 0.0
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://localhost:8080/orders" \
    -H "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=" \
    -H "Content-Type: application/json" \
    -d '{
      "user_id": "262006ea-8782-4b08-ac3b-b3f13270fec3",
      "table_id": "123e4567-e89b-12d3-a456-426614174000",
      "waiter": "María García",
      "status": "pending",
      "total": 0.0
    }'
  ```
  - **Response Body (Éxito - 201 Created):**
  ```json
  {
    "message": "Order added successfully",
    "id": "new-order-uuid"
  }
  ```

- `POST /orders/with-dishes`: Crea una orden completa con platos incluidos.
  - **Authorization:** Requiere autenticación básica
  - **Request Body:**
  ```json
  {
    "order": {
      "user_id": "string",
      "table_id": "string",
      "waiter": "string",
      "status": "string",
      "total": 0.0
    },
    "dishes": [
      {
        "dish_id": "string",
        "price_at_order": 0.0,
        "notes": "string"
      }
    ]
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://localhost:8080/orders/with-dishes" \
    -H "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=" \
    -H "Content-Type: application/json" \
    -d '{
      "order": {
        "user_id": "262006ea-8782-4b08-ac3b-b3f13270fec3",
        "table_id": "123e4567-e89b-12d3-a456-426614174000",
        "waiter": "Carlos López",
        "status": "pending",
        "total": 0.0
      },
      "dishes": [
        {
          "dish_id": "pizza-uuid",
          "price_at_order": 15.99,
          "notes": "Extra queso"
        }
      ]
    }'
  ```

- `PUT /orders/{id}`: Actualiza una orden existente.
  - **Authorization:** Requiere autenticación básica
  - **Path Parameters:**
    - `id` (string): ID de la orden a actualizar
  - **Request Body:**
  ```json
  {
    "user_id": "string",
    "table_id": "string",
    "waiter": "string",
    "status": "string",
    "total": 0.0
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X PUT "http://localhost:8080/orders/76ee1086-b945-4170-b2e6-9fbeb95ae0be" \
    -H "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=" \
    -H "Content-Type: application/json" \
    -d '{
      "user_id": "262006ea-8782-4b08-ac3b-b3f13270fec3",
      "table_id": "123e4567-e89b-12d3-a456-426614174000",
      "waiter": "Ana Martínez",
      "status": "completed",
      "total": 48.75
    }'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "message": "Order updated successfully"
  }
  ```

- `DELETE /orders/{id}`: Elimina una orden del sistema.
  - **Authorization:** Requiere autenticación básica
  - **Path Parameters:**
    - `id` (string): ID de la orden a eliminar
  - **cURL Example:**
  ```bash
  curl -X DELETE "http://localhost:8080/orders/76ee1086-b945-4170-b2e6-9fbeb95ae0be" \
    -H "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=" \
    -H "Content-Type: application/json"
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "message": "Order deleted successfully"
  }
  ```

### Gestión de Platos en Órdenes

- `GET /orders/{id}/dishes`: Obtiene todos los platos de una orden específica.
  - **cURL Example:**
  ```bash
  curl -X GET "http://localhost:8080/orders/76ee1086-b945-4170-b2e6-9fbeb95ae0be/dishes" \
    -H "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=" \
    -H "Content-Type: application/json"
  ```

- `POST /orders/{id}/dishes`: Agrega platos a una orden existente.
  - **Request Body:**
  ```json
  [
    {
      "dish_id": "string",
      "price_at_order": 0.0,
      "notes": "string"
    }
  ]
  ```

- `PUT /orders/{id}/dishes/{dishId}`: Actualiza un plato específico de una orden.
- `DELETE /orders/{id}/dishes/{dishId}`: Elimina un plato específico de una orden.
- `DELETE /orders/{id}/dishes`: Elimina todos los platos de una orden.

### Endpoints de Filtrado

- `GET /orders/user/{userId}`: Obtiene órdenes por usuario.
- `GET /orders/table/{tableId}`: Obtiene órdenes por mesa.
- `GET /orders/status/{status}`: Obtiene órdenes por estado.
- `GET /orders/date-range?start_date={date}&end_date={date}`: Obtiene órdenes por rango de fechas.
- `GET /orders/total-sales/{date}`: Obtiene ventas totales por fecha.

### Notas importantes:
- Todos los endpoints de órdenes requieren autenticación básica
- Los IDs son UUID generados automáticamente
- El total de la orden se calcula automáticamente basado en los platos
- Los estados válidos incluyen: "pending", "in_progress", "completed", "cancelled"
- Las fechas deben estar en formato ISO 8601
- Para codificar credenciales básicas: `echo -n "username:password" | base64`
- El servidor corre por defecto en `http://localhost:8080`
