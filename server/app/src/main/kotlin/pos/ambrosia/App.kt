package pos.ambrosia

import pos.ambrosia.api.*
import java.util.Base64
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
import pos.ambrosia.config.AppConfig
import java.sql.SQLException
import org.slf4j.LoggerFactory

private val logger = LoggerFactory.getLogger("pos.ambrosia.App")

fun main(args: Array<String>) {
    logger.info("Starting Ambrosia POS server...")
    AppConfig.loadConfig() // Load custom config before starting the server
    EngineMain.main(args)
}

fun Application.module() {
    // Exception handling
    install(StatusPages)
    {
        exception<SQLException> { call, cause ->
            logger.error("Database connection error: ${cause.message}", cause)
            call.respond(HttpStatusCode.InternalServerError, Message("Error connecting to the database"))
        }
        exception<Throwable> { call, cause ->
            logger.error("Unhandled Throwable: ${cause.message}", cause)
            call.respondText(text = cause.message?: "", status = defaultExceptionStatusCode(cause)?: HttpStatusCode.InternalServerError)
        }
        exception<InvalidCredentialsException> { call, cause ->
            logger.warn("Invalid login attempt: ${cause.message}")
            call.respond(HttpStatusCode.Unauthorized, Message("Invalid credentials"))
        }
        exception<Exception> { call, cause ->
            logger.error("Unhandled exception: ${cause.message}", cause)
            call.respond(HttpStatusCode.InternalServerError, Message("Internal server error"))
        }
        exception<UnauthorizedApiException> { call, cause ->
            logger.warn("Unauthorized API access attempt: ${cause.message}")
            call.respond(HttpStatusCode.Forbidden, Message("Unauthorized API access"))
        }
        status(HttpStatusCode.NotFound) { call, status ->
            logger.info("Resource not found: ${call.request}")
            call.respondText(text = "Unknown endpoint (check api doc)", status = status)
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
            // Use a custom validation function to check credenti
            validate { credentials ->
                // Decode the Base64 encoded username and password
                val decodedPassword: String
                try {
                    val BytePass = Base64.getDecoder().decode(credentials.password)
                    decodedPassword = String(BytePass)
                    logger.info("Decoded password: $decodedPassword")
                } catch (e: Exception) {
                    logger.error("Error decoding credentials")
                    throw UnauthorizedApiException()
                }
                // Try to get password from custom config, then environment variable, then default
                val passwordFromConfig = AppConfig.getProperty("TOKEN_HASH")
                val apiPassword = passwordFromConfig

                if (credentials.name == "" && decodedPassword == apiPassword) {
                    // Valid credentials - UserIdPrincipal can be used if you need to identify the user later
                    UserIdPrincipal(credentials.name)
                    logger.info("User authenticated successfully")
                } else {
                    // Invalid credentials
                    throw UnauthorizedApiException()
                }
            }
        }
    }
    configureRouting()
    configureAuth()
    configureUsers()
}
