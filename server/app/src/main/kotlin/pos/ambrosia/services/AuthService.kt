package pos.ambrosia.services

import pos.ambrosia.utils.InvalidCredentialsException
import pos.ambrosia.models.AuthRequest
import pos.ambrosia.models.Auth

class AuthService {
    suspend fun login(request: AuthRequest): Auth {
        // Simulate a database check for user credentials
        // TODO: Replace with actual database logic
        return if (request.role == "admin" && request.password == "admin") {
            Auth("administrator session established", "12345", request.role)
        } else if (request.role == "waiter" && request.password == "rolepassword") {
            Auth("waiter session established", "67890", request.role)
        } else {
            throw InvalidCredentialsException()
        }
    }
    suspend fun logout() {
        // Implement logout logic here
    }
}