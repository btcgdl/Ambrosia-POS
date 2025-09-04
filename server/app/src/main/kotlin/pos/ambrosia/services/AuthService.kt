package pos.ambrosia.services

import java.sql.Connection
import pos.ambrosia.logger
import pos.ambrosia.models.AuthResponse
import pos.ambrosia.utils.SecurePinProcessor

class AuthService(private val connection: Connection) {
  companion object {
    private const val GET_USER_FOR_AUTH_BY_NAME =
            """
            SELECT u.id, u.name, u.pin, u.role_id as role_id, r.role, r.isAdmin as isAdmin
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.name = ? AND u.is_deleted = 0
        """

    private const val GET_USER_AND_ROLE_FOR_AUTH_BY_USERID =
            """
            SELECT u.id, u.name, r.role, r.password as role_password, r.isAdmin
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = ? AND u.is_deleted = 0
        """
  }

  fun authenticateUser(name: String, pin: CharArray): AuthResponse? {
    val statement = connection.prepareStatement(GET_USER_FOR_AUTH_BY_NAME)
    statement.setString(1, name)
    val resultSet = statement.executeQuery()
    if (resultSet.next()) {
      val userIdString = resultSet.getString("id")
      val storedPinHashBase64 = resultSet.getString("pin")
      logger.info("Authenticating user: $userIdString")
      val storedPinHash = SecurePinProcessor.base64ToByteArray(storedPinHashBase64)

      val isValidPin = SecurePinProcessor.verifyPin(pin, userIdString, storedPinHash)
      pin.fill('\u0000') // Limpiar PIN de memoria

      logger.info("Authentication result for user pin: $isValidPin")
      if (isValidPin) {
        return AuthResponse(
                id = userIdString,
                name = resultSet.getString("name"),
                role = resultSet.getString("role"),
                isAdmin = resultSet.getBoolean("isAdmin")
        )
      }
    }
    return null
  }

  fun authenticateByRole(userId: String, rolePassword: CharArray): AuthResponse? {
    val statement = connection.prepareStatement(GET_USER_AND_ROLE_FOR_AUTH_BY_USERID)
    statement.setString(1, userId)
    val resultSet = statement.executeQuery()

    if (resultSet.next()) {
      val roleName = resultSet.getString("role")
      val storedPasswordHashBase64 = resultSet.getString("role_password")
      val storedPasswordHash = SecurePinProcessor.base64ToByteArray(storedPasswordHashBase64)

      // The salt for role password is the role name.
      val isValidPassword = SecurePinProcessor.verifyPin(rolePassword, roleName, storedPasswordHash)
      rolePassword.fill('\u0000') // Clear password from memory

      logger.info("Authentication result for role password: $isValidPassword")
      if (isValidPassword) {
        return AuthResponse(
                id = resultSet.getString("id"),
                name = resultSet.getString("name"),
                role = roleName,
                isAdmin = resultSet.getBoolean("isAdmin")
        )
      }
    }
    return null
  }
}
