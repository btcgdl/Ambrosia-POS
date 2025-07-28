### Endpoints Generales

Endpoints generales del sistema Ambrosia POS que proporcionan información básica y configuración.

## Endpoint Raíz

- `GET /`: Endpoint raíz de la API.
  - **Authorization:** No requiere autenticación
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/"
  ```
  - **Response Body (200 OK):**
  ```json
  "Root path of the API Nothing to see here"
  ```

## Configuración del Sistema

- `GET /base-currency`: Obtiene la moneda base del sistema.
  - **Authorization:** No requiere autenticación
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/base-currency"
  ```
  - **Response Body (200 OK):**
  ```json
  {
    "currency_id": "c4765ebd-6674-4b96-ab99-647fb7a24840"
  }
  ```

## Documentación de la API

- `GET /swagger`: Accede a la documentación interactiva de la API (Swagger UI).
  - **Authorization:** No requiere autenticación
  - **URL:** `http://127.0.0.1/9154/swagger`
  - **Descripción:** Interfaz web interactiva para explorar y probar todos los endpoints de la API.

---

### Códigos de Estado HTTP

La API utiliza los siguientes códigos de estado HTTP estándar:

#### Éxito (2xx)
- **200 OK**: Operación exitosa
- **201 Created**: Recurso creado exitosamente
- **204 No Content**: Sin contenido (lista vacía o eliminación exitosa)

#### Error del Cliente (4xx)
- **400 Bad Request**: Solicitud incorrecta (parámetros faltantes o inválidos)
- **401 Unauthorized**: No autenticado o token inválido
- **403 Forbidden**: Acceso denegado (permisos insuficientes)
- **404 Not Found**: Recurso no encontrado

#### Error del Servidor (5xx)
- **500 Internal Server Error**: Error interno del servidor

---

### Formato de Datos

#### Fechas y Timestamps
- **Formato de fecha**: YYYY-MM-DD (ISO 8601)
- **Formato de timestamp**: YYYY-MM-DDTHH:MM:SSZ (ISO 8601 con UTC)
- **Formato de hora**: HH:MM:SS (24 horas)

#### Identificadores
- **Tipo**: UUID v4
- **Formato**: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
- **Ejemplo**: `76ee1086-b945-4170-b2e6-9fbeb95ae0be`

#### Monedas y Cantidades
- **Formato numérico**: Punto decimal (ejemplo: 45.50)
- **Precisión**: 2 decimales para cantidades monetarias
- **Monedas soportadas**: EUR, USD, BTC

---

### Autenticación

#### Esquema de Autenticación
- **Tipo**: JWT (JSON Web Tokens)
- **Almacenamiento**: Cookies HTTP
- **Access Token**: Duración de 15 minutos
- **Refresh Token**: Duración de 30 días

#### Cookies de Autenticación
- **accessToken**: Token de acceso para operaciones de la API
- **refreshToken**: Token para renovar el access token

#### Endpoints de Autenticación
- **Login**: `POST /auth/login`
- **Refresh**: `POST /auth/refresh`
- **Logout**: `POST /auth/logout`

---

### Paginación

Algunos endpoints soportan parámetros de paginación:

#### Parámetros de Query
- **limit** (int): Número máximo de resultados (por defecto: 20)
- **offset** (int): Número de resultados a omitir (por defecto: 0)
- **all** (boolean): Mostrar todos los resultados sin paginación

#### Ejemplo de Uso
```bash
curl -X GET "http://127.0.0.1:9154/wallet/payments/incoming?limit=10&offset=20" \
  -H 'Cookie: accessToken=your_access_token_here'
```

---

### Filtros Comunes

#### Filtros por Fecha
- **from** (timestamp): Fecha/hora de inicio
- **to** (timestamp): Fecha/hora de fin
- **date** (date): Fecha específica

#### Filtros por Estado
- **status** (string): Estado del recurso (pending, completed, cancelled, etc.)

#### Filtros por Relación
- **user_id** (uuid): Filtrar por usuario
- **table_id** (uuid): Filtrar por mesa
- **space_id** (uuid): Filtrar por espacio

---

### Manejo de Errores

#### Estructura de Respuesta de Error
```json
{
  "message": "Descripción del error",
  "code": "ERROR_CODE",
  "details": "Información adicional (opcional)"
}
```

#### Errores Comunes
- **"Missing or malformed ID"**: ID requerido no proporcionado o inválido
- **"Invalid credentials"**: Credenciales de autenticación incorrectas
- **"Unauthorized"**: Token de acceso inválido o expirado
- **"Resource not found"**: El recurso solicitado no existe
- **"Validation failed"**: Los datos de entrada no pasan la validación

---

### Límites y Restricciones

#### Límites de Tasa
- **Requests por minuto**: Sin límite específico (sujeto a capacidad del servidor)
- **Tamaño máximo de request**: 10MB

#### Restricciones de Datos
- **Longitud máxima de string**: 255 caracteres (nombres, descripciones)
- **Longitud máxima de texto**: 1000 caracteres (notas, comentarios)
- **Precisión numérica**: 2 decimales para cantidades monetarias

---

### Entornos

#### Desarrollo
- **URL Base**: `http://localhost:8080`
- **Base de Datos**: SQLite local
- **Logging**: Nivel DEBUG

#### Producción
- **URL Base**: Configurada según el despliegue
- **Base de Datos**: PostgreSQL/MySQL
- **HTTPS**: Obligatorio
- **Logging**: Nivel INFO

---

### Tipos de Datos Personalizados

#### Estados de Mesa
- `available`: Mesa disponible
- `occupied`: Mesa ocupada
- `reserved`: Mesa reservada

#### Estados de Orden
- `pending`: Pedido pendiente
- `preparing`: En preparación
- `ready`: Listo para servir
- `completed`: Completado
- `cancelled`: Cancelado

#### Estados de Ticket
- `1`: Pendiente
- `2`: Pagado
- `3`: Cancelado

---

### Integración Bitcoin Lightning

El sistema incluye integración completa con Bitcoin Lightning Network a través del servicio Phoenix:

#### Funcionalidades
- Crear facturas Lightning
- Procesar pagos Lightning
- Consultar balance y transacciones
- Gestión de pagos on-chain
- Historial de transacciones

#### Monedas Soportadas
- **Satoshis**: Unidad base de Bitcoin
- **Millisatoshis**: Para microtransacciones Lightning
- **Bitcoin**: Conversión automática

---

### Seguridad

#### Medidas de Seguridad
- **Hash de PIN**: Los PINs se almacenan hasheados
- **Tokens JWT**: Firmados con clave secreta
- **Cookies HttpOnly**: Para prevenir ataques XSS
- **Validación de entrada**: Todos los datos se validan antes del procesamiento

#### Recomendaciones de Producción
- **HTTPS obligatorio**: Para proteger las comunicaciones
- **Certificados SSL válidos**: Para la confianza del cliente
- **Backup regular**: De la base de datos y configuración
- **Monitoreo**: Logs de acceso y errores
