package pos.ambrosia.api

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.auth.*
import io.ktor.server.plugins.swagger.*

fun Application.configureRouting() {
    routing {
        swaggerUI(path = "/swagger", swaggerFile = "openapi/documentation.yaml")
        get("/") {
            //TODO: Add link to the documentation
            call.respondText("Root path of the API Nothing to see here")
        }
    }
}
