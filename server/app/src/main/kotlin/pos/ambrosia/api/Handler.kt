package pos.ambrosia.api

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.engine.defaultExceptionStatusCode
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import java.sql.SQLException
import org.slf4j.LoggerFactory
import pos.ambrosia.models.Message
import pos.ambrosia.utils.InvalidCredentialsException
import pos.ambrosia.utils.UnauthorizedApiException
import pos.ambrosia.utils.UserNotFoundException
import pos.ambrosia.utils.PhoenixConnectionException
import pos.ambrosia.utils.PhoenixNodeInfoException
import pos.ambrosia.utils.PhoenixBalanceException
import pos.ambrosia.utils.PhoenixServiceException

private val logger = LoggerFactory.getLogger("pos.ambrosia.Handler")

fun Application.Handler() {
  install(StatusPages) {
    exception<SQLException> { call, cause ->
      logger.error("Database connection error: ${cause.message}", cause)
      call.respond(HttpStatusCode.InternalServerError, Message("Error connecting to the database"))
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
      logger.error("Unhandled exception: ${cause.message}")
      call.respond(HttpStatusCode.InternalServerError, Message("Internal server error"))
    }
    exception<UnauthorizedApiException> { call, _ ->
      logger.warn("Unauthorized API access attempt")
      call.respond(HttpStatusCode.Forbidden, Message("Unauthorized API access"))
    }
    exception<UserNotFoundException> { call, cause ->
      logger.error("User not found")
      call.respond(HttpStatusCode.NotFound, cause.message.toString())
    }
    exception<PhoenixConnectionException> { call, cause ->
      logger.error("Phoenix Lightning node connection error: ${cause.message}")
      call.respond(HttpStatusCode.ServiceUnavailable, Message("Lightning node is unavailable"))
    }
    exception<PhoenixNodeInfoException> { call, cause ->
      logger.error("Phoenix node info error: ${cause.message}")
      call.respond(HttpStatusCode.ServiceUnavailable, Message("Unable to retrieve node information"))
    }
    exception<PhoenixBalanceException> { call, cause ->
      logger.error("Phoenix balance error: ${cause.message}")
      call.respond(HttpStatusCode.ServiceUnavailable, Message("Unable to retrieve balance information"))
    }
    exception<PhoenixServiceException> { call, cause ->
      logger.error("Phoenix service error: ${cause.message}")
      call.respond(HttpStatusCode.ServiceUnavailable, Message("Lightning node service error"))
    }
    status(HttpStatusCode.NotFound) { call, status ->
      logger.info("Resource not found: ${call.request}")
      call.respondText(text = "Unknown endpoint (check api doc)", status = status)
    }
    status(HttpStatusCode.BadRequest) { call, status ->
      logger.warn("Bad request: ${call.request}")
      call.respondText(text = "Bad request (check api doc)", status = status)
    }
  }
}

