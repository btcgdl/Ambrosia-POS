### Supplier Management

The supplier endpoints allow you to manage the contact information of the restaurant's suppliers.

- `GET /suppliers`: Gets all the suppliers in the system.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/suppliers" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  [
    {
      "id": "1c322996-8696-4dcb-b14e-8c7abd8a4880",
      "name": "Central Distributor",
      "contact": "Maria Garcia",
      "phone": "+34 666 123 456",
      "email": "maria@distribuidora.com",
      "address": "Calle Mayor 123, Madrid"
    },
    {
      "id": "c46c6b1b-480c-4a83-86fc-327f6dbf9718",
      "name": "El Toro Butchery",
      "contact": "Juan Perez",
      "phone": "+34 677 234 567",
      "email": "juan@carniceriaeltoro.com",
      "address": "Avenida de la Paz 45, Valencia"
    }
  ]
  ```
  - **Response Body (No Content - 204 No Content):**
  ```json
  "No suppliers found"
  ```

- `GET /suppliers/{id}`: Gets a specific supplier by its ID.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the supplier to get
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/suppliers/5f7037ea-a0cc-4820-9df4-90a80960d897" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "id": "5f7037ea-a0cc-4820-9df4-90a80960d897",
    "name": "Central Distributor",
    "contact": "Maria Garcia",
    "phone": "+34 666 123 456",
    "email": "maria@distribuidora.com",
    "address": "Calle Mayor 123, Madrid"
  }
  ```

- `POST /suppliers`: Creates a new supplier.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Request Body:**
  ```json
  {
    "name": "string",
    "contact": "string",
    "phone": "string",
    "email": "string",
    "address": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/suppliers" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Fresh Fruits and Vegetables",
      "contact": "Ana Lopez",
      "phone": "+34 688 345 678",
      "email": "ana@frutasfrescas.com",
      "address": "Central Market, Stall 15, Seville"
    }'
  ```
  - **Response Body (Success - 201 Created):**
  ```json
  {
    "id": "10980f77-45fa-4a5c-bd3b-bb93d9b6ca0f",
    "message": "Supplier added successfully"
  }
  ```

- `PUT /suppliers/{id}`: Updates an existing supplier.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the supplier to update
  - **Request Body:**
  ```json
  {
    "name": "string",
    "contact": "string",
    "phone": "string",
    "email": "string",
    "address": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X PUT "http://127.0.0.1:9154/suppliers/a1bbc895-297f-42d8-bc92-e7dc61b81d6f" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Central Distributor S.L.",
      "contact": "Maria Garcia Rodriguez",
      "phone": "+34 666 123 456",
      "email": "maria.garcia@distribuidora.com",
      "address": "Calle Mayor 123, 28001 Madrid"
    }'
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "id": "10980f77-45fa-4a5c-bd3b-bb93d9b6ca0f",
    "message": "Supplier updated successfully"
  }
  ```

- `DELETE /suppliers/{id}`: Deletes a supplier from the system.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the supplier to delete
  - **cURL Example:**
  ```bash
  curl -X DELETE "http://127.0.0.1:9154/suppliers/supplier-uuid-1" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "id": "10980f77-45fa-4a5c-bd3b-bb93d9b6ca0f",
    "message": "Supplier deleted successfully"
  }
  ```

### Important notes:
- All supplier endpoints require JWT authentication.
- Supplier IDs are automatically generated UUIDs.
- All fields (name, contact, phone, email, address) are required.
- The email must have a valid format.
- Suppliers can be associated with ingredients for inventory control.
- It is recommended to keep contact information updated to facilitate orders.
- Tokens are sent automatically via browser cookies.
