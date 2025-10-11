### Payment Management

The payment endpoints allow you to manage transactions, payment methods, and currencies in the system.

## Main Payments

- `GET /payments`: Gets all the payments in the system.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/payments" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Success - 200 OK):**
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
  - **Response Body (No Content - 204 No Content):**
  ```json
  "No payments found"
  ```

- `GET /payments/{id}`: Gets a specific payment by its ID.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the payment to get
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/payments/payment-uuid-1" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" 
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "id": "payment-uuid-1",
    "method_id": "method-uuid-1",
    "currency_id": "currency-uuid-1",
    "transaction_id": "txn-123456",
    "amount": 45.50
  }
  ```

- `POST /payments`: Creates a new payment.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
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
  curl -X POST "http://127.0.0.1:9154/payments" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{ 
      "method_id": "method-uuid-1",
      "currency_id": "currency-uuid-1",
      "transaction_id": "txn-345678",
      "amount": 78.90
    }'
  ```
  - **Response Body (Success - 201 Created):**
  ```json
  {
    "id": "generated-uuid",
    "message": "Payment added successfully"
  }
  ```

- `PUT /payments/{id}`: Updates an existing payment.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the payment to update
  - **Request Body:**
  ```json
  {
    "method_id": "string",
    "currency_id": "string",
    "transaction_id": "string",
    "amount": 0.0
  }
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  "Payment updated successfully"
  ```

- `DELETE /payments/{id}`: Deletes a payment from the system.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the payment to delete
  - **Response Body (Success - 200 OK):**
  ```json
  "Payment deleted successfully"
  ```

## Payment Methods

- `GET /payments/methods`: Gets all available payment methods.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/payments/methods" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" 
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  [
    {
      "id": "method-uuid-1",
      "name": "Cash"
    },
    {
      "id": "method-uuid-2",
      "name": "Credit Card"
    },
    {
      "id": "method-uuid-3",
      "name": "Bitcoin Lightning"
    }
  ]
  ```
  - **Response Body (No Content - 204 No Content):**
  ```json
  "No payment methods found"
  ```

- `GET /payments/methods/{id}`: Gets a specific payment method.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the payment method
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "id": "method-uuid-1",
    "name": "Cash"
  }
  ```

## Currencies

- `GET /payments/currencies`: Gets all available currencies.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/payments/currencies" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" 
  ```
  - **Response Body (Success - 200 OK):**
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
  - **Response Body (No Content - 204 No Content):**
  ```json
  "No currencies found"
  ```

- `GET /payments/currencies/{id}`: Gets a specific currency.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the currency
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "id": "currency-uuid-1",
    "acronym": "EUR"
  }
  ```

## Ticket-Payment Relationships

- `POST /payments/ticket-payments`: Creates a relationship between a ticket and a payment.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Request Body:**
  ```json
  {
    "payment_id": "string",
    "ticket_id": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/payments/ticket-payments" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{ 
      "payment_id": "payment-uuid-1",
      "ticket_id": "ticket-uuid-1"
    }'
  ```
  - **Response Body (Success - 201 Created):**
  ```json
  "Ticket payment relationship created successfully"
  ```

- `GET /payments/ticket-payments/by-ticket/{ticketId}`: Gets all payments for a ticket.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `ticketId` (string): ID of the ticket
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/payments/ticket-payments/by-ticket/ticket-uuid-1" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```

- `GET /payments/ticket-payments/by-payment/{paymentId}`: Gets all tickets for a payment.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `paymentId` (string): ID of the payment

- `DELETE /payments/ticket-payments?paymentId={id}&ticketId={id}`: Deletes a specific ticket-payment relationship.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Query Parameters:**
    - `paymentId` (string): ID of the payment
    - `ticketId` (string): ID of the ticket
  - **cURL Example:**
  ```bash
  curl -X DELETE "http://127.0.0.1:9154/payments/ticket-payments?paymentId=payment-uuid-1&ticketId=ticket-uuid-1" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  "Ticket payment relationship deleted successfully"
  ```

- `DELETE /payments/ticket-payments/by-ticket/{ticketId}`: Deletes all payment relationships for a ticket.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `ticketId` (string): ID of the ticket
  - **Response Body (Success - 200 OK):**
  ```json
  "All payment relationships for ticket deleted"
  ```

### Important notes:
- All payment endpoints require JWT authentication
- IDs are automatically generated UUIDs
- A payment must be associated with a valid payment method (`method_id`)
- A payment must be associated with a valid currency (`currency_id`)
- The `transaction_id` is unique for each transaction
- Payments can be associated with multiple tickets (split payments)
- A ticket can have multiple payments (mixed payments)
- The system supports Bitcoin Lightning Network as a payment method
- Tokens are sent automatically via browser cookies
