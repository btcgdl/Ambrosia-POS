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
import pos.ambrosia.db.connectToSqlite
import pos.ambrosia.logger
import pos.ambrosia.models.AuthRequest
import pos.ambrosia.services.TokenService
import pos.ambrosia.services.UsersService
import pos.ambrosia.utils.*

fun Application.configureAuth() {
  val connection: Connection = connectToSqlite()
  val userService = UsersService(connection)
  val tokenService = TokenService(environment)
  routing { route("/auth") { auth(userService, tokenService) } }
}

fun Route.auth(userService: UsersService, tokenService: TokenService) {

  post("/login") {
    val loginRequest = call.receive<AuthRequest>()
    logger.info("Data for request: " + loginRequest.name + ", " + loginRequest.pin)
    val userResponse =
            userService.authenticateUser(loginRequest.name, loginRequest.pin.toCharArray())
    logger.info(userResponse?.role)
    if (userResponse == null) {
      throw InvalidCredentialsException()
    }
    val accessTokenResponse = tokenService.generateAccessToken(userResponse)
    val refreshTokenResponse = tokenService.generateRefreshToken()

    call.respond(
            hashMapOf("accessToken" to accessTokenResponse, "refreshToken" to refreshTokenResponse)
    )
  }
  authenticate("auth-jwt") { post("/logout") { call.respond(HttpStatusCode.NoContent) } }
}
