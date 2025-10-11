### Authentication

- `POST /auth/login`: Authenticates a specific user and sets session cookies with JWT tokens (access token and refresh token).
 - **Request Body:**
  ``` JSON
  {
    "name": "string",
    "pin": "string"
  }
  ``` 
  - **cURL Example:**
  
  The following example shows how to authenticate and save the session cookies in environment variables for later use.

  ```Bash
  headers=$(curl -i -X POST http://127.0.0.1:9154/auth/login \
    -H 'Content-Type: application/json' \
    -d '{ 
      "name": "cooluser1",
      "pin": "0000"
    }')

  access_token=$(echo "$headers" | grep -o 'accessToken=[^;]*' | cut -s -d= -f2)
  refresh_token=$(echo "$headers" | grep -o 'refreshToken=[^;]*' | cut -s -d= -f2)

  export ACCESS_TOKEN="$access_token"
  export REFRESH_TOKEN="$refresh_token"
  ```

  Once the `ACCESS_TOKEN` and `REFRESH_TOKEN` environment variables are set, you can use them in the `Cookie` headers for subsequent requests to protected endpoints.
  - **Response Body (Success - 200 OK):**
  ```JSON
  {
    "message": "Login successful"
  }
  ```
  - **Response Headers:** `accessToken` (1 minute) and `refreshToken` (30 days) cookies are set

- `POST /auth/refresh`: Renews the access token using the refresh token stored in cookies.
 - **Request:** The refresh token must be present in the cookies
 - **cURL Example:**
  ```Bash
  curl -v -X POST http://127.0.0.1:9154/auth/refresh \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Success - 200 OK):**
  ```JSON
  {"message":"Access token refreshed successfully","accessToken":"..."}
  ```
  - **Response Headers:** The `accessToken` cookie is updated

- `POST /auth/logout`: Logs out the user, revokes the refresh token, and deletes the authentication cookies.
 - **Authorization:** Requires a valid access token (sent automatically via cookies)
 - **cURL Example:** 
  ```Bash
  curl -X POST http://127.0.0.1:9154/auth/logout \
    -H "Cookie: accessToken=$ACCESS_TOKEN" \
    -H "Cookie: refreshToken=$REFRESH_TOKEN"
  ```
  - **Response Body (Success - 200 OK):**
  ```JSON
  {
    "message": "Logout successful"
  }
  ```
  - **Response Headers:** The `accessToken` and `refreshToken` cookies are deleted

### Important notes:
- Authentication is handled via HTTP cookies with JWT tokens
- The `accessToken` has a duration of 1 minute
- The `refreshToken` has a duration of 30 days
- For protected endpoints, the access token is sent automatically via cookies
- When the access token expires, use `/auth/refresh` to get a new one
