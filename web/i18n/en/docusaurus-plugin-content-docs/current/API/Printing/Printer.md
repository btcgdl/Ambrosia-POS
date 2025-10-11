### Printer Management

Endpoints for managing ticket printers.

- `GET /printers`: Gets the list of available printers in the system.
  - **Authorization:** Requires authentication token.
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/printers" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" 
  ```
  - **Response Body (200 OK):**
  ```json
  [
    "Printer 1",
    "Printer 2",
    "Kitchen"
  ]
  ```

- `POST /printers/set`: Sets the printer for a specific ticket type (kitchen or customer).
  - **Authorization:** Requires authentication token.
  - **Request Body:**
  ```json
  {
    "type": "KITCHEN" | "CUSTOMER",
    "printerName": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/printers/set" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "type": "KITCHEN",
      "printerName": "Kitchen"
    }'
  ```
  - **Response Body (200 OK):**
  ```text
  "Printer Kitchen set for KITCHEN"
  ```

- `POST /printers/print`: Sends a print job for a ticket.
  - **Authorization:** Requires authentication token.
  - **Request Body:**
  ```json
  {
    "templateName": "string",
    "ticketData": { ... },
    "type": "KITCHEN" | "CUSTOMER"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/printers/print" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "templateName": "Default Customer Ticket",
      "ticketData": {
        "ticketId": "T-123",
        "tableName": "Table 5",
        "roomName": "Main Hall",
        "date": "2025-10-06",
        "items": [
          {
            "quantity": 2,
            "name": "Pizza Margherita",
            "price": 12.50
          }
        ],
        "total": 25.00
      },
      "type": "CUSTOMER"
    }'
  ```
  - **Response Body (200 OK):**
  ```text
  "Print job sent"
  ```
  - **Response Body (404 Not Found):**
  ```json
  "Template '...' not found"
  ```
  - **Response Body (500 Internal Server Error):**
  ```text
  "Error printing: ..."
  ```
