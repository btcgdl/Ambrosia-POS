package pos.ambrosia.services

import java.sql.Connection
import pos.ambrosia.models.Auth
import pos.ambrosia.models.AuthRequest
import pos.ambrosia.utils.SecurePinProcessor

// Deprecated: Too many responsibilities see UsersService.kt and TokenService.kt
@Deprecated("This class is deprecated and will be removed in a future release.")
class AuthService(private val connection: Connection) {
    companion object {
        private const val GET_USER_CREDENTIALS_BY_NAME = "SELECT * FROM users WHERE users.name = ?"
    }
    suspend fun login(request: AuthRequest): Auth? {
        val statement = connection.prepareStatement(GET_USER_CREDENTIALS_BY_NAME)
        statement.setString(1, request.name)
        val resultSet = statement.executeQuery()

        if (resultSet.next()) {
            val pinHashBase64 = resultSet.getString("pin")
            val userId = resultSet.getString("id")

            val storedPinHash = SecurePinProcessor.base64ToByteArray(pinHashBase64)

            val isValidPin =
                    SecurePinProcessor.verifyPin(
                            request.pin.toCharArray(),
                            request.name,
                            storedPinHash
                    )

            request.pin.toCharArray().fill('\u0000')

            if (isValidPin) {
                return Auth(id = userId, name = request.name)
            }
        }
        return null
    }
}
