### Gestión de Categorías de Ingredientes

Los endpoints de categorías de ingredientes permiten organizar el inventario por tipos de ingredientes.

- `GET /ingredient-categories`: Obtiene todas las categorías de ingredientes.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/ingredient-categories" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  [
    {
      "id": "6ff600de-0805-4880-b9d8-a07624b77dec",
      "name": "Cereales"
    },
    {
      "id": "34b3e62d-c150-4c4c-8984-a7a306b910ea",
      "name": "Carnes"
    },
    {
      "id": "58e3e20e-437d-4909-8ddc-4ebf3b7998e1",
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
  curl -X GET "http://127.0.0.1:9154/ingredient-categories/bcccc9ef-5466-415a-adda-c2e62e154aaf" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "id": "bcccc9ef-5466-415a-adda-c2e62e154aaf",
    "name": "Cereales"
  }
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
  curl -X POST "http://127.0.0.1:9154/ingredient-categories" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{ 
      "name": "Lácteos"
    }'
  ```
  - **Response Body (Éxito - 201 Created):**
  ```json
  {
    "id": "644974e3-4067-41ac-92b4-8c33a2350e1c",
    "message": "Ingredient category added successfully"
  }
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
  curl -X PUT "http://127.0.0.1:9154/ingredient-categories/5c339473-d10d-432f-9666-b79be0f1201a" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{ 
      "name": "Cereales y Granos"
    }'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "id": "644974e3-4067-41ac-92b4-8c33a2350e1c",
    "message": "Ingredient category updated successfully"
  }
  ```

- `DELETE /ingredient-categories/{id}`: Elimina una categoría del sistema.
  - **Authorization:** Requiere access token válido (enviado automáticamente via cookies)
  - **Path Parameters:**
    - `id` (string): ID de la categoría a eliminar
  - **cURL Example:**
  ```bash
  curl -X DELETE "http://127.0.0.1:9154/ingredient-categories/1121cbb8-741b-4e63-9d38-cbbdf3099ea4" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" 
  ```
  - **Response Body (Éxito - 204 No Content):**
  ```json
  {
    "id": "97ef9759-36d5-4263-94d0-aa9851fe1b4f",
    "message": "Ingredient category deleted successfully"
  }
  ```

### Notas importantes:
- Todos los endpoints de categorías de ingredientes requieren autenticación 
- Los IDs de categorías son UUID generados automáticamente
- No se puede eliminar una categoría que tenga ingredientes asociados
- Las categorías ayudan a organizar el inventario por tipos de ingredientes
- Ejemplos de categorías: Cereales, Carnes, Verduras, Lácteos, Condimentos, etc.
