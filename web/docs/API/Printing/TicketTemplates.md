### Gestión de Plantillas de Tickets

Endpoints para gestionar las plantillas de tickets utilizadas para la impresión.

- `GET /ticket-templates`: Obtiene todas las plantillas de tickets disponibles.
  - **Authorization:** Requiere token de autenticación.
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/ticket-templates" \
    -H "Cookie: accessToken=$ACCESS_TOKEN"
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

- `POST /ticket-templates`: Crea una nueva plantilla de ticket.
  - **Authorization:** Requiere token de autenticación.
  - **Request Body:** `TicketTemplate` object
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/ticket-templates" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
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

- `GET /ticket-templates/{name}`: Obtiene una plantilla de ticket por su nombre.
  - **Authorization:** Requiere token de autenticación.
  - **Path Parameters:**
    - `name` (string): Nombre de la plantilla a obtener.
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/ticket-templates/Default%20Customer%20Ticket" \
    -H "Cookie: accessToken=$ACCESS_TOKEN"
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
