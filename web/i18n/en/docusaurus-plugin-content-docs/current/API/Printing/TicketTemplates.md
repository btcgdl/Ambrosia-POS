### Ticket Template Management

Endpoints for managing the ticket templates used for printing.

- `GET /ticket-templates`: Gets all available ticket templates.
  - **Authorization:** Requires authentication token.
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/ticket-templates" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (200 OK):**
  ```json
  [
    {
      "name": "Default Customer Ticket",
      "elements": [ ... ]
    }
  ]
  ```

- `POST /ticket-templates`: Creates a new ticket template.
  - **Authorization:** Requires authentication token.
  - **Request Body:** `TicketTemplate` object
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/ticket-templates" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{ 
      "name": "My Custom Template",
      "elements": [
        {
          "type": "HEADER",
          "value": "{{config.restaurantName}}",
          "style": { "bold": true, "justification": "CENTER" }
        }
      ]
    }'
  ```
  - **Response Body (201 Created):**
  ```text
  "Template 'My Custom Template' created"
  ```

- `GET /ticket-templates/{name}`: Gets a ticket template by its name.
  - **Authorization:** Requires authentication token.
  - **Path Parameters:**
    - `name` (string): Name of the template to get.
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/ticket-templates/Default%20Customer%20Ticket" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (200 OK):**
  ```json
  {
    "name": "Default Customer Ticket",
    "elements": [ ... ]
  }
  ```
  - **Response Body (404 Not Found):**
  ```json
  "Template '...' not found"
  ```
