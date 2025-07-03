package pos.ambrosia.services

import java.sql.Connection
import pos.ambrosia.models.Table

class TableService(private val connection: Connection) {
    companion object {
        private const val ADD_TABLE =
                "INSERT INTO tables (id, name, space_id, order_id, status) VALUES (?, ?, ?, ?, ?)"
        private const val GET_TABLES =
                "SELECT id, name, space_id, order_id, status FROM tables WHERE is_deleted = 0"
        private const val GET_TABLE_BY_ID =
                "SELECT id, name, space_id, order_id, status FROM tables WHERE id = ? AND is_deleted = 0"
        private const val UPDATE_TABLE =
                "UPDATE tables SET name = ?, space_id = ?, order_id = ?, status = ? WHERE id = ?"
        private const val DELETE_TABLE = "UPDATE tables SET is_deleted = 1 WHERE id = ?"
    }

    fun addTable(table: Table): Boolean {
        val statement = connection.prepareStatement(ADD_TABLE)
        statement.setString(1, table.id)
        statement.setString(2, table.name)
        statement.setString(3, table.space_id)
        statement.setString(4, table.order_id)
        statement.setString(5, table.status ?: "available") // Default status if not provided
        return statement.executeUpdate() > 0
    }

    fun getTables(): List<Table> {
        val statement = connection.prepareStatement(GET_TABLES)
        val resultSet = statement.executeQuery()
        val tables = mutableListOf<Table>()
        while (resultSet.next()) {
            val table =
                    Table(
                            id = resultSet.getString("id"),
                            name = resultSet.getString("name"),
                            space_id = resultSet.getString("space_id") ?: "not_space",
                            order_id = resultSet.getString("order_id") ?: "not_space",
                            status = resultSet.getString("status") // Default status if not provided
                    )
            tables.add(table)
        }
        return tables
    }

    fun getTableById(id: String): Table? {
        val statement = connection.prepareStatement(GET_TABLE_BY_ID)
        statement.setString(1, id)
        val resultSet = statement.executeQuery()
        return if (resultSet.next()) {
            Table(
                    id = resultSet.getString("id"),
                    name = resultSet.getString("name"),
                    space_id = resultSet.getString("space_id"),
                    order_id = resultSet.getString("order_id"),
                    status = resultSet.getString("status")
            )
        } else {
            null
        }
    }

    fun updateTable(table: Table): Boolean {
        val statement = connection.prepareStatement(UPDATE_TABLE)
        statement.setString(1, table.name)
        statement.setString(2, table.space_id)
        statement.setString(3, table.order_id)
        statement.setString(4, table.status) // Default status if not provided
        statement.setString(5, table.id)
        return statement.executeUpdate() > 0
    }

    fun deleteTable(id: String): Boolean {
        val statement = connection.prepareStatement(DELETE_TABLE)
        statement.setString(1, id)
        return statement.executeUpdate() > 0
    }
}
