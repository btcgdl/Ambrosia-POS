package pos.ambrosia.services

import java.sql.Connection
import pos.ambrosia.models.Space

class SpaceService(private val connection: Connection) {
    companion object {
        private const val ADD_SPACE = "INSERT INTO spaces (id, name) VALUES (?, ?, ?)"
        private const val GET_SPACES = "SELECT id, name FROM spaces WHERE is_deleted = 0"
        private const val GET_SPACE_BY_ID =
                "SELECT id, name FROM spaces WHERE id = ? AND is_deleted = 0"
        private const val UPDATE_SPACE = "UPDATE spaces SET name = ? WHERE id = ?"
        private const val DELETE_SPACE = "UPDATE spaces SET is_deleted = 1 WHERE id = ?"
    }

    fun addSpace(space: Space): Boolean {
        val statement = connection.prepareStatement(ADD_SPACE)
        statement.setString(1, space.id)
        statement.setString(2, space.name)
        return statement.executeUpdate() > 0
    }

    fun getSpaces(): List<Space> {
        val statement = connection.prepareStatement(GET_SPACES)
        val resultSet = statement.executeQuery()
        val spaces = mutableListOf<Space>()
        while (resultSet.next()) {
            val space =
                    Space(
                            id = resultSet.getString("id"),
                            name = resultSet.getString("name"),
                    )
            spaces.add(space)
        }
        return spaces
    }

    fun getSpaceById(id: String): Space? {
        val statement = connection.prepareStatement(GET_SPACE_BY_ID)
        statement.setString(1, id)
        val resultSet = statement.executeQuery()
        return if (resultSet.next()) {
            Space(
                    id = resultSet.getString("id"),
                    name = resultSet.getString("name"),
            )
        } else {
            null
        }
    }

    fun updateSpace(space: Space): Boolean {
        val statement = connection.prepareStatement(UPDATE_SPACE)
        statement.setString(1, space.name)
        statement.setString(3, space.id)
        return statement.executeUpdate() > 0
    }

    fun deleteSpace(id: String): Boolean {
        val statement = connection.prepareStatement(DELETE_SPACE)
        statement.setString(1, id)
        return statement.executeUpdate() > 0
    }
    fun restoreSpace(id: String): Boolean {
        val statement = connection.prepareStatement("UPDATE spaces SET is_deleted = 0 WHERE id = ?")
        statement.setString(1, id)
        return statement.executeUpdate() > 0
    }
    fun getDeletedSpaces(): List<Space> {
        val statement =
                connection.prepareStatement("SELECT id, name FROM spaces WHERE is_deleted = 1")
        val resultSet = statement.executeQuery()
        val spaces = mutableListOf<Space>()
        while (resultSet.next()) {
            val space =
                    Space(
                            id = resultSet.getString("id"),
                            name = resultSet.getString("name"),
                    )
            spaces.add(space)
        }
        return spaces
    }
}
