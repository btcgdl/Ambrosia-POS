### Gestión de Categorías de Ingredientes

Los endpoints de categorías de ingredientes permiten organizar el inventario por tipos de ingredientes.

- `GET /ingredient-categories`: Obtiene todas las categorías de ingredientes.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET "http://localhost:8080/ingredient-categories" \
    -H 'Cookie: accessToken=your_access_token_here'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  [
    {
      "id": "ingredient-category-uuid-1",
      "name": "Cereales"
    },
    {
      "id": "ingredient-category-uuid-2",
      "name": "Carnes"
    },
    {
      "id": "ingredient-category-uuid-3",
      "name": "Aceites y Condimentos"
    }
  ]
  ```
  - **Response Body (Sin contenido - 204 No Content):**
  ```json
  "No ingredient categories found"
  ```

- `GET /ingredient-categories/{id}`: Obtiene una categoría específica por su ID.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID de la categoría a obtener
  - **cURL Example:**
  ```bash
  curl -X GET "http://localhost:8080/ingredient-categories/ingredient-category-uuid-1" \
    -H 'Cookie: accessToken=your_access_token_here'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "id": "ingredient-category-uuid-1",
    "name": "Cereales"
  }
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Missing or malformed ID"
  ```
  - **Response Body (Error - 404 Not Found):**
  ```json
  "Ingredient category not found"
  ```

- `POST /ingredient-categories`: Crea una nueva categoría de ingredientes.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Request Body:**
  ```json
  {
    "name": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://localhost:8080/ingredient-categories" \
    -H 'Cookie: accessToken=your_access_token_here' \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Lácteos"
    }'
  ```
  - **Response Body (Éxito - 201 Created):**
  ```json
  {
    "id": "generated-uuid",
    "message": "Ingredient category added successfully"
  }
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Failed to create ingredient category"
  ```

- `PUT /ingredient-categories/{id}`: Actualiza una categoría existente.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID de la categoría a actualizar
  - **Request Body:**
  ```json
  {
    "name": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X PUT "http://localhost:8080/ingredient-categories/ingredient-category-uuid-1" \
    -H 'Cookie: accessToken=your_access_token_here' \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Cereales y Granos"
    }'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  "Ingredient category updated successfully"
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Missing or malformed ID"
  ```
  - **Response Body (Error - 404 Not Found):**
  ```json
  "Ingredient category not found or update failed"
  ```

- `DELETE /ingredient-categories/{id}`: Elimina una categoría del sistema.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID de la categoría a eliminar
  - **cURL Example:**
  ```bash
  curl -X DELETE "http://localhost:8080/ingredient-categories/ingredient-category-uuid-1" \
    -H 'Cookie: accessToken=your_access_token_here'
  ```
  - **Response Body (Éxito - 204 No Content):**
  ```json
  "Ingredient category deleted successfully"
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Missing or malformed ID"
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Cannot delete ingredient category - it may be in use or not found"
  ```

### Notas importantes:
- Todos los endpoints de categorías de ingredientes requieren autenticación 
- Los IDs de categorías son UUID generados automáticamente
- No se puede eliminar una categoría que tenga ingredientes asociados
- Las categorías ayudan a organizar el inventario por tipos de ingredientes
- Ejemplos de categorías: Cereales, Carnes, Verduras, Lácteos, Condimentos, etc.
