package pos.ambrosia.api

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.auth.*

fun Application.configureRouting() {
    routing {
        get("/") {
            //TODO: Add link to the documentation
            call.respondText("Root path of the API Nothing to see here")
        }
    }
}
