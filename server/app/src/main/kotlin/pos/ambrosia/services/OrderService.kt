package pos.ambrosia.services

import java.sql.Connection
import pos.ambrosia.models.Order

class OrderService(private val connection: Connection) {
    companion object {
        private const val ADD_ORDER =
                "INSERT INTO orders (id, user_id, table_id, waiter, status, total, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
        private const val GET_ORDERS =
                "SELECT id, user_id, table_id, waiter, status, total, created_at FROM orders WHERE is_deleted = 0"
        private const val GET_ORDER_BY_ID =
                "SELECT id, user_id, table_id, waiter, status, total, created_at FROM orders WHERE id = ? AND is_deleted = 0"
        private const val UPDATE_ORDER =
                "UPDATE orders SET user_id = ?, table_id = ?, waiter = ?, status = ?, total = ? WHERE id = ?"
        private const val DELETE_ORDER = "UPDATE orders SET is_deleted = 1 WHERE id = ?"
    }

    // Implement methods to add, get, update and delete orders
    fun addOrder(order: Order): Boolean {
        val statement = connection.prepareStatement(ADD_ORDER)
        statement.setString(1, order.id)
        statement.setString(2, order.user_id)
        statement.setString(3, order.table_id)
        statement.setString(4, order.waiter)
        statement.setString(5, order.status)
        statement.setFloat(6, order.total)
        statement.setString(7, order.created_at)
        return statement.executeUpdate() > 0
    }
    fun getOrders(): List<Order> {
        val statement = connection.prepareStatement(GET_ORDERS)
        val resultSet = statement.executeQuery()
        val orders = mutableListOf<Order>()
        while (resultSet.next()) {
            val order =
                    Order(
                            id = resultSet.getString("id"),
                            user_id = resultSet.getString("user_id"),
                            table_id = resultSet.getString("table_id"),
                            waiter = resultSet.getString("waiter"),
                            status = resultSet.getString("status"),
                            total = resultSet.getFloat("total"),
                            created_at = resultSet.getString("created_at")
                    )
            orders.add(order)
        }
        return orders
    }
    fun getOrderById(id: String): Order? {
        val statement = connection.prepareStatement(GET_ORDER_BY_ID)
        statement.setString(1, id)
        val resultSet = statement.executeQuery()
        return if (resultSet.next()) {
            Order(
                    id = resultSet.getString("id"),
                    user_id = resultSet.getString("user_id"),
                    table_id = resultSet.getString("table_id"),
                    waiter = resultSet.getString("waiter"),
                    status = resultSet.getString("status"),
                    total = resultSet.getFloat("total"),
                    created_at = resultSet.getString("created_at")
            )
        } else null
    }
    fun updateOrder(order: Order): Boolean {
        val statement = connection.prepareStatement(UPDATE_ORDER)
        statement.setString(1, order.user_id)
        statement.setString(2, order.table_id)
        statement.setString(3, order.waiter)
        statement.setString(4, order.status)
        statement.setFloat(5, order.total)
        statement.setString(6, order.id)
        return statement.executeUpdate() > 0
    }
    fun deleteOrder(id: String): Boolean {
        val statement = connection.prepareStatement(DELETE_ORDER)
        statement.setString(1, id)
        return statement.executeUpdate() > 0
    }
    fun getOrdersByTableId(tableId: String): List<Order> {
        val statement =
                connection.prepareStatement(
                        "SELECT id, user_id, table_id, waiter, status, total, created_at FROM orders WHERE table_id = ? AND is_deleted = 0"
                )
        statement.setString(1, tableId)
        val resultSet = statement.executeQuery()
        val orders = mutableListOf<Order>()
        while (resultSet.next()) {
            val order =
                    Order(
                            id = resultSet.getString("id"),
                            user_id = resultSet.getString("user_id"),
                            table_id = resultSet.getString("table_id"),
                            waiter = resultSet.getString("waiter"),
                            status = resultSet.getString("status"),
                            total = resultSet.getFloat("total"),
                            created_at = resultSet.getString("created_at")
                    )
            orders.add(order)
        }
        return orders
    }
    fun getOrdersByUserId(userId: String): List<Order> {
        val statement =
                connection.prepareStatement(
                        "SELECT id, user_id, table_id, waiter, status, total, created_at FROM orders WHERE user_id = ? AND is_deleted = 0"
                )
        statement.setString(1, userId)
        val resultSet = statement.executeQuery()
        val orders = mutableListOf<Order>()
        while (resultSet.next()) {
            val order =
                    Order(
                            id = resultSet.getString("id"),
                            user_id = resultSet.getString("user_id"),
                            table_id = resultSet.getString("table_id"),
                            waiter = resultSet.getString("waiter"),
                            status = resultSet.getString("status"),
                            total = resultSet.getFloat("total"),
                            created_at = resultSet.getString("created_at")
                    )
            orders.add(order)
        }
        return orders
    }
    fun getOrdersByStatus(status: String): List<Order> {
        val statement =
                connection.prepareStatement(
                        "SELECT id, user_id, table_id, waiter, status, total, created_at FROM orders WHERE status = ? AND is_deleted = 0"
                )
        statement.setString(1, status)
        val resultSet = statement.executeQuery()
        val orders = mutableListOf<Order>()
        while (resultSet.next()) {
            val order =
                    Order(
                            id = resultSet.getString("id"),
                            user_id = resultSet.getString("user_id"),
                            table_id = resultSet.getString("table_id"),
                            waiter = resultSet.getString("waiter"),
                            status = resultSet.getString("status"),
                            total = resultSet.getFloat("total"),
                            created_at = resultSet.getString("created_at")
                    )
            orders.add(order)
        }
        return orders
    }
    fun getOrdersByDateRange(startDate: String, endDate: String): List<Order> {
        val statement =
                connection.prepareStatement(
                        "SELECT id, user_id, table_id, waiter, status, total, created_at FROM orders WHERE created_at BETWEEN ? AND ? AND is_deleted = 0"
                )
        statement.setString(1, startDate)
        statement.setString(2, endDate)
        val resultSet = statement.executeQuery()
        val orders = mutableListOf<Order>()
        while (resultSet.next()) {
            val order =
                    Order(
                            id = resultSet.getString("id"),
                            user_id = resultSet.getString("user_id"),
                            table_id = resultSet.getString("table_id"),
                            waiter = resultSet.getString("waiter"),
                            status = resultSet.getString("status"),
                            total = resultSet.getFloat("total"),
                            created_at = resultSet.getString("created_at")
                    )
            orders.add(order)
        }
        return orders
    }
    fun getTotalSalesByDate(date: String): Float {
        val statement =
                connection.prepareStatement(
                        "SELECT SUM(total) AS total_sales FROM orders WHERE DATE(created_at) = ? AND is_deleted = 0"
                )
        statement.setString(1, date)
        val resultSet = statement.executeQuery()
        return if (resultSet.next()) {
            resultSet.getFloat("total_sales")
        } else 0f
    }
}
