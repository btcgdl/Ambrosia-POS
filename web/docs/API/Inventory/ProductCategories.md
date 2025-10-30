### Gestión de Categorías de Productos

Los endpoints de categorías de productos permiten organizar los productos por tipo.

- `GET /product-categories`: Obtiene todas las categorías de productos.
  - **Authorization:** Requiere access token válido
  - **cURL Example:**
  ```bash
  curl -X GET http://127.0.0.1:9154/product-categories \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  [
    { "id": "9f5c...", "name": "Bebidas" },
    { "id": "1a7e...", "name": "Alimentos" }
  ]
  ```
  - **Response Body (Sin contenido - 204 No Content):**
  ```json
  "No product categories found"
  ```

- `GET /product-categories/{id}`: Obtiene una categoría por su ID.
  - **Authorization:** Requiere access token válido
  - **Path Parameters:** `id` (string)
  - **cURL Example:**
  ```bash
  curl -X GET http://127.0.0.1:9154/product-categories/9f5c... \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```

- `POST /product-categories`: Crea una nueva categoría.
  - **Authorization:** Requiere access token válido
  - **Request Body:**
  ```json
  { "name": "Bebidas" }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST http://127.0.0.1:9154/product-categories \
    -H 'Content-Type: application/json' \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -d '{ "name": "Bebidas" }'
  ```
  - **Response Body (Éxito - 201 Created):**
  ```json
  { "id": "9f5c...", "message": "Product category added successfully" }
  ```

- `PUT /product-categories/{id}`: Actualiza una categoría existente.
  - **Authorization:** Requiere access token válido
  - **Path Parameters:** `id` (string)
  - **Request Body:**
  ```json
  { "name": "Bebidas calientes" }
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  { "id": "9f5c...", "message": "Product category updated successfully" }
  ```

- `DELETE /product-categories/{id}`: Elimina una categoría.
  - **Authorization:** Requiere access token válido
  - **Path Parameters:** `id` (string)
  - **Response Body (Éxito - 204 No Content):**
  ```json
  { "id": "9f5c...", "message": "Product category deleted successfully" }
  ```
  - **Errores comunes (400 Bad Request):**
    - "Cannot delete product category - it may be in use or not found"

### Notas
- No se puede eliminar una categoría si tiene productos asociados.
