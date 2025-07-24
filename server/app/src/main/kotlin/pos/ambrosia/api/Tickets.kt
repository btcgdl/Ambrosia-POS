package pos.ambrosia.api

import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.sql.Connection
import pos.ambrosia.logger
import pos.ambrosia.models.Ticket
import pos.ambrosia.services.TicketService
import pos.ambrosia.utils.UserNotFoundException
import pos.ambrosia.db.DatabaseConnection

fun Application.configureTickets() {
    val connection: Connection = DatabaseConnection.getConnection()
    val ticketService = TicketService(connection)
    routing { route("/tickets") { tickets(ticketService) } }
}

fun Route.tickets(ticketService: TicketService) {
    get("") {
        val tickets = ticketService.getTickets()
        if (tickets.isEmpty()) {
            call.respond(HttpStatusCode.NoContent, "No tickets found")
            return@get
        }
        call.respond(HttpStatusCode.OK, tickets)
    }
    get("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val ticket = ticketService.getTicketById(id)
            if (ticket != null) {
                call.respond(HttpStatusCode.OK, ticket)
            } else {
                throw UserNotFoundException()
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    post("") {
        val ticket = call.receive<Ticket>()
        ticketService.addTicket(ticket)
        call.respond(HttpStatusCode.Created, "Ticket added successfully")
    }
    put("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val updatedTicket = call.receive<Ticket>()
            val isUpdated = ticketService.updateTicket(updatedTicket)
            logger.info(isUpdated.toString())
            if (isUpdated) {
                call.respond(HttpStatusCode.OK, "Ticket updated successfully")
            } else {
                call.respond(HttpStatusCode.NotFound, "Ticket not found")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    delete("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val isDeleted = ticketService.deleteTicket(id)
            if (isDeleted) {
                call.respond(HttpStatusCode.OK, "Ticket deleted successfully")
            } else {
                call.respond(HttpStatusCode.NotFound, "Ticket not found")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
}
