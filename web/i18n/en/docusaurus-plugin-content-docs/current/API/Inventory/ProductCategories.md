### Product Category Management

Product category endpoints help organize products by type.

- `GET /product-categories`: Retrieves all product categories.
  - **Authorization:** Requires a valid access token
  - **cURL Example:**
  ```bash
  curl -X GET http://127.0.0.1:9154/product-categories \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  [
    { "id": "9f5c...", "name": "Beverages" },
    { "id": "1a7e...", "name": "Food" }
  ]
  ```
  - **Response Body (No Content - 204 No Content):**
  ```json
  "No product categories found"
  ```

- `GET /product-categories/{id}`: Retrieves a category by ID.
  - **Authorization:** Requires a valid access token
  - **Path Parameters:** `id` (string)
  - **cURL Example:**
  ```bash
  curl -X GET http://127.0.0.1:9154/product-categories/9f5c... \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```

- `POST /product-categories`: Creates a new category.
  - **Authorization:** Requires a valid access token
  - **Request Body:**
  ```json
  { "name": "Beverages" }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST http://127.0.0.1:9154/product-categories \
    -H 'Content-Type: application/json' \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -d '{ "name": "Beverages" }'
  ```
  - **Response Body (Success - 201 Created):**
  ```json
  { "id": "9f5c...", "message": "Product category added successfully" }
  ```

- `PUT /product-categories/{id}`: Updates an existing category.
  - **Authorization:** Requires a valid access token
  - **Path Parameters:** `id` (string)
  - **Request Body:**
  ```json
  { "name": "Hot beverages" }
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  { "id": "9f5c...", "message": "Product category updated successfully" }
  ```

- `DELETE /product-categories/{id}`: Deletes a category.
  - **Authorization:** Requires a valid access token
  - **Path Parameters:** `id` (string)
  - **Response Body (Success - 204 No Content):**
  ```json
  { "id": "9f5c...", "message": "Product category deleted successfully" }
  ```
  - **Common errors (400 Bad Request):**
    - "Cannot delete product category - it may be in use or not found"

### Notes
- You cannot delete a category that has associated products.
