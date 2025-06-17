package pos.ambrosia.services // O el paquete que prefieras

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import io.ktor.server.application.*
import pos.ambrosia.models.User
import java.util.*
import java.util.concurrent.TimeUnit
import kotlin.random.Random


class TokenService(application: Application) {
    
    private val config = application.environment.config
    private val secret = config.property("jwt.secret").getString()
    private val issuer = config.property("jwt.issuer").getString()
    private val audience = config.property("jwt.audience").getString()
    private val algorithm = Algorithm.HMAC256(secret)

    val verifier: JWTVerifier = JWT
        .require(algorithm)
        .withAudience(audience)
        .withIssuer(issuer)
        .build()

    fun generateAccessToken(user: User): String = JWT.create()
        .withAudience(audience)
        .withIssuer(issuer)
        .withClaim("userId", user.id.toString())
        .withClaim("role", user.role)             
        .withExpiresAt(Date(System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(15)))
        .sign(algorithm)

    fun generateRefreshToken(): String {
        val randomBytes = Random.nextBytes(32)
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes)
    }
}