### Product Management

The product endpoints let you create, retrieve, update, and delete inventory products.

- `GET /products`: Retrieves all products.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET http://127.0.0.1:9154/products \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  [
    {
      "id": "b5a6...",
      "SKU": "SKU-0001",
      "name": "Americano coffee",
      "description": "240ml cup",
      "image_url": null,
      "cost_cents": 5000,
      "category_id": "9f5c...",
      "quantity": 10,
      "price_cents": 25000
    }
  ]
  ```
  - **Response Body (No Content - 204 No Content):**
  ```json
  "No products found"
  ```

- `GET /products/{id}`: Retrieves a product by ID.
  - **Authorization:** Requires a valid access token
  - **Path Parameters:** `id` (string)
  - **cURL Example:**
  ```bash
  curl -X GET http://127.0.0.1:9154/products/b5a6... \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```

- `POST /products`: Creates a new product.
  - **Authorization:** Requires a valid access token
  - **Request Body:**
  ```json
  {
    "SKU": "SKU-0001",
    "name": "Americano coffee",
    "description": "240ml cup",
    "image_url": null,
    "cost_cents": 5000,
    "category_id": "9f5c...",
    "quantity": 10,
    "price_cents": 25000
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST http://127.0.0.1:9154/products \
    -H 'Content-Type: application/json' \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -d '{
      "SKU": "SKU-0001",
      "name": "Americano coffee",
      "description": "240ml cup",
      "image_url": null,
      "cost_cents": 5000,
      "category_id": "9f5c...",
      "quantity": 10,
      "price_cents": 25000
    }'
  ```
  - **Response Body (Success - 201 Created):**
  ```json
  { "id": "b5a6...", "message": "Product added successfully" }
  ```

- `PUT /products/{id}`: Updates an existing product.
  - **Authorization:** Requires a valid access token
  - **Path Parameters:** `id` (string)
  - **Request Body:** Same as creation with updated fields.
  - **Response Body (Success - 200 OK):**
  ```json
  { "id": "b5a6...", "message": "Product updated successfully" }
  ```

- `DELETE /products/{id}`: Logically deletes a product.
  - **Authorization:** Requires a valid access token
  - **Path Parameters:** `id` (string)
  - **Response Body (Success - 204 No Content):**
  ```json
  { "id": "b5a6...", "message": "Product deleted successfully" }
  ```

### Notes
- Required fields: `SKU`, `name`, `cost_cents`, `price_cents`, `quantity`, `category_id`.
- Deletion is logical (`is_deleted = 1`).
