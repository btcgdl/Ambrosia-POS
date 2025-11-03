### Gestión de Permisos

Los endpoints de permisos permiten listar los permisos disponibles en el sistema. Estos permisos se asignan a roles.

- `GET /permissions`: Obtiene todos los permisos habilitados.
  - **Authorization:** Requiere access token válido (admin)
  - **cURL Example:**
  ```bash
  curl -X GET http://127.0.0.1:9154/permissions \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  [
    { "id": "a1b2c3...", "name": "products_read", "description": "List and view products", "enabled": true },
    { "id": "d4e5f6...", "name": "orders_create", "description": "Create orders", "enabled": true },
    { "id": "g7h8i9...", "name": "settings_update", "description": "Update settings/config", "enabled": true }
  ]
  ```
  - **Response Body (Sin contenido - 204 No Content):** sin cuerpo

### Notas importantes
- La asignación de permisos a roles se gestiona desde los endpoints de Roles (`/roles/{id}/permissions`).
- La propiedad `name` es la clave que se usa para asignar permisos (por ejemplo: `products_read`, `orders_update`, `reports_export`).
