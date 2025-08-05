package pos.ambrosia.utils

import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.routing.*
import pos.ambrosia.logger

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

/**
 * Función de extensión para crear rutas que requieren autenticación y privilegios de administrador
 */
val AdminOnlyPlugin = createRouteScopedPlugin("AdminOnlyPlugin") {
    onCall { call ->
        // La lógica que antes estaba en el interceptor ahora vive aquí.
        call.requireAdmin()
    }
}

/** Función de extensión para crear rutas que requieren autenticación y privilegios de administrador */
fun Route.authenticateAdmin(name: String = "auth-jwt", build: Route.() -> Unit): Route {
    return authenticate(name) {
        // 2. Instalamos el plugin en el bloque de la ruta autenticada.
        install(AdminOnlyPlugin)
        build()
    }
}

/** Data class para representar información básica del usuario */
data class UserInfo(val userId: String, val role: String, val isAdmin: Boolean)
