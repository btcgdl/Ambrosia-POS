package pos.ambrosia.services // O el paquete que prefieras

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import io.ktor.server.application.*
import io.ktor.server.application.ApplicationEnvironment
import java.util.*
import java.util.concurrent.TimeUnit
import pos.ambrosia.config.AppConfig
import pos.ambrosia.models.User

class TokenService(environment: ApplicationEnvironment) {

  private val config = environment.config
  private val secret = AppConfig.getProperty("TOKEN_HASH")
  private val issuer = config.property("jwt.issuer").getString()
  private val audience = config.property("jwt.audience").getString()
  private val algorithm = Algorithm.HMAC256(secret)

  val verifier: JWTVerifier =
          JWT.require(algorithm).withAudience(audience).withIssuer(issuer).build()

  fun generateAccessToken(user: User): String =
          JWT.create()
                  .withAudience(audience)
                  .withIssuer(issuer)
                  .withClaim("userId", user.id.toString())
                  .withClaim("role", user.role)
                  .withExpiresAt(Date(System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(15)))
                  .sign(algorithm)

  fun generateRefreshToken(): String =
          JWT.create()
                  .withAudience(audience)
                  .withIssuer(issuer)
                  .withExpiresAt(Date(System.currentTimeMillis() + TimeUnit.HOURS.toMillis(24)))
                  .sign(algorithm)
}
