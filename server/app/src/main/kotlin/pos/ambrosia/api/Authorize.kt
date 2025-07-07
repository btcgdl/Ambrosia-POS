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
import io.ktor.util.date.*
import java.sql.Connection
import java.util.*
import pos.ambrosia.db.connectToSqlite
import pos.ambrosia.logger
import pos.ambrosia.models.AuthRequest
import pos.ambrosia.models.Message
import pos.ambrosia.services.TokenService
import pos.ambrosia.services.UsersService
import pos.ambrosia.utils.*

fun Application.configureAuth() {
  val connection: Connection = connectToSqlite()
  val userService = UsersService(connection)
  val tokenService = TokenService(environment, connection)
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
    val refreshTokenResponse = tokenService.generateRefreshToken(userResponse)

    // Configurar cookies para los tokens
    call.response.cookies.append(
            Cookie(
                    name = "accessToken",
                    value = accessTokenResponse,
                    maxAge = 15 * 60, // 15 minutos en segundos
                    httpOnly = true, // No accesible desde JavaScript
                    secure = false, // Cambiar a true en producción con HTTPS
                    path = "/"
            )
    )

    call.response.cookies.append(
            Cookie(
                    name = "refreshToken",
                    value = refreshTokenResponse,
                    maxAge = 30 * 24 * 60 * 60, // 30 días en segundos
                    httpOnly = true, // No accesible desde JavaScript
                    secure = false, // Cambiar a true en producción con HTTPS
                    path = "/"
            )
    )

    call.respond(Message(message = "Login successful"))
  }

  post("/refresh") {
    try {
      // Obtener el refresh token desde las cookies
      val refreshToken =
              call.request.cookies["refreshToken"]
                      ?: throw InvalidTokenException("Refresh token is required")

      logger.info("Refreshing token with: $refreshToken")

      // Verificar si el refresh token es válido
      val isValidRefreshToken = tokenService.validateRefreshToken(refreshToken)
      if (!isValidRefreshToken) {
        throw InvalidTokenException("Invalid refresh token")
      }

      // Obtener información del usuario del refresh token
      val userInfo = tokenService.getUserFromRefreshToken(refreshToken)
      if (userInfo == null) {
        throw InvalidTokenException("Unable to extract user information from refresh token")
      }

      // Generar SOLO un nuevo access token (NO generar nuevo refresh token)
      val newAccessToken = tokenService.generateAccessToken(userInfo)

      // Actualizar SOLO la cookie del access token
      call.response.cookies.append(
              Cookie(
                      name = "accessToken",
                      value = newAccessToken,
                      maxAge = 15 * 60, // 15 minutos
                      httpOnly = true,
                      secure = false, // Cambiar a true en producción
                      path = "/"
              )
      )

      // NO actualizamos el refresh token - sigue siendo el mismo

      call.respond(Message("Access token refreshed successfully"))
    } catch (e: Exception) {
      logger.error("Error refreshing token: ${e.message}")
      throw InvalidTokenException("Failed to refresh token")
    }
  }

  authenticate("auth-jwt") {
    post("/logout") {
      val principal = call.principal<JWTPrincipal>()
      val userId = principal?.getClaim("userId", String::class)

      if (userId != null) {
        tokenService.revokeRefreshToken(userId)
      }

      // Eliminar las cookies usando maxAge = 0
      call.response.cookies.append(
              Cookie(
                      name = "accessToken",
                      value = "",
                      maxAge = 0, // Expira inmediatamente
                      path = "/"
              )
      )

      call.response.cookies.append(
              Cookie(
                      name = "refreshToken",
                      value = "",
                      maxAge = 0, // Expira inmediatamente
                      path = "/"
              )
      )

      call.respond(Message("Logout successful"))
    }
  }
}
