### Gestión de Wallet (Bitcoin Lightning)

### Autenticación de Wallet

- `POST /wallet/auth`: Autoriza el acceso a las funciones de la wallet para un administrador.
  - **Authorization:** Requiere token de administrador.
  - **Request Body:**
  ```json
  {
    "password": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/wallet/auth" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "password": "S3cur3P4ssw0rd!!"
    }'
  ```
  - **Response Body (200 OK):**
  ```json
  {
    "message": "Login successful"
  }
  ```
  - **Response Headers:** Establece la cookie `walletAccessToken`.

- `POST /wallet/logout`: Cierra la sesión de la wallet y elimina la cookie de acceso.
  - **Authorization:** Requiere token de administrador.
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/wallet/logout" \
    -H "Cookie: accessToken=$ACCESS_TOKEN"
  ```
  - **Response Body (200 OK):**
  ```json
  {
    "status": "ok"
  }
  ```
  - **Response Headers:** Elimina la cookie `walletAccessToken`.

Los endpoints de wallet permiten gestionar la billetera Bitcoin Lightning integrada en el sistema POS.

- `GET /wallet/getinfo`: Obtiene información del nodo Lightning.
  - **Authorization:** Requiere autenticación JWT (admin)
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/wallet/getinfo" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json"
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "nodeId": "03a1b2c3d4e5f6789012345678901234567890abcdef",
    "channels": [
      {
        "state": "NORMAL",
        "channelId": "0x1234567890abcdef",
        "balanceSat": 1000000,
        "inboundLiquiditySat": 500000,
        "capacitySat": 1500000,
        "fundingTxId": "abcdef1234567890"
      }
    ],
    "chain": "mainnet",
    "blockHeight": 800000,
    "version": "0.6.0"
  }
  ```

- `GET /wallet/getbalance`: Obtiene el balance de la billetera Lightning.
  - **Authorization:** Requiere autenticación JWT (admin)
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/wallet/getbalance" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json"
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "balanceSat": 1000000,
    "feeCreditSat": 5000
  }
  ```

- `POST /wallet/createinvoice`: Crea una factura Lightning para recibir pagos.
  - **Authorization:** Requiere autenticación JWT
  - **Request Body:**
  ```json
  {
    "description": "string",
    "amountSat": 1000,
    "externalId": "string",
    "expirySeconds": 3600
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/wallet/createinvoice" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "description": "Pago orden #123",
      "amountSat": 50000,
      "externalId": "order-123",
      "expirySeconds": 3600
    }'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "amountSat": 50000,
    "paymentHash": "abcdef1234567890abcdef1234567890abcdef12",
    "serialized": "lnbc500u1p3xnhl2pp5..."
  }
  ```

- `POST /wallet/payinvoice`: Paga una factura Lightning.
  - **Authorization:** Requiere autenticación JWT (admin)
  - **Request Body:**
  ```json
  {
    "amountSat": 1000,
    "invoice": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/wallet/payinvoice" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "amountSat": 25000,
      "invoice": "lnbc250u1p3xnhl2pp5..."
    }'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "recipientAmountSat": 25000,
    "routingFeeSat": 100,
    "paymentId": "payment-uuid-123",
    "paymentHash": "abcdef1234567890",
    "paymentPreimage": "1234567890abcdef"
  }
  ```

- `POST /wallet/payoffer`: Paga una oferta BOLT12.
  - **Authorization:** Requiere autenticación JWT (admin)
  - **Request Body:**
  ```json
  {
    "amountSat": 1000,
    "offer": "string",
    "message": "string"
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/wallet/payoffer" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "amountSat": 30000,
      "offer": "lno1qcp4256wpj...",
      "message": "Pago por servicio"
    }'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "recipientAmountSat": 30000,
    "routingFeeSat": 150,
    "paymentId": "payment-uuid-456",
    "paymentHash": "fedcba0987654321",
    "paymentPreimage": "0987654321fedcba"
  }
  ```

- `POST /wallet/payonchain`: Realiza un pago on-chain de Bitcoin.
  - **Authorization:** Requiere autenticación JWT (admin)
  - **Request Body:**
  ```json
  {
    "amountSat": 100000,
    "address": "string",
    "feerateSatByte": 10
  }
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/wallet/payonchain" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "amountSat": 100000,
      "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      "feerateSatByte": 15
    }'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "txId": "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "amountSat": 100000,
    "feesSat": 2250
  }
  ```

- `POST /wallet/bumpfee`: Incrementa la comisión de una transacción on-chain.
  - **Authorization:** Requiere autenticación JWT (admin)
  - **Request Body:**
  ```json
  20
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/wallet/bumpfee" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '25'
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  {
    "txId": "fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
    "newFeerateSatByte": 25,
    "additionalFeesSat": 1500
  }
  ```

### Gestión de Pagos

- `GET /wallet/payments/incoming`: Lista los pagos entrantes.
  - **Authorization:** Requiere autenticación JWT (admin)
  - **Query Parameters:**
    - `from` (long): Timestamp de inicio
    - `to` (long): Timestamp final
    - `limit` (int): Límite de resultados (default: 20)
    - `offset` (int): Offset para paginación (default: 0)
    - `all` (boolean): Incluir todos los pagos (default: false)
    - `externalId` (string): ID externo específico
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/wallet/payments/incoming?limit=10&offset=0" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json"
  ```
  - **Response Body (Éxito - 200 OK):**
  ```json
  [
    {
      "paymentHash": "abcdef1234567890",
      "amountSat": 50000,
      "receivedSat": 50000,
      "description": "Pago orden #123",
      "externalId": "order-123",
      "createdAt": 1640995200000,
      "completedAt": 1640995300000,
      "status": "RECEIVED"
    }
  ]
  ```

- `GET /wallet/payments/incoming/{paymentHash}`: Obtiene un pago entrante específico.
  - **Authorization:** Requiere autenticación JWT (admin)
  - **Path Parameters:**
    - `paymentHash` (string): Hash del pago
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/wallet/payments/incoming/abcdef1234567890" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json"
  ```

- `GET /wallet/payments/outgoing`: Lista los pagos salientes.
  - **Authorization:** Requiere autenticación JWT (admin)
  - **Query Parameters:**
    - `from` (long): Timestamp de inicio
    - `to` (long): Timestamp final
    - `limit` (int): Límite de resultados (default: 20)
    - `offset` (int): Offset para paginación (default: 0)
    - `all` (boolean): Incluir todos los pagos (default: false)
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/wallet/payments/outgoing?limit=10" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json"
  ```

- `GET /wallet/payments/outgoing/{paymentId}`: Obtiene un pago saliente por ID.
  - **Authorization:** Requiere autenticación JWT (admin)
  - **Path Parameters:**
    - `paymentId` (string): ID del pago
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/wallet/payments/outgoing/payment-uuid-123" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json"
  ```

- `GET /wallet/payments/outgoingbyhash/{paymentHash}`: Obtiene un pago saliente por hash.
  - **Authorization:** Requiere autenticación JWT (admin)
  - **Path Parameters:**
    - `paymentHash` (string): Hash del pago
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/wallet/payments/outgoingbyhash/abcdef1234567890" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json"
  ```

### Notas importantes:
- Los endpoints requieren autenticación JWT a través de cookies (accessToken)
- Solo `/createinvoice` está disponible para usuarios autenticados, el resto requiere permisos de admin
- Los montos están expresados en satoshis (1 BTC = 100,000,000 sats)
- Las facturas Lightning tienen tiempo de expiración configurable
- Los pagos on-chain requieren confirmaciones en la blockchain
- Phoenix Wallet debe estar configurado y sincronizado
- Para production, asegurar conexión segura con el nodo Phoenix
