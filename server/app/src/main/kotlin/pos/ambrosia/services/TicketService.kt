package pos.ambrosia.services

import java.sql.Connection
import pos.ambrosia.models.Ticket

// this is my model ticket
// data class Ticket(
//         val id: String?,
//         val order_id: String,
//         val user_id: String,
//         val ticket_date: String,
//         val status: Int,
//         val total_amount: Float,
//         val notes: String
// )
class TicketService(private val connection: Connection) {
    companion object {
        private const val ADD_TICKET =
                "INSERT INTO tickets (id, order_id, user_id, ticket_date, status, total_amount, notes) VALUES (?, ?, ?, ?, ?, ?, ?)"
        private const val GET_TICKETS =
                "SELECT id, order_id, user_id, ticket_date, status, total_amount, notes FROM tickets"
        private const val GET_TICKET_BY_ID =
                "SELECT id, order_id, user_id, ticket_date, status, total_amount, notes FROM tickets WHERE id = ?"
        private const val UPDATE_TICKET =
                "UPDATE tickets SET order_id = ?, user_id = ?, ticket_date = ?, status = ?, total_amount = ?, notes = ? WHERE id = ?"
        private const val DELETE_TICKET = "DELETE FROM tickets WHERE id = ?"
    }

    fun addTicket(ticket: Ticket): Boolean {
        val statement = connection.prepareStatement(ADD_TICKET)
        statement.setString(1, ticket.id)
        statement.setString(2, ticket.order_id)
        statement.setString(3, ticket.user_id)
        statement.setString(4, ticket.ticket_date)
        statement.setInt(5, ticket.status)
        statement.setFloat(6, ticket.total_amount)
        statement.setString(7, ticket.notes)
        return statement.executeUpdate() > 0
    }

    fun getTickets(): List<Ticket> {
        val statement = connection.prepareStatement(GET_TICKETS)
        val resultSet = statement.executeQuery()
        val tickets = mutableListOf<Ticket>()
        while (resultSet.next()) {
            val ticket =
                    Ticket(
                            id = resultSet.getString("id"),
                            order_id = resultSet.getString("order_id"),
                            user_id = resultSet.getString("user_id"),
                            ticket_date = resultSet.getString("ticket_date"),
                            status = resultSet.getInt("status"),
                            total_amount = resultSet.getFloat("total_amount"),
                            notes = resultSet.getString("notes")
                    )
            tickets.add(ticket)
        }
        return tickets
    }

    fun getTicketById(id: String): Ticket? {
        val statement = connection.prepareStatement(GET_TICKET_BY_ID)
        statement.setString(1, id)
        val resultSet = statement.executeQuery()
        return if (resultSet.next()) {
            Ticket(
                    id = resultSet.getString("id"),
                    order_id = resultSet.getString("order_id"),
                    user_id = resultSet.getString("user_id"),
                    ticket_date = resultSet.getString("ticket_date"),
                    status = resultSet.getInt("status"),
                    total_amount = resultSet.getFloat("total_amount"),
                    notes = resultSet.getString("notes")
            )
        } else null
    }
    fun updateTicket(ticket: Ticket): Boolean {
        val statement = connection.prepareStatement(UPDATE_TICKET)
        statement.setString(1, ticket.order_id)
        statement.setString(2, ticket.user_id)
        statement.setString(3, ticket.ticket_date)
        statement.setInt(4, ticket.status)
        statement.setFloat(5, ticket.total_amount)
        statement.setString(6, ticket.notes)
        statement.setString(7, ticket.id)
        return statement.executeUpdate() > 0
    }
    fun deleteTicket(id: String): Boolean {
        val statement = connection.prepareStatement(DELETE_TICKET)
        statement.setString(1, id)
        return statement.executeUpdate() > 0
    }
}
