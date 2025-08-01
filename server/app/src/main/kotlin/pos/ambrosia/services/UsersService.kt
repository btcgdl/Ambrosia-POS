package pos.ambrosia.services

import java.sql.Connection
import pos.ambrosia.logger
import pos.ambrosia.models.AuthResponse
import pos.ambrosia.models.User
import pos.ambrosia.utils.SecurePinProcessor

class UsersService(private val connection: Connection) {
  companion object {
    private const val ADD_USER =
            """
            INSERT INTO users (id, name, pin, refresh_token, role_id) VALUES (?, ?, ?, ?, ?)
        """

    private const val GET_USERS =
            """
            SELECT u.id, u.name, u.refresh_token, u.pin, u.role_id
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.is_deleted = 0
        """

    private const val GET_USER_BY_ID =
            """
            SELECT u.id, u.name, u.refresh_token, u.pin, r.role
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = ? AND u.is_deleted = 0
        """

    private const val UPDATE_USER =
            """
            UPDATE users SET name = ?, pin = ?, refresh_token = ?, role_id = ? WHERE id = ?
        """

    private const val DELETE_USER = "UPDATE users SET is_deleted = 1 WHERE id = ?"

    private const val GET_USER_FOR_AUTH =
            """
            SELECT u.id, u.name, u.pin, u.role_id as role_id, r.role, r.isAdmin as isAdmin
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.name = ? AND u.is_deleted = 0
        """

    private const val CHECK_ROLE_EXISTS =
            """
            SELECT id FROM roles WHERE id = ? AND is_deleted = 0
        """
  }

  fun authenticateUser(name: String, pin: CharArray): AuthResponse? {
    val statement = connection.prepareStatement(GET_USER_FOR_AUTH)
    statement.setString(1, name)
    val resultSet = statement.executeQuery()
    if (resultSet.next()) {
      val userIdString = resultSet.getString("id")
      val storedPinHashBase64 = resultSet.getString("pin")
      logger.info("Authenticating user: $userIdString")
      val storedPinHash = SecurePinProcessor.base64ToByteArray(storedPinHashBase64)

      val isValidPin = SecurePinProcessor.verifyPin(pin, userIdString, storedPinHash)
      pin.fill('\u0000') // Limpiar PIN de memoria

      logger.info("Authentication result: $isValidPin")
      if (isValidPin) {
        return AuthResponse(
                id = userIdString,
                name = resultSet.getString("name"),
                role = resultSet.getString("role_id"),
                isAdmin = resultSet.getBoolean("isAdmin")
        )
      }
    }
    return null
  }

  private fun roleExists(roleId: String): Boolean {
    val statement = connection.prepareStatement(CHECK_ROLE_EXISTS)
    statement.setString(1, roleId)
    val resultSet = statement.executeQuery()
    return resultSet.next()
  }

  suspend fun addUser(user: User): String? {
    // Verificar que el rol existe
    if (user.role == null || !roleExists(user.role)) {
      logger.error("Role does not exist: ${user.role}")
      return null
    }

    val generatedId = java.util.UUID.randomUUID().toString()
    val statement = connection.prepareStatement(ADD_USER)

    statement.setString(1, generatedId)
    statement.setString(2, user.name)

    // Hashear el PIN correctamente
    val encryptedPin = SecurePinProcessor.hashPinForStorage(user.pin.toCharArray(), generatedId)
    statement.setString(3, SecurePinProcessor.byteArrayToBase64(encryptedPin))
    statement.setString(4, user.refreshToken)
    statement.setString(5, user.role) // Asumiendo que user.role contiene el role_id

    val rowsAffected = statement.executeUpdate()

    return if (rowsAffected > 0) {
      logger.info("User created successfully with ID: $generatedId")
      generatedId
    } else {
      logger.error("Failed to create user")
      null
    }
  }

  suspend fun getUsers(): List<User> {
    val users = mutableListOf<User>()
    val statement = connection.prepareStatement(GET_USERS)
    val resultSet = statement.executeQuery()
    while (resultSet.next()) {
      val id = resultSet.getString("id")
      val name = resultSet.getString("name")
      val role = resultSet.getString("role_id")
      // No devolvemos el PIN hasheado en las consultas generales
      users.add(User(id = id, name = name, pin = "****", refreshToken = "****", role = role))
    }
    return users
  }

  suspend fun getUserById(id: String): User? {
    val statement = connection.prepareStatement(GET_USER_BY_ID)
    statement.setString(1, id)
    val resultSet = statement.executeQuery()
    if (resultSet.next()) {
      val userId = resultSet.getString("id")
      val name = resultSet.getString("name")
      val refreshToken = resultSet.getString("refresh_token")
      val role = resultSet.getString("role")
      // No devolvemos el PIN hasheado
      return User(id = userId, name = name, pin = "****", refreshToken = refreshToken, role = role)
    }
    return null
  }

  suspend fun updateUser(id: String?, updatedUser: User): Boolean {
    if (id == null) return false

    // Verificar que el rol existe
    if (updatedUser.role == null || !roleExists(updatedUser.role)) {
      logger.error("Role does not exist: ${updatedUser.role}")
      return false
    }

    val statement = connection.prepareStatement(UPDATE_USER)
    statement.setString(1, updatedUser.name)

    // Corregir el hash del PIN - usar el ID del usuario, no el PIN como salt
    val encryptedPin = SecurePinProcessor.hashPinForStorage(updatedUser.pin.toCharArray(), id)
    statement.setString(2, SecurePinProcessor.byteArrayToBase64(encryptedPin))
    statement.setString(3, updatedUser.refreshToken)
    statement.setString(4, updatedUser.role)
    statement.setString(5, id) // El ID del usuario a actualizar

    val rowsUpdated = statement.executeUpdate()
    return rowsUpdated > 0
  }

  suspend fun deleteUser(id: String): Boolean {
    val statement = connection.prepareStatement(DELETE_USER)
    statement.setString(1, id)
    val rowsDeleted = statement.executeUpdate()
    return rowsDeleted > 0
  }
}
