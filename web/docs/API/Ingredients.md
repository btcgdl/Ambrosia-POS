### Gestión de Ingredientes

Los endpoints de ingredientes permiten administrar el inventario de materias primas.

- `GET /ingredients`: Obtiene todos los ingredientes del inventario.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET "http://localhost:8080/ingredients" \
    -H 'Cookie: accessToken=your_access_token_here'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  [
    {
      "id": "ingredient-uuid-1",
      "name": "Arroz",
      "category_id": "ingredient-category-uuid-1",
      "quantity": 50.0,
      "unit": "kg",
      "low_stock_threshold": 10.0,
      "cost_per_unit": 2.50
    },
    {
      "id": "ingredient-uuid-2",
      "name": "Pollo",
      "category_id": "ingredient-category-uuid-2",
      "quantity": 25.0,
      "unit": "kg",
      "low_stock_threshold": 5.0,
      "cost_per_unit": 8.90
    }
  ]
  ```
  - **Response Body (Sin contenido - 204 No Content):**
  ```json
  "No ingredients found"
  ```

- `GET /ingredients/{id}`: Obtiene un ingrediente específico por su ID.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID del ingrediente a obtener
  - **cURL Example:**
  ```bash
  curl -X GET "http://localhost:8080/ingredients/ingredient-uuid-1" \
    -H 'Cookie: accessToken=your_access_token_here'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "id": "ingredient-uuid-1",
    "name": "Arroz",
    "category_id": "ingredient-category-uuid-1",
    "quantity": 50.0,
    "unit": "kg",
    "low_stock_threshold": 10.0,
    "cost_per_unit": 2.50
  }
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Missing or malformed ID"
  ```
  - **Response Body (Error - 404 Not Found):**
  ```json
  "Ingredient not found"
  ```

- `GET /ingredients/low_stock/{threshold}`: Obtiene ingredientes con stock bajo según el umbral especificado.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `threshold` (float): Umbral de stock bajo
  - **cURL Example:**
  ```bash
  curl -X GET "http://localhost:8080/ingredients/low_stock/15.0" \
    -H 'Cookie: accessToken=your_access_token_here'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  [
    {
      "id": "ingredient-uuid-1",
      "name": "Arroz",
      "category_id": "ingredient-category-uuid-1",
      "quantity": 8.0,
      "unit": "kg",
      "low_stock_threshold": 10.0,
      "cost_per_unit": 2.50
    }
  ]
  ```
  - **Response Body (Sin contenido - 204 No Content):**
  ```json
  "No low stock ingredients found"
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Invalid or missing threshold parameter"
  ```

- `POST /ingredients`: Crea un nuevo ingrediente.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Request Body:**
  ```json
  {
    "name": "string",
    "category_id": "string",
    "quantity": 0.0,
    "unit": "string",
    "low_stock_threshold": 0.0,
    "cost_per_unit": 0.0
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://localhost:8080/ingredients" \
    -H 'Cookie: accessToken=your_access_token_here' \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Aceite de Oliva",
      "category_id": "ingredient-category-uuid-3",
      "quantity": 20.0,
      "unit": "litros",
      "low_stock_threshold": 5.0,
      "cost_per_unit": 4.50
    }'
  ```
  - **Response Body (Éxito - 201 Created):**
  ```json
  "Ingredient added successfully"
  ```

- `PUT /ingredients/{id}`: Actualiza un ingrediente existente.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID del ingrediente a actualizar
  - **Request Body:**
  ```json
  {
    "name": "string",
    "category_id": "string",
    "quantity": 0.0,
    "unit": "string",
    "low_stock_threshold": 0.0,
    "cost_per_unit": 0.0
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X PUT "http://localhost:8080/ingredients/ingredient-uuid-1" \
    -H 'Cookie: accessToken=your_access_token_here' \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Arroz Bomba",
      "category_id": "ingredient-category-uuid-1",
      "quantity": 60.0,
      "unit": "kg",
      "low_stock_threshold": 15.0,
      "cost_per_unit": 3.00
    }'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  "Ingredient updated successfully"
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Missing or malformed ID"
  ```
  - **Response Body (Error - 404 Not Found):**
  ```json
  "Ingredient not found"
  ```

- `DELETE /ingredients/{id}`: Elimina un ingrediente del inventario.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID del ingrediente a eliminar
  - **cURL Example:**
  ```bash
  curl -X DELETE "http://localhost:8080/ingredients/ingredient-uuid-1" \
    -H 'Cookie: accessToken=your_access_token_here'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  "Ingredient deleted successfully"
  ```
  - **Response Body (Error - 400 Bad Request):**
  ```json
  "Missing or malformed ID"
  ```
  - **Response Body (Error - 404 Not Found):**
  ```json
  "Ingredient not found"
  ```

### Notas importantes:
- Todos los endpoints de ingredientes requieren autenticación 
- Los IDs de ingredientes son UUID generados automáticamente
- Un ingrediente debe estar asociado a una categoría válida (`category_id`)
- Las unidades pueden ser: kg, litros, gramos, unidades, etc.
- El sistema alertará cuando la cantidad esté por debajo del `low_stock_threshold`
- El `cost_per_unit` es importante para el cálculo de costos de platos
