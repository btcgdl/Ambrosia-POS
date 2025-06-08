package pos.ambrosia.api

import com.auth0.jwt.*
import com.auth0.jwt.algorithms.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.sql.Connection
import java.util.Date
import pos.ambrosia.config.AppConfig
import pos.ambrosia.db.connectToSqlite
import pos.ambrosia.models.AuthRequest
import pos.ambrosia.services.AuthService
import pos.ambrosia.utils.*

fun Application.configureAuth() {
    val connection: Connection = connectToSqlite()
    val authService = AuthService(connection)
    routing { route("/auth") { auth(authService) } }
}

fun Route.auth(authService: AuthService) {
    val secret = AppConfig.getProperty("TOKEN_HASH")
    val issuer = environment.config.property("jwt.issuer").getString()
    val audience = environment.config.property("jwt.audience").getString()
    val myRealm = environment.config.property("jwt.realm").getString()

    post("/login") {
        val loginRequest = call.receive<AuthRequest>()
        val authResponse = authService.login(loginRequest)
        if (authResponse == null) {
            throw InvalidCredentialsException()
        }
        val token =
                JWT.create()
                        .withAudience(audience)
                        .withIssuer(issuer)
                        .withClaim("username", authResponse.name)
                        .withExpiresAt(Date(System.currentTimeMillis() + 60000))
                        .sign(Algorithm.HMAC256(secret))
        call.respond(hashMapOf("token" to token))
    }
    authenticate("auth-jwt") { post("/logout") { call.respond(HttpStatusCode.NoContent) } }
}
