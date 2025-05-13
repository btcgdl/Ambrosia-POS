package pos.ambrosia

import pos.ambrosia.api.*
import io.ktor.server.auth.*
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
import io.github.cdimascio.dotenv.Dotenv

// Get the credentials from .env file
val dotenv = Dotenv.configure()
.directory("../../")
.load();

fun main() {
    embeddedServer(Netty, port = 5000, host = "127.0.0.1", module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    // Exception handling
    install(StatusPages)
    {
        exception<InvalidCredentialsException> { call, cause ->
            call.respond(HttpStatusCode.Unauthorized, ApiResponse<String>(data = cause.message))
        }
        exception<UnauthorizedApiException> { call, cause ->
            call.respond(HttpStatusCode.Forbidden, ApiResponse<String>(data = cause.message))
        }
        exception<Throwable> { call, cause ->
            call.respond(HttpStatusCode.InternalServerError, ApiResponse<String>(data = cause.message))
        }
    }
    // Configure the application
    install(ContentNegotiation) {
        json()
    }
    install(CORS) {
        anyHost()
        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Authorization)
    }
    install(Authentication) {
        basic("auth-basic") {
            realm = "POS Ambrosia API"
            validate { credentials ->
                val password = dotenv["TOKEN_HASH"]
                if (credentials.name == "" && credentials.password == password) {
                    
                } else null
            }
        }
    }
    configureRouting()
    configureAuth()
}
