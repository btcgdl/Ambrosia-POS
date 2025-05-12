package pos.ambrosia

import pos.ambrosia.api.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.contentnegotiation.*
import pos.ambrosia.utils.InvalidCredentialsException
import pos.ambrosia.utils.UnauthorizedApiException
import io.ktor.server.response.*
import io.ktor.http.*
import pos.ambrosia.models.ApiResponse

fun main() {
    embeddedServer(Netty, port = 5000, host = "127.0.0.1", module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    // Exception handling
    install(StatusPages)
    {
        exception<InvalidCredentialsException> { call, cause ->
            call.respond(HttpStatusCode.Unauthorized, ApiResponse<String>(false, error = cause.message))
        }
        exception<UnauthorizedApiException> { call, cause ->
            call.respond(HttpStatusCode.Forbidden, ApiResponse<String>(false, error = cause.message))
        }
        exception<Throwable> { call, cause ->
            call.respond(HttpStatusCode.InternalServerError, ApiResponse<String>(false, error = cause.message))
        }
    }
    // Configure the application
    install(ContentNegotiation) {
        json()
    }
    install(CORS) {
        anyHost()
    }
    configureRouting()
    configureAuth()
}
