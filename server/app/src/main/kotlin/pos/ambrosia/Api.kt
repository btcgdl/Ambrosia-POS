package pos.ambrosia

import com.auth0.jwt.*
import com.auth0.jwt.algorithms.*
import io.ktor.http.*
import io.ktor.http.auth.*
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
import org.slf4j.LoggerFactory
import pos.ambrosia.api.*
import pos.ambrosia.config.AppConfig
import pos.ambrosia.utils.UnauthorizedApiException

public val logger = LoggerFactory.getLogger("pos.ambrosia.App")

class Api() {

    fun Application.module() {
        AppConfig.loadConfig() // Load custom config
        // Configure the application
        val config = this.environment.config
        Handler() // Install exception handlers
        install(ContentNegotiation) { json() }
        install(CORS) {
            allowCredentials = true
            anyHost()
            allowMethod(HttpMethod.Put)
            allowMethod(HttpMethod.Delete)
            allowHeader(HttpHeaders.ContentType)
            allowHeader(HttpHeaders.Authorization)
        }

        install(Authentication) {
            jwt("auth-jwt") {
                // Configurar para leer el token desde cookies
                authHeader { call ->
                    try {
                        val token = call.request.cookies["accessToken"]
                        if (token != null) {
                            HttpAuthHeader.Single("Bearer", token)
                        } else {
                            null
                        }
                    } catch (cause: Throwable) {
                        null
                    }
                }
                verifier(
                        JWT.require(Algorithm.HMAC256(config.property("secret").getString()))
                                .withIssuer(config.property("jwt.issuer").getString())
                                .withAudience(config.property("jwt.audience").getString())
                                .withClaim("realm", "Ambrosia-Server")
                                .build()
                )
                validate { credential ->
                    if (credential.payload.getClaim("userId").asString() != "") {
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
        configureUsers()
        configureRoles()
        configureDishes()
        configureDishCategories()
        configureSpaces()
        configureTables()
        configureIngredients()
        configureIngredientCategories()
        configureSuppliers()
        configureOrders()
        configurePayments()
        configureTickets()
        configureShifts()
        configureWallet()
        configureRoles()
        configureDishes()
        configureSpaces()
        configureTables()
        configureIngredients()
        configureSuppliers()
        configureOrders()
        configurePayments()
        configureTickets()
        configureShifts()
        configureWallet()
    }
}
