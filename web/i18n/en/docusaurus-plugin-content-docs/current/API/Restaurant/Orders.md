### Order Management

The order endpoints allow you to manage the restaurant's orders, including the associated dishes.

- `GET /orders`: Gets all the orders in the system.
  - **Authorization:** Requires JWT authentication (sent automatically via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/orders" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  [
    {
      "id": "76ee1086-b945-4170-b2e6-9fbeb95ae0be",
      "user_id": "262006ea-8782-4b08-ac3b-b3f13270fec3",
      "table_id": "123e4567-e89b-12d3-a456-426614174000",
      "waiter": "Juan Perez",
      "status": "pending",
      "total": 45.50,
      "created_at": "2025-01-15T14:30:00Z"
    }
  ]
  ```
  - **Response Body (No Content - 204 No Content):**
  ```json
  "No orders found"
  ```

- `GET /orders/{id}`: Gets a specific order by its ID.
  - **Authorization:** Requires JWT authentication (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the order to get
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/orders/76ee1086-b945-4170-b2e6-9fbeb95ae0be" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "id": "76ee1086-b945-4170-b2e6-9fbeb95ae0be",
    "user_id": "262006ea-8782-4b08-ac3b-b3f13270fec3",
    "table_id": "123e4567-e89b-12d3-a456-426614174000",
    "waiter": "Juan Perez",
    "status": "pending",
    "total": 45.50,
    "created_at": "2025-01-15T14:30:00Z"
  }
  ```

- `GET /orders/{id}/complete`: Gets a complete order with all its dishes.
  - **Authorization:** Requires JWT authentication (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the order to get
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/orders/76ee1086-b945-4170-b2e6-9fbeb95ae0be/complete" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "order": {
      "id": "76ee1086-b945-4170-b2e6-9fbeb95ae0be",
      "user_id": "262006ea-8782-4b08-ac3b-b3f13270fec3",
      "table_id": "123e4567-e89b-12d3-a456-426614174000",
      "waiter": "Juan Perez",
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
        "notes": "No onion"
      }
    ]
  }
  ```

- `POST /orders`: Creates a new order in the system.
  - **Authorization:** Requires JWT authentication (sent automatically via cookies)
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
  curl -X POST "http://127.0.0.1:9154/orders" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "user_id": "262006ea-8782-4b08-ac3b-b3f13270fec3",
      "table_id": "123e4567-e89b-12d3-a456-426614174000",
      "waiter": "Maria Garcia",
      "status": "pending",
      "total": 0.0
    }'
  ```
  - **Response Body (Success - 201 Created):**
  ```json
  {
    "message": "Order added successfully",
    "id": "new-order-uuid"
  }
  ```

- `POST /orders/with-dishes`: Creates a complete order with dishes included.
  - **Authorization:** Requires JWT authentication (sent automatically via cookies)
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
  curl -X POST "http://127.0.0.1:9154/orders/with-dishes" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "order": {
        "user_id": "262006ea-8782-4b08-ac3b-b3f13270fec3",
        "table_id": "123e4567-e89b-12d3-a456-426614174000",
        "waiter": "Carlos Lopez",
        "status": "pending",
        "total": 0.0
      },
      "dishes": [
        {
          "dish_id": "pizza-uuid",
          "price_at_order": 15.99,
          "notes": "Extra cheese"
        }
      ]
    }'
  ```

- `PUT /orders/{id}`: Updates an existing order.
  - **Authorization:** Requires JWT authentication (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the order to update
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
  curl -X PUT "http://127.0.0.1:9154/orders/76ee1086-b945-4170-b2e6-9fbeb95ae0be" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "user_id": "262006ea-8782-4b08-ac3b-b3f13270fec3",
      "table_id": "123e4567-e89b-12d3-a456-426614174000",
      "waiter": "Ana Martinez",
      "status": "completed",
      "total": 48.75
    }'
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "message": "Order updated successfully"
  }
  ```

- `DELETE /orders/{id}`: Deletes an order from the system.
  - **Authorization:** Requires JWT authentication (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the order to delete
  - **cURL Example:**
  ```bash
  curl -X DELETE "http://127.0.0.1:9154/orders/76ee1086-b945-4170-b2e6-9fbeb95ae0be" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "message": "Order deleted successfully"
  }
  ```

### Dish Management in Orders

- `GET /orders/{id}/dishes`: Gets all the dishes of a specific order.
  - **Authorization:** Requires JWT authentication (sent automatically via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/orders/76ee1086-b945-4170-b2e6-9fbeb95ae0be/dishes" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json"
  ```

- `POST /orders/{id}/dishes`: Adds dishes to an existing order.
  - **Authorization:** Requires JWT authentication (sent automatically via cookies)
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

- `PUT /orders/{id}/dishes/{dishId}`: Updates a specific dish of an order.
  - **Authorization:** Requires JWT authentication (sent automatically via cookies)
- `DELETE /orders/{id}/dishes/{dishId}`: Deletes a specific dish from an order.
  - **Authorization:** Requires JWT authentication (sent automatically via cookies)
- `DELETE /orders/{id}/dishes`: Deletes all the dishes from an order.
  - **Authorization:** Requires JWT authentication (sent automatically via cookies)

### Filters and Additional Actions

- `GET /orders/user/{userId}`: Gets all the orders of a specific user.
  - **Authorization:** Requires JWT authentication.
  - **Path Parameters:**
    - `userId` (string): User ID.

- `GET /orders/table/{tableId}`: Gets all the orders of a specific table.
  - **Authorization:** Requires JWT authentication.
  - **Path Parameters:**
    - `tableId` (string): Table ID.

- `GET /orders/status/{status}`: Gets all the orders with a specific status.
  - **Authorization:** Requires JWT authentication.
  - **Path Parameters:**
    - `status` (string): Order status (`pending`, `completed`, etc.).

- `GET /orders/date-range`: Gets orders within a date range.
  - **Authorization:** Requires JWT authentication.
  - **Query Parameters:**
    - `start_date` (string): Start date (YYYY-MM-DD format).
    - `end_date` (string): End date (YYYY-MM-DD format).

- `GET /orders/total-sales/{date}`: Gets the total sales for a specific date.
  - **Authorization:** Requires JWT authentication.
  - **Path Parameters:**
    - `date` (string): Date (YYYY-MM-DD format).

- `PUT /orders/{id}/calculate-total`: Recalculates and updates the total of an order.
  - **Authorization:** Requires JWT authentication.
  - **Path Parameters:**
    - `id` (string): Order ID.

### Important notes:
- All order endpoints require JWT authentication.
- IDs are automatically generated UUIDs.
- The order total is calculated automatically based on the dishes.
- Tokens are sent automatically via browser cookies.
