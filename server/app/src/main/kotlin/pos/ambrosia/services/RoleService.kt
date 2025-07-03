package pos.ambrosia.services

import java.sql.Connection
import pos.ambrosia.models.Role

class RolesService(private val connection: Connection) {
    companion object {
        private const val ADD_ROLE = "INSERT INTO roles (id, role) VALUES (?, ?)"
        private const val GET_ROLES = "SELECT id, role, password FROM roles WHERE is_deleted = 0"
        private const val GET_ROLE_BY_ID =
                "SELECT id, role, password FROM roles WHERE id = ? AND is_deleted = 0"
        private const val UPDATE_ROLE = "UPDATE roles SET role = ?, password = ? WHERE id = ?"
        private const val DELETE_ROLE = "UPDATE roles SET is_deleted = 1 WHERE id = ?"
    }

    fun addRole(role: Role): Boolean {
        val statement = connection.prepareStatement(ADD_ROLE)
        statement.setString(1, role.id)
        statement.setString(2, role.role)
        return statement.executeUpdate() > 0
    }

    fun getRoles(): List<Role> {
        val statement = connection.prepareStatement(GET_ROLES)
        val resultSet = statement.executeQuery()
        val roles = mutableListOf<Role>()
        while (resultSet.next()) {
            val role =
                    Role(
                            id = resultSet.getString("id"),
                            role = resultSet.getString("role"),
                            password =
                                    resultSet.getString(
                                            "password"
                                    ) // Assuming Role has a password field
                    )
            roles.add(role)
        }
        return roles
    }

    fun getRoleById(id: String): Role? {
        val statement = connection.prepareStatement(GET_ROLE_BY_ID)
        statement.setString(1, id)
        val resultSet = statement.executeQuery()
        return if (resultSet.next()) {
            Role(
                    id = resultSet.getString("id"),
                    role = resultSet.getString("role"),
                    password = resultSet.getString("password")
            )
        } else {
            null
        }
    }

    fun updateRole(role: Role): Boolean {
        val statement = connection.prepareStatement(UPDATE_ROLE)
        statement.setString(1, role.role)
        statement.setString(2, role.password)
        statement.setString(3, role.id)
        return statement.executeUpdate() > 0
    }

    fun deleteRole(id: String): Boolean {
        val statement = connection.prepareStatement(DELETE_ROLE)
        statement.setString(1, id)
        return statement.executeUpdate() > 0
    }
}
