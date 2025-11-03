### Role Management

The role endpoints allow you to manage the different user roles in the system.

- `GET /roles`: Gets all the roles in the system.
  - **Authorization:** Requires a valid access token (admin)
  - **cURL Example:**
  ```bash
  curl -X GET http://127.0.0.1:9154/roles \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  [
    {
      "id": "e7349203-1bdf-4d8a-8a83-0f5dccb23e1b",
      "role": "coolrolename",
      "password": "******",
      "isAdmin": true
    }
  ]
  ```
  - **Response Body (No Content - 204 No Content):**
  ```json
  "No roles found"
  ```

- `GET /roles/{id}`: Gets a specific role by its ID.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the role to get
  - **cURL Example:**
  ```bash
  curl -X GET http://127.0.0.1:9154/roles/76ee1086-b945-4170-b2e6-9fbeb95ae0be \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "id": "e7349203-1bdf-4d8a-8a83-0f5dccb23e1b",
    "role": "coolrolename",
    "password": "******",
    "isAdmin": true
  }
  ```

- `POST /roles`: Creates a new role in the system.
  - **Authorization:** Requires a valid access token (admin)
  - **Request Body:**
  ```json
    {
        "role" : "String",
        "password": "String",
        "isAdmin": true || false
    }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST http://127.0.0.1:9154/roles \
    -H 'Content-Type: application/json' \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -d '{ 
        "role" : "admin",
        "password": "S3cur3P4ssw0rd!!",
        "isAdmin": true
    }'
  ```
  - **Response Body (Success - 201 Created):**
  ```json
  {
    "id": "5f80cf01-9448-4332-a981-0140cba12279",
    "message": "Role added successfully"
  }
  ```

- `PUT /roles/{id}`: Updates an existing role.
  - **Authorization:** Requires a valid access token (admin)
  - **Path Parameters:**
    - `id` (string): ID of the role to update
  - **Request Body:**
  ```json
    {
        "role" : "admin",
        "password": "S3cur3P4ssw0rd!!",
        "isAdmin": true
    }
  ```
  - **cURL Example:**
  ```bash
  curl -X PUT http://127.0.0.1:9154/roles/76ee1086-b945-4170-b2e6-9fbeb95ae0be \
    -H 'Content-Type: application/json' \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -d '{ 
        "role" : "admin",
        "password": "S3cur3P4ssw0rd123!!",
        "isAdmin": true
    }'
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  "Role updated successfully"
  ```

- `DELETE /roles/{id}`: Deletes a role from the system.
  - **Authorization:** Requires a valid access token (admin)
  - **Path Parameters:**
    - `id` (string): ID of the role to delete
  - **cURL Example:**
  ```bash
  curl -X DELETE http://127.0.0.1:9154/roles/76ee1086-b945-4170-b2e6-9fbeb95ae0be \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Success - 204 No Content):**
  ```json
  "Role deleted successfully"
  ```

---

### Role Permissions

- `GET /roles/{id}/permissions`: Lists the permissions assigned to a role.
  - **Authorization:** Requires a valid access token (admin)
  - **Path Parameters:**
    - `id` (string): Role ID
  - **cURL Example:**
  ```bash
  curl -X GET http://127.0.0.1:9154/roles/76ee1086-b945-4170-b2e6-9fbeb95ae0be/permissions \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  [
    { "id": "0f3c...", "name": "products_read", "description": "List and view products", "enabled": true },
    { "id": "1a2b...", "name": "orders_create", "description": "Create new orders", "enabled": true }
  ]
  ```
  - **Response Body (No Content - 204 No Content):** no body

- `PUT /roles/{id}/permissions`: Replaces the permissions assigned to a role.
  - **Authorization:** Requires a valid access token (admin)
  - **Path Parameters:**
    - `id` (string): Role ID
  - **Request Body:**
  ```json
  {
    "permissions": ["products_read", "orders_create", "orders_read"]
  }
  ```
  - The values in `permissions` are the permission `name` keys (e.g., `products_read`, `products_update`, `orders_export`).
  - **cURL Example:**
  ```bash
  curl -X PUT http://127.0.0.1:9154/roles/76ee1086-b945-4170-b2e6-9fbeb95ae0be/permissions \
    -H 'Content-Type: application/json' \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -d '{
      "permissions": ["products_read", "orders_create", "orders_read"]
    }'
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "roleId": "76ee1086-b945-4170-b2e6-9fbeb95ae0be",
    "assigned": 3
  }
  ```

### Important notes:
- All role endpoints require authentication via access token
- Role IDs must be unique in the system
- Deleting a role may affect users who are assigned that role
- The `id` and `name` fields are required to create/update roles
