### Gestión de Categorías de Platos

Los endpoints de categorías de platos permiten gestionar las categorías para organizar los platos del menú.

- `GET /dish-categories`: Obtiene todas las categorías de platos del sistema.
  - **Authorization:** Requiere autenticación JWT (enviado automáticamente via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/dish-categories" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  [
    {
      "id": "76ee1086-b945-4170-b2e6-9fbeb95ae0be",
      "name": "Entradas"
    },
    {
      "id": "262006ea-8782-4b08-ac3b-b3f13270fec3",
      "name": "Platos Principales"
    }
  ]
  ```
  - **Response Body (Sin contenido - 204 No Content):**
  ```json
  "No dish categories found"
  ```

- `GET /dish-categories/{id}`: Obtiene una categoría de plato específica por su ID.
  - **Authorization:** Requiere autenticación JWT (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID de la categoría a obtener
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/dish-categories/76ee1086-b945-4170-b2e6-9fbeb95ae0be" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "id": "76ee1086-b945-4170-b2e6-9fbeb95ae0be",
    "name": "Entradas"
  }
  ```

- `POST /dish-categories`: Crea una nueva categoría de plato en el sistema.
  - **Authorization:** Requiere autenticación JWT (enviado automáticamente via cookies)
  - **Request Body:**
  ```json
  {
    "name": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/dish-categories" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{ 
      "name": "Postres"
    }'
  ```
  - **Response Body (Éxito - 201 Created):**
  ```json
  {
    "id": "4f264229-5a9f-439d-a944-442c5f0f748d",
    "message": "Dish category added successfully"
  }
  ```

- `PUT /dish-categories/{id}`: Actualiza una categoría de plato existente.
  - **Authorization:** Requiere autenticación JWT (enviado automáticamente via cookies)
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
  curl -X PUT "http://127.0.0.1:9154/dish-categories/76ee1086-b945-4170-b2e6-9fbeb95ae0be" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{ 
      "name": "Entradas Gourmet"
    }'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "id": "76ee1086-b945-4170-b2e6-9fbeb95ae0be",
    "message": "Dish category updated successfully"
  }
  ```

- `DELETE /dish-categories/{id}`: Elimina una categoría de plato del sistema.
  - **Authorization:** Requiere autenticación JWT (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID de la categoría a eliminar
  - **cURL Example:**
  ```bash
  curl -X DELETE "http://127.0.0.1:9154/dish-categories/76ee1086-b945-4170-b2e6-9fbeb95ae0be" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json"
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "id": "76ee1086-b945-4170-b2e6-9fbeb95ae0be",
    "message": "Dish category deleted successfully"
  }
  ```

### Notas importantes:
- Todos los endpoints de categorías de platos requieren autenticación JWT (enviado automáticamente via cookies)
- Los IDs de categorías son UUID generados automáticamente
- No se puede eliminar una categoría si está siendo utilizada por platos existentes
- El campo `name` es requerido para crear/actualizar categorías
