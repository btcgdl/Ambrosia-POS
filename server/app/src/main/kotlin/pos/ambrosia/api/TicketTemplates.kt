package pos.ambrosia.api

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import pos.ambrosia.models.TicketTemplate

val ticketTemplates = mutableMapOf<String, TicketTemplate>()

fun Application.configureTicketTemplates() {
    routing { ticketTemplates() }
}

fun Route.ticketTemplates() {
    route("/ticket-templates") {
        get {
            call.respond(ticketTemplates.values.toList())
        }
        post {
            val template = call.receive<TicketTemplate>()
            ticketTemplates[template.name] = template
            call.respond(HttpStatusCode.Created, "Template '${template.name}' created")
        }

        get("{name}") {
            val name = call.parameters["name"] ?: return@get call.respond(HttpStatusCode.BadRequest, "Template name is required")
            val template = ticketTemplates[name]
            if (template != null) {
                call.respond(template)
            } else {
                call.respond(HttpStatusCode.NotFound, "Template '$name' not found")
            }
        }
    }
}
