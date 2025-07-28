package pos.ambrosia.services

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.JWTVerificationException
import io.ktor.server.application.*
import io.ktor.server.application.ApplicationEnvironment
import java.sql.Connection
import java.util.*
import java.util.concurrent.TimeUnit
import pos.ambrosia.models.AuthResponse

class TokenService(environment: ApplicationEnvironment, private val connection: Connection) {

  private val config = environment.config
  private val secret = config.property("secret").getString()
  private val issuer = config.property("jwt.issuer").getString()
  private val audience = config.property("jwt.audience").getString()
  private val algorithm = Algorithm.HMAC256(secret)

  val verifier: JWTVerifier =
          JWT.require(algorithm).withAudience(audience).withIssuer(issuer).build()

  fun generateAccessToken(user: AuthResponse): String =
          JWT.create()
                  .withAudience(audience)
                  .withIssuer(issuer)
                  .withClaim("userId", user.id.toString())
                  .withClaim("role", user.role)
                  .withClaim("isAdmin", user.isAdmin)
                  .withClaim("realm", "Ambrosia-Server")
                  .withExpiresAt(Date(System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(15)))
                  .sign(algorithm)

  fun generateRefreshToken(user: AuthResponse): String {
    val refreshToken =
            JWT.create()
                    .withAudience(audience)
                    .withIssuer(issuer)
                    .withClaim("userId", user.id.toString())
                    .withClaim("role", user.role)
                    .withClaim("isAdmin", user.isAdmin)
                    .withClaim("type", "refresh")
                    .withClaim("realm", "Ambrosia-Server")
                    .withExpiresAt(Date(System.currentTimeMillis() + TimeUnit.DAYS.toMillis(30)))
                    .sign(algorithm)

    // Almacenar el refresh token en la base de datos
    user.id?.let { saveRefreshTokenToDatabase(it, refreshToken) }
    return refreshToken
  }

  fun validateRefreshToken(refreshToken: String): Boolean {
    return try {
      val decodedJWT = verifier.verify(refreshToken)
      val tokenType = decodedJWT.getClaim("type")?.asString()
      val userId = decodedJWT.getClaim("userId")?.asString()

      // Verificar que el token existe en la base de datos
      val isStoredInDb = isRefreshTokenInDatabase(userId, refreshToken)

      tokenType == "refresh" && !isTokenExpired(decodedJWT.expiresAt) && isStoredInDb
    } catch (e: JWTVerificationException) {
      false
    }
  }

  fun getUserFromRefreshToken(refreshToken: String): AuthResponse? {
    return try {
      val decodedJWT = verifier.verify(refreshToken)
      val userId = decodedJWT.getClaim("userId")?.asString()
      val role = decodedJWT.getClaim("role")?.asString()
      val name = decodedJWT.getClaim("name")?.asString()
      val isAdmin = decodedJWT.getClaim("isAdmin")?.asBoolean() ?: false

      if (userId != null && role != null) {
        AuthResponse(id = userId, role = role, name = name ?: "", isAdmin = isAdmin)
      } else {
        null
      }
    } catch (e: JWTVerificationException) {
      null
    }
  }

  fun revokeRefreshToken(userId: String) {
    val sql = "UPDATE users SET refresh_token = NULL WHERE id = ?"
    connection.prepareStatement(sql).use { statement ->
      statement.setString(1, userId)
      statement.executeUpdate()
    }
  }

  fun revokeAllRefreshTokens() {
    val sql = "UPDATE users SET refresh_token = NULL"
    connection.prepareStatement(sql).use { statement -> statement.executeUpdate() }
  }

  private fun saveRefreshTokenToDatabase(userId: String, refreshToken: String) {
    val sql = "UPDATE users SET refresh_token = ? WHERE id = ?"
    connection.prepareStatement(sql).use { statement ->
      statement.setString(1, refreshToken)
      statement.setString(2, userId)
      statement.executeUpdate()
    }
  }

  private fun isRefreshTokenInDatabase(userId: String?, refreshToken: String): Boolean {
    if (userId == null) return false

    val sql = "SELECT refresh_token FROM users WHERE id = ? AND refresh_token = ?"
    connection.prepareStatement(sql).use { statement ->
      statement.setString(1, userId)
      statement.setString(2, refreshToken)
      val resultSet = statement.executeQuery()
      return resultSet.next()
    }
  }

  private fun isTokenExpired(expiresAt: Date): Boolean {
    return expiresAt.before(Date())
  }
}
