### Ingredient Category Management

The ingredient category endpoints allow you to organize the inventory by ingredient types.

- `GET /ingredient-categories`: Gets all ingredient categories.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/ingredient-categories" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  [
    {
      "id": "6ff600de-0805-4880-b9d8-a07624b77dec",
      "name": "Cereals"
    },
    {
      "id": "34b3e62d-c150-4c4c-8984-a7a306b910ea",
      "name": "Meats"
    },
    {
      "id": "58e3e20e-437d-4909-8ddc-4ebf3b7998e1",
      "name": "Oils and Condiments"
    }
  ]
  ```
  - **Response Body (No Content - 204 No Content):**
  ```json
  "No ingredient categories found"
  ```

- `GET /ingredient-categories/{id}`: Gets a specific category by its ID.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the category to get
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/ingredient-categories/bcccc9ef-5466-415a-adda-c2e62e154aaf" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "id": "bcccc9ef-5466-415a-adda-c2e62e154aaf",
    "name": "Cereals"
  }
  ```

- `POST /ingredient-categories`: Creates a new ingredient category.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Request Body:**
  ```json
  {
    "name": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/ingredient-categories" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Dairy"
    }'
  ```
  - **Response Body (Success - 201 Created):**
  ```json
  {
    "id": "644974e3-4067-41ac-92b4-8c33a2350e1c",
    "message": "Ingredient category added successfully"
  }
  ```

- `PUT /ingredient-categories/{id}`: Updates an existing category.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
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
  curl -X PUT "http://127.0.0.1:9154/ingredient-categories/5c339473-d10d-432f-9666-b79be0f1201a" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Cereals and Grains"
    }'
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "id": "644974e3-4067-41ac-92b4-8c33a2350e1c",
    "message": "Ingredient category updated successfully"
  }
  ```

- `DELETE /ingredient-categories/{id}`: Deletes a category from the system.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the category to delete
  - **cURL Example:**
  ```bash
  curl -X DELETE "http://127.0.0.1:9154/ingredient-categories/1121cbb8-741b-4e63-9d38-cbbdf3099ea4" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" 
  ```
  - **Response Body (Success - 204 No Content):**
  ```json
  {
    "id": "97ef9759-36d5-4263-94d0-aa9851fe1b4f",
    "message": "Ingredient category deleted successfully"
  }
  ```

### Important notes:
- All ingredient category endpoints require authentication.
- Category IDs are automatically generated UUIDs.
- You cannot delete a category that has associated ingredients.
- Categories help organize inventory by ingredient type.
- Examples of categories: Cereals, Meats, Vegetables, Dairy, Condiments, etc.
