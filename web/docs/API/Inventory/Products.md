### Gestión de Productos

Los endpoints de productos permiten crear, consultar, actualizar y eliminar productos del inventario.

- `GET /products`: Obtiene todos los productos.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET http://127.0.0.1:9154/products \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  [
    {
      "id": "b5a6...",
      "SKU": "SKU-0001",
      "name": "Café americano",
      "description": "Taza de café 240ml",
      "image_url": null,
      "cost_cents": 5000,
      "category_id": "9f5c...",
      "quantity": 10,
      "price_cents": 25000
    }
  ]
  ```
  - **Response Body (Sin contenido - 204 No Content):**
  ```json
  "No products found"
  ```

- `GET /products/{id}`: Obtiene un producto por su ID.
  - **Authorization:** Requiere access token válido
  - **Path Parameters:** `id` (string)
  - **cURL Example:**
  ```bash
  curl -X GET http://127.0.0.1:9154/products/b5a6... \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```

- `POST /products`: Crea un nuevo producto.
  - **Authorization:** Requiere access token válido
  - **Request Body:**
  ```json
  {
    "SKU": "SKU-0001",
    "name": "Café americano",
    "description": "Taza de café 240ml",
    "image_url": null,
    "cost_cents": 5000,
    "category_id": "9f5c...",
    "quantity": 10,
    "price_cents": 25000
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST http://127.0.0.1:9154/products \
    -H 'Content-Type: application/json' \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -d '{
      "SKU": "SKU-0001",
      "name": "Café americano",
      "description": "Taza de café 240ml",
      "image_url": null,
      "cost_cents": 5000,
      "category_id": "9f5c...",
      "quantity": 10,
      "price_cents": 25000
    }'
  ```
  - **Response Body (Éxito - 201 Created):**
  ```json
  { "id": "b5a6...", "message": "Product added successfully" }
  ```

- `PUT /products/{id}`: Actualiza un producto existente.
  - **Authorization:** Requiere access token válido
  - **Path Parameters:** `id` (string)
  - **Request Body:** Igual al de creación, con los campos actualizados.
  - **Response Body (Éxito - 200 OK):**
  ```json
  { "id": "b5a6...", "message": "Product updated successfully" }
  ```

- `DELETE /products/{id}`: Elimina (lógico) un producto.
  - **Authorization:** Requiere access token válido
  - **Path Parameters:** `id` (string)
  - **Response Body (Éxito - 204 No Content):**
  ```json
  { "id": "b5a6...", "message": "Product deleted successfully" }
  ```

### Notas
- Los campos `SKU`, `name`, `cost_cents`, `price_cents`, `quantity` y `category_id` son requeridos.
- El borrado es lógico (`is_deleted = 1`).
