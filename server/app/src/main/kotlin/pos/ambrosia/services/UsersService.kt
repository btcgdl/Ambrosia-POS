package pos.ambrosia.services

import io.ktor.server.application.ApplicationEnvironment
import pos.ambrosia.logger
import pos.ambrosia.models.AuthResponse
import pos.ambrosia.models.User
import pos.ambrosia.utils.SecurePinProcessor
import java.sql.Connection

class UsersService(
  private val env: ApplicationEnvironment,
  private val connection: Connection,
) {
  companion object {
    private const val ADD_USER =
      """
            INSERT INTO users (id, name, pin, refresh_token, role_id, email, phone) VALUES (?, ?, ?, ?, ?, ?, ?)
        """

    private const val GET_USERS =
      """
            SELECT u.id, u.name, u.refresh_token, u.pin, u.role_id, u.email, u.phone
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.is_deleted = 0
        """

    private const val GET_USER_COUNT =
      """
            SELECT COUNT(*)
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.is_deleted = 0
        """

    private const val GET_USER_BY_ID =
      """
            SELECT u.id, u.name, u.refresh_token, u.pin, u.email, u,phone, r.role, r.isAdmin
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = ? AND u.is_deleted = 0
        """

    private const val UPDATE_USER =
      """
            UPDATE users SET name = ?, pin = ?, refresh_token = ?, role_id = ?, email = ?, phone = ? WHERE id = ?
        """

    private const val DELETE_USER = "UPDATE users SET is_deleted = 1 WHERE id = ?"

    private const val CHECK_ROLE_EXISTS =
      """
            SELECT id FROM roles WHERE id = ? AND is_deleted = 0
        """
  }

  private fun roleExists(roleId: String): Boolean {
    val statement = connection.prepareStatement(CHECK_ROLE_EXISTS)
    statement.setString(1, roleId)
    val resultSet = statement.executeQuery()
    return resultSet.next()
  }

  suspend fun addUser(user: User): String? {
    if (user.role == null || !roleExists(user.role)) {
      logger.error("Role does not exist: ${user.role}")
      return null
    }

    val generatedId =
      java.util.UUID
        .randomUUID()
        .toString()
    val statement = connection.prepareStatement(ADD_USER)

    statement.setString(1, generatedId)
    statement.setString(2, user.name)

    val encryptedPin = SecurePinProcessor.hashPinForStorage(user.pin.toCharArray(), generatedId, env)
    statement.setString(3, SecurePinProcessor.byteArrayToBase64(encryptedPin))
    statement.setString(4, user.refreshToken)
    statement.setString(5, user.role) // Asumiendo que user.role contiene el role_id
    statement.setString(6, user.email)
    statement.setString(7, user.phone)

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
      val email = resultSet.getString("email")
      val phone = resultSet.getString("phone")
      users.add(
        User(id = id, name = name, pin = "****", refreshToken = "****", role = role, email = email, phone = phone),
      )
    }
    return users
  }

  suspend fun getUserCount(): Long {
    val statement = connection.prepareStatement(GET_USER_COUNT)
    val resultSet = statement.executeQuery()
    return if (resultSet.next()) {
      resultSet.getLong(1)
    } else {
      0L
    }
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
      val isAdmin = resultSet.getBoolean("isAdmin")
      val email = resultSet.getString("email")
      val phone = resultSet.getString("phone")
      return User(
        id = userId,
        name = name,
        pin = "****",
        refreshToken = refreshToken,
        role = role,
        isAdmin = isAdmin,
        email = email,
        phone = phone,
      )
    }
    return null
  }

  suspend fun updateUser(
    id: String?,
    updatedUser: User,
  ): Boolean {
    if (id == null) return false

    if (updatedUser.role == null || !roleExists(updatedUser.role)) {
      logger.error("Role does not exist: ${updatedUser.role}")
      return false
    }

    val statement = connection.prepareStatement(UPDATE_USER)
    statement.setString(1, updatedUser.name)

    val encryptedPin = SecurePinProcessor.hashPinForStorage(updatedUser.pin.toCharArray(), id, env)
    statement.setString(2, SecurePinProcessor.byteArrayToBase64(encryptedPin))
    statement.setString(3, updatedUser.refreshToken)
    statement.setString(4, updatedUser.role)
    statement.setString(5, id)
    statement.setString(6, updatedUser.email)
    statement.setString(7, updatedUser.phone)

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
