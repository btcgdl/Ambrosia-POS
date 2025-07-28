### 6. Gestión de Wallet (Bitcoin Lightning)

Los endpoints de wallet permiten gestionar la billetera Bitcoin Lightning integrada en el sistema POS.

- `GET /wallet/getinfo`: Obtiene información del nodo Lightning.
  - **Authorization:** Requiere autenticación básica
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/wallet/getinfo" \
    -H "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=" \
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
  - **Authorization:** Requiere autenticación básica
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/wallet/getbalance" \
    -H "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=" \
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
  - **Authorization:** Requiere autenticación básica
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
    -H "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=" \
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
  - **Authorization:** Requiere autenticación básica
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
    -H "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=" \
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
  - **Authorization:** Requiere autenticación básica
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
    -H "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=" \
    -H "Content-Type: application/json" \
    -d '{
      "amountSat": 30000,
      "offer": "lno1qcp4256wpj...",
      "message": "Pago por servicio"
    }'
  ```

- `POST /wallet/payonchain`: Realiza un pago on-chain de Bitcoin.
  - **Authorization:** Requiere autenticación básica
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
    -H "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=" \
    -H "Content-Type: application/json" \
    -d '{
      "amountSat": 100000,
      "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      "feerateSatByte": 15
    }'
  ```

- `POST /wallet/bumpfee`: Incrementa la comisión de una transacción on-chain.
  - **Authorization:** Requiere autenticación básica
  - **Request Body:**
  ```json
  20
  ```
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/wallet/bumpfee" \
    -H "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=" \
    -H "Content-Type: application/json" \
    -d '25'
  ```

### Gestión de Pagos

- `GET /wallet/payments/incoming`: Lista los pagos entrantes.
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
    -H "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=" \
    -H "Content-Type: application/json"
  ```

- `GET /wallet/payments/incoming/{paymentHash}`: Obtiene un pago entrante específico.
  - **Path Parameters:**
    - `paymentHash` (string): Hash del pago
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/wallet/payments/incoming/abcdef1234567890" \
    -H "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=" \
    -H "Content-Type: application/json"
  ```

- `GET /wallet/payments/outgoing`: Lista los pagos salientes.
  - **Query Parameters:**
    - `from` (long): Timestamp de inicio
    - `to` (long): Timestamp final
    - `limit` (int): Límite de resultados (default: 20)
    - `offset` (int): Offset para paginación (default: 0)
    - `all` (boolean): Incluir todos los pagos (default: false)
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/wallet/payments/outgoing?limit=10" \
    -H "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=" \
    -H "Content-Type: application/json"
  ```

- `GET /wallet/payments/outgoing/{paymentId}`: Obtiene un pago saliente por ID.
  - **Path Parameters:**
    - `paymentId` (string): ID del pago
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/wallet/payments/outgoing/payment-uuid-123" \
    -H "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=" \
    -H "Content-Type: application/json"
  ```

- `GET /wallet/payments/outgoingbyhash/{paymentHash}`: Obtiene un pago saliente por hash.
  - **Path Parameters:**
    - `paymentHash` (string): Hash del pago
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/wallet/payments/outgoingbyhash/abcdef1234567890" \
    -H "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=" \
    -H "Content-Type: application/json"
  ```

### Notas importantes:
- Todos los endpoints de wallet requieren autenticación básica
- Los montos están expresados en satoshis (1 BTC = 100,000,000 sats)
- Las facturas Lightning tienen tiempo de expiración configurable
- Los pagos on-chain requieren confirmaciones en la blockchain
- Phoenix Wallet debe estar configurado y sincronizado
- Para production, asegurar conexión segura con el nodo Phoenix
- Para codificar credenciales básicas: `echo -n "username:password" | base64`
- El servidor corre por defecto en `http://localhost:8080`
