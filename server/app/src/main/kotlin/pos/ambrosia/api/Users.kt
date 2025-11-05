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
import pos.ambrosia.models.UserMeResponse
import pos.ambrosia.models.UserResponse
import pos.ambrosia.services.PermissionsService
import pos.ambrosia.services.TokenService
import pos.ambrosia.services.UsersService

fun Application.configureUsers() {
  val connection: Connection = DatabaseConnection.getConnection()
  val userService = UsersService(environment, connection)
  val tokenService = TokenService(environment, connection)
  val permissionsService = PermissionsService(environment, connection)
  routing { route("/users") { users(userService, tokenService, permissionsService) } }
}

fun Route.users(
        userService: UsersService,
        tokenService: TokenService,
        permissionsService: PermissionsService
) {
  get("") {
    val users = userService.getUsers()
    if (users.isEmpty()) {
      call.respond(HttpStatusCode.NoContent, "No users found")
      return@get
    }
    call.respond(HttpStatusCode.OK, users)
  }
  authenticate("auth-jwt") {
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

    get("/me") {
      val refreshToken =
              call.request.cookies["refreshToken"]
                      ?: run {
                        call.respond(
                                HttpStatusCode.Unauthorized,
                                mapOf("error" to "Refresh token no encontrado")
                        )
                        return@get
                      }
      val isValidRefreshToken = tokenService.validateRefreshToken(refreshToken)
      if (!isValidRefreshToken) {
        call.respond(HttpStatusCode.Unauthorized)
        return@get
      }

      val userInfo = tokenService.getUserFromRefreshToken(refreshToken)

      if (userInfo == null) {
        call.respond(HttpStatusCode.NotFound, "User not found")
        return@get
      }

      val perms = permissionsService.getByRole(userInfo.role_id)
      if (perms.isEmpty()) {
        logger.info("The user doesn't have a permissions")
        call.respond(HttpStatusCode.Forbidden)
        return@get
      }

      val userResponse =
              UserResponse(
                      user_id = userInfo.id,
                      name = userInfo.name,
                      role = userInfo.role,
                      role_id = userInfo.role,
                      isAdmin = userInfo.isAdmin
              )

      call.respond(UserMeResponse(userResponse, perms))
    }
    post("") {
      val user = call.receive<User>()
      val result = userService.addUser(user)
      if (result == null) {
        call.respond(HttpStatusCode.BadRequest, "Failed to add user")
        return@post
      }
      call.respond(
              HttpStatusCode.Created,
              mapOf("id" to result, "message" to "User added successfully")
      )
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

      call.respond(HttpStatusCode.OK, mapOf("id" to id, "message" to "User updated successfully"))
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

      call.respond(
              HttpStatusCode.NoContent,
              mapOf("id" to id, "message" to "User deleted successfully")
      )
    }
  }
}
