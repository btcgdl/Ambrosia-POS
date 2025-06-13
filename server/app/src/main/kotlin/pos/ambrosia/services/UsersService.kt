package pos.ambrosia.services

import pos.ambrosia.utils.SecurePinProcessor
import pos.ambrosia.models.User
import java.sql.Connection
import java.sql.Statement

class UsersService(private val connection: Connection) {
    companion object {
        private const val ADD_USER = "INSERT INTO users VALUES (?,?,?,?)"
        private const val GET_USERS = "SELECT users.id, users.name, users.refreshToken FROM users"
        private const val GET_USER_BY_ID = "SELECT users.id, users.name, users.refreshToken FROM users WHERE users.id = ?"
        private const val UPDATE_USER = "UPDATE users SET users.name = ?, users.pin = ?, users.refreshToken = ? WHERE users.id = ?"
        private const val DELETE_USER = "UPDATE users SET users.is_deleted = true WHERE users.id = ?"
    }

    suspend fun addUser(user: User): String? {   
        val statement = connection.prepareStatement(ADD_USER, Statement.RETURN_GENERATED_KEYS)
        //TODO: HASH ID FOR USERS SHA256
        val genereatedId = user.id.ifEmpty { java.util.UUID.randomUUID().toString() }
        statement.setString(1, genereatedId)
        statement.setString(2, user.name)
        // Encrypt the pin before storing it
        val encryptedPin = SecurePinProcessor.hashPinForStorage(genereatedId.toCharArray(), user.pin)
        statement.setString(3, SecurePinProcessor.byteArrayToBase64(encryptedPin))
        statement.setString(4, user.refreshToken)
        statement.executeUpdate()

        val generatedKeys = statement.generatedKeys
        if (generatedKeys.next()) {
            val id = generatedKeys.getString(1)
            return id'''
        } else {
            return null
        }
    }

    suspend fun getUsers(): List<User> {
        val users = mutableListOf<User>()
        val statement = connection.prepareStatement(GET_USERS)
        val resultSet = statement.executeQuery()
        while (resultSet.next()) {
            val id = resultSet.getString("id")
            val name = resultSet.getString("name")
            val refreshToken = resultSet.getString("refreshToken")
            users.add(User(id = id, name = name, pin = "", refreshToken = refreshToken)) // Pin is not returned for security reasons
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
            val refreshToken = resultSet.getString("refreshToken")
            return User(id = userId, name = name, pin = "", refreshToken = refreshToken) // Pin is not returned for security reasons
        }
        return null
    }

    suspend fun updateUser(id: String, updatedUser: User): Boolean {
        val statement = connection.prepareStatement(UPDATE_USER)
        statement.setString(1, updatedUser.name)
        statement.setString(2, updatedUser.pin)
        statement.setString(3, updatedUser.refreshToken)
        statement.setString(4, id)
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