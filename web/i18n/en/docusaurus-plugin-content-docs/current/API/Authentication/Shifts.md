### Shift Management

The shift endpoints allow you to manage the work schedules of the restaurant staff.

- `GET /shifts`: Gets all the shifts in the system.
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/shifts" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" 
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  [
    {
      "id": "670ee547-bc75-4c02-89ff-2cd45f12c77f",
      "user_id": "f9c9d4fc-c4b7-4c42-8ae3-bb4649b34f2b",
      "shift_date": "1753523565371",
      "start_time": "1753523565371",
      "end_time": "1753549837824",
      "notes": "Morning shift"
    },
    {
      "id": "c145e48c-210e-49fd-b2fd-3b8fbaf76529",
      "user_id": "b3ddbf81-7934-49ed-b495-086f8c5eda93",
      "shift_date": "1753523565371",
      "start_time": "1753523565371",
      "end_time": null,
      "notes": "Afternoon shift - In progress"
    }
  ]
  ```
  - **Response Body (No Content - 204 No Content):**
  ```json
  "No shifts found"
  ```

- `GET /shifts/{id}`: Gets a specific shift by its ID.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the shift to get
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/shifts/0e5805f1-ff25-4c9d-823b-cacc81eb31db" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "id": "0e5805f1-ff25-4c9d-823b-cacc81eb31db",
    "user_id": "ac5f7527-3c9a-4d89-9133-ee5d8fde631e",
    "shift_date": "1753523565371",
    "start_time": "1753523565371",
    "end_time": "1753549837824",
    "notes": "Morning shift"
  }
  ```

- `POST /shifts`: Creates a new shift.
  - **Authorization:** Requires a valid access token (admin)
  - **Request Body:**
  ```json
  {
    "user_id": "string",
    "shift_date": "Unix Timestamp",
    "start_time": "Unix Timestamp ",
    "end_time": "Unix Timestamp ",
    "notes": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/shifts" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "user_id": "ac5f7527-3c9a-4d89-9133-ee5d8fde631e",
      "shift_date": "1753523565371",
      "start_time": "1753523565371",
      "end_time": "1753549837824",
      "notes": "Morning shift"
    }'
  ```
  - **Response Body (Success - 201 Created):**
  ```json
  {
    "id": "3bbaee46-57f7-461b-9df5-bd40c61823ee",
    "message": "Shift added successfully"
  }
  ```

- `PUT /shifts/{id}`: Updates an existing shift.
  - **Authorization:** Requires a valid access token (admin)
  - **Path Parameters:**
    - `id` (string): ID of the shift to update
  - **Request Body:**
  ```json
  {
    "user_id": "string",
    "shift_date": "Unix Timestamp",
    "start_time": "Unix Timestamp ",
    "end_time": "Unix Timestamp ",
    "notes": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X PUT "http://127.0.0.1:9154/shifts/0e5805f1-ff25-4c9d-823b-cacc81eb31db" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "user_id": "03978988-42ff-4cb9-a790-c51aceb39b2b",
      "shift_date": "1753523565371",
      "start_time": "1753523565371",
      "end_time": "1753549837824",
      "notes": "Shift extended for special events"
    }'
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "id": "0e5805f1-ff25-4c9d-823b-cacc81eb31db",
    "message": "Shift updated successfully"
  }
  ```

- `DELETE /shifts/{id}`: Deletes a shift from the system.
  - **Authorization:** Requires a valid access token (sent automatically via cookies)
  - **Path Parameters:**
    - `id` (string): ID of the shift to delete
  - **cURL Example:**
  ```bash
  curl -X DELETE "http://127.0.0.1:9154/shifts/03978988-42ff-4cb9-a790-c51aceb39b2b" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" 
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "id": "03978988-42ff-4cb9-a790-c51aceb39b2b",
    "message": "Shift deleted successfully"
  }
  ```

### Important notes:
- All shift endpoints require authentication except for GET, which is required when starting a session
- Shift IDs are automatically generated UUIDs
- A shift must be associated with a valid user (`user_id`)
- The `end_time` field can be `null` for ongoing shifts
- The `notes` field is optional and can contain additional information
- There can be no overlapping shifts for the same user on the same date
