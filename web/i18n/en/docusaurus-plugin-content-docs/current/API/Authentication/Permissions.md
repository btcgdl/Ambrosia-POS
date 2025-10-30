### Permission Management

Permission endpoints allow listing the available permissions in the system. These permissions are assigned to roles.

- `GET /permissions`: Gets all enabled permissions.
  - **Authorization:** Requires a valid access token (admin)
  - **cURL Example:**
  ```bash
  curl -X GET http://127.0.0.1:9154/permissions \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  [
    { "id": "a1b2c3...", "name": "products_read", "description": "List and view products", "enabled": true },
    { "id": "d4e5f6...", "name": "orders_create", "description": "Create orders", "enabled": true },
    { "id": "g7h8i9...", "name": "settings_update", "description": "Update settings/config", "enabled": true }
  ]
  ```
  - **Response Body (No Content - 204 No Content):** no body

### Notes
- Assigning permissions to roles is managed via Role endpoints (`/roles/{id}/permissions`).
- The `name` property is the key used to assign permissions (e.g., `products_read`, `orders_update`, `reports_export`).
