package pos.ambrosia.utils

import java.sql.Connection
import pos.ambrosia.models.Role
import pos.ambrosia.models.User
import pos.ambrosia.services.RolesService
import pos.ambrosia.services.UsersService
import io.ktor.server.application.ApplicationEnvironment

class DefaultCredentialsService(private val enviroment: ApplicationEnvironment, private val connection: Connection) {

  suspend fun addUser(): String {

    val roleService = RolesService(enviroment, connection)
    val userService = UsersService(enviroment, connection)

    val userCount = userService.getUserCount()

    // Only create default user if no users exist
    if (userCount == 0L) {
      val newRoleId = roleService.addRole(Role(null, "coolrolename", "password123", true  ))
      if (newRoleId == null) {
        throw Error()
      }
      val userCreationStatus = userService.addUser(User(null, "cooluser1", "0000", null, newRoleId ))
      if (userCreationStatus == null) {
        throw Error()
      }
      return userCreationStatus
    }
    return "Users already exist"
  }

}