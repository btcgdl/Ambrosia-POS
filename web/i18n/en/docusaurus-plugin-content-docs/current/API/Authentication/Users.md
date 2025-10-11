### User Management

The user endpoints allow you to manage user accounts in the Ambrosia POS system.

- `GET /users`: Gets all the users in the system.
  - **Authorization:** Requires a valid access token
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/users" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" 
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  [
    {
      "id": "e911705c-e1b4-4997-ab02-ef7460491ac0",
      "name": "cooluser1",
      "pin": "****",
      "refreshToken": "****",
      "role": "e7349203-1bdf-4d8a-8a83-0f5dccb23e1b",
      "isAdmin": false
    }
  ]
  ```
  - **Response Body (No Content - 204 No Content):**
  ```json
  "No users found"
  ```

- `GET /users/{id}`: Gets a specific user by their ID.
  - **Authorization:** Requires a valid access token (admin)
  - **Path Parameters:**
    - `id` (string): ID of the user to get
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/users/76ee1086-b945-4170-b2e6-9fbeb95ae0be" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" 
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "id": "76ee1086-b945-4170-b2e6-9fbeb95ae0be",
    "name": "admin",
    "pin": "****",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "role": "262006ea-8782-4b08-ac3b-b3f13270fec3"
  }
  ```

- `POST /users`: Creates a new user in the system.
  - **Authorization:** Requires a valid access token (admin)
  - **Request Body:**
  ```json
  {
    "name": "string",
    "pin": "string",
    "refreshToken": "string",
    "role": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/users" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "newuser",
      "pin": "1234",
      "refreshToken": null,
      "role": "262006ea-8782-4b08-ac3b-b3f13270fec3"
    }'
  ```
  - **Response Body (Success - 201 Created):**
  ```json
  "User added successfully"
  ```

- `PUT /users/{id}`: Updates an existing user.
  - **Authorization:** Requires a valid access token (admin)
  - **Path Parameters:**
    - `id` (string): ID of the user to update
  - **Request Body:**
  ```json
  {
    "name": "string",
    "pin": "string",
    "refreshToken": "string",
    "role": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X PUT "http://197.0.0.1:9154/users/76ee1086-b945-4170-b2e6-9fbeb95ae0be" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "updateduser",
      "pin": "5678",
      "refreshToken": "new-refresh-token",
      "role": "262006ea-8782-4b08-ac3b-b3f13270fec3"
    }'
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  "User updated successfully"
  ```

- `DELETE /users/{id}`: Deletes a user from the system.
  - **Authorization:** Requires a valid access token (admin)
  - **Path Parameters:**
    - `id` (string): ID of the user to delete
  - **cURL Example:**
  ```bash
  curl -X DELETE "http://197.0.0.1:9154/users/76ee1086-b945-4170-b2e6-9fbeb95ae0be" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" 
  ```
  - **Response Body (Success - 204 No Content):**
  ```json
  "User deleted successfully"
  ```

### Important notes:
- All user endpoints require authentication 
- User IDs are automatically generated UUIDs
- The `role` field must be a UUID of an existing role in the system
- The PIN is stored hashed and returned masked as "****" for security
- The `refreshToken` field is optional and can be `null`
