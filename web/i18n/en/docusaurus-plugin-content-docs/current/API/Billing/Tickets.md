### Ticket Management

The ticket endpoints allow you to manage the invoices and receipts of the point of sale system.

- `GET /tickets`: Gets all the tickets in the system.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/tickets" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  [
    {
      "id": "2be55b66-819e-47f6-870a-a0d2cfbca279",
      "order_id": "11122afd-3dda-4455-82de-310fc94f58db",
      "user_id": "941bc7aa-ee4c-45cf-844d-1a624a870fed",
      "ticket_date": "2025-07-27T10:30:00Z",
      "status": 1,
      "total_amount": 45.50,
      "notes": "Cash payment"
    },
    {
      "id": "88a3aea6-ac53-4a40-842d-ee2d08be74f5",
      "order_id": "027fd070-33fb-4e5c-918f-9cc6f7dc1a94",
      "user_id": "a227d382-e1d0-4b02-b4ce-864274604d76",
      "ticket_date": "2025-07-27T11:15:00Z",
      "status": 2,
      "total_amount": 32.80,
      "notes": "Card payment"
    }
  ]
  ```
  - **Response Body (No Content - 204 No Content):**
  ```json
  "No tickets found"
  ```

- `GET /tickets/{id}`: Gets a specific ticket by its ID.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the ticket to get
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/tickets/64bec9ff-c8a2-47db-8f4b-f7d92b47dc1a" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "id": "12226fd9-7299-4c75-b573-2d4a586ac8ab",
    "order_id": "83bb3cc3-7c60-4ad2-a4c3-e0601c028106",
    "user_id": "22ed1170-ccb7-4a2d-9fc6-47ac6b39c2ca",
    "ticket_date": "2025-07-27T10:30:00Z",
    "status": 1,
    "total_amount": 45.50,
    "notes": "Cash payment"
  }
  ```

- `POST /tickets`: Creates a new ticket.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Request Body:**
  ```json
  {
    "order_id": "string",
    "user_id": "string",
    "ticket_date": "2025-07-27T10:30:00Z",
    "status": 1,
    "total_amount": 0.0,
    "notes": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/tickets" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "order_id": "80506193-de42-4a5e-958f-9e6c9b59d19d",
      "user_id": "f31def9e-2382-4b51-b61d-199843b663b0",
      "ticket_date": "2025-07-27T12:00:00Z",
      "status": 1,
      "total_amount": 67.25,
      "notes": "Mixed payment: cash + card"
    }'
  ```
  - **Response Body (Success - 201 Created):**
  ```json
  {
    "id": "1633ebd2-7462-4c6c-aa57-41143e8a087a"
  }
  ```

- `PUT /tickets/{id}`: Updates an existing ticket.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the ticket to update
  - **Request Body:**
  ```json
  {
    "order_id": "string",
    "user_id": "string",
    "ticket_date": "2025-07-27T10:30:00Z",
    "status": 1,
    "total_amount": 0.0,
    "notes": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X PUT "http://127.0.0.1:9154/tickets/2ce883f9-bd79-447c-b840-af418ca2223c" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "order_id": "2ce883f9-bd79-447c-b840-af418ca2223c",
      "user_id": "089a081a-43fd-413d-937e-d12f245bf800",
      "ticket_date": "2025-07-27T10:30:00Z",
      "status": 2,
      "total_amount": 45.50,
      "notes": "Payment processed successfully"
    }'
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  "Ticket updated successfully"
  ```

- `DELETE /tickets/{id}`: Deletes a ticket from the system.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the ticket to delete
  - **cURL Example:**
  ```bash
  curl -X DELETE "http://127.0.0.1:9154/tickets/6eb9893a-8a48-419f-be2f-1353a5c0f43a" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  "Ticket deleted successfully"
  ```

### Important notes:
- All ticket endpoints require authentication 
- Ticket IDs are automatically generated UUIDs
- A ticket must be associated with a valid order (`order_id`)
- A ticket must be associated with a valid user (`user_id`)
- The date format is ISO 8601 (YYYY-MM-DDTHH:MM:SSZ)
- Common ticket states:
  - `1`: Pending
  - `2`: Paid
  - `3`: Canceled
- The `total_amount` must match the total of the associated order
- The `notes` field can contain information about the payment method or special details
