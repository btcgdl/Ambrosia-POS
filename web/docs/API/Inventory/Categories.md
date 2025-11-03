### Gestión de Categorías

Los endpoints de categorías permiten crear, consultar, actualizar y eliminar categorías para distintos tipos de recursos del inventario. Las categorías se agrupan por `type`, que debe ser uno de: `dish`, `ingredient`, `product`.

- `GET /categories?type=TYPE`: Obtiene todas las categorías del tipo indicado.
  - Authorization: Requiere access token válido (enviado automáticamente via cookies)
  - cURL Example:
  ```bash
  curl -X GET "http://127.0.0.1:9154/categories?type=product" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - Response Body (Éxito - 200 OK):
  ```json
  [
    { "id": "9f5c...", "name": "Bebidas" },
    { "id": "a2d1...", "name": "Cafetería" }
  ]
  ```
  - Response Body (Sin contenido - 204 No Content):
  ```json
  "No categories found"
  ```

- `GET /categories/{id}?type=TYPE`: Obtiene una categoría por su ID y tipo.
  - Authorization: Requiere access token válido
  - Path Parameters: `id` (string)
  - Query Parameters: `type` (string) en `dish|ingredient|product`
  - cURL Example:
  ```bash
  curl -X GET "http://127.0.0.1:9154/categories/9f5c...?type=product" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - Response Body (Éxito - 200 OK):
  ```json
  { "id": "9f5c...", "name": "Bebidas" }
  ```

- `POST /categories`: Crea una nueva categoría.
  - Authorization: Requiere access token válido
  - Request Body:
  ```json
  {
    "name": "Bebidas",
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
      "name": "Bebidas",
      "type": "product"
    }'
  ```
  - Response Body (Éxito - 201 Created):
  ```json
  { "id": "b5a6...", "message": "Category added successfully" }
  ```
  - Posibles errores (400 Bad Request): `Missing or malformed type`, `Failed to create category`

- `PUT /categories/{id}`: Actualiza una categoría existente (por ID) indicando el tipo en el body.
  - Authorization: Requiere access token válido
  - Path Parameters: `id` (string)
  - Request Body:
  ```json
  {
    "name": "Bebidas Frías",
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
      "name": "Bebidas Frías",
      "type": "product"
    }'
  ```
  - Response Body (Éxito - 200 OK):
  ```json
  { "id": "b5a6...", "message": "Category updated successfully" }
  ```
  - Posibles errores: 
    - 400 Bad Request: `Missing or malformed ID/type`
    - 404 Not Found: `Category with ID: <id> not found`

- `DELETE /categories/{id}?type=TYPE`: Elimina (lógico) una categoría por ID y tipo.
  - Authorization: Requiere access token válido
  - Path Parameters: `id` (string)
  - Query Parameters: `type` (string) en `dish|ingredient|product`
  - cURL Example:
  ```bash
  curl -X DELETE "http://127.0.0.1:9154/categories/b5a6...?type=product" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - Response Body (Éxito - 204 No Content):
  ```json
  { "id": "b5a6...", "message": "Category deleted successfully" }
  ```
  - Posibles errores (400 Bad Request): `Cannot delete category - it may be in use or not found`

### Esquemas
- CategoryItem (respuesta):
```json
{ "id": "string", "name": "string" }
```
- CategoryUpsert (petición):
```json
{ "name": "string", "type": "dish|ingredient|product" }
```

### Notas
- `type` es obligatorio y debe ser uno de: `dish`, `ingredient`, `product`.
- Los nombres de categorías son únicos por `type`; si ya existe una categoría con el mismo nombre y tipo, la creación/actualización fallará (400).
- El borrado es lógico (`is_deleted = 1`) y no es posible eliminar una categoría que esté en uso por el tipo correspondiente (productos, ingredientes o platos).
- Todos los endpoints requieren autenticación vía JWT (cookies `accessToken`/`refreshToken`).
