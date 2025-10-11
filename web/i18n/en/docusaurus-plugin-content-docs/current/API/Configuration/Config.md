### Configuration Management

Endpoints for managing the general application configuration.

- `GET /config`: Gets the current application configuration.
  - **Authorization:** Requires administrator token.
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/config" \
    -H "Cookie: accessToken=$ACCESS_TOKEN"
  ```
  - **Response Body (200 OK):**
  ```json
  {
    "id": 1,
    "restaurantName": "Ambrosia Restaurant",
    "address": "123 Main Street, Anytown",
    "phone": "555-1234",
    "email": "contact@ambrosia.com",
    "taxId": "ABC123456",
    "logo": null
  }
  ```
  - **Response Body (404 Not Found):**
  ```json
  "Config not found"
  ```

- `PUT /config`: Updates the application configuration.
  - **Authorization:** Requires administrator token.
  - **Request Body:**
  ```json
  {
    "restaurantName": "string",
    "address": "string",
    "phone": "string",
    "email": "string",
    "taxId": "string",
    "logo": "string (base64)"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X PUT "http://127.0.0.1:9154/config" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "restaurantName": "Ambrosia Updated",
      "address": "456 Oak Avenue, Anytown",
      "phone": "555-5678",
      "email": "info@ambrosia.com",
      "taxId": "XYZ987654"
    }'
  ```
  - **Response Body (200 OK):**
  ```json
  {
    "message": "Config updated successfully"
  }
  ```
  - **Response Body (404 Not Found):**
  ```json
  "Failed to update config"
  ```
