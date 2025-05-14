### 1. Autenticación

- `POST /auth/login`: Autentica a un usuario específico dentro de la instancia de la aplicación (verificando credenciales) y establece el estado de la sesión del usuario actual para esta instancia. El `WWW-Authenticate` aún es necesario para autenticar la aplicación cliente que realiza la llamada.
 - **Authorization: `WWW-Authenticate` requerido.**
 - **Request Body:**
  ``` JSON
  {
    "role": "string",
    "password": "string"
  }
  ``` 
  - **cURL Example:**
  
  ```Bash
  curl -v -X POST http://127.0.0.1:5000/auth/login \
    -H 'Content-Type: application/json' \
    -u :edd3b33a6fffd2b790ea2fc04f30bb441885e873887abc94fc293c30f9eb23e0 \
    -d '{
      "role": "admin",
      "password": "admin"
    }'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```JSON
  {
    "message": "administrator session established",
    "id": "string",
    "role": "admin | waiter"
  }
  ```
  - **Response Body (Error - 401 Unauthorized):**
  ```JSON
  {
    "message": "Invalid credentials"
  }
  ```
  - **Response Body (Error - 403 Forbidden):** (Si el X-Auth-Token es inválido)
  ```JSON
  {
    "message": "Unauthorized API access"
  }
  ```
- `POST /auth/logout`: Cierra la sesión del usuario actualmente loggeado en esta instancia de la aplicación. Esto borra el estado de la sesión del usuario en el servidor para este cliente particular. El `WWW-Authenticate` sigue siendo válido para autenticar la aplicación, pero las operaciones que requieran un usuario loggeado o un rol específico podrían fallar después de esto.
 - Authorization: `WWW-Authenticate` requerido.
 - cURL Example: 
 ```Bash
 curl -X POST http://127.0.0.1:5000/auth/logout \
-H "X-Auth-Token: ${AUTH_TOKEN}"
```
- **Response Body (Éxito - 204 No Content):** (Sin cuerpo)
- **Response Body (Error - 403 Forbidden):** (Si el X-Auth-Token es inválido)
```JSON
{
  "message": "Unauthorized API access"
}
```
