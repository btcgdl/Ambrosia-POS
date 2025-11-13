package pos.ambrosia.api

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.sql.Connection
import pos.ambrosia.db.DatabaseConnection
import pos.ambrosia.models.Config
import pos.ambrosia.models.InitialSetupRequest
import pos.ambrosia.models.InitialSetupStatus
import pos.ambrosia.models.Role
import pos.ambrosia.models.User
import pos.ambrosia.services.ConfigService
import pos.ambrosia.services.PermissionsService
import pos.ambrosia.services.RolesService
import pos.ambrosia.services.UsersService
import pos.ambrosia.services.CurrencyService
import pos.ambrosia.logger

fun Application.configureInitialSetup() {
  val connection: Connection = DatabaseConnection.getConnection()
  routing {
    route("/inital-setup") { initialSetupRoutes(connection) }
    route("/initial-setup") { initialSetupRoutes(connection) }
  }
}

private fun Route.initialSetupRoutes(connection: Connection) {
  get("") {
    val configService = ConfigService(connection)
    val exists = configService.getConfig() != null
    call.respond(HttpStatusCode.OK, InitialSetupStatus(initialized = exists))
  }

  post("") {
    val req = call.receive<InitialSetupRequest>()

    val configService = ConfigService(connection)
    if (configService.getConfig() != null) {
      call.respond(HttpStatusCode.Conflict, mapOf("message" to "Initial setup already completed"))
      return@post
    }

    val taxId = req.businessTaxId ?: req.businessRFC
    val logoUrl = req.businessLogoUrl ?: req.businessLogo

    val env = call.application.environment
    val rolesService = RolesService(env, connection)
    val usersService = UsersService(env, connection)
    val permissionsService = PermissionsService(env, connection)
    val currencyService = CurrencyService(connection)

    val currency = currencyService.getByAcronym(req.businessCurrency)
    if (currency == null) {
      call.respond(HttpStatusCode.BadRequest, mapOf("message" to "Unknown currency acronym: ${req.businessCurrency}"))
      return@post
    }
    

    try {
      connection.autoCommit = false

      val roleId = rolesService.addRole(Role(role = "Admin", password = req.userPassword, isAdmin = true))
        ?: throw IllegalStateException("Failed to create admin role")

      permissionsService.assignAllEnabledToRole(roleId)

      val userId = usersService.addUser(User(name = req.userName, pin = req.userPin, role = roleId))
        ?: throw IllegalStateException("Failed to create user")

      val saved = configService.updateConfig(
        Config(
          businessType = req.businessType,
          businessName = req.businessName,
          businessAddress = req.businessAddress,
          businessPhone = req.businessPhone,
          businessEmail = req.businessEmail,
          businessTaxId = taxId,
          businessLogoUrl = logoUrl,
        ),
      )
      if (!saved) throw IllegalStateException("Failed to save config")

      if (!currencyService.setBaseCurrencyById(currency.id!!)) {
        throw IllegalStateException("Failed to set base currency")
      }

      connection.autoCommit = false
      connection.commit()
      call.respond(HttpStatusCode.Created, mapOf("message" to "Initial setup completed", "userId" to userId, "roleId" to roleId))
    } catch (e: Exception) {
      logger.error("Initial setup failed: ${e.message}")
      try { connection.rollback() } catch (_: Exception) {}
      call.respond(HttpStatusCode.InternalServerError, mapOf("message" to (e.message ?: "Setup failed")))
    } finally {
      try { connection.autoCommit = true } catch (_: Exception) {}
    }
  }
}
