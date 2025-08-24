package pos.ambrosia.api

import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.sql.Connection
import pos.ambrosia.db.DatabaseConnection
import pos.ambrosia.logger
import pos.ambrosia.models.Role
import pos.ambrosia.services.RolesService
import pos.ambrosia.utils.authenticateAdmin

fun Application.configureRoles() {
  val connection: Connection = DatabaseConnection.getConnection()
  val roleService = RolesService(connection)
  routing { route("/roles") { roles(roleService) } }
}

fun Route.roles(roleService: RolesService) {
  get("/{id}") {
    val id = call.parameters["id"]
    if (id == null) {
      call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
      return@get
    }

    val role = roleService.getRoleById(id)
    if (role == null) {
      call.respond(HttpStatusCode.NotFound, "Role not found")
      return@get
    }

    call.respond(HttpStatusCode.OK, role)
  }
  authenticateAdmin() {
    get("") {
      val roles = roleService.getRoles()
      if (roles.isEmpty()) {
        call.respond(HttpStatusCode.NoContent, "No roles found")
        return@get
      }
      call.respond(HttpStatusCode.OK, roles)
    }
    post("") {
      val user = call.receive<Role>()
      val id = roleService.addRole(user)
      call.respond(HttpStatusCode.Created, mapOf("id" to id, "message" to "Role added successfully"))
    }
    put("/{id}") {
      val id = call.parameters["id"]
      if (id == null) {
        call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        return@put
      }

      val updatedRole = call.receive<Role>()
      val isUpdated = roleService.updateRole(id, updatedRole)
      logger.info(isUpdated.toString())

      if (!isUpdated) {
        call.respond(HttpStatusCode.NotFound, "Role with ID: $id not found")
        return@put
      }

      call.respond(HttpStatusCode.OK, mapOf("id" to id, "message" to "Role updated successfully"))
    }
    delete("/{id}") {
      val id = call.parameters["id"]
      if (id == null) {
        call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        return@delete
      }

      val isDeleted = roleService.deleteRole(id)
      if (!isDeleted) {
        call.respond(HttpStatusCode.NotFound, "Role with ID: $id not found")
        return@delete
      }

      call.respond(HttpStatusCode.NoContent, mapOf("id" to id, "message" to "Role deleted successfully"))
    }
  }
}
