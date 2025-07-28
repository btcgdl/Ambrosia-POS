### Gestión de Pagos

Los endpoints de pagos permiten administrar las transacciones, métodos de pago y monedas del sistema.

## Pagos Principales

- `GET /payments`: Obtiene todos los pagos del sistema.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET "http://localhost:8080/payments" \
    -H 'Cookie: accessToken=your_access_token_here' \
    -H 'Cookie: refreshToken=your_refresh_token_here'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  [
    {
      "id": "payment-uuid-1",
      "method_id": "method-uuid-1",
      "currency_id": "currency-uuid-1",
      "transaction_id": "txn-123456",
      "amount": 45.50
    },
    {
      "id": "payment-uuid-2",
      "method_id": "method-uuid-2",
      "currency_id": "currency-uuid-1",
      "transaction_id": "txn-789012",
      "amount": 32.80
    }
  ]
  ```
  - **Response Body (Sin contenido - 204 No Content):**
  ```json
  "No payments found"
  ```

- `GET /payments/{id}`: Obtiene un pago específico por su ID.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID del pago a obtener
  - **cURL Example:**
  ```bash
  curl -X GET "http://localhost:8080/payments/payment-uuid-1" \
    -H 'Cookie: accessToken=your_access_token_here'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "id": "payment-uuid-1",
    "method_id": "method-uuid-1",
    "currency_id": "currency-uuid-1",
    "transaction_id": "txn-123456",
    "amount": 45.50
  }
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Missing or malformed ID"
  ```
  - **Response Body (Error - 404 Not Found):**
  ```json
  "Payment not found"
  ```

- `POST /payments`: Crea un nuevo pago.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Request Body:**
  ```json
  {
    "method_id": "string",
    "currency_id": "string",
    "transaction_id": "string",
    "amount": 0.0
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://localhost:8080/payments" \
    -H 'Cookie: accessToken=your_access_token_here' \
    -H "Content-Type: application/json" \
    -d '{
      "method_id": "method-uuid-1",
      "currency_id": "currency-uuid-1",
      "transaction_id": "txn-345678",
      "amount": 78.90
    }'
  ```
  - **Response Body (Éxito - 201 Created):**
  ```json
  {
    "id": "generated-uuid",
    "message": "Payment added successfully"
  }
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Failed to create payment"
  ```

- `PUT /payments/{id}`: Actualiza un pago existente.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID del pago a actualizar
  - **Request Body:**
  ```json
  {
    "method_id": "string",
    "currency_id": "string",
    "transaction_id": "string",
    "amount": 0.0
  }
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  "Payment updated successfully"
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Failed to update payment"
  ```

- `DELETE /payments/{id}`: Elimina un pago del sistema.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID del pago a eliminar
  - **Response Body (Éxito - 200 OK):**
  ```json
  "Payment deleted successfully"
  ```

## Métodos de Pago

- `GET /payments/methods`: Obtiene todos los métodos de pago disponibles.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET "http://localhost:8080/payments/methods" \
    -H 'Cookie: accessToken=your_access_token_here'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  [
    {
      "id": "method-uuid-1",
      "name": "Efectivo"
    },
    {
      "id": "method-uuid-2",
      "name": "Tarjeta de Crédito"
    },
    {
      "id": "method-uuid-3",
      "name": "Bitcoin Lightning"
    }
  ]
  ```
  - **Response Body (Sin contenido - 204 No Content):**
  ```json
  "No payment methods found"
  ```

- `GET /payments/methods/{id}`: Obtiene un método de pago específico.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID del método de pago
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "id": "method-uuid-1",
    "name": "Efectivo"
  }
  ```
  - **Response Body (Error - 404 Not Found):**
  ```json
  "Payment method not found"
  ```

## Monedas

- `GET /payments/currencies`: Obtiene todas las monedas disponibles.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET "http://localhost:8080/payments/currencies" \
    -H 'Cookie: accessToken=your_access_token_here'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  [
    {
      "id": "currency-uuid-1",
      "acronym": "EUR"
    },
    {
      "id": "currency-uuid-2",
      "acronym": "USD"
    },
    {
      "id": "currency-uuid-3",
      "acronym": "BTC"
    }
  ]
  ```
  - **Response Body (Sin contenido - 204 No Content):**
  ```json
  "No currencies found"
  ```

- `GET /payments/currencies/{id}`: Obtiene una moneda específica.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID de la moneda
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "id": "currency-uuid-1",
    "acronym": "EUR"
  }
  ```
  - **Response Body (Error - 404 Not Found):**
  ```json
  "Currency not found"
  ```

## Relaciones Ticket-Pago

- `POST /payments/ticket-payments`: Crea una relación entre un ticket y un pago.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Request Body:**
  ```json
  {
    "payment_id": "string",
    "ticket_id": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://localhost:8080/payments/ticket-payments" \
    -H 'Cookie: accessToken=your_access_token_here' \
    -H "Content-Type: application/json" \
    -d '{
      "payment_id": "payment-uuid-1",
      "ticket_id": "ticket-uuid-1"
    }'
  ```
  - **Response Body (Éxito - 201 Created):**
  ```json
  "Ticket payment relationship created successfully"
  ```

- `GET /payments/ticket-payments/by-ticket/{ticketId}`: Obtiene todos los pagos de un ticket.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `ticketId` (string): ID del ticket
  - **cURL Example:**
  ```bash
  curl -X GET "http://localhost:8080/payments/ticket-payments/by-ticket/ticket-uuid-1" \
    -H 'Cookie: accessToken=your_access_token_here'
  ```

- `GET /payments/ticket-payments/by-payment/{paymentId}`: Obtiene todos los tickets de un pago.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `paymentId` (string): ID del pago

- `DELETE /payments/ticket-payments?paymentId={id}&ticketId={id}`: Elimina una relación ticket-pago específica.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Query Parameters:**
    - `paymentId` (string): ID del pago
    - `ticketId` (string): ID del ticket
  - **cURL Example:**
  ```bash
  curl -X DELETE "http://localhost:8080/payments/ticket-payments?paymentId=payment-uuid-1&ticketId=ticket-uuid-1" \
    -H 'Cookie: accessToken=your_access_token_here'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  "Ticket payment relationship deleted successfully"
  ```

- `DELETE /payments/ticket-payments/by-ticket/{ticketId}`: Elimina todas las relaciones de pago de un ticket.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `ticketId` (string): ID del ticket
  - **Response Body (Éxito - 200 OK):**
  ```json
  "All payment relationships for ticket deleted"
  ```

### Notas importantes:
- Todos los endpoints de pagos requieren autenticación 
- Los IDs son UUID generados automáticamente
- Un pago debe estar asociado a un método de pago válido (`method_id`)
- Un pago debe estar asociado a una moneda válida (`currency_id`)
- El `transaction_id` es único para cada transacción
- Los pagos pueden estar asociados a múltiples tickets (pagos divididos)
- Un ticket puede tener múltiples pagos (pagos mixtos)
- El sistema soporta Bitcoin Lightning Network como método de pago
