package pos.ambrosia.utils

import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.routing.*
import java.sql.Connection
import pos.ambrosia.db.DatabaseConnection
import pos.ambrosia.logger
import pos.ambrosia.services.UsersService

/** Extensión para verificar si el usuario actual es administrador */
fun ApplicationCall.requireAdmin() {
  val principal = principal<JWTPrincipal>()
  val isAdmin = principal?.getClaim("isAdmin", Boolean::class) ?: false

  if (!isAdmin) {
    logger.warn("Non-admin user attempted to access admin-only endpoint")
    throw AdminOnlyException()
  }
}


/** Extensión para obtener información del usuario actual desde el JWT */
fun ApplicationCall.getCurrentUser(): UserInfo? {
  val principal = principal<JWTPrincipal>() ?: return null

  return UserInfo(
          userId = principal.getClaim("userId", String::class) ?: return null,
          role = principal.getClaim("role", String::class) ?: return null,
          isAdmin = principal.getClaim("isAdmin", Boolean::class) ?: false
  )
}

suspend fun ApplicationCall.requireWallet() {
  // Verificar que la cookie walletAccessToken esté presente
  val walletToken = request.cookies["walletAccessToken"]
  if (walletToken == null) {
    logger.warn("Wallet access attempted without walletAccessToken cookie")
    throw WalletOnlyException()
  }

  // Verificar que el principal tenga el scope correcto
  val principal = principal<JWTPrincipal>()
  val scope = principal?.getClaim("scope", String::class)
  
  if (scope != "wallet_access") {
    logger.warn("Wallet access attempted with invalid scope: $scope")
    throw WalletOnlyException()
  }
  
  logger.info("Wallet access granted successfully")
}


/**
 * Plugin de Ktor para verificar los privilegios de administrador. Este plugin se asegura de que
 * solo los administradores puedan acceder a una ruta. Se debe usar dentro de un bloque
 * `authenticate`.
 */
val AdminAccess =
        createRouteScopedPlugin(name = "AdminAccess") {
          on(AuthenticationChecked) { call -> call.requireAdmin() }
        }
        
/**
 * Función de extensión para crear rutas que requieren autenticación y privilegios de administrador
 */
fun Route.authenticateAdmin(name: String = "auth-jwt", build: Route.() -> Unit): Route {
  return authenticate(name) {
    install(AdminAccess)
    build()
  }
}

/** Data class para representar información básica del usuario */
data class UserInfo(val userId: String, val role: String, val isAdmin: Boolean)
