package pos.ambrosia

import com.auth0.jwt.*
import com.auth0.jwt.algorithms.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import java.sql.SQLException
import org.slf4j.LoggerFactory
import pos.ambrosia.api.*
import pos.ambrosia.config.AppConfig
import pos.ambrosia.models.Message
import pos.ambrosia.utils.InvalidCredentialsException
import pos.ambrosia.utils.UnauthorizedApiException

private val logger = LoggerFactory.getLogger("pos.ambrosia.App")

fun main(args: Array<String>) {
    logger.info("Starting Ambrosia POS server...")
    AppConfig.loadConfig() // Load custom config before starting the server
    EngineMain.main(args)
}

fun Application.module() {
    // Exception handling
    install(StatusPages) {
        exception<SQLException> { call, cause ->
            logger.error("Database connection error: ${cause.message}", cause)
            call.respond(
                    HttpStatusCode.InternalServerError,
                    Message("Error connecting to the database")
            )
        }
        exception<Throwable> { call, cause ->
            logger.error("Unhandled Throwable: ${cause.message}", cause)
            call.respondText(
                    text = cause.message ?: "",
                    status = defaultExceptionStatusCode(cause) ?: HttpStatusCode.InternalServerError
            )
        }
        exception<InvalidCredentialsException> { call, cause ->
            logger.warn("Invalid login attempt: ${cause.message}")
            call.respond(HttpStatusCode.Unauthorized, Message("Invalid credentials"))
        }
        exception<Exception> { call, cause ->
            logger.error("Unhandled exception: ${cause.message}", cause)
            call.respond(HttpStatusCode.InternalServerError, Message("Internal server error"))
        }
        exception<UnauthorizedApiException> { call, _ ->
            logger.warn("Unauthorized API access attempt")
            call.respond(HttpStatusCode.Forbidden, Message("Unauthorized API access"))
        }
        status(HttpStatusCode.NotFound) { call, status ->
            logger.info("Resource not found: ${call.request}")
            call.respondText(text = "Unknown endpoint (check api doc)", status = status)
        }
    }
    // Configure the application
    install(ContentNegotiation) { json() }
    install(CORS) {
        anyHost()
        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Authorization)
    }
    AppConfig.loadConfig()
    val secret = AppConfig.getProperty("TOKEN_HASH")
    val issuer = environment.config.property("jwt.issuer").getString()
    val audience = environment.config.property("jwt.audience").getString()
    val myRealm = environment.config.property("jwt.realm").getString()
    install(Authentication) {
        jwt("auth-jwt") {
            // Use a custom validation function to check credentials
            verifier(
                    JWT.require(Algorithm.HMAC256(secret))
                            .withIssuer(issuer)
                            .withAudience(audience)
                            .withClaim("realm", myRealm)
                            .build()
            )
            validate { credential ->
                if (credential.payload.getClaim("username").asString() != "") {
                    JWTPrincipal(credential.payload)
                } else {
                    null
                }
            }
            challenge { _, _ -> throw UnauthorizedApiException() }
        }
    }
    configureRouting()
    configureAuth()
    // configureUsers()
}
