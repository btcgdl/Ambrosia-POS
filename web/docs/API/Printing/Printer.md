### Gestión de Impresoras

Endpoints para gestionar las impresoras de tickets.

- `GET /printers`: Obtiene la lista de impresoras disponibles en el sistema.
  - **Authorization:** Requiere token de autenticación.
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
    "Cocina"
  ]
  ```

- `POST /printers/set`: Establece la impresora para un tipo de ticket específico (cocina o cliente).
  - **Authorization:** Requiere token de autenticación.
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
      "printerName": "Cocina"
    }'
  ```
  - **Response Body (200 OK):**
  ```text
  "Printer Cocina set for KITCHEN"
  ```

- `POST /printers/print`: Envía un trabajo de impresión para un ticket.
  - **Authorization:** Requiere token de autenticación.
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
        "tableName": "Mesa 5",
        "roomName": "Salón Principal",
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
