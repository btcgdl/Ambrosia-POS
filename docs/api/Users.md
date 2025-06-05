### 1. Users

- `POST /auth/login`: This endpoint returns all users stored in the database as a JSON array. Each user object includes fields such as `id`, `username`, `email`, and `role`.

#### Base URL

```
/users
```

#### Authentication
All endpoints require Basic Authentication.

#### Endpoints

##### 1.1. Get All Users
Retrieves a list of all users in the system.

**Endpoint:** `GET /users`

**Authentication:** Required

**Responses:**

- `200 OK`: Successfully retrieved the list of users
  ```json
  [
    {
      "id": "string",
      "username": "string",
      "email": "string",
      "role": "string"
      // other user properties
    }
  ]
  ```
- `204 No Content`: No users found in the system
- `401 Unauthorized`: Authentication failed

##### 1.2. Get User by ID
Retrieves a specific user by their ID.

**Endpoint:** `GET /users/{id}`

**Path Parameters:**
- `id` (string, required): The unique identifier of the user

**Authentication:** Required

**Responses:**
- `200 OK`: Successfully retrieved the user
  ```json
  {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "string"
    // other user properties
  }
  ```
- `400 Bad Request`: Missing or malformed ID
- `401 Unauthorized`: Authentication failed
- `404 Not Found`: User with specified ID not found

##### 1.3. Create User
Creates a new user in the system.

**Endpoint:** `POST /users`

**Authentication:** Required

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "string"
  // other user properties
}
```

**Responses:**
- `201 Created`: User added successfully
- `400 Bad Request`: Invalid request body
- `401 Unauthorized`: Authentication failed

##### 1.4. Update User
Updates an existing user's information.

**Endpoint:** `PUT /users/{id}`

**Path Parameters:**
- `id` (string, required): The unique identifier of the user to update

**Authentication:** Required

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "string"
  // other user properties
}
```

**Responses:**
- `200 OK`: User updated successfully
- `400 Bad Request`: Missing or malformed ID or invalid request body
- `401 Unauthorized`: Authentication failed
- `404 Not Found`: User with specified ID not found

##### 1.5. Delete User
Deletes a user from the system.

**Endpoint:** `DELETE /users/{id}`

**Path Parameters:**
- `id` (string, required): The unique identifier of the user to delete

**Authentication:** Required

**Responses:**
- `204 No Content`: User deleted successfully
- `400 Bad Request`: Missing or malformed ID
- `401 Unauthorized`: Authentication failed
- `404 Not Found`: User with specified ID not found

#### Implementation Details
The Users API is implemented in `Users.kt` using Ktor framework with the following components:
- `UsersService`: Handles the business logic and database operations
- Basic authentication is required for all endpoints
- SQLite database is used for persistence
