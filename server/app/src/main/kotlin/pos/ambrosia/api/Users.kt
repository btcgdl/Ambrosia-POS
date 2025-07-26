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
import pos.ambrosia.models.User
import pos.ambrosia.services.UsersService

fun Application.configureUsers() {
    val connection: Connection = DatabaseConnection.getConnection()
    val userService = UsersService(connection)
    routing { route("/users") { users(userService) } }
}

fun Route.users(userService: UsersService) {
    get("") {
        val users = userService.getUsers()
        if (users.isEmpty()) {
            call.respond(HttpStatusCode.NoContent, "No users found")
            return@get
        }
        call.respond(HttpStatusCode.OK, users)
    }
    get("/{id}") {
        val id = call.parameters["id"]
        if (id == null) {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
            return@get
        }

        val user = userService.getUserById(id)
        if (user == null) {
            call.respond(HttpStatusCode.NotFound, "User not found")
            return@get
        }

        call.respond(HttpStatusCode.OK, user)
    }
    post("") {
        val user = call.receive<User>()
        val result = userService.addUser(user)
        if (result == null) {
            call.respond(HttpStatusCode.BadRequest, "Failed to add user")
            return@post
        }
        call.respond(HttpStatusCode.Created, "User added successfully")
    }
    put("/{id}") {
        val id = call.parameters["id"]
        if (id == null) {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
            return@put
        }

        val updatedUser = call.receive<User>()
        val isUpdated = userService.updateUser(id, updatedUser)
        logger.info(isUpdated.toString())

        if (!isUpdated) {
            call.respond(HttpStatusCode.NotFound, "User with ID: $id not found")
            return@put
        }

        call.respond(HttpStatusCode.OK, "User updated successfully")
    }
    delete("/{id}") {
        val id = call.parameters["id"]
        if (id == null) {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
            return@delete
        }

        val isDeleted = userService.deleteUser(id)
        if (!isDeleted) {
            call.respond(HttpStatusCode.NotFound, "User with ID: $id not found")
            return@delete
        }

        call.respond(HttpStatusCode.NoContent, "User deleted successfully")
    }
}
