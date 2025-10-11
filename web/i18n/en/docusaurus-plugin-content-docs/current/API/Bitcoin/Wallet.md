### Wallet Management (Bitcoin Lightning)

### Wallet Authentication

- `POST /wallet/auth`: Authorizes access to wallet functions for an administrator.
  - **Authorization:** Requires administrator token.
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
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
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
  - **Response Headers:** Sets the `walletAccessToken` cookie.

- `POST /wallet/logout`: Logs out of the wallet and deletes the access cookie.
  - **Authorization:** Requires administrator token.
  - **cURL Example:**
  ```bash
  curl -X POST "http://127.0.0.1:9154/wallet/logout" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (200 OK):**
  ```json
  {
    "status": "ok"
  }
  ```
  - **Response Headers:** Deletes the `walletAccessToken` cookie.

The wallet endpoints allow you to manage the Bitcoin Lightning wallet integrated into the POS system.

- `GET /wallet/getinfo`: Gets information from the Lightning node.
  - **Authorization:** Requires JWT authentication (admin)
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/wallet/getinfo" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json"
  ```
  - **Response Body (Success - 200 OK):**
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

- `GET /wallet/getbalance`: Gets the balance of the Lightning wallet.
  - **Authorization:** Requires JWT authentication (admin)
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/wallet/getbalance" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "balanceSat": 1000000,
    "feeCreditSat": 5000
  }
  ```

- `POST /wallet/createinvoice`: Creates a Lightning invoice to receive payments.
  - **Authorization:** Requires JWT authentication
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
      "description": "Payment for order #123",
      "amountSat": 50000,
      "externalId": "order-123",
      "expirySeconds": 3600
    }'
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "amountSat": 50000,
    "paymentHash": "abcdef1234567890abcdef1234567890abcdef12",
    "serialized": "lnbc500u1p3xnhl2pp5..."
  }
  ```

- `POST /wallet/payinvoice`: Pays a Lightning invoice.
  - **Authorization:** Requires JWT authentication (admin)
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
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "recipientAmountSat": 25000,
    "routingFeeSat": 100,
    "paymentId": "payment-uuid-123",
    "paymentHash": "abcdef1234567890",
    "paymentPreimage": "1234567890abcdef"
  }
  ```

- `POST /wallet/payoffer`: Pays a BOLT12 offer.
  - **Authorization:** Requires JWT authentication (admin)
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
      "message": "Payment for service"
    }'
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "recipientAmountSat": 30000,
    "routingFeeSat": 150,
    "paymentId": "payment-uuid-456",
    "paymentHash": "fedcba0987654321",
    "paymentPreimage": "0987654321fedcba"
  }
  ```

- `POST /wallet/payonchain`: Makes an on-chain Bitcoin payment.
  - **Authorization:** Requires JWT authentication (admin)
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
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "txId": "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "amountSat": 100000,
    "feesSat": 2250
  }
  ```

- `POST /wallet/bumpfee`: Increases the fee of an on-chain transaction.
  - **Authorization:** Requires JWT authentication (admin)
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
  - **Response Body (Success - 200 OK):**
  ```json
  {
    "txId": "fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
    "newFeerateSatByte": 25,
    "additionalFeesSat": 1500
  }
  ```

### Payment Management

- `GET /wallet/payments/incoming`: Lists incoming payments.
  - **Authorization:** Requires JWT authentication (admin)
  - **Query Parameters:**
    - `from` (long): Start timestamp
    - `to` (long): End timestamp
    - `limit` (int): Result limit (default: 20)
    - `offset` (int): Offset for pagination (default: 0)
    - `all` (boolean): Include all payments (default: false)
    - `externalId` (string): Specific external ID
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/wallet/payments/incoming?limit=10&offset=0" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json"
  ```
  - **Response Body (Success - 200 OK):**
  ```json
  [
    {
      "paymentHash": "abcdef1234567890",
      "amountSat": 50000,
      "receivedSat": 50000,
      "description": "Payment for order #123",
      "externalId": "order-123",
      "createdAt": 1640995200000,
      "completedAt": 1640995300000,
      "status": "RECEIVED"
    }
  ]
  ```

- `GET /wallet/payments/incoming/{paymentHash}`: Gets a specific incoming payment.
  - **Authorization:** Requires JWT authentication (admin)
  - **Path Parameters:**
    - `paymentHash` (string): Payment hash
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/wallet/payments/incoming/abcdef1234567890" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json"
  ```

- `GET /wallet/payments/outgoing`: Lists outgoing payments.
  - **Authorization:** Requires JWT authentication (admin)
  - **Query Parameters:**
    - `from` (long): Start timestamp
    - `to` (long): End timestamp
    - `limit` (int): Result limit (default: 20)
    - `offset` (int): Offset for pagination (default: 0)
    - `all` (boolean): Include all payments (default: false)
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/wallet/payments/outgoing?limit=10" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json"
  ```

- `GET /wallet/payments/outgoing/{paymentId}`: Gets an outgoing payment by ID.
  - **Authorization:** Requires JWT authentication (admin)
  - **Path Parameters:**
    - `paymentId` (string): Payment ID
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/wallet/payments/outgoing/payment-uuid-123" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json"
  ```

- `GET /wallet/payments/outgoingbyhash/{paymentHash}`: Gets an outgoing payment by hash.
  - **Authorization:** Requires JWT authentication (admin)
  - **Path Parameters:**
    - `paymentHash` (string): Payment hash
  - **cURL Example:**
  ```bash
  curl -X GET "http://127.0.0.1:9154/wallet/payments/outgoingbyhash/abcdef1234567890" \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN" \
    -H "Content-Type: application/json"
  ```

### Important notes:
- Endpoints require JWT authentication via cookies (accessToken)
- Only `/createinvoice` is available for authenticated users, the rest require admin permissions
- Amounts are expressed in satoshis (1 BTC = 100,000,000 sats)
- Lightning invoices have a configurable expiration time
- On-chain payments require blockchain confirmations
- Phoenix Wallet must be configured and synchronized
- For production, ensure a secure connection with the Phoenix node
