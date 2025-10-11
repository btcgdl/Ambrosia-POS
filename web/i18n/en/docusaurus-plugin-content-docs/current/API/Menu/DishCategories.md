### Dish Category Management

The dish category endpoints allow you to manage the categories for organizing the dishes on the menu.

- `GET /dish-categories`: Gets all the dish categories in the system.
  - **Authorization:** Requires JWT authentication (sent automatically via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/dish-categories" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  [
    {
      "id": "76ee1086-b945-4170-b2e6-9fbeb95ae0be",
      "name": "Appetizers"
    },
    {
      "id": "262006ea-8782-4b08-ac3b-b3f13270fec3",
      "name": "Main Courses"
    }
  ]
  ```
  - **Response Body (No Content - 204 No Content):**
  ```json
  "No dish categories found"
  ```

- `GET /dish-categories/{id}`: Gets a specific dish category by its ID.
  - **Authorization:** Requires JWT authentication (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the category to get
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/dish-categories/76ee1086-b945-4170-b2e6-9fbeb95ae0be" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "id": "76ee1086-b945-4170-b2e6-9fbeb95ae0be",
    "name": "Appetizers"
  }
  ```

- `POST /dish-categories`: Creates a new dish category in the system.
  - **Authorization:** Requires JWT authentication (sent automatically via cookies)
  - **Request Body:**
  ```json
  {
    "name": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/dish-categories" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{ 
      "name": "Desserts"
    }'
  ```
  - **Response Body (Success - 201 Created):**
  ```json
  {
    "id": "4f264229-5a9f-439d-a944-442c5f0f748d",
    "message": "Dish category added successfully"
  }
  ```

- `PUT /dish-categories/{id}`: Updates an existing dish category.
  - **Authorization:** Requires JWT authentication (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the category to update
  - **Request Body:**
  ```json
  {
    "name": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X PUT "http://127.0.0.1:9154/dish-categories/76ee1086-b945-4170-b2e6-9fbeb95ae0be" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{ 
      "name": "Gourmet Appetizers"
    }'
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "id": "76ee1086-b945-4170-b2e6-9fbeb95ae0be",
    "message": "Dish category updated successfully"
  }
  ```

- `DELETE /dish-categories/{id}`: Deletes a dish category from the system.
  - **Authorization:** Requires JWT authentication (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the category to delete
  - **cURL Example:**
  ```bash
  curl -X DELETE "http://127.0.0.1:9154/dish-categories/76ee1086-b945-4170-b2e6-9fbeb95ae0be" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "id": "76ee1086-b945-4170-b2e6-9fbeb95ae0be",
    "message": "Dish category deleted successfully"
  }
  ```

### Important notes:
- All dish category endpoints require JWT authentication (sent automatically via cookies).
- Category IDs are automatically generated UUIDs.
- You cannot delete a category if it is being used by existing dishes.
- The `name` field is required to create/update categories.
