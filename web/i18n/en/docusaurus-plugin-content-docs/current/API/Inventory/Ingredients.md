### Ingredient Management

The ingredient endpoints allow you to manage the inventory of raw materials.

- `GET /ingredients`: Gets all the ingredients from the inventory.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/ingredients" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" 
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  [
    {
      "id": "9bd8a46f-9a41-40a7-bb7b-c31567cdc7c1",
      "name": "Rice",
      "category_id": "b80b3b3f-4fc4-4fab-a988-182de6985c27",
      "quantity": 50.0,
      "unit": "kg",
      "low_stock_threshold": 10.0,
      "cost_per_unit": 2.50
    },
    {
      "id": "7d77727b-a183-425c-99ae-34494f032c9c",
      "name": "Chicken",
      "category_id": "0914018f-f127-4433-aab2-1d3738af312f",
      "quantity": 25.0,
      "unit": "kg",
      "low_stock_threshold": 5.0,
      "cost_per_unit": 8.90
    }
  ]
  ```
  - **Response Body (No Content - 204 No Content):**
  ```json
  "No ingredients found"
  ```

- `GET /ingredients/{id}`: Gets a specific ingredient by its ID.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the ingredient to get
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/ingredients/abae1423-ba25-49c2-b54a-d0d55c727baf" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" 
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "id": "a9cf05f5-e99e-47a5-a50f-bb3546d75a50",
    "name": "Rice",
    "category_id": "8425ff0d-2322-4c92-875b-588002a8e0e9",
    "quantity": 50.0,
    "unit": "kg",
    "low_stock_threshold": 10.0,
    "cost_per_unit": 2.50
  }
  ```

- `GET /ingredients/low_stock/{threshold}`: Gets ingredients with low stock according to the specified threshold.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `threshold` (float): Low stock threshold
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/ingredients/low_stock/15.0" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" 
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  [
    {
      "id": "91b0df69-ee28-4e48-bd8f-419cb8fd184f",
      "name": "Rice",
      "category_id": "54d14313-badf-447c-88a6-5342f09cca22",
      "quantity": 8.0,
      "unit": "kg",
      "low_stock_threshold": 10.0,
      "cost_per_unit": 2.50
    }
  ]
  ```
  - **Response Body (No Content - 204 No Content):**
  ```json
  "No low stock ingredients found"
  ```

- `POST /ingredients`: Creates a new ingredient.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Request Body:**
  ```json
  {
    "name": "string",
    "category_id": "string",
    "quantity": 0.0,
    "unit": "string",
    "low_stock_threshold": 0.0,
    "cost_per_unit": 0.0
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/ingredients" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Olive Oil",
      "category_id": "e13018bf-ffa3-4b22-aa35-6e782f29302a",
      "quantity": 20.0,
      "unit": "liters",
      "low_stock_threshold": 5.0,
      "cost_per_unit": 4.50
    }'
  ```
  - **Response Body (Success - 201 Created):**
  ```json
  {
    "id": "ab68898f-7f1a-4ecc-a7c4-40974727564c",
    "message": "Ingredient added successfully"
  }
  ```

- `PUT /ingredients/{id}`: Updates an existing ingredient.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the ingredient to update
  - **Request Body:**
  ```json
  {
    "name": "string",
    "category_id": "string",
    "quantity": 0.0,
    "unit": "string",
    "low_stock_threshold": 0.0,
    "cost_per_unit": 0.0
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X PUT "http://127.0.0.1:9154/ingredients/11993e13-b748-4634-ab78-2080f212e98e" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" 
    -H "Content-Type: application/json" \
    -d '{
      "name": "Bomba Rice",
      "category_id": "e13018bf-ffa3-4b22-aa35-6e782f29302a",
      "quantity": 60.0,
      "unit": "kg",
      "low_stock_threshold": 15.0,
      "cost_per_unit": 3.00
    }'
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "id": "ab68898f-7f1a-4ecc-a7c4-40974727564c",
    "message": "Ingredient updated successfully"
  }
  ```

- `DELETE /ingredients/{id}`: Deletes an ingredient from the inventory.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the ingredient to delete
  - **cURL Example:**
  ```bash
  curl -X DELETE "http://127.0.0.1:9154/ingredients/e13018bf-ffa3-4b22-aa35-6e782f29302a" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" 
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "id": "ab68898f-7f1a-4ecc-a7c4-40974727564c",
    "message": "Ingredient deleted successfully"
  }
  ```

### Important notes:
- All ingredient endpoints require authentication.
- Ingredient IDs are automatically generated UUIDs.
- An ingredient must be associated with a valid category (`category_id`).
- Units can be: kg, liters, grams, units, etc.
- The system will alert when the quantity is below the `low_stock_threshold`.
- The `cost_per_unit` is important for calculating dish costs.
