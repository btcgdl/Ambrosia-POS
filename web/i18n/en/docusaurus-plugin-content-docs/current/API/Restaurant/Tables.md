### Table Management

The table endpoints allow you to manage the tables within each space.

- `GET /tables`: Gets all the tables in the system.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/tables" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  [
    {
      "id": "31c4a18d-a760-4d1f-a3ca-80b184c2d56c",
      "name": "Table 1",
      "status": "available",
      "space_id": "7743646d-946a-4401-96ca-f970b617485c",
      "order_id": null
    },
    {
      "id": "605850d7-1c91-45dc-aabc-2e3055d8feae",
      "name": "Table 2",
      "status": "occupied",
      "space_id": "ee5078dc-8829-4c91-af1d-2096089d4608",
      "order_id": "b9f9c8c7-180c-49e5-8a45-0cfca41d2dfa"
    }
  ]
  ```
  - **Response Body (No Content - 204 No Content):**
  ```json
  "No tables found"
  ```

- `GET /tables/by-space/{id}`: Gets all the tables of a specific space.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the space
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/tables/by-space/9c9064f5-f389-4e32-b037-805a86827777" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  [
    {
      "id": "9c9064f5-f389-4e32-b037-805a86827777",
      "name": "Table 1",
      "status": "available",
      "space_id": "da787870-0cff-44a7-9179-ceeb49739292",
      "order_id": null
    }
  ]
  ```
  - **Response Body (No Content - 204 No Content):**
  ```json
  "No tables found for space ID: {id}"
  ```

- `GET /tables/{id}`: Gets a specific table by its ID.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the table to get
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/tables/8dacb80d-0694-4a11-bab0-01a877fea66d" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" 
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "id": "2056766b-dcd7-4bb7-a3c7-40d953592195",
    "name": "Table 1",
    "status": "available",
    "space_id": "ded606ff-2d0b-4f89-8352-9d34355043be",
    "order_id": null
  }
  ```

- `POST /tables`: Creates a new table.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Request Body:**
  ```json
  {
    "name": "string",
    "status": "available",
    "space_id": "string",
    "order_id": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/tables" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Table 5",
      "status": "available",
      "space_id": "1a1a67c9-15bf-4f18-aadd-896308ff51c2",
      "order_id": null
    }'
  ```
  - **Response Body (Success - 201 Created):**
  ```json
  {
    "id": "a77d20d1-49d2-4f6a-af3c-96eb89c5cfcb",
    "message": "Table added successfully"
  }
  ```

- `PUT /tables/{id}`: Updates an existing table.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the table to update
  - **Request Body:**
  ```json
  {
    "name": "string",
    "status": "available|occupied|reserved",
    "space_id": "string",
    "order_id": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X PUT "http://127.0.0.1:9154/tables/7088369e-ad06-4ec6-8cc0-68465a395877" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Table 1 VIP",
      "status": "occupied",
      "space_id": "c5a51221-851d-4b7e-b534-1847091fcc09",
      "order_id": "d7c7a43c-7884-48b1-82c4-a18e48aafef8"
    }'
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "id": "a77d20d1-49d2-4f6a-af3c-96eb89c5cfcb",
    "message": "Table updated successfully"
  }
  ```

- `DELETE /tables/{id}`: Deletes a table from the system.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the table to delete
  - **cURL Example:**
  ```bash
  curl -X DELETE "http://192.0.0.1:9154/tables/fc5566ef-6e4c-465f-a1ad-d9ff5dfbb92a" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" 
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "id": "a77d20d1-49d2-4f6a-af3c-96eb89c5cfcb",
    "message": "Table deleted successfully"
  }
  ```

### Important notes:
- All table endpoints require authentication.
- Table IDs are automatically generated UUIDs.
- A table must be associated with a valid space (`space_id`).
- Valid table states are: `available`, `occupied`, `reserved`.
- The `order_id` field is set when there is an active order at the table.
- You cannot delete a table that has an active order.
