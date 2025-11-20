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
import pos.ambrosia.db.DatabaseConnection
import pos.ambrosia.logger
import pos.ambrosia.models.AuthRequest
import pos.ambrosia.models.LoginResponse
import pos.ambrosia.models.Message
import pos.ambrosia.models.UserResponse
import pos.ambrosia.services.AuthService
import pos.ambrosia.services.PermissionsService
import pos.ambrosia.services.TokenService
import pos.ambrosia.utils.*

fun Application.configureAuth() {
  val connection: Connection = DatabaseConnection.getConnection()
  val authService = AuthService(environment, connection)
  val tokenService = TokenService(environment, connection)
  val permissionsService = PermissionsService(environment, connection)
  routing { route("/auth") { auth(tokenService, authService, permissionsService) } }
}

fun Route.auth(
  tokenService: TokenService,
  authService: AuthService,
  permissionsService: PermissionsService
) {

  post("/login") {
    val loginRequest = call.receive<AuthRequest>()
    val userInfo = authService.authenticateUser(loginRequest.name, loginRequest.pin.toCharArray())
    logger.info(userInfo?.toString() ?: "User not found")

    if (userInfo == null) {
      throw InvalidCredentialsException()
    }
    val accessTokenResponse = tokenService.generateAccessToken(userInfo)
    val refreshTokenResponse = tokenService.generateRefreshToken(userInfo)

    val perms = permissionsService.getByRole(userInfo.role_id)
    if (perms.isEmpty()) {
      logger.info("The user doesn't have a permissions")
      call.respond(HttpStatusCode.Forbidden)
      return@post
    }

    // Configurar cookies para los tokens
    call.response.cookies.append(
      Cookie(
        name = "accessToken",
        value = accessTokenResponse,
        expires = GMTDate(System.currentTimeMillis() + (60 * 1000L)), // 60 s
        httpOnly = true, // Accesible desde JavaScript
        secure = false, // Cambiar a true en producción con HTTPS
        path = "/",
      )
    )

    call.response.cookies.append(
      Cookie(
        name = "refreshToken",
        value = refreshTokenResponse,
        maxAge = 30 * 24 * 60 * 60, // 30 días en segundos
        httpOnly = true,
        secure = false, // Cambiar a true en producción con HTTPS
        path = "/",
      )
    )

    val userResponse =
    UserResponse(
      user_id = userInfo.id,
      name = userInfo.name,
      role = userInfo.role,
      role_id = userInfo.role_id,
      isAdmin = userInfo.isAdmin,
      email = userInfo.email,
      phone = userInfo.phone
    )

    call.respond(LoginResponse("Login successful", userResponse, perms))
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

      // Actualizar SOLO la cookie del access token (60 s)
      call.response.cookies.append(
        Cookie(
          name = "accessToken",
          value = newAccessToken,
          expires = GMTDate(System.currentTimeMillis() + (60 * 1000L)), // 60 s
          httpOnly = true,
          secure = true,
          path = "/"
        )
      )

      // NO actualizamos el refresh token - sigue siendo el mismo

      call.respond(
        mapOf(
          "message" to "Access token refreshed successfully",
          "accessToken" to newAccessToken
        )
      )
    } catch (e: Exception) {
      logger.error("Error refreshing token: ${e.message}")
      throw InvalidTokenException("Failed to refresh token")
    }
  }

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
