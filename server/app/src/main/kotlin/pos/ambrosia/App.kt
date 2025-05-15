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
import pos.ambrosia.models.Message
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
        exception<Throwable> { call, cause ->
            call.respondText(text = cause.message?: "", status = defaultExceptionStatusCode(cause)?: HttpStatusCode.InternalServerError)
        }
        exception<InvalidCredentialsException> { call, _->
            call.respond(HttpStatusCode.Unauthorized, Message("Invalid credentials"))
        }
        exception<UnauthorizedApiException> { call, _->
            call.respond(HttpStatusCode.Forbidden, Message("Unauthorized API access"))
        }
        status(HttpStatusCode.NotFound) { call, status ->
            call.respondText(text = "Unknown endpoint (check api doc)", status = status)
        }
    }
    // Configure the application
    install(ContentNegotiation) {
        json()
    }
    install(CORS) {
        anyHost()
    }
    install(Authentication) {
        basic("auth-basic") {
            realm = "POS Ambrosia API"
            validate { credentials ->
                val password = dotenv["TOKEN_HASH"]
                if (credentials.name == "" && credentials.password == password) {
                    
                } else {
                    throw UnauthorizedApiException()
                }
            }
        }
    }
    configureRouting()
    configureAuth()
    configureUsers()
}
