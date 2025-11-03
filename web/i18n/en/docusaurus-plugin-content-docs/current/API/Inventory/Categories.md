### Category Management

The category endpoints let you create, retrieve, update, and delete categories for different inventory resources. Categories are grouped by `type`, which must be one of: `dish`, `ingredient`, `product`.

- `GET /categories?type=TYPE`: Retrieves all categories for the given type.
  - Authorization: Requires a valid access token (sent automatically via cookies)
  - cURL Example:
  ```bash
  curl -X GET "http://127.0.0.1:9154/categories?type=product" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - Response Body (Success - 200 OK):
  ```json
  [
    { "id": "9f5c...", "name": "Beverages" },
    { "id": "a2d1...", "name": "Coffee" }
  ]
  ```
  - Response Body (No Content - 204 No Content):
  ```json
  "No categories found"
  ```

- `GET /categories/{id}?type=TYPE`: Retrieves a category by ID and type.
  - Authorization: Requires a valid access token
  - Path Parameters: `id` (string)
  - Query Parameters: `type` (string) in `dish|ingredient|product`
  - cURL Example:
  ```bash
  curl -X GET "http://127.0.0.1:9154/categories/9f5c...?type=product" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - Response Body (Success - 200 OK):
  ```json
  { "id": "9f5c...", "name": "Beverages" }
  ```

- `POST /categories`: Creates a new category.
  - Authorization: Requires a valid access token
  - Request Body:
  ```json
  {
    "name": "Beverages",
    "type": "product"
  }
  ```
  - cURL Example:
  ```bash
  curl -X POST "http://127.0.0.1:9154/categories" \
    -H "Content-Type: application/json" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -d '{
      "name": "Beverages",
      "type": "product"
    }'
  ```
  - Response Body (Success - 201 Created):
  ```json
  { "id": "b5a6...", "message": "Category added successfully" }
  ```
  - Possible errors (400 Bad Request): `Missing or malformed type`, `Failed to create category`

- `PUT /categories/{id}`: Updates an existing category (by ID) including its type in the body.
  - Authorization: Requires a valid access token
  - Path Parameters: `id` (string)
  - Request Body:
  ```json
  {
    "name": "Cold Beverages",
    "type": "product"
  }
  ```
  - cURL Example:
  ```bash
  curl -X PUT "http://127.0.0.1:9154/categories/b5a6..." \
    -H "Content-Type: application/json" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -d '{
      "name": "Cold Beverages",
      "type": "product"
    }'
  ```
  - Response Body (Success - 200 OK):
  ```json
  { "id": "b5a6...", "message": "Category updated successfully" }
  ```
  - Possible errors:
    - 400 Bad Request: `Missing or malformed ID/type`
    - 404 Not Found: `Category with ID: <id> not found`

- `DELETE /categories/{id}?type=TYPE`: Logically deletes a category by ID and type.
  - Authorization: Requires a valid access token
  - Path Parameters: `id` (string)
  - Query Parameters: `type` (string) in `dish|ingredient|product`
  - cURL Example:
  ```bash
  curl -X DELETE "http://127.0.0.1:9154/categories/b5a6...?type=product" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - Response Body (Success - 204 No Content):
  ```json
  { "id": "b5a6...", "message": "Category deleted successfully" }
  ```
  - Possible errors (400 Bad Request): `Cannot delete category - it may be in use or not found`

### Schemas
- CategoryItem (response):
```json
{ "id": "string", "name": "string" }
```
- CategoryUpsert (request):
```json
{ "name": "string", "type": "dish|ingredient|product" }
```

### Notes
- `type` is required and must be one of: `dish`, `ingredient`, `product`.
- Category names are unique per `type`; if a category with the same name and type already exists, create/update will fail (400).
- Deletion is logical (`is_deleted = 1`), and a category cannot be deleted if it is in use by the corresponding type (products, ingredients, or dishes).
- All endpoints require JWT-based auth via cookies (`accessToken`/`refreshToken`).

