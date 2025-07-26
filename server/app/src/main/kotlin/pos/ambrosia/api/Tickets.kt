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
        if (id == null) {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
            return@get
        }
        
        val ticket = ticketService.getTicketById(id)
        if (ticket == null) {
            call.respond(HttpStatusCode.NotFound, "Ticket not found")
            return@get
        }
        
        call.respond(HttpStatusCode.OK, ticket)
    }
    post("") {
        val ticket = call.receive<Ticket>()
        val generatedId = ticketService.addTicket(ticket)
        call.respond(HttpStatusCode.Created, mapOf("id" to generatedId))
    }
    put("/{id}") {
        val id = call.parameters["id"]
        if (id == null) {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
            return@put
        }
        
        val updatedTicket = call.receive<Ticket>()
        val isUpdated = ticketService.updateTicket(updatedTicket)
        logger.info(isUpdated.toString())
        
        if (!isUpdated) {
            call.respond(HttpStatusCode.NotFound, "Ticket not found")
            return@put
        }
        
        call.respond(HttpStatusCode.OK, "Ticket updated successfully")
    }
    delete("/{id}") {
        val id = call.parameters["id"]
        if (id == null) {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
            return@delete
        }
        
        val isDeleted = ticketService.deleteTicket(id)
        if (!isDeleted) {
            call.respond(HttpStatusCode.NotFound, "Ticket not found")
            return@delete
        }
        
        call.respond(HttpStatusCode.OK, "Ticket deleted successfully")
    }
}
