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
import org.slf4j.LoggerFactory
import pos.ambrosia.api.*
import pos.ambrosia.config.AppConfig
import pos.ambrosia.utils.UnauthorizedApiException

public val logger = LoggerFactory.getLogger("pos.ambrosia.App")

fun main(args: Array<String>) {
  logger.info("Starting Ambrosia POS server...")
  EngineMain.main(args)
}

fun Application.module() {
  AppConfig.loadConfig() // Load custom config
  // Configure the application
  Handler() // Install exception handlers
  install(ContentNegotiation) { json() }
  install(CORS) {
    anyHost()
    allowHeader(HttpHeaders.ContentType)
    allowHeader(HttpHeaders.Authorization)
  }

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
  configureUsers()
}
