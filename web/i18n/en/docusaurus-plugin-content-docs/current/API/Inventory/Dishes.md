### Dish Management

The dish endpoints allow you to manage the restaurant's menu with all available dishes.

- `GET /dishes`: Gets all the dishes in the system.
  - **Authorization:** Requires JWT authentication (sent automatically via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/dishes" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  [
    {
      "id": "76ee1086-b945-4170-b2e6-9fbeb95ae0be",
      "name": "Pizza Margherita",
      "price": 15.99,
      "category_id": "262006ea-8782-4b08-ac3b-b3f13270fec3"
    },
    {
      "id": "262006ea-8782-4b08-ac3b-b3f13270fec3",
      "name": "Caesar Salad",
      "price": 12.50,
      "category_id": "76ee1086-b945-4170-b2e6-9fbeb95ae0be"
    }
  ]
  ```
  - **Response Body (No Content - 204 No Content):**
  ```json
  "No dishes found"
  ```

- `GET /dishes/{id}`: Gets a specific dish by its ID.
  - **Authorization:** Requires JWT authentication (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the dish to get
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/dishes/76ee1086-b945-4170-b2e6-9fbeb95ae0be" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "id": "76ee1086-b945-4170-b2e6-9fbeb95ae0be",
    "name": "Pizza Margherita",
    "price": 15.99,
    "category_id": "262006ea-8782-4b08-ac3b-b3f13270fec3"
  }
  ```

- `POST /dishes`: Creates a new dish in the system.
  - **Authorization:** Requires JWT authentication (sent automatically via cookies)
  - **Request Body:**
  ```json
  {
    "name": "string",
    "price": 0.0,
    "category_id": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/dishes" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Pasta Carbonara",
      "price": 18.75,
      "category_id": "262006ea-8782-4b08-ac3b-b3f13270fec3"
    }'
  ```
  - **Response Body (Success - 201 Created):**
  ```json
  "Dish added successfully"
  ```

- `PUT /dishes/{id}`: Updates an existing dish.
  - **Authorization:** Requires JWT authentication (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the dish to update
  - **Request Body:**
  ```json
  {
    "name": "string",
    "price": 0.0,
    "category_id": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X PUT "http://127.0.0.1:9154/dishes/76ee1086-b945-4170-b2e6-9fbeb95ae0be" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Pizza Margherita Premium",
      "price": 17.99,
      "category_id": "262006ea-8782-4b08-ac3b-b3f13270fec3"
    }'
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  "Dish updated successfully"
  ```

- `DELETE /dishes/{id}`: Deletes a dish from the system.
  - **Authorization:** Requires JWT authentication (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the dish to delete
  - **cURL Example:**
  ```bash
  curl -X DELETE "http://127.0.0.1:9154/dishes/76ee1086-b945-4170-b2e6-9fbeb95ae0be" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json"
  ```
  - **Response Body (Success - 204 No Content):**
  ```json
  "Dish deleted successfully"
  ```

### Important notes:
- All dish endpoints require JWT authentication (sent automatically via cookies).
- Dish IDs are automatically generated UUIDs.
- The `category_id` field must reference an existing dish category.
- Prices must be positive numeric values.
- The `name`, `price`, and `category_id` fields are required.
