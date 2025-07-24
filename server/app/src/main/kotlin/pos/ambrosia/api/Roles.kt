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
import pos.ambrosia.logger
import pos.ambrosia.models.Role
import pos.ambrosia.services.RolesService
import pos.ambrosia.utils.UserNotFoundException
import pos.ambrosia.db.DatabaseConnection

fun Application.configureRoles() {
    val connection: Connection = DatabaseConnection.getConnection()
    val roleService = RolesService(connection)
    routing { route("/roles") { roles(roleService) } }
}

fun Route.roles(roleService: RolesService) {
    get("") {
        val roles = roleService.getRoles()
        if (roles.isEmpty()) {
            call.respond(HttpStatusCode.NoContent, "No roles found")
            return@get
        }
        call.respond(HttpStatusCode.OK, roles)
    }
    get("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val role = roleService.getRoleById(id)
            if (role != null) {
                call.respond(HttpStatusCode.OK, role)
            } else {
                throw UserNotFoundException()
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    post("") {
        val user = call.receive<Role>()
        roleService.addRole(user)
        call.respond(HttpStatusCode.Created, "Role added successfully")
    }
    put("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val updatedRole = call.receive<Role>()
            val isUpdated = roleService.updateRole(updatedRole)
            logger.info(isUpdated.toString())
            if (isUpdated) {
                call.respond(HttpStatusCode.OK, "Role updated successfully")
            } else {
                call.respond(HttpStatusCode.NotFound, "Role with ID: $id not found")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    delete("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val isDeleted = roleService.deleteRole(id)
            if (isDeleted) {
                call.respond(HttpStatusCode.NoContent, "Role deleted successfully")
            } else {
                call.respond(HttpStatusCode.NotFound, "Role with ID: $id not found")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
}
